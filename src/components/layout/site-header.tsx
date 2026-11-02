'use client'

import { useEffect, useRef, useState } from 'react'
import { useLenis } from 'lenis/react'
import { motion, useReducedMotion } from 'motion/react'
import { usePathname } from 'next/navigation'

import { siteNavigation } from '@/config/site-navigation'
import { cn } from '@/lib/utils'
import { DesktopNavigation } from './desktop-navigation'

const ALWAYS_VISIBLE_UNTIL = 80
const DIRECTION_DISTANCE = 14

type Direction = -1 | 0 | 1

export function SiteHeader() {
	const pathname = usePathname()
	const reducedMotion = useReducedMotion()
	const [hidden, setHidden] = useState(false)
	const [menuOpen, setMenuOpen] = useState(false)
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

			if (current <= ALWAYS_VISIBLE_UNTIL) {
				direction.current = 0
				distance.current = 0
				setHidden(false)
				return
			}

			if (menuOpen || keyboardFocus || previous === null) {
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
			if (distance.current < DIRECTION_DISTANCE) return

			setHidden(nextDirection === 1)
			distance.current = 0
		},
		[menuOpen, keyboardFocus],
	)

	useEffect(() => {
		previousScroll.current = null
		direction.current = 0
		distance.current = 0
		const frameId = requestAnimationFrame(() => setHidden(false))
		return () => cancelAnimationFrame(frameId)
	}, [pathname])

	const isHidden = hidden && !menuOpen && !keyboardFocus

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
				'fixed bottom-0 left-1/2 z-50 w-fit pb-7.5',
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
			<DesktopNavigation
				siteNavigation={siteNavigation}
				onMenuOpenChange={(open) => {
					setMenuOpen(open)
					if (open) setHidden(false)
				}}
			/>
		</motion.header>
	)
}
