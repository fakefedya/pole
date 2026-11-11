"use client";

import { useState, type PointerEvent } from "react";
import Link from "next/link";
import { motion, useReducedMotion, useSpring } from "motion/react";

type Props = {
  slug: string;
  title: string;
};

const CURSOR_OFFSET_X = 20;
const CURSOR_OFFSET_Y = 16;

const springOptions = {
  stiffness: 450,
  damping: 35,
  mass: 0.7,
};

export function ProjectHoverLink({ slug, title }: Props) {
  const [visible, setVisible] = useState(false);
  const reduceMotion = useReducedMotion();

  const x = useSpring(0, springOptions);
  const y = useSpring(0, springOptions);

  const updatePosition = (
    event: PointerEvent<HTMLAnchorElement>,
    immediate: boolean,
  ) => {
    const nextX = event.clientX + CURSOR_OFFSET_X;
    const nextY = event.clientY + CURSOR_OFFSET_Y;

    if (immediate || reduceMotion) {
      x.jump(nextX);
      y.jump(nextY);
      return;
    }

    x.set(nextX);
    y.set(nextY);
  };

  return (
    <Link
      href={`/projects/${slug}`}
      aria-label={`Посмотреть проект «${title}»`}
      className="focus-visible:outline-brand-milk absolute inset-0 z-20 cursor-pointer focus-visible:outline-2 focus-visible:-outline-offset-4"
      onPointerEnter={(event) => {
        if (event.pointerType !== "mouse") return;

        updatePosition(event, true);
        setVisible(true);
      }}
      onPointerMove={(event) => {
        if (event.pointerType !== "mouse") return;

        updatePosition(event, false);
      }}
      onPointerLeave={() => setVisible(false)}
      onPointerCancel={() => setVisible(false)}
    >
      <motion.div
        aria-hidden="true"
        initial={false}
        animate={{
          opacity: visible ? 1 : 0,
          scale: visible ? 1 : 0.95,
        }}
        transition={{
          duration: reduceMotion ? 0 : 0.2,
          ease: "easeOut",
        }}
        style={{ x, y }}
        className="bg-brand-charcoal/70 text-brand-milk pointer-events-none fixed top-0 left-0 z-20 w-max rounded-sm px-2.5 py-1 text-xs font-medium whitespace-nowrap uppercase backdrop-blur-md"
      >
        Посмотреть проект
      </motion.div>
    </Link>
  );
}
