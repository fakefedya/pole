"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowDown, ArrowUp, ArrowUpRight } from "lucide-react";
import { useLenis } from "lenis/react";
import Snap from "lenis/snap";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";

import type { PublicProjectCard } from "@/features/projects/server/public-queries";
import { cn } from "@/lib/utils";
import { SiteSection } from "@/components/layout/site-section";
import { SiteContainer } from "@/components/layout/site-container";
import { ProjectHoverLink } from "./project-hover-link";

type Props = { projects: PublicProjectCard[] };

type PaginationEntry =
  { kind: "page"; index: number } | { kind: "gap"; id: string };

const formatNumber = (value: number) => String(value).padStart(3, "0");
const snapEasing = (t: number) => 1 - Math.pow(1 - t, 3);

const paginationEntries = (
  activeIndex: number,
  total: number,
): PaginationEntry[] => {
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => ({
      kind: "page" as const,
      index,
    }));
  }

  const pages = [
    ...new Set([0, total - 1, activeIndex - 1, activeIndex, activeIndex + 1]),
  ]
    .filter((index) => index >= 0 && index < total)
    .sort((a, b) => a - b);

  const entries: PaginationEntry[] = [];
  for (let i = 0; i < pages.length; i++) {
    const index = pages[i];
    if (i > 0 && index - pages[i - 1] > 1) {
      entries.push({ kind: "gap", id: `${pages[i - 1]}-${index}` });
    }
    entries.push({ kind: "page", index });
  }
  return entries;
};

const ProjectSlide = ({
  project,
  index,
}: {
  project: PublicProjectCard;
  index: number;
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const photoY = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    index === 0 ? ["0%", "0%", "8%"] : ["-8%", "0%", "8%"],
  );
  const headingY = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    index === 0 ? [0, 0, -88] : [88, 0, -88],
  );
  const detailsY = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    index === 0 ? [0, 0, -36] : [36, 0, -36],
  );
  const headingOpacity = useTransform(
    scrollYProgress,
    [0, 0.22, 0.4, 0.6, 0.78, 1],
    index === 0 ? [1, 1, 1, 1, 0.75, 0] : [0, 0.75, 1, 1, 0.75, 0],
  );

  const details = [
    project.location,
    project.style,
    project.areaSqM ? `${project.areaSqM} м²` : null,
    project.year ? String(project.year) : null,
    ...project.tags.slice(0, 2),
  ].filter((value): value is string => Boolean(value));

  return (
    <article
      ref={sectionRef}
      data-project-snap
      aria-label={`Проект ${index + 1}: ${project.title}`}
      className="bg-brand-charcoal text-brand-milk relative isolate h-dvh w-full overflow-hidden"
    >
      <motion.div
        className="pointer-events-none absolute inset-x-0 inset-y-[-12%]"
        style={reduceMotion ? undefined : { y: photoY }}
      >
        <Image
          src={project.coverUrl}
          alt={project.coverAlt}
          fill
          preload={index === 0}
          loading={index === 0 ? undefined : "lazy"}
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-linear-to-b from-black/55 via-black/35 to-black/65"
      />

      {/* Кликабельная ссылка для удобства по всей видимой части изображения */}
      <ProjectHoverLink slug={project.slug} title={project.title} />

      <div className="absolute inset-x-0 top-0 z-10 px-5 pt-[max(2.75rem,env(safe-area-inset-top))] sm:px-9 sm:pt-10 lg:px-12">
        <motion.div
          style={reduceMotion ? undefined : { y: headingY }}
          className="flex max-w-[95%] flex-col gap-y-4"
        >
          <motion.h2
            style={reduceMotion ? undefined : { opacity: headingOpacity }}
            className={cn(
              "font-display text-brand-milk text-4xl font-bold uppercase",
              "lg:text-8xl",
            )}
          >
            {project.title}
          </motion.h2>
        </motion.div>
      </div>

      {/* Детали проектов */}
      {details.length > 0 && (
        <motion.div
          style={reduceMotion ? undefined : { y: detailsY }}
          className={cn(
            "pointer-events-none absolute inset-x-10 top-[50%] z-10 mx-auto flex max-w-2/3 -translate-y-1/2 flex-wrap justify-center gap-1.5 sm:inset-x-20",
            "lg:max-w-full",
          )}
          role="group"
          aria-label="Характеристики проекта"
        >
          {details.map((detail, detailIndex) => (
            <span
              key={`${detail}-${detailIndex}`}
              className={cn(
                "text-brand-milk border-brand-milk/5 bg-brand-milk/20 rounded-full border px-3 py-1 text-xs font-medium uppercase backdrop-blur-md",
                "lg:text-sm",
              )}
            >
              {detail}
            </span>
          ))}
        </motion.div>
      )}
    </article>
  );
};

