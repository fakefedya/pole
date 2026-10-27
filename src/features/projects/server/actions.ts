'use server'

import { redirect } from 'next/navigation'
import { invalidateProjectViews } from './invalidate'
import { Prisma } from '@/generated/prisma/client'
import { mediaBuckets } from '@/lib/storage/s3'
import { drainMediaDeletionJobs } from './media'
import { prisma } from '@/lib/db/prisma'
import { PERMISSION } from '@/lib/auth/authorization'
import { assertMutationPermission } from '@/features/auth/server/access'
import { descriptionToBlocks, parseProjectForm, prepareProject } from '@/features/projects/schemas/project-form'
import { fieldErrorsFromZod } from '@/features/dashboard/lib/form-errors'
import { serializable, lockProject } from '@/lib/db/transaction-guards'

export type ProjectActionState = {
  error: string | null
  fieldErrors?: Record<string, string>
  savedAt?: number
  revision?: number
}


export async function saveProjectAction(
  _previous: ProjectActionState,
  formData: FormData,
): Promise<ProjectActionState> {
  const rawId = formData.get('projectId')
  const id = typeof rawId === 'string' && rawId.length > 0 ? rawId : null
  await assertMutationPermission(id ? PERMISSION.PROJECT_UPDATE : PERMISSION.PROJECT_CREATE)
  const result = parseProjectForm(formData)
  if (!result.success) return { error: 'Проверьте поля проекта.', fieldErrors: fieldErrorsFromZod(result.error) }

  const data = prepareProject(result.data)
  const blocks = descriptionToBlocks(result.data.description)
  const expected = formData.get('expectedRevision')

  let newId: string | null = null
  let nextRevision: number | undefined
  try {
    if (id) {
      // Project row lock coordinates publishing with cover updates and image deletion.
      const saved = await serializable(async (tx) => {
        await lockProject(tx, id)
        const existing = await tx.project.findUniqueOrThrow({
          where: { id }, select: { coverImageId: true, publishedAt: true, contentRevision: true },
        })
        if (typeof expected !== 'string' || !/^\d+$/.test(expected) || Number(expected) !== existing.contentRevision) return 'STALE' as const
        if (data.status === 'PUBLISHED') {
          if (!existing.coverImageId) return false
          const cover = await tx.projectImage.findFirst({
            where: { id: existing.coverImageId, projectId: id }, select: { id: true },
          })
          if (!cover) return false
        }
        const publishedAt = data.status === 'PUBLISHED'
          ? existing.publishedAt ?? new Date()
          : existing.publishedAt
        const savedProject = await tx.project.update({ where: { id }, data: { ...data, publishedAt, contentRevision: { increment: 1 } } })
        // Update blocks in place: stable IDs matter for future references and auditing.
        const existingBlocks = await tx.projectContentBlock.findMany({
          where: { projectId: id }, orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
        })
        for (const [i, block] of blocks.entries()) {
          const previous = existingBlocks[i]
          if (previous) {
            if (previous.body !== block.body || previous.type !== block.type || previous.sortOrder !== block.sortOrder) {
              await tx.projectContentBlock.update({ where: { id: previous.id }, data: block })
            }
          } else {
            await tx.projectContentBlock.create({ data: { ...block, projectId: id } })
          }
        }
        const obsolete = existingBlocks.slice(blocks.length).map((b) => b.id)
        if (obsolete.length) await tx.projectContentBlock.deleteMany({ where: { id: { in: obsolete } } })
        return savedProject.contentRevision
      })
      if (saved === 'STALE') return { error: 'Содержание проекта изменилось в другой вкладке или другим редактором. Обновите страницу и проверьте данные перед повторным сохранением.' }
      if (!saved) {
        return {
          error: 'Нельзя опубликовать проект без обложки. Выберите её в галерее.',
          fieldErrors: { status: 'Для публикации требуется обложка.' },
        }
      }
      nextRevision = saved
    } else {
      if (data.status === 'PUBLISHED') return { error: 'Новый проект сначала необходимо сохранить как черновик.', fieldErrors: { status: 'Создайте черновик и добавьте обложку перед публикацией.' } }
      const created = await prisma.project.create({ data: { ...data, blocks: { create: blocks } } })
      newId = created.id
    }
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return { error: 'Такой slug уже используется.', fieldErrors: { slug: 'Укажите другой URL-адрес проекта.' } }
    }
    throw error
  }
  invalidateProjectViews()
  if (newId) redirect(`/dashboard/projects/${newId}/edit`)
  // Stay in the editor; gallery and publication remain accessible.
  return { error: null, savedAt: Date.now(), revision: nextRevision }
}

export async function deleteProjectAction(id: string): Promise<void> {
  await assertMutationPermission(PERMISSION.PROJECT_DELETE)
  if (!id || id.length > 128) throw new Error('Некорректный идентификатор.')
  // The DB transaction deletes the project and queues all object deletions atomically.
  await serializable(async (tx) => {
    await lockProject(tx, id)
    const existing = await tx.project.findUnique({
      where: { id }, select: { images: { select: { objectKey: true } } },
    })
    if (!existing) return
    await tx.storageDeletionJob.createMany({
      data: existing.images.map((image) => ({
        bucket: mediaBuckets.public, objectKey: image.objectKey,
      })), skipDuplicates: true,
    })
    await tx.project.delete({ where: { id } })
    // Keep staging rows for recovery: an S3 copy can be in flight during deletion.
  })
  await drainMediaDeletionJobs(50)
  invalidateProjectViews()
  redirect('/dashboard/projects')
}
