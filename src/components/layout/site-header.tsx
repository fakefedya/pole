import { DesktopNavigation } from './desktop-navigation'
import { siteNavigation } from '@/config/site-navigation'

export function SiteHeader() {
	return (
		<header className='fixed top-7.5 left-1/2 z-50 w-fit -translate-x-1/2'>
			<DesktopNavigation siteNavigation={siteNavigation} />
		</header>
	)
}
