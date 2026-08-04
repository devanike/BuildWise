"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils/cn";

const EASE = [0.22, 1, 0.36, 1] as const;

export function EmptyState({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-6 rounded-card border border-dashed border-border bg-surface/50 px-6 py-14 text-center",
        className,
      )}
    >
      <EmptyPlanArt />

      <div className="flex flex-col gap-2">
        <h3 className="text-h6 font-semibold text-foreground">{title}</h3>
        <p className="mx-auto max-w-md text-body-sm text-muted-foreground">
          {description}
        </p>
      </div>

      {action}
    </div>
  );
}

function EmptyPlanArt() {
  const prefersReducedMotion = useReducedMotion();

  const sheet = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: EASE },
      };

  const row = (index: number) =>
    prefersReducedMotion
      ? {}
      : {
          initial: { scaleX: 0, opacity: 0 },
          animate: { scaleX: 1, opacity: 1 },
          transition: {
            duration: 0.5,
            delay: 0.35 + index * 0.14,
            ease: EASE,
          },
        };

  const node = (index: number) =>
    prefersReducedMotion
      ? {}
      : {
          initial: { scale: 0.6, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          transition: {
            duration: 0.45,
            delay: 0.95 + index * 0.12,
            ease: EASE,
          },
        };

  const link = (index: number) =>
    prefersReducedMotion
      ? {}
      : {
          initial: { pathLength: 0, opacity: 0 },
          animate: { pathLength: 1, opacity: 1 },
          transition: {
            duration: 0.5,
            delay: 1.25 + index * 0.12,
            ease: "easeOut" as const,
          },
        };

  return (
    <motion.svg
      viewBox="0 0 132 104"
      role="img"
      aria-label="An empty backend plan waiting to be created"
      fill="none"
      className="h-auto w-52 md:w-64"
      {...sheet}
    >
      {/* Sheet */}
      <rect
        x="14"
        y="6"
        width="72"
        height="92"
        rx="8"
        className="fill-surface-raised stroke-border-strong"
        strokeWidth="1.5"
      />

      {/* Content rows */}
      {[
        { y: 24, w: 36, accent: true },
        { y: 36, w: 44, accent: false },
        { y: 48, w: 28, accent: false },
      ].map((r, i) => (
        <motion.rect
          key={r.y}
          x="26"
          y={r.y}
          width={r.w}
          height="4"
          rx="2"
          className={r.accent ? "fill-accent" : "fill-border-strong"}
          style={{ originX: 0, transformBox: "fill-box" }}
          {...row(i)}
        />
      ))}

      {/* Connectors between the plan and its nodes */}
      {[
        "M86 52 L98 52 L98 26",
        "M86 52 L104 52",
        "M86 52 L98 52 L98 78",
      ].map((d, i) => (
        <motion.path
          key={d}
          d={d}
          className="stroke-border-strong"
          strokeWidth="1.5"
          strokeLinecap="round"
          {...link(i)}
        />
      ))}

      {/* Architecture nodes */}
      {[
        { cx: 106, cy: 26, accent: true },
        { cx: 112, cy: 52, accent: false },
        { cx: 106, cy: 78, accent: false },
      ].map((n, i) => (
        <motion.circle
          key={`${n.cx}-${n.cy}`}
          cx={n.cx}
          cy={n.cy}
          r="8"
          className={cn(
            "stroke-[1.5]",
            n.accent
              ? "fill-accent-soft stroke-accent"
              : "fill-surface-raised stroke-subtle-foreground",
          )}
          style={{ originX: "50%", originY: "50%", transformBox: "fill-box" }}
          {...node(i)}
        />
      ))}
    </motion.svg>
  );
}
