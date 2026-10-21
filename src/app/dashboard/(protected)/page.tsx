import { Suspense } from 'react'
import { AdminDashboard } from './_components/admin-dashboard'

export function AdminPage() {
	return (
		<Suspense fallback={<div>Загрузка панели…</div>}>
			<AdminDashboard />
		</Suspense>
	)
}

export { AdminPage as default }
