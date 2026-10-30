import { cn } from '@/lib/utils'

type Props = {
	children: React.ReactNode
	className?: string
	id?: string
}

export function SiteSection({ children, className, id }: Props) {
	return (
		<section
			id={id}
			className={cn(
				'flex w-full flex-col items-center',
				'last:mb-32',
				className,
			)}
		>
			{children}
		</section>
	)
}
