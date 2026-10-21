import 'server-only'

import { cacheLife, cacheTag } from 'next/cache'

import { prisma } from '@/lib/db/prisma'
import { getPublicImageUrl } from '@/lib/storage/public-image'

export async function getFeaturedProjects() {
  'use cache'

  cacheLife('hours')
  cacheTag('featured-projects')

  const projects = await prisma.project.findMany({
    where: {
      status: 'PUBLISHED',
      showOnHome: true,
      coverImageId: {
        not: null,
      },
    },

    orderBy: [
      { homeOrder: 'asc' },
      { publishedAt: 'desc' },
      { id: 'asc' },
    ],

    take: 3,

    select: {
      id: true,
      slug: true,
      title: true,
      summary: true,
      tags: true,

      coverImage: {
        select: {
          objectKey: true,
          alt: true,
          width: true,
          height: true,
        },
      },
    },
  })

  return projects.map((project) => ({
    id: project.id,
    slug: project.slug,
    title: project.title,
    summary: project.summary,
    tags: project.tags,

    cover: project.coverImage
      ? {
          src: getPublicImageUrl(
            project.coverImage.objectKey,
          ),
          alt: project.coverImage.alt,
          width: project.coverImage.width,
          height: project.coverImage.height,
        }
      : null,
  }))
}
