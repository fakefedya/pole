import { Suspense } from 'react'
import { prisma } from '@/lib/db/prisma'
import { requirePagePermission } from '@/features/auth/server/access'
import { PERMISSION } from '@/lib/auth/authorization'
import { UsersManager } from '@/features/users/components/users-manager'
import { Skeleton } from '@/components/ui/skeleton'

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
		<Suspense fallback={<Skeleton className='h-80 rounded-2xl' />}>
			<UsersContent />
		</Suspense>
	)
}
