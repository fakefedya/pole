'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { ReactLenis, type LenisRef } from 'lenis/react'
import { cancelFrame, frame } from 'motion/react'

type Props = { children: ReactNode }

/** One frame loop for Lenis and Motion, on public pages only. */
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
        // Lower than 0.1: smoother, with slightly longer wheel-scroll inertia.
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
