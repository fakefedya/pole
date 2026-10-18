import { cn } from '@/lib/utils'
import { DesktopNavigation } from './desktop-navigation'
import { siteNavigation } from '@/config/site-navigation'

export function SiteHeader() {
	return (
		<header className={cn('fixed top-4 left-0 z-10 w-full')}>
			<div
				className={cn(
					'bg-background relative mx-auto w-fit flex rounded-full p-1',
				)}
			>
				<DesktopNavigation siteNavigation={siteNavigation} />
			</div>
		</header>
	)
}
