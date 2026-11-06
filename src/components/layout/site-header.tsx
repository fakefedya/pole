'use client'

import { useEffect, useRef, useState } from 'react'
import { useLenis } from 'lenis/react'
import { motion, useReducedMotion } from 'motion/react'
import { usePathname } from 'next/navigation'

import { siteNavigation } from '@/config/site-navigation'
import { cn } from '@/lib/utils'
import { DesktopNavigation } from './desktop-navigation'
import { MobileNavigation } from './mobile-navigation'

const ALWAYS_VISIBLE_UNTIL = 80
const ALWAYS_VISIBLE_NEAR_BOTTOM = 40
const HIDE_DISTANCE = 24
const SHOW_DISTANCE = 6

type Direction = -1 | 0 | 1

export function SiteHeader() {
	const pathname = usePathname()
	const reducedMotion = useReducedMotion()
	const [hidden, setHidden] = useState(false)
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
	const [desktopMenuOpen, setDesktopMenuOpen] = useState(false)
	const [keyboardFocus, setKeyboardFocus] = useState(false)

	const previousScroll = useRef<number | null>(null)
	const direction = useRef<Direction>(0)
	const distance = useRef(0)

	// Подключение Lenis
	useLenis(
		(lenis) => {
			const current = lenis.scroll
			const previous = previousScroll.current
			previousScroll.current = current

			if (
				current <= ALWAYS_VISIBLE_UNTIL ||
				current >= lenis.limit - ALWAYS_VISIBLE_NEAR_BOTTOM
			) {
				direction.current = 0
				distance.current = 0
				setHidden(false)
				return
			}

			if (mobileMenuOpen || desktopMenuOpen || keyboardFocus || previous === null) {
				direction.current = 0
				distance.current = 0
				return
			}

			const delta = current - previous
			if (Math.abs(delta) < 0.1) return

			const nextDirection: Direction = delta > 0 ? 1 : -1
			if (direction.current !== nextDirection) {
				direction.current = nextDirection
				distance.current = 0
			}

			distance.current += Math.abs(delta)
			const threshold = nextDirection === 1 ? HIDE_DISTANCE : SHOW_DISTANCE
			if (distance.current < threshold) return

			setHidden(nextDirection === 1)
			distance.current = 0
		},
		[mobileMenuOpen, desktopMenuOpen, keyboardFocus],
	)

	useEffect(() => {
		previousScroll.current = null
		direction.current = 0
		distance.current = 0
		const frameId = requestAnimationFrame(() => {
			setHidden(false)
			setMobileMenuOpen(false)
			setDesktopMenuOpen(false)
		})
		return () => cancelAnimationFrame(frameId)
	}, [pathname])

	// CSS handles visibility at lg. A portal-based Sheet, however, requires
	// React state to close when crossing the breakpoint in either direction.
	useEffect(() => {
		const desktop = window.matchMedia('(min-width: 1024px)')
		const resetOnBreakpointChange = () => {
			previousScroll.current = null
			direction.current = 0
			distance.current = 0
			setHidden(false)
			setKeyboardFocus(false)
			setMobileMenuOpen(false)
			setDesktopMenuOpen(false)
		}

		desktop.addEventListener('change', resetOnBreakpointChange)
		return () => desktop.removeEventListener('change', resetOnBreakpointChange)
	}, [])

	const isHidden = hidden && !mobileMenuOpen && !desktopMenuOpen && !keyboardFocus

	return (
		<motion.header
			layoutRoot
			initial={false}
			animate={{ y: isHidden ? '100%' : '0%' }}
			transition={
				reducedMotion
					? { duration: 0 }
					: {
							y: {
								type: 'tween',
								duration: 0.75,
								ease: [0.4, 0, 0.2, 1] as const,
							},
						}
			}
			style={{ x: '-50%' }}
			className={cn(
				'fixed bottom-0 left-1/2 z-50 w-fit pb-[calc(1rem+env(safe-area-inset-bottom))] lg:pb-7.5',
				isHidden && 'pointer-events-none',
			)}
			onFocusCapture={(event) => {
				if (
					event.target instanceof HTMLElement &&
					event.target.matches(':focus-visible')
				) {
					setKeyboardFocus(true)
					setHidden(false)
				}
			}}
			onBlurCapture={(event) => {
				if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
					setKeyboardFocus(false)
				}
			}}
		>
			<div className='hidden lg:block'>
				<DesktopNavigation
					siteNavigation={siteNavigation}
					onMenuOpenChange={(open) => {
						setDesktopMenuOpen(open)
						if (open) setHidden(false)
					}}
				/>
			</div>
			<div className='lg:hidden'>
				<MobileNavigation
					siteNavigation={siteNavigation}
					open={mobileMenuOpen}
					onOpenChange={(open) => {
						setMobileMenuOpen(open)
						if (open) setHidden(false)
					}}
				/>
			</div>
		</motion.header>
	)
}
