import 'server-only'
import { prisma } from '@/lib/db/prisma'

/** Always private, no "use cache". The page guards access before calling. */
export async function listAdminProjects() {
  return prisma.project.findMany({
    select: {
      id: true, slug: true, title: true, status: true,
      location: true, areaSqM: true, tags: true, showOnHome: true,
      updatedAt: true,
      coverImage: { select: { objectKey: true } },
      _count: { select: { images: true } },
    },
    orderBy: [{ updatedAt: 'desc' }, { id: 'asc' }],
  })
}

export async function getAdminProject(id: string) {
  return prisma.project.findUnique({
    where: { id },
    include: {
      blocks: { orderBy: { sortOrder: 'asc' } },
      images: { orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
        select: { id: true, objectKey: true, alt: true, width: true, height: true, sortOrder: true },
      },
    },
  })
}
/** Private counter; only call after the Dashboard permission check. */
export async function countFeaturedProjects(): Promise<number> {
  return prisma.project.count({ where: { status: 'PUBLISHED', showOnHome: true } })
}
