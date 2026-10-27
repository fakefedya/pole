import Link from 'next/link'
import {
	FolderKanban,
	LayoutDashboard,
	ArrowUpRight,
	UsersRound,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { LogoutButton } from '@/features/auth/components/logout-button'
import {
	PERMISSION,
	hasPermission,
	primaryRoleLabel,
} from '@/lib/auth/authorization'
import { cn } from '@/lib/utils'

type Props = {
	name: string
	role: string | null | undefined
	children: React.ReactNode
}

export function DashboardShell({ name, role, children }: Props) {
	const items = [
		{
			href: '/dashboard',
			label: 'Обзор',
			icon: LayoutDashboard,
			allowed: true,
		},
		{
			href: '/dashboard/projects',
			label: 'Проекты',
			icon: FolderKanban,
			allowed: hasPermission(role, PERMISSION.PROJECT_READ),
		},
		{
			href: '/dashboard/users',
			label: 'Пользователи',
			icon: UsersRound,
			allowed: hasPermission(role, PERMISSION.USERS_MANAGE),
		},
	]

	return (
		<div
			className={cn(
				'min-h-dvh bg-dashboard-background',
				'md:grid md:grid-cols-[124px_minmax(0,1fr)]',
			)}
		>
			<aside className='h-dvh sticky top-0 flex items-center mx-7.5'>
				<nav
					className='relative flex flex-col w-fit rounded-full bg-brand-charcoal p-1.5 backdrop-blur-md'
					aria-label='Навигация дашборда'
				>
					{items
						.filter((item) => item.allowed)
						.map(({ href, icon: Icon }) => (
							<Link
								key={href}
								href={href}
								className={cn(
									'w-fit h-fit text-brand-milk p-4 rounded-full',
									'hover:bg-brand-milk/10 transition-colors duration-300',
									'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-800',
								)}
							>
								<Icon size={20} aria-hidden='true' />
							</Link>
						))}
				</nav>
			</aside>

			<div className=' min-w-0 p-7.5'>
				<div className='flex flex-col gap-10 max-w-7xl  mx-auto'>
					<div className='flex justify-end items-center gap-2'>
						<div className='border border-chart-5 p-1.5 h-13 flex items-center gap-2  rounded-full'>
							<p className='text-brand-milk text-sm font-medium px-5'>{name}</p>
							<Badge
								variant='secondary'
								className='h-full px-5 text-brand-charcoal font-medium text-sm'
							>
								{primaryRoleLabel(role)}
							</Badge>
						</div>
						<LogoutButton />
						<Link
							className={cn(
								'flex items-center p-4 rounded-full bg-brand-charcoal text-brand-milk',
								'hover:bg-brand-milk/10 transition-colors duration-300',
							)}
							href='/'
							target='_blank'
							rel='noopener noreferrer'
						>
							<ArrowUpRight size={20} />
						</Link>
					</div>
					{children}
				</div>
			</div>
		</div>
	)
}
