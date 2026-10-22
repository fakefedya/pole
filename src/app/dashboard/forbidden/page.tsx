import Link from 'next/link'
import { ShieldX } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
export default function ForbiddenPage() {
	return (
		<main className='flex min-h-dvh flex-col items-center justify-center gap-5 bg-[#f6f4f0] px-6 text-center'>
			<ShieldX className='size-12 text-neutral-500' />
			<h1 className='text-3xl font-semibold'>Нет доступа</h1>
			<p className='max-w-md text-neutral-600'>
				У вашей учётной записи нет прав для этого раздела. Обратитесь к
				администратору.
			</p>
			<div className='flex gap-3'>
				<Link className={cn(buttonVariants(), 'inline-flex')} href='/'>
					На сайт
				</Link>
				<Link className='self-center text-sm underline' href='/dashboard/login'>
					Другой аккаунт
				</Link>
			</div>
		</main>
	)
}
