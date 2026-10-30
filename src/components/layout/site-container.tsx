import { cn } from '@/lib/utils'

type Props = {
	children: React.ReactNode
	className?: string
}

export function SiteContainer({ children, className }: Props) {
	return (
		<div className={cn('flex flex-col w-full max-w-site', className)}>
			{children}
		</div>
	)
}
