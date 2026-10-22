import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { PERMISSION } from '@/lib/auth/authorization'
import { requirePagePermission } from '@/features/auth/server/access'
import { ProjectForm } from '@/features/projects/components/project-form'
async function NewContent() {
	await requirePagePermission(PERMISSION.PROJECT_CREATE)
	return <ProjectForm />
}
export default function NewProjectPage() {
	return (
		<Suspense fallback={<Skeleton className='h-72 rounded-2xl' />}>
			<NewContent />
		</Suspense>
	)
}
