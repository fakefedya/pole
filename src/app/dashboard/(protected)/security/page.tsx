import { Suspense } from 'react'

import { requireAdmin } from '@/features/auth/server/require-admin'
import { TwoFactorSetup } from '@/features/auth/components/two-factor-setup'

async function SecurityContent() {
	const session = await requireAdmin()

	return (
		<main className='mx-auto max-w-2xl p-10'>
			<h1 className='mb-8 text-3xl font-semibold'>Безопасность аккаунта</h1>

			<TwoFactorSetup
				initiallyEnabled={session.user.twoFactorEnabled === true}
			/>
		</main>
	)
}

export default function SecurityPage() {
	return (
		<Suspense
			fallback={<div className='p-10'>Загрузка настроек безопасности…</div>}
		>
			<SecurityContent />
		</Suspense>
	)
}
