'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowDown, ArrowUp, ArrowUpRight } from 'lucide-react'
import { useLenis } from 'lenis/react'
import Snap from 'lenis/snap'
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react'

import type { PublicProjectCard } from '@/features/projects/server/public-queries'
import { cn } from '@/lib/utils'

type Props = { projects: PublicProjectCard[] }

type PaginationEntry = { kind: 'page'; index: number } | { kind: 'gap'; id: string }

const formatNumber = (value: number) => String(value).padStart(3, '0')
const snapEasing = (t: number) => 1 - Math.pow(1 - t, 3)

function paginationEntries(activeIndex: number, total: number): PaginationEntry[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => ({
      kind: 'page' as const,
      index,
    }))
  }

  const pages = [...new Set([0, total - 1, activeIndex - 1, activeIndex, activeIndex + 1])]
    .filter((index) => index >= 0 && index < total)
    .sort((a, b) => a - b)

  const entries: PaginationEntry[] = []
  for (let i = 0; i < pages.length; i++) {
    const index = pages[i]
    if (i > 0 && index - pages[i - 1] > 1) {
      entries.push({ kind: 'gap', id: `${pages[i - 1]}-${index}` })
    }
    entries.push({ kind: 'page', index })
  }
  return entries
}

/**
 * A slide is a real full-viewport document section, not a nested scroll area.
 * Both the photo and the editorial text track the *same* document scroll.
 */
function ProjectSlide({ project, index }: { project: PublicProjectCard; index: number }) {
  const sectionRef = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  // The image wrapper is 24% taller than the viewport so movement won't reveal edges.
  const photoY = useTransform(
    scrollYProgress, [0, 0.5, 1],
    index === 0 ? ['0%', '0%', '8%'] : ['-8%', '0%', '8%'],
  )
  const headingY = useTransform(
    scrollYProgress, [0, 0.5, 1], index === 0 ? [0, 0, -88] : [88, 0, -88],
  )
  const detailsY = useTransform(
    scrollYProgress, [0, 0.5, 1], index === 0 ? [0, 0, -36] : [36, 0, -36],
  )
  const headingOpacity = useTransform(
    scrollYProgress,
    [0, 0.22, 0.4, 0.6, 0.78, 1],
    index === 0 ? [1, 1, 1, 1, 0.75, 0] : [0, 0.75, 1, 1, 0.75, 0],
  )

  const details = [
    project.location,
    project.style,
    project.areaSqM ? `${project.areaSqM} м²` : null,
    project.year ? String(project.year) : null,
    ...project.tags.slice(0, 2),
  ].filter((value): value is string => Boolean(value))

  return (
    <article
      ref={sectionRef}
      data-project-snap
      aria-label={`Проект ${index + 1}: ${project.title}`}
      className='relative isolate h-dvh w-full overflow-hidden bg-brand-charcoal text-brand-milk'
    >
      <motion.div
        className='pointer-events-none absolute inset-x-0 -inset-y-[12%]'
        style={reduceMotion ? undefined : { y: photoY }}
      >
        <Image
          src={project.coverUrl}
          alt={project.coverAlt}
          fill
          preload={index === 0}
          loading={index === 0 ? undefined : 'lazy'}
          sizes='100vw'
          className='object-cover'
        />
      </motion.div>

      <div
        aria-hidden='true'
        className='pointer-events-none absolute inset-0 bg-linear-to-b from-black/55 via-black/35 to-black/65'
      />

      <span className='pointer-events-none absolute top-6 left-3 hidden text-[10px] font-semibold tracking-[0.18em] uppercase [writing-mode:vertical-rl] rotate-180 lg:block'>
        [ ПРОЕКТЫ ]
      </span>

      <div className='absolute inset-x-0 top-0 z-10 px-5 pt-[max(2.75rem,env(safe-area-inset-top))] sm:px-9 sm:pt-10 lg:px-12'>
        <motion.div
          style={reduceMotion ? undefined : { y: headingY, opacity: headingOpacity }}
          className='max-w-[95%]'
        >
          <h2 className='font-display text-[clamp(2.6rem,8.1vw,9.5rem)] leading-[0.93] font-semibold tracking-[-0.055em] uppercase text-balance wrap-break-word'>
            {project.title}
          </h2>
          <Link
            href={`/projects/${project.slug}`}
            className={cn(
              'mt-5 inline-flex min-h-11 w-fit items-center gap-2 rounded-sm bg-brand-charcoal/65 px-3 py-2',
              'text-xs font-semibold uppercase text-brand-milk backdrop-blur-sm',
              'transition-colors duration-300 hover:bg-brand-terracota-accent',
              'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-milk',
            )}
          >
            Посмотреть проект <ArrowUpRight aria-hidden='true' className='size-3.5' />
          </Link>
        </motion.div>
      </div>

      {details.length > 0 && (
        <motion.div
          style={reduceMotion ? undefined : { y: detailsY }}
          className='pointer-events-none absolute inset-x-10 top-[57%] z-10 flex -translate-y-1/2 flex-wrap justify-center gap-1.5 sm:inset-x-20'
          role='group'
          aria-label='Характеристики проекта'
        >
          {details.map((detail, detailIndex) => (
            <span
              key={`${detail}-${detailIndex}`}
              className='rounded-full bg-brand-milk/55 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-brand-charcoal uppercase backdrop-blur-md sm:text-xs'
            >
              {detail}
            </span>
          ))}
        </motion.div>
      )}
    </article>
  )
}

