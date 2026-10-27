import { Suspense } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { DashboardPageSkeleton } from '@/features/dashboard/components/dashboard-page-skeleton'
import { DashboardPageHeader } from '@/features/dashboard/components/dashboard-page-header'
import { ProjectsDataTable } from '@/features/projects/components/data-table'
import type { ProjectTableRow } from '@/features/projects/components/types'
import { PERMISSION, hasPermission } from '@/lib/auth/authorization'
import { requirePagePermission } from '@/features/auth/server/access'
import { listAdminProjects } from '@/features/projects/server/admin-queries'
import { getPublicImageUrl } from '@/lib/storage/public-image'

async function ProjectsList() {
	const session = await requirePagePermission(PERMISSION.PROJECT_READ)
	const projects = await listAdminProjects()
	const canCreate = hasPermission(session.user.role, PERMISSION.PROJECT_CREATE)
	const canEdit = hasPermission(session.user.role, PERMISSION.PROJECT_UPDATE)
	const rows: ProjectTableRow[] = projects.map((p) => ({
		id: p.id,
		title: p.title,
		slug: p.slug,
		status: p.status,
		location: p.location,
		areaSqM: p.areaSqM?.toString() ?? null,
		tags: p.tags,
		updatedAt: p.updatedAt.toISOString(),
		showOnHome: p.showOnHome,
		imageCount: p._count.images,
		coverUrl: p.coverImage ? getPublicImageUrl(p.coverImage.objectKey) : null,
	}))
	return (
		<main className='mx-auto w-full space-y-7'>
			<DashboardPageHeader
				title='Проекты'
				description='Управление портфолио STUDIO POLE'
				action={
					canCreate ? (
						<Link
							href='/dashboard/projects/new'
							className={cn(
								buttonVariants(),
								'h-9 rounded-sm border border-dashboard-input-border bg-dashboard-input px-4',
							)}
						>
							<Plus className='size-4' /> Создать проект
						</Link>
					) : undefined
				}
			/>
			<ProjectsDataTable projects={rows} canEdit={canEdit} />
		</main>
	)
}
export default function ProjectsPage() {
	return (
		<Suspense fallback={<DashboardPageSkeleton variant='table' />}>
			<ProjectsList />
		</Suspense>
	)
}