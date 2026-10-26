import { ShieldCheck, ShieldOff, Settings2 } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { DashboardColumn } from '@/features/dashboard/components/dashboard-data-table'
import { primaryRoleLabel } from '@/lib/auth/authorization'
import type { ManagedUser } from './types'
import { cn } from '@/lib/utils'

export function userColumns(
	actorId: string,
	onManage: (id: string) => void,
): DashboardColumn<ManagedUser>[] {
	return [
		{
			id: 'name',
			header: 'Пользователь',
			sortValue: (item) => item.name,
			cell: (item) => (
				<div className='min-w-40 max-w-xs'>
					<p className='font-medium text-brand-milk'>{item.name}</p>
					<p
						className='mt-1 truncate text-sm font-medium text-muted-foreground'
						title={item.email}
					>
						{item.email}
					</p>
				</div>
			),
		},
		{
			id: 'role',
			header: 'Роль',
			sortValue: (item) => primaryRoleLabel(item.role),
			cell: (item) => (
				<Badge
					variant='table'
					className={cn(
						'tracking-wide',
						item.role === 'admin' && 'bg-dashboard-input text-muted-foreground',
						item.role === 'editor' &&
							'bg-dashboard-input text-muted-foreground',
						item.role === 'user' && 'bg-destructive/20 text-destructive',
					)}
				>
					{primaryRoleLabel(item.role)}
				</Badge>
			),
		},
		{
			id: 'status',
			header: 'Статус',
			sortValue: (item) => (item.banned ? 1 : 0),
			cell: (item) => (
				<Badge
					variant='table'
					className={cn(
						'tracking-wide',
						item.banned
							? 'bg-destructive/20 text-destructive'
							: 'bg-dashboard-input text-muted-foreground',
					)}
				>
					{item.banned ? 'Заблокирован' : 'Активен'}
				</Badge>
			),
		},
		{
			id: 'twoFactor',
			header: 'Безопасность',
			sortValue: (item) => (item.twoFactorEnabled ? 1 : 0),
			cell: (item) => (
				<div className='flex flex-col items-start gap-1.5'>
					<Badge
						variant='table'
						className={cn(
							item.twoFactorEnabled
								? 'bg-green-950 text-green-400'
								: 'bg-destructive/20 text-destructive',
						)}
					>
						{item.twoFactorEnabled ? (
							<ShieldCheck size={16} />
						) : (
							<ShieldOff size={16} />
						)}
						{item.twoFactorEnabled ? 'Включена' : 'Выключена'}
					</Badge>
				</div>
			),
		},
		{
			id: 'createdAt',
			header: 'Создан',
			sortValue: (item) => Date.parse(item.createdAt),
			cell: (item) => (
				<div className='text-sm text-muted-foreground font-medium'>
					{new Date(item.createdAt).toLocaleDateString('ru-RU', {
						timeZone: 'UTC',
					})}
				</div>
			),
		},
		{
			id: 'actions',
			header: '',
			className: 'text-right',
			cell: (item) =>
				item.id === actorId ? (
					<div className='flex justify-end'>
						<span className='py-2 px-3 w-fit flex items-center text-sm text-muted-foreground bg-dashboard-input rounded-sm border border-transparent'>
							Свой аккаунт
						</span>
					</div>
				) : (
					<Button
						type='button'
						className='rounded-sm border border-dashboard-input-border bg-dashboard-input cursor-pointer'
						onClick={() => onManage(item.id)}
					>
						<Settings2 size={16} aria-hidden='true' />
						Изменить
					</Button>
				),
		},
	]
}
