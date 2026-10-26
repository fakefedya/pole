import { Suspense } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { PERMISSION, hasPermission } from '@/lib/auth/authorization'
import { requirePagePermission } from '@/features/auth/server/access'
import { listAdminProjects } from '@/features/projects/server/admin-queries'
import { DeleteProjectButton } from '@/features/projects/components/delete-project-button'

const STATUS = { DRAFT: 'Черновик', HIDDEN: 'Скрыт', PUBLISHED: 'Опубликован' }

async function ProjectsList() {
	const session = await requirePagePermission(PERMISSION.PROJECT_READ)
	const [projects] = await Promise.all([listAdminProjects()])
	const canCreate = hasPermission(session.user.role, PERMISSION.PROJECT_CREATE)
	const canEdit = hasPermission(session.user.role, PERMISSION.PROJECT_UPDATE)
	const canDelete = hasPermission(session.user.role, PERMISSION.PROJECT_DELETE)
	return (
		<main className='mx-auto max-w-6xl space-y-7'>
			<div className='flex flex-wrap items-start justify-between gap-4'>
				<div>
					<p className='mb-2 text-xs font-semibold uppercase tracking-[.25em] text-[#954520]'>
						Портфолио
					</p>
					<h1 className='text-3xl font-semibold tracking-tight'>Проекты</h1>
					<p className='mt-2 text-sm text-neutral-500'>
						Управление публикациями STUDIO POLE
					</p>
				</div>
				{canCreate && (
					<Link href='/dashboard/projects/new' className={cn(buttonVariants())}>
						+ Создать проект
					</Link>
				)}
			</div>
			<Card>
				<CardHeader>
					<CardTitle>
						Все проекты{' '}
						<span className='text-neutral-400'>({projects.length})</span>
					</CardTitle>
					<CardDescription>Последние изменения — сверху</CardDescription>
				</CardHeader>
				<CardContent className='space-y-1'>
					{projects.length === 0 ? (
						<div className='rounded-xl border border-dashed p-10 text-center text-sm text-neutral-500'>
							Проектов пока нет. Создайте первый черновик.
						</div>
					) : (
						projects.map((project) => (
							<div
								className='flex flex-wrap items-center justify-between gap-4 border-b border-neutral-100 py-4 last:border-0'
								key={project.id}
							>
								<div className='min-w-0 flex-1'>
									<div className='flex flex-wrap items-center gap-3'>
										<p className='font-medium'>{project.title}</p>
										<Badge variant='outline'>{STATUS[project.status]}</Badge>
										{project.showOnHome && (
											<Badge variant='secondary'>Главная</Badge>
										)}
									</div>
									<p className='mt-1 text-xs text-neutral-500'>
										/{project.slug} · {project._count.images} фото ·{' '}
										{project.updatedAt.toLocaleDateString('ru-RU')}
									</p>
								</div>
								<div className='flex items-center gap-3'>
									{canEdit && (
										<Link
											href={`/dashboard/projects/${project.id}/edit`}
											className={cn(
												buttonVariants({ size: 'sm', variant: 'outline' }),
											)}
										>
											Изменить
										</Link>
									)}
									{canDelete && <DeleteProjectButton id={project.id} />}
								</div>
							</div>
						))
					)}
				</CardContent>
			</Card>
		</main>
	)
}
export default function ProjectsPage() {
	return (
		<Suspense fallback={<Skeleton className='h-64 rounded-2xl' />}>
			<ProjectsList />
		</Suspense>
	)
}
