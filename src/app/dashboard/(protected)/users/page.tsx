import { Suspense } from 'react'
import { prisma } from '@/lib/db/prisma'
import { requirePagePermission } from '@/features/auth/server/access'
import { PERMISSION } from '@/lib/auth/authorization'
import { UsersManager } from '@/features/users/components/users-manager'
import { DashboardPageSkeleton } from '@/features/dashboard/components/dashboard-page-skeleton'

async function UsersContent() {
	const session = await requirePagePermission(PERMISSION.USERS_MANAGE)
	const users = await prisma.user.findMany({
		select: {
			id: true,
			name: true,
			email: true,
			role: true,
			banned: true,
			twoFactorEnabled: true,
			createdAt: true,
		},
		orderBy: { createdAt: 'desc' },
	})
	return (
		<UsersManager
			actorId={session.user.id}
			users={users.map((u) => ({ ...u, createdAt: u.createdAt.toISOString() }))}
		/>
	)
}

export default function UsersPage() {
	return (
		<Suspense fallback={<DashboardPageSkeleton variant='table' />}>
			<UsersContent />
		</Suspense>
	)
}