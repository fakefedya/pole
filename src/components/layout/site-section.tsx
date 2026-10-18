import { cn } from '@/lib/utils'

type Props = {
	children: React.ReactNode
	className?: string
}

export function SiteSection({ children, className }: Props) {
	return (
		<section
			className={cn(
				className,
				'flex w-full flex-col items-center',
				'last:mb-32',
			)}
		>
			{children}
		</section>
	)
}
