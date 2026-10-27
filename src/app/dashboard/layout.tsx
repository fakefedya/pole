import { Toaster } from '@/components/ui/sonner'

/** One toast host for /dashboard, /dashboard/login and /dashboard/verify. */
export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<div className='min-h-dvh bg-dashboard-background'>
			{children}
			<Toaster position='bottom-left' richColors closeButton theme='dark' />
		</div>
	)
}
