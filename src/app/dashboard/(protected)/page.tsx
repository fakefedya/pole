import { Suspense } from 'react'
import Link from 'next/link'
import { prisma } from '@/lib/db/prisma'
import { PERMISSION, hasPermission } from '@/lib/auth/authorization'
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { requireDashboardSession } from '@/features/auth/server/access'

async function Overview() {
	const session = await requireDashboardSession()

	const canSeeProjects = hasPermission(
		session.user.role,
		PERMISSION.PROJECT_READ,
	)

	const counts = canSeeProjects
		? await prisma.project.groupBy({
				by: ['status'],
				_count: { _all: true },
			})
		: []

	const count = (status: 'DRAFT' | 'HIDDEN' | 'PUBLISHED') =>
		counts.find((row) => row.status === status)?._count._all ?? 0
	return (
		<main className='mx-auto max-w-6xl space-y-8 bg-red-100'>
			<header className='flex flex-wrap items-center justify-between gap-4'>
				<div>
					<p className='mb-2 text-xs font-semibold uppercase tracking-[.25em] text-[#954520]'>
						STUDIO POLE / Workspace
					</p>
					<h1 className='text-3xl font-semibold tracking-tight sm:text-4xl'>
						Рабочая панель
					</h1>
					<p className='mt-2 text-sm text-neutral-500'>
						Добро пожаловать, {session.user.name || session.user.email}.
					</p>
				</div>
				<Badge variant='outline'>Защищённый доступ</Badge>
			</header>

			{canSeeProjects ? (
				<div className='grid gap-4 sm:grid-cols-3'>
					{(
						[
							['Опубликовано', count('PUBLISHED')],
							['Черновики', count('DRAFT')],
							['Скрыто', count('HIDDEN')],
						] as const
					).map(([label, value]) => (
						<Card key={label}>
							<CardHeader>
								<CardDescription>{label}</CardDescription>
								<CardTitle className='text-4xl'>{value}</CardTitle>
							</CardHeader>
						</Card>
					))}
				</div>
			) : null}
			{canSeeProjects && (
				<Card>
					<CardHeader>
						<CardTitle>Портфолио</CardTitle>
						<CardDescription>
							Управление проектами и публикациями
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Link
							href='/dashboard/projects'
							className='inline-flex rounded-xl bg-neutral-950 px-5 py-3 text-sm font-medium text-white hover:bg-neutral-800'
						>
							Перейти к проектам →
						</Link>
					</CardContent>
				</Card>
			)}
		</main>
	)
}
export default function DashboardPage() {
	return (
		<Suspense fallback={<Skeleton className='h-64 rounded-2xl' />}>
			<Overview />
		</Suspense>
	)
}
