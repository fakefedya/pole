import { Suspense } from 'react'
import { requireDashboardSession } from '@/features/auth/server/access'
import { TwoFactorSetup } from '@/features/auth/components/two-factor-setup'
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

async function SecurityContent() {
	const session = await requireDashboardSession()
	return (
		<div className='mx-auto max-w-2xl space-y-6'>
			<header>
				<p className='mb-1 text-xs font-semibold uppercase tracking-[.25em] text-neutral-500'>
					Настройки
				</p>
				<h1 className='text-3xl font-semibold tracking-tight'>
					Безопасность аккаунта
				</h1>
			</header>
			<Card>
				<CardHeader>
					<CardTitle>Двухфакторная авторизация</CardTitle>
					<CardDescription>Подтверждение входа кодом из письма</CardDescription>
				</CardHeader>
				<CardContent>
					<TwoFactorSetup
						initiallyEnabled={session.user.twoFactorEnabled === true}
					/>
				</CardContent>
			</Card>
		</div>
	)
}
export default function SecurityPage() {
	return (
		<Suspense fallback={<Skeleton className='h-72 w-full rounded-2xl' />}>
			<SecurityContent />
		</Suspense>
	)
}
