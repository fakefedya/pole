import 'server-only'
import { cacheLife, cacheTag } from 'next/cache'
import { prisma } from '@/lib/db/prisma'
import { getPublicImageUrl } from '@/lib/storage/public-image'

export type PublicProjectCard = {
  id: string
  slug: string
  title: string
  summary: string | null
  location: string | null
  areaSqM: string | null
  coverUrl: string
  coverAlt: string
}

function toCard(project: {
  id: string; slug: string; title: string; summary: string | null;
  location: string | null; areaSqM: { toString(): string } | null;
  coverImage: { objectKey: string; alt: string } | null
}): PublicProjectCard | null {
  if (!project.coverImage) return null
  return {
    id: project.id, slug: project.slug, title: project.title,
    summary: project.summary, location: project.location,
    areaSqM: project.areaSqM?.toString() ?? null,
    coverUrl: getPublicImageUrl(project.coverImage.objectKey),
    coverAlt: project.coverImage.alt,
  }
}

export async function getFeaturedProjects(): Promise<PublicProjectCard[]> {
  'use cache'
  cacheTag('featured-projects')
  cacheLife('hours')
  const projects = await prisma.project.findMany({
    where: { status: 'PUBLISHED', showOnHome: true, coverImageId: { not: null }, coverImage: { isNot: null } },
    orderBy: [{ homeOrder: 'asc' }, { publishedAt: 'desc' }, { id: 'asc' }],
    take: 6,
    select: { id: true, slug: true, title: true, summary: true, location: true, areaSqM: true,
      coverImage: { select: { objectKey: true, alt: true } } },
  })
  return projects.map(toCard).filter((item): item is PublicProjectCard => item !== null)
}

export async function getPublishedProjects(): Promise<PublicProjectCard[]> {
  'use cache'
  cacheTag('published-projects')
  cacheLife('hours')
  const projects = await prisma.project.findMany({
    where: { status: 'PUBLISHED', coverImageId: { not: null }, coverImage: { isNot: null } },
    orderBy: [{ publishedAt: 'desc' }, { id: 'asc' }],
    take: 100,
    select: { id: true, slug: true, title: true, summary: true, location: true, areaSqM: true,
      coverImage: { select: { objectKey: true, alt: true } } },
  })
  return projects.map(toCard).filter((item): item is PublicProjectCard => item !== null)
}

export async function getPublishedProjectBySlug(slug: string) {
  'use cache'
  cacheTag('published-projects')
  cacheLife('hours')
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return null
  const project = await prisma.project.findFirst({
    where: { slug, status: 'PUBLISHED', coverImageId: { not: null }, coverImage: { isNot: null } },
    select: { slug: true, title: true, summary: true, location: true, coverImageId: true,
      coverImage: { select: { objectKey: true, alt: true } },
      areaSqM: true, style: true, designDuration: true, year: true, tags: true,
      images: { orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
        select: { id: true, alt: true, objectKey: true, width: true, height: true } },
      blocks: { orderBy: { sortOrder: 'asc' }, select: { id: true, type: true, body: true } },
    },
  })
  if (!project) return null
  return {
    ...project,
    areaSqM: project.areaSqM?.toString() ?? null,
    coverUrl: project.coverImage ? getPublicImageUrl(project.coverImage.objectKey) : null,
    images: project.images.map((im) => ({ ...im, url: getPublicImageUrl(im.objectKey) })),
  }
}
