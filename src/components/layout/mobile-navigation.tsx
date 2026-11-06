'use client'

import { useEffect } from 'react'
import { useLenis } from 'lenis/react'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion'
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet'
import {
	isCurrentPath,
	type SiteNavigationItem,
} from '@/config/site-navigation'
import { cn } from '@/lib/utils'

type MobileNavigationProps = {
	siteNavigation: readonly SiteNavigationItem[]
	open: boolean
	onOpenChange: (open: boolean) => void
}

export function MobileNavigation({
	siteNavigation,
	open,
	onOpenChange,
}: MobileNavigationProps) {
	const pathname = usePathname()
	const lenis = useLenis()

	useEffect(() => {
		if (!open) return
		lenis?.stop()
		return () => lenis?.start()
	}, [lenis, open])

	const closeMenu = () => onOpenChange(false)

	const items = siteNavigation.filter(
		(item) =>
			item.isVisible !== false &&
			(item.type === 'link' ||
				item.items.some((child) => child.isVisible !== false)),
	)

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetTrigger
				className={cn(
					'flex h-14 w-[calc(100vw-2rem)] max-w-sm items-center justify-between',
					'rounded-full border border-brand-milk/10 bg-neutral-900 px-5',
					'text-brand-milk shadow-xl outline-none backdrop-blur-md',
					'focus-visible:ring-2 focus-visible:ring-brand-terracota-accent',
				)}
				aria-label='Открыть меню сайта'
			>
				<span className='text-sm font-semibold tracking-wide'>Меню</span>
				<Menu aria-hidden='true' className='size-5' />
			</SheetTrigger>

			<SheetContent
				side='bottom'
				showCloseButton={false}
				className={cn(
					'max-h-[min(88dvh,760px)] rounded-t-[28px] border-t border-brand-milk/15',
					'bg-brand-charcoal text-brand-milk shadow-2xl',
					'duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
					'data-[side=bottom]:data-starting-style:translate-y-full',
					'data-[side=bottom]:data-ending-style:translate-y-full',
					'motion-reduce:transition-none',
				)}
			>
				<SheetHeader className='flex-row items-center justify-between border-b border-brand-milk/15 px-6 py-5'>
					<SheetTitle className='font-display text-2xl text-brand-milk'>
						Навигация
					</SheetTitle>
					<SheetClose
						className='grid size-11 cursor-pointer place-items-center rounded-full bg-brand-milk/10 text-brand-milk outline-none focus-visible:ring-2 focus-visible:ring-brand-terracota-accent'
						aria-label='Закрыть меню'
					>
						<X aria-hidden='true' className='size-5' />
					</SheetClose>
				</SheetHeader>

				<nav
					aria-label='Мобильная навигация'
					data-lenis-prevent
					className='min-h-0 overflow-y-auto overscroll-contain px-6 pt-2 pb-[calc(1.5rem+env(safe-area-inset-bottom))]'
				>
					<Accordion multiple>
						{items.map((item) => {
							if (item.type === 'link') {
								const active = isCurrentPath(item.href, pathname)

								return (
									<div
										key={item.href}
										className='border-b border-brand-milk/15'
									>
										<Link
											href={item.href}
											aria-current={active ? 'page' : undefined}
											onClick={closeMenu}
											className={cn(
												'flex min-h-14 items-center py-4 font-display text-2xl',
												'outline-none focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2',
												active
													? 'text-brand-terracota-accent'
													: 'text-brand-milk',
											)}
										>
											{item.label}
										</Link>
									</div>
								)
							}

							const children = item.items.filter(
								(child) => child.isVisible !== false,
							)
							const active = children.some((child) =>
								isCurrentPath(child.href, pathname),
							)

							return (
								<AccordionItem
									key={item.label}
									value={item.label}
									className='border-brand-milk/15'
								>
									<AccordionTrigger
										className={cn(
											'font-display text-2xl focus-visible:outline-brand-terracota-accent',
											active
												? 'text-brand-terracota-accent'
												: 'text-brand-milk',
										)}
									>
										{item.label}
									</AccordionTrigger>
									<AccordionContent>
										<div className='flex flex-col gap-1'>
											{children.map((child) => {
												const childActive = isCurrentPath(child.href, pathname)
												return (
													<Link
														key={child.href}
														href={child.href}
														aria-current={childActive ? 'page' : undefined}
														onClick={closeMenu}
														className={cn(
															'flex flex-col gap-1 rounded-xl px-4 py-3 outline-none',
															'focus-visible:ring-2 focus-visible:ring-brand-terracota-accent',
															childActive
																? 'bg-brand-terracota-accent/20 text-brand-milk'
																: 'bg-brand-milk/5 text-brand-milk hover:bg-brand-milk/10',
														)}
													>
														<span className='text-sm font-medium'>
															{child.label}
														</span>
														{child.description && (
															<span className='text-xs leading-relaxed text-brand-milk/60'>
																{child.description}
															</span>
														)}
													</Link>
												)
											})}
										</div>
									</AccordionContent>
								</AccordionItem>
							)
						})}
					</Accordion>
				</nav>
			</SheetContent>
		</Sheet>
	)
}
