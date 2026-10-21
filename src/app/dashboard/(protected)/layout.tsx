import { Suspense } from 'react'

import { requireAdmin } from '@/features/auth/server/require-admin'

async function AdminAccess({ children }: { children: React.ReactNode }) {
	await requireAdmin()

	return (
		<div className='min-h-dvh bg-neutral-100 text-neutral-900'>{children}</div>
	)
}

export function AdminLayout({ children }: { children: React.ReactNode }) {
	return (
		<Suspense fallback={<div>Проверка доступа…</div>}>
			<AdminAccess>{children}</AdminAccess>
		</Suspense>
	)
}

export { AdminLayout as default }
