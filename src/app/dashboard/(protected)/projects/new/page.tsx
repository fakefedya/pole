import { Suspense } from 'react'
import { DashboardPageSkeleton } from '@/features/dashboard/components/dashboard-page-skeleton'
import { PERMISSION } from '@/lib/auth/authorization'
import { requirePagePermission } from '@/features/auth/server/access'
import { ProjectForm } from '@/features/projects/components/project-form'
import { countFeaturedProjects } from '@/features/projects/server/admin-queries'
async function NewContent() {
	await requirePagePermission(PERMISSION.PROJECT_CREATE)
	const featuredCount = await countFeaturedProjects()
	return <ProjectForm featuredCount={featuredCount} />
}
export default function NewProjectPage() {
	return (
		<Suspense fallback={<DashboardPageSkeleton variant='form' />}>
			<NewContent />
		</Suspense>
	)
}