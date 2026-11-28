
import { Suspense } from 'react'

import { requireDashboardSession } from '@/features/auth/server/access'
import { DashboardShell } from '@/features/dashboard/components/dashboard-shell'
import { DashboardShellSkeleton } from '@/features/dashboard/components/dashboard-shell-skeleton'
import { DashboardRouteBoundary } from '@/features/dashboard/components/dashboard-route-boundary'

async function ProtectedArea({ children }: { children: React.ReactNode }) {
	const session = await requireDashboardSession()

	return (
		<DashboardShell name={session.user.name} role={session.user.role}>
			<DashboardRouteBoundary>{children}</DashboardRouteBoundary>
		</DashboardShell>
	)
}

export default function ProtectedLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<Suspense fallback={<DashboardShellSkeleton />}>
			<ProtectedArea>{children}</ProtectedArea>
		</Suspense>
	)
}