export function ProjectSnapGallery({ projects }: Props) {
  const lenis = useLenis();
  const reduceMotion = useReducedMotion();
  const galleryRef = useRef<HTMLDivElement>(null);
  const snapRef = useRef<Snap | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [galleryVisible, setGalleryVisible] = useState(true);

  useEffect(() => {
    const gallery = galleryRef.current;
    if (!lenis || !gallery || projects.length === 0) return;

    const targets = Array.from(
      gallery.querySelectorAll<HTMLElement>("[data-project-snap]"),
    );
    const sections = targets.slice(0, projects.length);
    if (
      sections.length !== projects.length ||
      targets.length !== projects.length + 1
    )
      return;

    const snap = reduceMotion
      ? null
      : new Snap(lenis, {
          type: "lock",
          distanceThreshold: "100%",
          debounce: 0,
          // With lerp: 0, Lenis uses duration + easing for a predictable transition.
          lerp: 0,
          duration: 1.1,
          easing: snapEasing,
        });
    snapRef.current = snap;
    snap?.addElements(targets, { align: "start" });

    let start = 0;
    let end = 0;
    let slideHeight = 1;
    let snapEnabled = true;

    const measure = () => {
      start = gallery.getBoundingClientRect().top + lenis.scroll;
      end = start + gallery.offsetHeight;
      slideHeight = Math.max(1, sections[0].offsetHeight);
      snap?.resize();
    };

    const sync = () => {
      const scroll = lenis.scroll;
      const visible = scroll >= start - 1 && scroll < end - 1;
      const nextIndex = Math.max(
        0,
        Math.min(
          projects.length - 1,
          Math.round((scroll - start) / slideHeight),
        ),
      );

      setActiveIndex((previous) =>
        previous === nextIndex ? previous : nextIndex,
      );
      setGalleryVisible((previous) =>
        previous === visible ? previous : visible,
      );

      const snapping = scroll >= start - 1 && scroll < end + slideHeight;
      if (snap && snapping !== snapEnabled) {
        snapEnabled = snapping;
        if (snapping) snap.start();
        else snap.stop();
      }
    };

    const onResize = () => {
      measure();
      sync();
    };

    measure();
    lenis.on("scroll", sync);
    window.addEventListener("resize", onResize);
    const initialFrame = requestAnimationFrame(sync);

    return () => {
      cancelAnimationFrame(initialFrame);
      window.removeEventListener("resize", onResize);
      lenis.off("scroll", sync);
      snap?.destroy();
      if (snapRef.current === snap) snapRef.current = null;
    };
  }, [lenis, projects, reduceMotion]);

  const goTo = (index: number) => {
    if (!lenis || !galleryRef.current) return;
    const targetIndex = Math.max(0, Math.min(projects.length, index));
    const snap = snapRef.current;
    if (snap) {
      snap.goTo(targetIndex);
      return;
    }

    const target = galleryRef.current.querySelectorAll<HTMLElement>(
      "[data-project-snap]",
    )[targetIndex];
    if (target) {
      lenis.scrollTo(target, {
        immediate: Boolean(reduceMotion),
        lerp: 0,
        duration: 1.1,
        easing: snapEasing,
      });
    }
  };

  if (projects.length === 0) {
    return (
      <section className="bg-brand-black text-brand-milk flex min-h-dvh items-center justify-center px-6">
        <div className="text-center">
          <h1 className="font-display text-5xl uppercase">Проекты</h1>
          <p className="text-brand-milk/70 mt-4">
            Опубликованных проектов пока нет.
          </p>
        </div>
      </section>
    );
  }

  const total = projects.length;
  const pagination = paginationEntries(activeIndex, total);

  return (
    <SiteSection>
      <SiteContainer isWide>
        <div ref={galleryRef} className="bg-brand-black relative w-full">
          <h1 className="sr-only">Проекты STUDIO POLE</h1>
          {projects.map((project, index) => (
            <ProjectSlide key={project.id} project={project} index={index} />
          ))}
          <div data-project-snap aria-hidden="true" className="h-0 w-full" />
        </div>

        <div
          aria-hidden={!galleryVisible}
          className={cn(
            "text-brand-milk pointer-events-none fixed inset-0 z-30 transition-opacity duration-300 motion-reduce:transition-none",
            galleryVisible ? "opacity-100" : "opacity-0",
          )}
        >
          {/* Индексы проектов */}
          <div className="bg-brand-black/50 absolute top-[50%] left-5 -translate-y-1/2 rounded-sm px-3 py-1 text-xs font-medium tabular-nums backdrop-blur-lg sm:left-10 sm:text-sm">
            <span aria-live="polite">{formatNumber(activeIndex + 1)}</span>
          </div>

          <div className="bg-brand-black/50 absolute top-[50%] right-5 -translate-y-1/2 rounded-sm px-3 py-1 text-xs font-medium tabular-nums backdrop-blur-lg sm:right-10 sm:text-sm">
            / {formatNumber(total)}
          </div>

          {/* Пагинация проектов */}
          <nav
            aria-label="Пагинация проектов"
            className={cn(
              "bg-brand-black/50 absolute top-[69%] right-5 flex -translate-y-1/2 flex-col items-center gap-0 rounded-full px-1 py-2 backdrop-blur-lg sm:right-8",
              galleryVisible ? "pointer-events-auto" : "pointer-events-none",
            )}
          >
            {pagination.map((entry) =>
              entry.kind === "gap" ? (
                <span
                  key={`gap-${entry.id}`}
                  aria-hidden="true"
                  className="flex h-5 w-9 items-center justify-center text-xs text-neutral-900"
                >
                  ···
                </span>
              ) : (
                <button
                  key={entry.index}
                  type="button"
                  disabled={!galleryVisible}
                  aria-current={
                    entry.index === activeIndex ? "step" : undefined
                  }
                  aria-label={`Проект ${entry.index + 1} из ${total}: ${projects[entry.index].title}`}
                  onClick={() => goTo(entry.index)}
                  className="group focus-visible:outline-brand-milk flex size-8 cursor-pointer items-center justify-center rounded-full focus-visible:outline-2 disabled:pointer-events-none"
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "block rounded-full transition-all duration-300 motion-reduce:transition-none",
                      entry.index === activeIndex
                        ? "bg-brand-terracota-accent ring-brand-milk h-2.5 w-2.5 ring-2"
                        : "group-hover:bg-brand-milk bg-brand-neutral h-1.5 w-1.5",
                    )}
                  />
                </button>
              ),
            )}
          </nav>

          {/* Переключение проектов */}
          <div
            className={cn(
              "absolute right-5 bottom-[calc(3rem+env(safe-area-inset-bottom))] flex flex-col gap-1 sm:right-8",
              "lg:bottom-[calc(5rem+env(safe-area-inset-bottom))]",
              galleryVisible ? "pointer-events-auto" : "pointer-events-none",
            )}
          >
            <button
              type="button"
              disabled={!galleryVisible || activeIndex === 0}
              onClick={() => goTo(activeIndex - 1)}
              aria-label="Предыдущий проект"
              className="bg-brand-black/50 hover:bg-brand-terracota-accent focus-visible:outline-brand-milk grid size-10 cursor-pointer place-items-center rounded-full backdrop-blur-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowUp aria-hidden="true" className="size-4" />
            </button>
            <button
              type="button"
              disabled={!galleryVisible}
              onClick={() => goTo(activeIndex + 1)}
              aria-label={
                activeIndex === total - 1
                  ? "Перейти к подвалу сайта"
                  : "Следующий проект"
              }
              className="bg-brand-black/50 hover:bg-brand-terracota-accent focus-visible:outline-brand-milk grid size-10 cursor-pointer place-items-center rounded-full backdrop-blur-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowDown aria-hidden="true" className="size-4" />
            </button>
          </div>
        </div>
      </SiteContainer>
    </SiteSection>
  );
}
