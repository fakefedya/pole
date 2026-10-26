import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { Skeleton } from '@/components/ui/skeleton'
import { PERMISSION } from '@/lib/auth/authorization'
import { requirePagePermission } from '@/features/auth/server/access'
import { getAdminProject } from '@/features/projects/server/admin-queries'
import { ProjectForm } from '@/features/projects/components/project-form'

type Props = { params: Promise<{ id: string }> }
async function EditContent({ params }: Props) {
	await requirePagePermission(PERMISSION.PROJECT_UPDATE)
	const { id } = await params
	const project = await getAdminProject(id)
	if (!project) notFound()
	return (
		<ProjectForm
			key={project.id}
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
				description: project.blocks.map((b) => b.body).join('\n\n'),
				status: project.status,
				showOnHome: project.showOnHome,
				homeOrder: project.homeOrder,
			}}
		/>
	)
}
export default function EditProjectPage(props: Props) {
	return (
		<Suspense fallback={<Skeleton className='h-72 rounded-2xl' />}>
			<EditContent {...props} />
		</Suspense>
	)
}
