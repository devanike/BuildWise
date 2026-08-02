"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils/cn";

export function IllustrationStage({
  children,
  className,
  contentClassName,
}: {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}) {
  return (
    <div
      className={cn(
        "relative isolate overflow-hidden rounded-card border border-border",
        "bg-linear-to-b from-surface-raised to-surface shadow-soft",
        className,
      )}
    >
      <BlueprintGrid />
      <div className={cn("relative z-10 h-full", contentClassName)}>
        {children}
      </div>
    </div>
  );
}

function BlueprintGrid() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 size-full opacity-70"
      style={{
        maskImage:
          "radial-gradient(ellipse at 50% 40%, black 30%, transparent 78%)",
        WebkitMaskImage:
          "radial-gradient(ellipse at 50% 40%, black 30%, transparent 78%)",
      }}
    >
      <defs>
        <pattern
          id="stage-grid"
          width="28"
          height="28"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M28 0H0V28"
            fill="none"
            stroke="var(--illo-line)"
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#stage-grid)" />
    </svg>
  );
}

export function TextLine({ width, accent }: { width: string; accent?: boolean }) {
  return (
    <span
      className={cn(
        "block h-1.5 rounded-full",
        accent ? "bg-accent-line" : "bg-surface-hover",
      )}
      style={{ width }}
    />
  );
}

export function Panel({
  children,
  className,
  accent,
}: {
  children: React.ReactNode;
  className?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-input border bg-linear-to-b p-4",
        accent
          ? "border-accent from-surface-raised to-accent-soft"
          : "border-border from-surface-raised to-surface",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function StaggerGroup({
  children,
  className,
  stagger = 0.08,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: stagger, delayChildren: delay },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export const riseIn: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export function Drift({
  children,
  distance = 5,
  duration = 7,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  distance?: number;
  duration?: number;
  delay?: number;
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      animate={{ y: [0, -distance, 0] }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}
