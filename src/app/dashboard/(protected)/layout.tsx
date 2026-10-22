import { Suspense } from 'react'

import { requireDashboardSession } from '@/features/auth/server/access'
import { DashboardShell } from '@/features/dashboard/components/dashboard-shell'

async function ProtectedArea({ children }: { children: React.ReactNode }) {
	const session = await requireDashboardSession()

	return (
		<DashboardShell email={session.user.email} role={session.user.role}>
			{children}
		</DashboardShell>
	)
}

export default function ProtectedLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<Suspense fallback={null}>
			<ProtectedArea>{children}</ProtectedArea>
		</Suspense>
	)
}
