'use client'

import { SiteNavigationItem } from '@/config/site-navigation'
import { usePathname } from 'next/navigation'
import { NavigationMenuList } from '../ui/navigation-menu'

type DesktopNavigationOptions = {
	siteNavigation: readonly SiteNavigationItem[]
}

const checkActiveLink = (href: string, currentPath: string) => {
	if (href === '/') return currentPath === '/'
	return currentPath === href || currentPath.startsWith(`${href}/`)
}

export function DesktopNavigation({
	siteNavigation,
}: DesktopNavigationOptions) {
	const pathName = usePathname()
	if (!siteNavigation || siteNavigation.length === 0) return null

	return <NavigationMenuList></NavigationMenuList>
}
