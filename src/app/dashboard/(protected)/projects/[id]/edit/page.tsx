import { Suspense } from 'react'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ImageOff, Images, ShieldCheck } from 'lucide-react'
import { DashboardPageSkeleton } from '@/features/dashboard/components/dashboard-page-skeleton'
import { Badge } from '@/components/ui/badge'
import { PERMISSION, hasPermission } from '@/lib/auth/authorization'
import { requirePagePermission } from '@/features/auth/server/access'
import { blocksToDescription } from '@/features/projects/schemas/project-form'
import { getAdminProject, countFeaturedProjects } from '@/features/projects/server/admin-queries'
import { ProjectForm } from '@/features/projects/components/project-form'
import { ProjectGallery } from '@/features/projects/components/project-gallery'
import { DeleteProjectButton } from '@/features/projects/components/delete-project-button'
import { getPublicImageUrl } from '@/lib/storage/public-image'

const statusLabel = {
	DRAFT: 'Черновик',
	HIDDEN: 'Скрыт',
	PUBLISHED: 'Опубликован',
} as const

type Props = { params: Promise<{ id: string }> }

async function EditContent({ params }: Props) {
	const session = await requirePagePermission(PERMISSION.PROJECT_UPDATE)
	const { id } = await params
	const project = await getAdminProject(id)
	if (!project) notFound()
	const featuredCount = await countFeaturedProjects()

	const cover = project.images.find(
		(image) => image.id === project.coverImageId,
	)
	const hasCover = Boolean(cover)

	return (
		<main className='mx-auto w-full max-w-7xl'>
			<div className='grid min-w-0 gap-7 xl:grid-cols-[minmax(0,1fr)_270px]'>
				<div className='min-w-0 space-y-7'>
					<ProjectForm
						key={project.id}
						featuredCount={featuredCount}
						project={{
							id: project.id,
							title: project.title,
							slug: project.slug,
							summary: project.summary,
							tags: project.tags,
							location: project.location,
							style: project.style,
							designDuration: project.designDuration,
							areaSqM: project.areaSqM?.toString() ?? null,
							year: project.year,
							description: blocksToDescription(project.blocks),
							status: project.status,
							showOnHome: project.showOnHome,
							homeOrder: project.homeOrder,
							hasCover,
							contentRevision: project.contentRevision,
						}}
					/>
					<div id='project-gallery' className='scroll-mt-28'>
						<ProjectGallery
							projectId={project.id}
							coverImageId={project.coverImageId}
							images={project.images.map((image) => ({
								id: image.id,
								alt: image.alt,
								width: image.width,
								height: image.height,
								url: getPublicImageUrl(image.objectKey),
							}))}
						/>
					</div>
				</div>

				<aside
					aria-label='Сводка проекта'
					className='h-fit space-y-4 xl:sticky xl:top-6'
				>
					<div className='overflow-hidden rounded-lg border border-dashboard-border bg-dashboard-input'>
						<div className='relative aspect-[4/3] bg-dashboard-background'>
							{cover ? (
								<Image
									src={getPublicImageUrl(cover.objectKey)}
									alt={`Обложка проекта: ${project.title}`}
									fill
									unoptimized
									sizes='270px'
									className='object-cover'
								/>
							) : (
								<div className='flex h-full w-full items-center justify-center'>
									<ImageOff
										className='size-9 text-muted-foreground'
										aria-hidden='true'
									/>
								</div>
							)}
							{hasCover && (
								<span className='absolute bottom-3 left-3 rounded-md bg-brand-terracota px-3 py-1.5 text-xs font-semibold text-white'>
									Обложка проекта
								</span>
							)}
						</div>
						<div className='space-y-4 p-4 text-sm'>
							<div className='space-y-2'>
								<p className='text-xs uppercase tracking-wider text-muted-foreground'>
									Состояние
								</p>
								<Badge variant='outline' className='text-brand-milk'>
									{statusLabel[project.status]}
								</Badge>
								<p className='text-xs text-muted-foreground'>
									{hasCover
										? 'Обложка назначена'
										: 'Для публикации выберите обложку в галерее'}
								</p>
							</div>
							<div className='flex items-center gap-2 text-brand-milk'>
								<Images className='size-4' aria-hidden='true' />
								{project.images.length}{' '}
								{project.images.length === 1 ? 'фотография' : 'фотографий'}
							</div>
							<div className='flex items-center gap-2 text-xs text-muted-foreground'>
								<ShieldCheck className='size-4' aria-hidden='true' />
								{project.status === 'PUBLISHED'
									? 'Статус: опубликован'
									: 'Не опубликован'}
							</div>
							<a
								href='#project-gallery'
								className='block rounded-md border border-dashboard-border px-3 py-2 text-center text-xs font-medium text-brand-milk transition hover:bg-dashboard-background'
							>
								Управлять фотографиями
							</a>
							<p className='text-xs text-muted-foreground'>
								Обновлён: {project.updatedAt.toLocaleDateString('ru-RU')}
							</p>
						</div>
					</div>
					{hasPermission(session.user.role, PERMISSION.PROJECT_DELETE) && (
						<div className='rounded-lg border border-dashboard-border p-3'>
							<p className='mb-3 text-xs text-muted-foreground'>
								Опасная зона: удаление проекта необратимо.
							</p>
							<DeleteProjectButton
								className='w-full rounded-lg'
								id={project.id}
							/>
						</div>
					)}
				</aside>
			</div>
		</main>
	)
}

export default function EditProjectPage(props: Props) {
	return (
		<Suspense fallback={<DashboardPageSkeleton variant='form' />}>
			<EditContent {...props} />
		</Suspense>
	)
}