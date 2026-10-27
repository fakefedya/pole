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
		<main className='mx-auto max-w-6xl space-y-8'>
			<header className='flex flex-wrap items-center justify-between gap-4'>
				<div>
					<h1 className='text-3xl text-brand-milk font-semibold tracking-tight sm:text-4xl'>
						Панель управления
					</h1>
				</div>
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
						<Card
							key={label}
							className='border border-dashboard-input-border bg-brand-charcoal'
						>
							<CardHeader>
								<CardDescription className='font-semibold text-muted-foreground'>
									{label}
								</CardDescription>
								<CardTitle className='text-4xl text-brand-milk'>
									{value}
								</CardTitle>
							</CardHeader>
						</Card>
					))}
				</div>
			) : null}
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
