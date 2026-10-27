import { Suspense } from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPublishedProjectBySlug } from '@/features/projects/server/public-queries'
import { SiteContainer } from '@/components/layout/site-container'

type Props = { params: Promise<{ slug: string }> }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { slug } = await params
	const project = await getPublishedProjectBySlug(slug)
	if (!project)
		return { title: 'Проект не найден | STUDIO POLE', robots: { index: false } }
	return {
		title: `${project.title} | STUDIO POLE`,
		description:
			project.summary ?? `Дизайн интерьера ${project.title} от STUDIO POLE`,
		openGraph: {
			title: project.title,
			description: project.summary ?? undefined,
			images: project.coverUrl ? [{ url: project.coverUrl }] : [],
		},
	}
}

async function PublishedProject({ params }: Props) {
	const { slug } = await params
	const project = await getPublishedProjectBySlug(slug)
	if (!project) notFound()
	return (
		<article className='bg-brand-milk px-6 py-16 text-brand-charcoal md:px-10'>
			<SiteContainer className='mx-auto max-w-7xl gap-12'>
				<header className='space-y-5'>
					<Link
						href='/projects'
						className='text-sm opacity-60 hover:opacity-100'
					>
						Все проекты
					</Link>
					<h1 className='font-display text-5xl md:text-7xl'>{project.title}</h1>
					{project.summary && (
						<p className='max-w-3xl text-lg opacity-70'>{project.summary}</p>
					)}
					<div className='flex flex-wrap gap-x-6 gap-y-2 text-sm opacity-65'>
						{project.location && <span>{project.location}</span>}
						{project.areaSqM && <span>{project.areaSqM} м²</span>}
						{project.style && <span>{project.style}</span>}
						{project.year && <span>{project.year}</span>}
					</div>
				</header>
				{project.coverUrl && (
					<div className='relative aspect-[16/9] overflow-hidden bg-brand-espresso'>
						<Image
							src={project.coverUrl}
							alt={project.coverImage?.alt ?? project.title}
							fill
							sizes='100vw'
							priority
							className='object-cover'
						/>
					</div>
				)}
				{project.images.some((image) => image.id !== project.coverImageId) && (
					<div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
						{project.images
							.filter((image) => image.id !== project.coverImageId)
							.map((image) => (
								<figure key={image.id}>
									<div className='relative aspect-[4/3] overflow-hidden bg-brand-espresso'>
										<Image
											src={image.url}
											alt={image.alt}
											fill
											sizes='(max-width: 768px) 100vw, 50vw'
											className='object-cover'
										/>
									</div>
								</figure>
							))}
					</div>
				)}
				{project.blocks.length > 0 && (
					<div className='max-w-3xl space-y-5'>
						{project.blocks.map((block) =>
							block.type === 'HEADING' ? (
								<h2 key={block.id} className='pt-6 font-display text-3xl'>
									{block.body}
								</h2>
							) : (
								<p
									key={block.id}
									className='whitespace-pre-line leading-relaxed'
								>
									{block.body}
								</p>
							),
						)}
					</div>
				)}
			</SiteContainer>
		</article>
	)
}
export default function ProjectPage({ params }: Props) {
	return (
		<Suspense fallback={<div className='min-h-dvh bg-brand-milk' />}>
			<PublishedProject params={params} />
		</Suspense>
	)
}
