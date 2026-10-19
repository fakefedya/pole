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

import { cn } from '@/lib/utils'
import { LayoutGroup, MotionConfig, motion } from 'motion/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

type DesktopNavigationProps = {
	siteNavigation: readonly SiteNavigationItem[]
}

const navigationItemClassName = cn(
	'relative isolate h-full rounded-full px-5 py-0',
	'text-base text-brand-milk',
	'bg-transparent!',
	'transition-colors duration-300 hover:text-brand-milk/70 data-popup-open:hover:text-brand-milk/70 data-popup-open:text-brand-milk/70 data-open:text-brand-milk/70',
	'[&_svg]:relative [&_svg]:size-3.5 [&_svg]:z-10',
)

const isCurrentPath = (href: string, pathname: string) => {
	if (href === '/') return pathname === '/'

	return pathname === href || pathname.startsWith(`${href}/`)
}

function ActivePill() {
	return (
		<motion.span
			layoutId='site-navigation-active-pill'
			initial={false}
			transition={{
				type: 'spring',
				stiffness: 420,
				damping: 36,
			}}
			className={cn(
				'pointer-events-none absolute inset-0 z-0',
				'rounded-full bg-brand-terracota-accent',
			)}
			aria-hidden='true'
		/>
	)
}

export function DesktopNavigation({ siteNavigation }: DesktopNavigationProps) {
	const pathname = usePathname()

	const visibleItems = siteNavigation.filter(
		(item) =>
			item.isVisible !== false &&
			(item.type === 'link' ||
				item.items.some((child) => child.isVisible !== false)),
	)

	if (visibleItems.length === 0) return null

	const activeIndex = visibleItems.findIndex((item) => {
		if (item.type === 'link') {
			return isCurrentPath(item.href, pathname)
		}

		return item.items.some(
			(child) =>
				child.isVisible !== false && isCurrentPath(child.href, pathname),
		)
	})

	return (
		<MotionConfig reducedMotion='user'>
			<LayoutGroup id='studio-pole-desktop-navigation'>
				<NavigationMenu aria-label='Основная навигация'>
					<NavigationMenuList>
						{visibleItems.map((item, index) => {
							const isSelected = index === activeIndex

							if (item.type === 'link') {
								return (
									<NavigationMenuItem
										key={item.href}
										className='flex h-11.5 items-center'
									>
										<NavigationMenuLink
											render={<Link href={item.href} />}
											active={isSelected}
											aria-current={isSelected ? 'page' : undefined}
											className={cn(
												navigationMenuTriggerStyle(),
												navigationItemClassName,
												isSelected && 'hover:text-brand-milk',
											)}
										>
											{isSelected && <ActivePill />}

											<span className='relative z-10'>{item.label}</span>
										</NavigationMenuLink>
									</NavigationMenuItem>
								)
							}

							const visibleChildren = item.items.filter(
								(child) => child.isVisible !== false,
							)

							return (
								<NavigationMenuItem
									key={item.label}
									className='flex h-11.5 items-center'
								>
									<NavigationMenuTrigger
										data-active={isSelected || undefined}
										className={navigationItemClassName}
									>
										{isSelected && <ActivePill />}

										<span className='relative z-10'>{item.label}</span>
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
			</LayoutGroup>
		</MotionConfig>
	)
}
