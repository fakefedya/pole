'use client'

import type { SiteNavigationItem } from '@/config/site-navigation'

import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

type DesktopNavigationProps = {
	siteNavigation: readonly SiteNavigationItem[]
}

const isCurrentPath = (href: string, pathname: string) => {
	if (href === '/') {
		return pathname === '/'
	}

	return pathname === href || pathname.startsWith(`${href}/`)
}

export function DesktopNavigation({ siteNavigation }: DesktopNavigationProps) {
	const pathname = usePathname()

	const visibleItems = siteNavigation.filter((item) => item.isVisible !== false)

	if (visibleItems.length === 0) {
		return null
	}

	return (
		<NavigationMenu aria-label='Основная навигация'>
			<NavigationMenuList>
				{visibleItems.map((item) => {
					if (item.type === 'link') {
						const isCurrent = isCurrentPath(item.href, pathname)

						return (
							<NavigationMenuItem key={item.href}>
								<NavigationMenuLink
									render={<Link href={item.href} />}
									active={isCurrent}
									aria-current={isCurrent ? 'page' : undefined}
									className={navigationMenuTriggerStyle()}
								>
									{item.label}
								</NavigationMenuLink>
							</NavigationMenuItem>
						)
					}

					const visibleChildren = item.items.filter(
						(child) => child.isVisible !== false,
					)

					if (visibleChildren.length === 0) {
						return null
					}

					const hasActiveChild = visibleChildren.some((child) =>
						isCurrentPath(child.href, pathname),
					)

					return (
						<NavigationMenuItem key={item.label}>
							<NavigationMenuTrigger data-active={hasActiveChild || undefined}>
								{item.label}
							</NavigationMenuTrigger>

							<NavigationMenuContent>
								<ul className='grid min-w-64 gap-1'>
									{visibleChildren.map((child) => {
										const isCurrent = isCurrentPath(child.href, pathname)

										return (
											<li key={child.href}>
												<NavigationMenuLink
													render={<Link href={child.href} />}
													active={isCurrent}
													aria-current={isCurrent ? 'page' : undefined}
													closeOnClick
													className='w-full'
												>
													{child.label}
												</NavigationMenuLink>
											</li>
										)
									})}
								</ul>
							</NavigationMenuContent>
						</NavigationMenuItem>
					)
				})}
			</NavigationMenuList>
		</NavigationMenu>
	)
}
