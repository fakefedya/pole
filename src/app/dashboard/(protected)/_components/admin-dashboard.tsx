import { requireAdmin } from '@/features/auth/server/require-admin'

import { LogoutButton } from '@/features/auth/components/logout-button'

export async function AdminDashboard() {
	const session = await requireAdmin()

	return (
		<main className='mx-auto flex max-w-5xl flex-col gap-8 p-10'>
			<div className='flex items-center justify-between gap-4'>
				<div>
					<h1 className='text-3xl font-semibold'>Панель управления</h1>

					<p className='mt-2 text-sm text-neutral-600'>{session.user.email}</p>
				</div>

				<LogoutButton />
			</div>

			<section className='rounded-2xl bg-white p-6'>
				<h2 className='text-xl font-medium'>Проекты</h2>

				<p className='mt-2 text-neutral-600'>
					Управление портфолио появится на следующем этапе.
				</p>
			</section>
		</main>
	)
}
