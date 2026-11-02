'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { ReactLenis, type LenisRef } from 'lenis/react'
import { cancelFrame, frame } from 'motion/react'

type Props = { children: ReactNode }

export function SiteSmoothScroll({ children }: Props) {
	const lenisRef = useRef<LenisRef>(null)

	useEffect(() => {
		const update = ({ timestamp }: { timestamp: number }) => {
			lenisRef.current?.lenis?.raf(timestamp)
		}

		frame.setup(update, true)
		return () => cancelFrame(update)
	}, [])

	return (
		<ReactLenis
			root
			ref={lenisRef}
			options={{
				autoRaf: false,
				// При значении < 1 скролл будет более плавный
				lerp: 0.075,
				smoothWheel: true,
				syncTouch: false,
				anchors: true,
			}}
		>
			{children}
		</ReactLenis>
	)
}
