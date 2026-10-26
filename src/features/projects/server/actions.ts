'use server'

import { redirect } from 'next/navigation'
import { revalidatePath, updateTag } from 'next/cache'
import { Prisma } from '@/generated/prisma/client'
import { prisma } from '@/lib/db/prisma'
import { PERMISSION } from '@/lib/auth/authorization'
import { assertMutationPermission } from '@/features/auth/server/access'
import { descriptionToBlocks, parseProjectForm, prepareProject } from '@/features/projects/schemas/project-form'
import { fieldErrorsFromZod } from '@/features/dashboard/lib/form-errors'

export type ProjectActionState = { error: string | null; fieldErrors?: Record<string, string> }

function invalidateProjects() {
  updateTag('featured-projects')
  revalidatePath('/dashboard')
  revalidatePath('/dashboard/projects')
  revalidatePath('/projects')
  revalidatePath('/')
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

  try {
    if (id) {
      const existing = await prisma.project.findUnique({ where: { id }, select: { id: true, coverImageId: true, publishedAt: true } })
      if (!existing) return { error: 'Проект не найден' }
      if (data.status === 'PUBLISHED' && !existing.coverImageId) return { error: 'Сначала выберите обложку проекта.', fieldErrors: { status: 'Для публикации требуется обложка.' } }
      await prisma.$transaction(async (tx) => {
        await tx.project.update({ where: { id }, data: {
          ...data,
          publishedAt: data.status === 'PUBLISHED' ? existing.publishedAt ?? new Date() : existing.publishedAt,
        } })
        await tx.projectContentBlock.deleteMany({ where: { projectId: id } })
        if (blocks.length) await tx.projectContentBlock.createMany({ data: blocks.map(b => ({ ...b, projectId: id })) })
      })
    } else {
      if (data.status === 'PUBLISHED') return { error: 'Новый проект сначала необходимо сохранить как черновик.', fieldErrors: { status: 'Создайте черновик и добавьте обложку перед публикацией.' } }
      await prisma.project.create({ data: { ...data, blocks: { create: blocks } } })
    }
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return { error: 'Такой slug уже используется.', fieldErrors: { slug: 'Укажите другой URL-адрес проекта.' } }
    }
    throw error
  }
  invalidateProjects()
  redirect('/dashboard/projects')
}

export async function deleteProjectAction(id: string): Promise<void> {
  await assertMutationPermission(PERMISSION.PROJECT_DELETE)
  const existing = await prisma.project.findUnique({ where: { id }, select: { images: { select: { id: true }, take: 1 } } })
  if (!existing) return
  // Не оставляем сиротские объекты в S3. Сначала отдельный workflow удаления галереи.
  if (existing.images.length) throw new Error('Сначала удалите изображения проекта из S3 через управление галереей')
  await prisma.project.delete({ where: { id } })
  invalidateProjects()
  redirect('/dashboard/projects')
}
