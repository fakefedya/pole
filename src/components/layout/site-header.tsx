import { cn } from '@/lib/utils'
import { DesktopNavigation } from './desktop-navigation'
import { siteNavigation } from '@/config/site-navigation'

export function SiteHeader() {
	return (
		<header
			className={cn(
				'fixed top-7.5 left-1/2 -translate-x-1/2 translate-y-0 translate-z-0 z-10 w-auto',
			)}
		>
			<div
				className={cn(
					'bg-black/60 backdrop-blur-md relative mx-2.5 w-fit flex rounded-full p-1.5',
				)}
			>
				<DesktopNavigation siteNavigation={siteNavigation} />
			</div>
		</header>
	)
}
