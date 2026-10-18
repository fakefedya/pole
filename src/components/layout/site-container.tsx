type Props = {
	children: React.ReactNode
}

export function SiteContainer({ children }: Props) {
	return <div className='flex flex-col max-w-7xl w-full'>{children}</div>
}
