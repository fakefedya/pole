import { cn } from '@/lib/utils'

type Props = {
	children: React.ReactNode
	className?: string
}

export function SiteContainer({ children, className }: Props) {
	return (
		<div className={cn('flex flex-col max-w-7xl w-full', className)}>
			{children}
		</div>
	)
}
