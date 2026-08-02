"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils/cn";

type Concept = {
  label: string;
  left: string;
  top: string;
  rotate: number;
  visibility: string;
  accent?: boolean;
};

const CONCEPTS: Concept[] = [
  {
    label: "PostgreSQL",
    left: "3%",
    top: "14%",
    rotate: -7,
    accent: true,
    visibility: "hidden sm:block",
  },
  {
    label: "JWT sessions",
    left: "27%",
    top: "6%",
    rotate: 5,
    visibility: "hidden sm:block",
  },
  {
    label: "REST endpoints",
    left: "54%",
    top: "12%",
    rotate: -4,
    visibility: "hidden sm:block",
  },
  {
    label: "Object storage",
    left: "78%",
    top: "5%",
    rotate: 8,
    visibility: "hidden sm:block",
  },
  {
    label: "Indexing",
    left: "9%",
    top: "76%",
    rotate: 6,
    visibility: "hidden lg:block",
  },
  {
    label: "Migrations",
    left: "36%",
    top: "84%",
    rotate: -5,
    accent: true,
    visibility: "hidden lg:block",
  },
  {
    label: "Rate limiting",
    left: "61%",
    top: "78%",
    rotate: 4,
    visibility: "hidden lg:block",
  },
  {
    label: "Caching",
    left: "84%",
    top: "72%",
    rotate: -8,
    visibility: "hidden lg:block",
  },
];

export function WordmarkCloud() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className="relative mt-16 select-none overflow-hidden px-1 pb-8 pt-24"
    >
      <svg
        viewBox="0 0 1000 150"
        aria-hidden="true"
        focusable="false"
        className="h-auto w-full"
      >
        <text
          x="500"
          y="118"
          textAnchor="middle"
          fontSize="140"
          fontWeight="700"
          letterSpacing="-4"
          className="font-display"
          fill="var(--surface-hover)"
        >
          BuildWise AI
        </text>
      </svg>

      {CONCEPTS.map((concept, index) => (
        <motion.span
          key={concept.label}
          className={cn("absolute", concept.visibility)}
          style={{ left: concept.left, top: concept.top }}
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{
            duration: 0.5,
            delay: index * 0.06,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <motion.span
            className={cn(
              "block whitespace-nowrap rounded-badge border px-3.5 py-1.5 text-body-xs font-medium shadow-soft",
              concept.accent
                ? "border-accent-line bg-accent-soft text-accent-text"
                : "border-border bg-surface text-muted-foreground",
            )}
            style={{ rotate: concept.rotate }}
            animate={
              prefersReducedMotion
                ? undefined
                : { y: [0, index % 2 === 0 ? -6 : 6, 0] }
            }
            transition={{
              duration: 7 + (index % 4),
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.4,
            }}
          >
            {concept.label}
          </motion.span>
        </motion.span>
      ))}
    </div>
  );
}
