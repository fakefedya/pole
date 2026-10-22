import 'server-only'
import { prisma } from '@/lib/db/prisma'

/** Приватные данные. Не используем use cache. */
export async function listAdminProjects() {
  return prisma.project.findMany({
    select: { id: true, slug: true, title: true, status: true, showOnHome: true, updatedAt: true, _count: { select: { images: true } } },
    orderBy: [{ updatedAt: 'desc' }, { id: 'asc' }],
    take: 100,
  })
}

export async function getAdminProject(id: string) {
  return prisma.project.findUnique({
    where: { id },
    include: { blocks: { orderBy: { sortOrder: 'asc' } }, images: { orderBy: { sortOrder: 'asc' }, select: { id: true, objectKey: true, alt: true, width: true, height: true } } },
  })
}
