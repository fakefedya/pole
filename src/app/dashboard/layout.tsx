import { Toaster } from '@/components/ui/sonner'

/** One toast host for /dashboard, /dashboard/login and /dashboard/verify. */
export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<>
			{children}
			<Toaster position='bottom-right' richColors closeButton theme='dark' />
		</>
	)
}
