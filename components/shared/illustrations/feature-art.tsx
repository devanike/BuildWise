"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  IllustrationStage,
  Panel,
  StaggerGroup,
  TextLine,
  riseIn,
  scaleIn,
} from "@/components/shared/illustrations/stage";

function useCycle(length: number, intervalMs: number) {
  const prefersReducedMotion = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion || length < 2) return;

    const timer = setInterval(
      () => setIndex((current) => (current + 1) % length),
      intervalMs,
    );
    return () => clearInterval(timer);
  }, [length, intervalMs, prefersReducedMotion]);

  return prefersReducedMotion ? 0 : index;
}

const SOFT = { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const };

const PLAN_SECTIONS = [
  { title: "Database", detail: "PostgreSQL" },
  { title: "Authentication", detail: "Email and Google" },
  { title: "API Design", detail: "REST" },
];

export function PlanStructureArt({ className }: { className?: string }) {
  const active = useCycle(PLAN_SECTIONS.length, 1700);

  return (
    <IllustrationStage className={className} contentClassName="p-6 md:p-8">
      <StaggerGroup className="flex flex-col gap-3">
        <motion.div
          variants={riseIn}
          className="mb-1 flex items-center justify-between"
        >
          <span className="text-body-sm font-semibold text-foreground">
            Study Planner
          </span>
          <span className="rounded-badge border border-border px-3 py-1 text-body-xs text-subtle-foreground">
            Education
          </span>
        </motion.div>

        {PLAN_SECTIONS.map((section, index) => {
          const isActive = index === active;

          return (
            <motion.div key={section.title} variants={riseIn}>
              <motion.div
                animate={{
                  borderColor: isActive
                    ? "var(--accent)"
                    : "var(--border)",
                }}
                transition={SOFT}
                className="rounded-input border bg-linear-to-b from-surface-raised to-surface p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-body-sm font-medium text-foreground">
                    {section.title}
                  </span>
                  <motion.span
                    animate={{
                      color: isActive
                        ? "var(--accent-text)"
                        : "var(--text-subtle)",
                    }}
                    transition={SOFT}
                    className="text-body-xs"
                  >
                    {section.detail}
                  </motion.span>
                </div>
                <div className="mt-3 flex flex-col gap-1.5">
                  <motion.span
                    className="block h-1.5 rounded-full"
                    animate={{
                      width: isActive ? "88%" : "62%",
                      backgroundColor: isActive
                        ? "var(--accent-line)"
                        : "var(--surface-hover)",
                    }}
                    transition={SOFT}
                  />
                  <TextLine width="62%" />
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </StaggerGroup>
    </IllustrationStage>
  );
}

const REASONS = [
  "Handles relational data well, which suits a study planner.",
  "Widely documented, so answers are easy to find while learning.",
  "Scales comfortably past what this project is likely to need.",
];

export function ReasoningArt({ className }: { className?: string }) {
  const active = useCycle(REASONS.length, 2400);

  return (
    <IllustrationStage className={className} contentClassName="p-6 md:p-8">
      <StaggerGroup className="flex flex-col">
        <motion.div variants={riseIn}>
          <Panel accent className="flex items-center justify-between gap-3">
            <span className="text-body font-semibold text-foreground">
              PostgreSQL
            </span>
            <span className="rounded-badge bg-accent px-3 py-1 text-body-xs font-medium text-accent-foreground">
              Recommended
            </span>
          </Panel>
        </motion.div>

        <motion.span
          variants={scaleIn}
          aria-hidden="true"
          className="ml-8 h-8 w-px origin-top bg-accent-line"
        />

        <motion.div variants={riseIn}>
          <Panel>
            <span className="text-body-xs font-medium uppercase tracking-wide text-accent-text">
              Why this?
            </span>

            <div className="relative mt-3 min-h-14">
              {REASONS.map((reason, index) => (
                <motion.p
                  key={reason}
                  className="absolute inset-0 text-body-xs text-muted-foreground"
                  initial={false}
                  animate={{ opacity: index === active ? 1 : 0 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                >
                  {reason}
                </motion.p>
              ))}
            </div>
          </Panel>
        </motion.div>

        <motion.div variants={riseIn} className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-badge border border-border px-3 py-1.5 text-body-xs text-muted-foreground">
            Is it beginner friendly?
          </span>
          <span className="rounded-badge border border-border px-3 py-1.5 text-body-xs text-muted-foreground">
            Will it scale?
          </span>
        </motion.div>
      </StaggerGroup>
    </IllustrationStage>
  );
}

const TECHNOLOGIES = [
  "PostgreSQL",
  "Redis",
  "REST",
  "GraphQL",
  "JWT",
  "OAuth",
  "Docker",
  "Object storage",
];

const TECH_SELECTIONS = [
  [0, 2, 4],
  [0, 3, 5],
  [1, 2, 7],
];

export function TechnologyArt({ className }: { className?: string }) {
  const step = useCycle(TECH_SELECTIONS.length, 1800);
  const selected = TECH_SELECTIONS[step];

  return (
    <IllustrationStage className={className} contentClassName="p-6 md:p-8">
      <StaggerGroup className="flex flex-col gap-5" stagger={0.05}>
        <motion.div variants={riseIn} className="flex flex-col gap-2">
          <span className="text-body-sm font-semibold text-foreground">
            Suggested for your project
          </span>
          <span className="text-body-xs text-subtle-foreground">
            Medium scale, education category
          </span>
        </motion.div>

        <div className="flex flex-wrap gap-2">
          {TECHNOLOGIES.map((tech, index) => {
            const isSelected = selected.includes(index);

            return (
              <motion.span
                key={tech}
                variants={scaleIn}
                animate={{
                  borderColor: isSelected ? "var(--accent)" : "var(--border)",
                  backgroundColor: isSelected
                    ? "var(--accent-soft)"
                    : "var(--surface)",
                  color: isSelected
                    ? "var(--accent-text)"
                    : "var(--text-subtle)",
                }}
                transition={SOFT}
                className="rounded-badge border px-3.5 py-2 text-body-xs font-medium"
              >
                {tech}
              </motion.span>
            );
          })}
        </div>

        <motion.div variants={riseIn}>
          <Panel>
            <div className="flex flex-col gap-2">
              <TextLine width="94%" accent />
              <TextLine width="70%" />
            </div>
          </Panel>
        </motion.div>
      </StaggerGroup>
    </IllustrationStage>
  );
}

const ROADMAP = [
  "Design the database schema",
  "Add authentication",
  "Build the core endpoints",
  "Connect file storage",
];

export function RoadmapArt({ className }: { className?: string }) {
  const completed = useCycle(ROADMAP.length, 1500) + 1;

  return (
    <IllustrationStage className={className} contentClassName="p-6 md:p-8">
      <StaggerGroup className="flex flex-col gap-5">
        <motion.div variants={riseIn} className="flex items-center justify-between">
          <span className="text-body-sm font-semibold text-foreground">
            Implementation roadmap
          </span>
          <span className="text-body-xs text-accent-text">
            Step {completed} of {ROADMAP.length}
          </span>
        </motion.div>

        <motion.div
          variants={riseIn}
          className="h-1.5 w-full overflow-hidden rounded-full bg-surface-hover"
        >
          <motion.span
            className="block h-full rounded-full bg-accent"
            initial={{ width: "0%" }}
            animate={{ width: `${(completed / ROADMAP.length) * 100}%` }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          />
        </motion.div>

        <ol className="flex flex-col gap-4">
          {ROADMAP.map((step, index) => {
            const isDone = index < completed;

            return (
              <motion.li
                key={step}
                variants={riseIn}
                className="flex items-center gap-4"
              >
                <motion.span
                  animate={{
                    borderColor: isDone ? "var(--accent)" : "var(--border)",
                    backgroundColor: isDone ? "var(--accent)" : "var(--surface)",
                    color: isDone
                      ? "var(--accent-contrast)"
                      : "var(--text-subtle)",
                  }}
                  transition={SOFT}
                  className="flex size-7 shrink-0 items-center justify-center rounded-badge border text-body-xs font-semibold"
                >
                  {index + 1}
                </motion.span>

                <motion.span
                  animate={{
                    borderColor: isDone ? "var(--accent-line)" : "var(--border)",
                    backgroundColor: isDone
                      ? "var(--accent-soft)"
                      : "var(--surface)",
                    color: isDone ? "var(--text)" : "var(--text-subtle)",
                  }}
                  transition={SOFT}
                  className="flex-1 rounded-input border px-4 py-3 text-body-xs"
                >
                  {step}
                </motion.span>
              </motion.li>
            );
          })}
        </ol>
      </StaggerGroup>
    </IllustrationStage>
  );
}
