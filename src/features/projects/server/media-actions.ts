'use server'

import { CopyObjectCommand } from '@aws-sdk/client-s3'
import { invalidateProjectViews } from './invalidate'
import { z } from 'zod'
import { prisma } from '@/lib/db/prisma'
import { s3, mediaBuckets } from '@/lib/storage/s3'
import { PERMISSION } from '@/lib/auth/authorization'
import { assertMutationPermission } from '@/features/auth/server/access'
import { drainMediaDeletionJobs } from './media'
import { serializable, lockProject } from '@/lib/db/transaction-guards'

const idSchema = z.string().min(1).max(128)
const altSchema = z.string().trim().min(2, 'Укажите описание изображения').max(240)


const copySource = (bucket: string, key: string) =>
  `${encodeURIComponent(bucket)}/${key.split('/').map(encodeURIComponent).join('/')}`

export async function commitProjectImageAction(projectId: string, uploadId: string, alt: string) {
  const actor = await assertMutationPermission(PERMISSION.PROJECT_UPDATE)
  const id = idSchema.parse(projectId)
  const upload = idSchema.parse(uploadId)
  const label = altSchema.parse(alt)
  const staged = await prisma.stagedProjectUpload.findFirst({
    where: { id: upload, projectId: id, uploaderId: actor.user.id,
      status: 'STAGED', expiresAt: { gt: new Date() } },
  })
  if (!staged) throw new Error('Временная загрузка не найдена или истекла.')

  // Atomic claim prevents a double-submit from promoting the same staging object.
  const claim = await prisma.stagedProjectUpload.updateMany({
    where: { id: staged.id, status: 'STAGED', expiresAt: { gt: new Date() } },
    data: { status: 'PROMOTING', expiresAt: new Date(Date.now() + 30 * 60 * 1000) },
  })
  if (claim.count !== 1) throw new Error('Файл уже обрабатывается.')

  let copied = false
  try {
    await s3.send(new CopyObjectCommand({
      Bucket: mediaBuckets.public,
      Key: staged.finalKey,
      CopySource: copySource(mediaBuckets.private, staged.tempKey),
      ContentType: 'image/webp',
      MetadataDirective: 'REPLACE',
      CacheControl: 'public, max-age=31536000, immutable',
    }))
    copied = true

    await serializable(async (tx) => {
      await lockProject(tx, id)
      const claimed = await tx.stagedProjectUpload.findFirst({
        where: { id: staged.id, projectId: id, status: 'PROMOTING' }, select: { id: true },
      })
      if (!claimed) throw new Error('Загрузка была отменена или удалена.')
      const tail = await tx.projectImage.aggregate({
        where: { projectId: id }, _max: { sortOrder: true }, _count: { _all: true },
      })
      if (tail._count._all >= 100) throw new Error('В галерее не может быть больше 100 изображений.')
      await tx.projectImage.create({ data: {
        id: staged.id, projectId: id, objectKey: staged.finalKey,
        alt: label, width: staged.width, height: staged.height,
        sortOrder: (tail._max.sortOrder ?? -1) + 1,
      } })
      await tx.project.update({ where: { id }, data: { updatedAt: new Date() } })
      await tx.stagedProjectUpload.delete({ where: { id: staged.id } })
      await tx.storageDeletionJob.createMany({
        data: [{ bucket: mediaBuckets.private, objectKey: staged.tempKey }],
        skipDuplicates: true,
      })
    })
  } catch (error) {
    // Compensating deletion is queued durably when a copy succeeded but DB write failed.
    if (copied) {
      await prisma.storageDeletionJob.createMany({
        data: [{ bucket: mediaBuckets.public, objectKey: staged.finalKey }],
        skipDuplicates: true,
      })
    }
    await prisma.stagedProjectUpload.updateMany({
      where: { id: staged.id, status: 'PROMOTING' }, data: { status: 'STAGED' },
    })
    throw error
  }

  await drainMediaDeletionJobs(10)
  invalidateProjectViews()
}

export async function setProjectCoverAction(projectId: string, imageId: string) {
  await assertMutationPermission(PERMISSION.PROJECT_UPDATE)
  const id = idSchema.parse(projectId)
  await serializable(async (tx) => {
    await lockProject(tx, id)
    const image = await tx.projectImage.findFirst({
      where: { id: idSchema.parse(imageId), projectId: id }, select: { id: true },
    })
    if (!image) throw new Error('Изображение не принадлежит проекту.')
    await tx.project.update({ where: { id }, data: { coverImageId: image.id, updatedAt: new Date() } })
  })
  invalidateProjectViews()
}

export async function changeProjectImageAltAction(projectId: string, imageId: string, alt: string) {
  await assertMutationPermission(PERMISSION.PROJECT_UPDATE)
  await serializable(async (tx) => {
    await lockProject(tx, idSchema.parse(projectId))
    const result = await tx.projectImage.updateMany({
      where: { id: idSchema.parse(imageId), projectId: projectId },
      data: { alt: altSchema.parse(alt) },
    })
    if (result.count !== 1) throw new Error('Фото не найдено.')
    await tx.project.update({ where: { id: projectId }, data: { updatedAt: new Date() } })
  })
  invalidateProjectViews()
}

export async function moveProjectImageAction(projectId: string, orderedIds: string[]) {
  await assertMutationPermission(PERMISSION.PROJECT_UPDATE)
  const id = idSchema.parse(projectId)
  if (!orderedIds.length || orderedIds.length > 100 || new Set(orderedIds).size !== orderedIds.length) {
    throw new Error('Некорректный порядок фотографий.')
  }
  orderedIds.forEach((imageId) => idSchema.parse(imageId))
  await serializable(async (tx) => {
    await lockProject(tx, id)
    const images = await tx.projectImage.findMany({ where: { projectId: id }, select: { id: true } })
    if (images.length !== orderedIds.length || !images.every((i) => orderedIds.includes(i.id))) {
      throw new Error('Состав галереи изменился. Обновите страницу.')
    }
    for (const [sortOrder, imageId] of orderedIds.entries()) {
      await tx.projectImage.update({ where: { id: imageId }, data: { sortOrder } })
    }
    await tx.project.update({ where: { id }, data: { updatedAt: new Date() } })
  })
  invalidateProjectViews()
}

export async function removeProjectImageAction(projectId: string, imageId: string) {
  await assertMutationPermission(PERMISSION.PROJECT_UPDATE)
  const id = idSchema.parse(projectId)
  await serializable(async (tx) => {
    await lockProject(tx, id)
    const image = await tx.projectImage.findFirst({
      where: { id: idSchema.parse(imageId), projectId: id }, select: { id: true, objectKey: true },
    })
    if (!image) throw new Error('Фото не найдено.')
    const project = await tx.project.findUniqueOrThrow({ where: { id }, select: { coverImageId: true } })
    if (project.coverImageId === image.id) {
      // Published projects must never remain published without an existing cover.
      await tx.project.update({ where: { id }, data: {
        coverImageId: null, status: 'DRAFT', showOnHome: false,
      } })
    }
    await tx.projectImage.delete({ where: { id: image.id } })
    await tx.project.update({ where: { id }, data: { updatedAt: new Date() } })
    await tx.storageDeletionJob.createMany({
      data: [{ bucket: mediaBuckets.public, objectKey: image.objectKey }],
      skipDuplicates: true,
    })
  })
  await drainMediaDeletionJobs(10)
  invalidateProjectViews()
}
