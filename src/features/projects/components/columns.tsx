import Link from 'next/link'
import Image from 'next/image'
import { Pencil } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { DashboardColumn } from '@/features/dashboard/components/dashboard-data-table'
import type { ProjectTableRow } from './types'

const statusLabels = { DRAFT: 'Черновик', HIDDEN: 'Скрыт', PUBLISHED: 'Опубликован' } as const

export function projectColumns(canEdit: boolean): DashboardColumn<ProjectTableRow>[] {
  return [

			{
				id: 'title',
				header: 'Проект',
				sortValue: (r) => r.title,
				cell: (r) => (
					<div className='flex min-w-52 items-center gap-3'>
						<div className='relative size-13 shrink-0 overflow-hidden rounded-sm border border-dashboard-border bg-dashboard-input'>
							{r.coverUrl ? (
								<Image
									unoptimized
									src={r.coverUrl}
									alt={r.title}
									fill
									sizes='52px'
									className='object-cover'
								/>
							) : null}
						</div>
						<div className='min-w-0'>
							<p className='font-medium text-brand-milk'>{r.title}</p>
							<p className='truncate text-xs font-medium text-muted-foreground'>
								/{r.slug}
							</p>
						</div>
					</div>
				),
			},
			{
				id: 'status',
				header: 'Статус',
				sortValue: (r) => r.status,
				cell: (r) => (
					<Badge
						variant='table'
						className={cn(
							'tracking-wide',
							r.status === 'DRAFT' &&
								'bg-dashboard-input text-muted-foreground',
							r.status === 'HIDDEN' &&
								'bg-dashboard-input text-muted-foreground',
							r.status === 'PUBLISHED' && 'bg-green-950 text-green-400',
						)}
					>
						{statusLabels[r.status]}
					</Badge>
				),
			},
			{
				id: 'area',
				header: 'Площадь',
				sortValue: (r) => Number(r.areaSqM ?? 0),
				cell: (r) => (
					<span className='text-brand-milk'>
						{r.areaSqM ? `${r.areaSqM} м²` : '—'}
					</span>
				),
			},
			{
				id: 'photos',
				header: 'Фото',
				sortValue: (r) => r.imageCount,
				cell: (r) => <span className='text-brand-milk'>{r.imageCount}</span>,
			},
			{
				id: 'featured',
				header: 'Главная',
				sortValue: (r) => Number(r.showOnHome),
				cell: (r) => (
					<span className='text-muted-foreground'>
						{r.showOnHome && r.status === 'PUBLISHED' ? 'Да' : 'Нет'}
					</span>
				),
			},
			{
				id: 'updated',
				header: 'Изменён',
				sortValue: (r) => Date.parse(r.updatedAt),
				cell: (r) => (
					<span className='whitespace-nowrap text-muted-foreground'>
						{new Date(r.updatedAt).toLocaleDateString('ru-RU')}
					</span>
				),
			},
			{
				id: 'actions',
				header: '',
				className: 'text-right',
				cell: (r) => (
					<div className='flex justify-end gap-2'>
						{canEdit && (
							<Link
								href={`/dashboard/projects/${r.id}/edit`}
								className={cn(
									buttonVariants({ size: 'sm' }),
									'rounded-sm border border-dashboard-input-border bg-dashboard-input cursor-pointer',
								)}
							>
								<Pencil className='size-4' /> Изменить
							</Link>
						)}
						
					</div>
				),
			},
  ]
}
