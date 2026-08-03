"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";

type Direction = "up" | "down" | "left" | "right" | "none";
type Element = "div" | "li" | "ol" | "ul" | "section";

const OFFSETS: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 1 },
  down: { x: 0, y: -1 },
  left: { x: 1, y: 0 },
  right: { x: -1, y: 0 },
  none: { x: 0, y: 0 },
};

const EASE = [0.22, 1, 0.36, 1] as const;

const MOTION_ELEMENTS = {
  div: motion.div,
  li: motion.li,
  ol: motion.ol,
  ul: motion.ul,
  section: motion.section,
} as const;

export function revealVariants({
  direction = "up",
  distance = 24,
  duration = 0.65,
  blur = true,
}: {
  direction?: Direction;
  distance?: number;
  duration?: number;
  blur?: boolean;
} = {}): Variants {
  const offset = OFFSETS[direction];

  return {
    hidden: {
      opacity: 0,
      x: offset.x * distance,
      y: offset.y * distance,
      ...(blur ? { filter: "blur(6px)" } : {}),
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      ...(blur ? { filter: "blur(0px)" } : {}),
      transition: { duration, ease: EASE },
    },
  };
}

export function FadeIn({
  children,
  delay = 0,
  className,
  as = "div",
  direction = "up",
  distance = 24,
  duration = 0.65,
  blur = true,
  once = true,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: Element;
  direction?: Direction;
  distance?: number;
  duration?: number;
  blur?: boolean;
  once?: boolean;
}) {
  const prefersReducedMotion = useReducedMotion();
  const MotionElement = MOTION_ELEMENTS[as];

  if (prefersReducedMotion) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }

  const variants = revealVariants({ direction, distance, duration, blur });

  return (
    <MotionElement
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-90px" }}
      variants={variants}
      transition={{ delay }}
    >
      {children}
    </MotionElement>
  );
}

export function Reveal({
  children,
  className,
  as = "div",
  stagger = 0.09,
  delay = 0,
  once = true,
}: {
  children: React.ReactNode;
  className?: string;
  as?: Element;
  stagger?: number;
  delay?: number;
  once?: boolean;
}) {
  const prefersReducedMotion = useReducedMotion();
  const MotionElement = MOTION_ELEMENTS[as];

  if (prefersReducedMotion) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }

  return (
    <MotionElement
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-90px" }}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: stagger, delayChildren: delay },
        },
      }}
    >
      {children}
    </MotionElement>
  );
}

export function RevealItem({
  children,
  className,
  as = "div",
  direction = "up",
  distance = 24,
  duration = 0.65,
  blur = true,
}: {
  children: React.ReactNode;
  className?: string;
  as?: Element;
  direction?: Direction;
  distance?: number;
  duration?: number;
  blur?: boolean;
}) {
  const prefersReducedMotion = useReducedMotion();
  const MotionElement = MOTION_ELEMENTS[as];

  if (prefersReducedMotion) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }

  return (
    <MotionElement
      className={className}
      variants={revealVariants({ direction, distance, duration, blur })}
    >
      {children}
    </MotionElement>
  );
}