export function ProjectSnapGallery({ projects }: Props) {
  const lenis = useLenis()
  const reduceMotion = useReducedMotion()
  const galleryRef = useRef<HTMLDivElement>(null)
  const snapRef = useRef<Snap | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [galleryVisible, setGalleryVisible] = useState(true)

  useEffect(() => {
    const gallery = galleryRef.current
    if (!lenis || !gallery || projects.length === 0) return

    const targets = Array.from(
      gallery.querySelectorAll<HTMLElement>('[data-project-snap]'),
    )
    const sections = targets.slice(0, projects.length)
    if (sections.length !== projects.length || targets.length !== projects.length + 1) return

    const snap = reduceMotion
      ? null
      : new Snap(lenis, {
          type: 'lock',
          distanceThreshold: '100%',
          debounce: 0,
          // With lerp: 0, Lenis uses duration + easing for a predictable transition.
          lerp: 0,
          duration: 1.1,
          easing: snapEasing,
        })
    snapRef.current = snap
    snap?.addElements(targets, { align: 'start' })

    let start = 0
    let end = 0
    let slideHeight = 1
    let snapEnabled = true

    const measure = () => {
      start = gallery.getBoundingClientRect().top + lenis.scroll
      end = start + gallery.offsetHeight
      slideHeight = Math.max(1, sections[0].offsetHeight)
      snap?.resize()
    }

    const sync = () => {
      const scroll = lenis.scroll
      const visible = scroll >= start - 1 && scroll < end - 1
      const nextIndex = Math.max(
        0,
        Math.min(projects.length - 1, Math.round((scroll - start) / slideHeight)),
      )

      setActiveIndex((previous) => previous === nextIndex ? previous : nextIndex)
      setGalleryVisible((previous) => previous === visible ? previous : visible)

      // Keep the footer boundary as a snap point for the return trip.
      // Beyond one viewport into the footer, regular Lenis scroll takes over.
      const snapping = scroll >= start - 1 && scroll < end + slideHeight
      if (snap && snapping !== snapEnabled) {
        snapEnabled = snapping
        if (snapping) snap.start()
        else snap.stop()
      }
    }

    const onResize = () => {
      measure()
      sync()
    }

    measure()
    lenis.on('scroll', sync)
    window.addEventListener('resize', onResize)
    const initialFrame = requestAnimationFrame(sync)

    return () => {
      cancelAnimationFrame(initialFrame)
      window.removeEventListener('resize', onResize)
      lenis.off('scroll', sync)
      // destroy() disconnects the SnapElement ResizeObservers too.
      snap?.destroy()
      if (snapRef.current === snap) snapRef.current = null
    }
  }, [lenis, projects, reduceMotion])

  const goTo = useCallback((index: number) => {
    if (!lenis || !galleryRef.current) return
    const targetIndex = Math.max(0, Math.min(projects.length, index))
    const snap = snapRef.current
    if (snap) {
      snap.goTo(targetIndex)
      return
    }

    // Reduced motion (or a not-yet-initialized Snap): direct Lenis navigation.
    const target = galleryRef.current.querySelectorAll<HTMLElement>(
      '[data-project-snap]',
    )[targetIndex]
    if (target) {
      lenis.scrollTo(target, {
        immediate: Boolean(reduceMotion),
        lerp: 0,
        duration: 1.1,
        easing: snapEasing,
      })
    }
  }, [lenis, projects.length, reduceMotion])

  if (projects.length === 0) {
    return (
      <section className='flex min-h-dvh items-center justify-center bg-brand-charcoal px-6 text-brand-milk'>
        <div className='text-center'>
          <h1 className='font-display text-5xl uppercase'>Проекты</h1>
          <p className='mt-4 text-brand-milk/70'>Опубликованных проектов пока нет.</p>
        </div>
      </section>
    )
  }

  const total = projects.length
  const pagination = paginationEntries(activeIndex, total)

  return (
    <>
      <div ref={galleryRef} className='relative w-full bg-brand-charcoal'>
        <h1 className='sr-only'>Проекты STUDIO POLE</h1>
        {projects.map((project, index) => (
          <ProjectSlide key={project.id} project={project} index={index} />
        ))}
        {/* Last snap destination: the exact boundary before the shared Footer. */}
        <div data-project-snap aria-hidden='true' className='h-0 w-full' />
      </div>

      {/* Controls are fixed only while the portfolio is in view. */}
      <div
        aria-hidden={!galleryVisible}
        className={cn(
          'pointer-events-none fixed inset-0 z-30 text-brand-milk transition-opacity duration-300 motion-reduce:transition-none',
          galleryVisible ? 'opacity-100' : 'opacity-0',
        )}
      >
        <div className='absolute top-[52%] left-3 -translate-y-1/2 rounded-sm bg-brand-charcoal/50 px-2 py-1 text-xs font-semibold tabular-nums backdrop-blur-sm sm:left-10 sm:text-sm'>
          <span aria-live='polite'>{formatNumber(activeIndex + 1)}</span>
        </div>

        <div className='absolute top-[52%] right-3 -translate-y-1/2 rounded-sm bg-brand-charcoal/50 px-2 py-1 text-xs font-semibold tabular-nums backdrop-blur-sm sm:right-10 sm:text-sm'>
          / {formatNumber(total)}
        </div>

        <nav
          aria-label='Пагинация проектов'
          className={cn(
            'absolute top-[69%] right-2 flex -translate-y-1/2 flex-col items-center gap-0 rounded-full bg-brand-charcoal/40 px-1 py-2 backdrop-blur-sm sm:right-8',
            galleryVisible ? 'pointer-events-auto' : 'pointer-events-none',
          )}
        >
          {pagination.map((entry) => entry.kind === 'gap' ? (
            <span key={`gap-${entry.id}`} aria-hidden='true' className='flex h-5 w-9 items-center justify-center text-xs text-brand-milk/60'>···</span>
          ) : (
            <button
              key={entry.index}
              type='button'
              disabled={!galleryVisible}
              aria-current={entry.index === activeIndex ? 'step' : undefined}
              aria-label={`Проект ${entry.index + 1} из ${total}: ${projects[entry.index].title}`}
              onClick={() => goTo(entry.index)}
              className='group flex size-9 cursor-pointer items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-brand-milk disabled:pointer-events-none'
            >
              <span
                aria-hidden='true'
                className={cn(
                  'block rounded-full transition-all duration-300 motion-reduce:transition-none',
                  entry.index === activeIndex
                    ? 'h-2.5 w-2.5 bg-brand-terracota-accent ring-2 ring-brand-milk'
                    : 'h-1.5 w-1.5 bg-brand-milk/70 group-hover:bg-brand-milk',
                )}
              />
            </button>
          ))}
        </nav>

        <div className={cn(
          'absolute right-3 bottom-[calc(7.5rem+env(safe-area-inset-bottom))] flex gap-2 sm:right-10 lg:bottom-14',
          galleryVisible ? 'pointer-events-auto' : 'pointer-events-none',
        )}>
          <button
            type='button'
            disabled={!galleryVisible || activeIndex === 0}
            onClick={() => goTo(activeIndex - 1)}
            aria-label='Предыдущий проект'
            className='grid size-11 cursor-pointer place-items-center rounded-full border border-brand-milk/40 bg-brand-charcoal/50 backdrop-blur-sm transition-colors hover:bg-brand-terracota-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-milk disabled:cursor-not-allowed disabled:opacity-40'
          >
            <ArrowUp aria-hidden='true' className='size-4' />
          </button>
          <button
            type='button'
            disabled={!galleryVisible}
            onClick={() => goTo(activeIndex + 1)}
            aria-label={activeIndex === total - 1 ? 'Перейти к подвалу сайта' : 'Следующий проект'}
            className='grid size-11 cursor-pointer place-items-center rounded-full border border-brand-milk/40 bg-brand-charcoal/50 backdrop-blur-sm transition-colors hover:bg-brand-terracota-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-milk disabled:cursor-not-allowed disabled:opacity-40'
          >
            <ArrowDown aria-hidden='true' className='size-4' />
          </button>
        </div>
      </div>
    </>
  )
}
