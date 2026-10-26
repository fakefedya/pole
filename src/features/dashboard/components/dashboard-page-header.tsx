import type { ReactNode } from 'react'

type DashboardPageHeaderProps = {
	eyebrow?: string
	title: string
	description?: string
	action?: ReactNode
}

export function DashboardPageHeader({
	eyebrow,
	title,
	description,
	action,
}: DashboardPageHeaderProps) {
	return (
		<header className='flex flex-wrap items-start justify-between gap-4'>
			<div className='min-w-0 flex flex-col gap-2'>
				{eyebrow && (
					<p className='mb-2 text-xs font-semibold uppercase tracking-[.2em] text-brand-terracota'>
						{eyebrow}
					</p>
				)}
				<h1 className='text-3xl font-semibold text-brand-milk tracking-tight'>
					{title}
				</h1>
				{description && (
					<p className='text-muted-foreground font-semibold'>{description}.</p>
				)}
			</div>
			{action && <div className='shrink-0'>{action}</div>}
		</header>
	)
}
