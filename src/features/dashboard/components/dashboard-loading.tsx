import { Skeleton } from '@/components/ui/skeleton'

export function DashboardLoading() {
	return (
		<div
			className='flex min-h-dvh w-full bg-[#f6f4f0]'
			role='status'
			aria-label='Загрузка личного кабинета'
		>
			<aside
				className='hidden w-64 border-r border-neutral-200 bg-white p-6 md:block'
				aria-hidden='true'
			>
				<Skeleton className='mb-12 h-8 w-28' />
				<Skeleton className='mb-4 h-9 w-full' />
				<Skeleton className='mb-4 h-9 w-4/5' />
				<Skeleton className='h-9 w-4/5' />
			</aside>
			<main className='w-full max-w-6xl p-6 md:p-10' aria-hidden='true'>
				<Skeleton className='mb-5 h-9 w-56' />
				<Skeleton className='mb-10 h-5 w-80 max-w-full' />
				<div className='grid gap-4 md:grid-cols-3'>
					<Skeleton className='h-36 rounded-2xl' />
					<Skeleton className='h-36 rounded-2xl' />
					<Skeleton className='h-36 rounded-2xl' />
				</div>
			</main>
		</div>
	)
}
