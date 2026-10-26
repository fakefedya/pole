'use client'

import { usePathname } from 'next/navigation'

/**
 * Keep the shared dashboard shell mounted, but remount page content when
 * moving between dashboard routes. Next.js 16 cacheComponents can retain
 * inactive route DOM using React Activity; dashboard editing forms should
 * not leak their state into another section.
 *
 * Do not key DashboardShell itself: that would reset navigation and logout.
 */
export function DashboardRouteBoundary({
	children,
}: {
	children: React.ReactNode
}) {
	const pathname = usePathname()
	return (
		<div key={pathname} data-dashboard-route={pathname}>
			{children}
		</div>
	)
}
