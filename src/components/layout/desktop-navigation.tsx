'use client'

import type { SiteNavigationItem } from '@/config/site-navigation'
import { useRef } from 'react'
import Image from 'next/image'

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
	const menuAnchorRef = useRef<HTMLDivElement>(null)

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
				<div
					ref={menuAnchorRef}
					className='relative flex w-fit rounded-full bg-black/80 p-1.5 backdrop-blur-md'
				>
					<NavigationMenu
						aria-label='Основная навигация'
						anchor={menuAnchorRef}
						align='center'
						sideOffset={4}
						matchAnchorWidth
					>
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

										<NavigationMenuContent className='w-full p-1.5'>
											<ul className='grid w-full grid-cols-2 gap-1.5'>
												{visibleChildren.map((child) => {
													const isCurrent = isCurrentPath(child.href, pathname)
													const cover = `/layout/${child.cover}`

													return (
														<li key={child.href}>
															<NavigationMenuLink
																render={<Link href={child.href} />}
																active={isCurrent}
																aria-current={isCurrent ? 'page' : undefined}
																closeOnClick
																className={cn(
																	'relative overflow-hidden w-full h-75 flex flex-col items-start justify-between p-8 bg-brand-milk/5',
																	'hover:bg-brand-milk/10 transition-colors duration-300',
																)}
															>
																<div className='flex flex-col gap-1'>
																	<span className='font-display font-semibold text-brand-milk text-base'>
																		{child.label}
																	</span>
																	<p className='text-sm text-brand-milk/80'>
																		{child.description}
																	</p>
																</div>

																<div className='absolute -right-1/3 -bottom-1/3 h-full w-full'>
																	<Image
																		src={cover}
																		alt={child.label}
																		fill
																		sizes='(max-width: 1024px) 100vw, 66vw'
																		className={cn('object-contain')}
																	/>
																</div>
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
				</div>
			</LayoutGroup>
		</MotionConfig>
	)
}
