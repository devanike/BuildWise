"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  Drift,
  IllustrationStage,
  Panel,
  StaggerGroup,
  TextLine,
  riseIn,
  scaleIn,
} from "@/components/shared/illustrations/stage";
import { cn } from "@/lib/utils/cn";

const NAV_ROWS = ["Dashboard", "Create Plan", "Saved Plans", "Settings"];
const SIGNALS = [
  { label: "Database", value: "PostgreSQL", fill: "92%" },
  { label: "Authentication", value: "Sessions", fill: "68%" },
  { label: "API design", value: "REST", fill: "80%" },
];
const EASE = [0.22, 1, 0.36, 1] as const;

export function ProductPreview() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <IllustrationStage
      className="flex min-h-125 w-full flex-col sm:min-h-150 lg:min-h-175"
      contentClassName="flex flex-1 flex-col"
    >
      <StaggerGroup
        className="flex flex-1 flex-col gap-5 p-5 sm:p-7 lg:p-8"
        stagger={0.12}
      >
        <motion.div
          variants={scaleIn}
          className="flex flex-1 gap-4 rounded-input border border-border bg-background/70 p-3 sm:gap-5 sm:p-5"
        >
          <div className="hidden w-34 shrink-0 flex-col gap-2 border-r border-border pr-4 sm:flex">
            <div className="flex items-center gap-2 pb-3">
              <span className="size-4.5 rounded-[5px] bg-accent" />
              <TextLine width="56%" />
            </div>

            {NAV_ROWS.map((row, index) => (
              <span
                key={row}
                className={cn(
                  "rounded-lg px-2.5 py-2 text-body-xs",
                  index === 1
                    ? "bg-accent-soft text-accent-text"
                    : "text-subtle-foreground",
                )}
              >
                {row}
              </span>
            ))}

            <div className="mt-auto flex flex-col gap-2 border-t border-border pt-3">
              <TextLine width="70%" />
              <TextLine width="45%" />
            </div>
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-body-sm font-semibold text-foreground">
                Recommended architecture
              </span>
              <span className="rounded-badge border border-accent-line bg-accent-soft px-2.5 py-1 text-body-xs text-accent-text">
                Explained
              </span>
            </div>

            <Panel accent className="relative overflow-hidden p-4">
              <div className="flex flex-col gap-2.5">
                <TextLine width="90%" accent />
                <TextLine width="72%" />
                <TextLine width="58%" />
              </div>

              {prefersReducedMotion ? null : (
                <motion.span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 w-1/3 bg-linear-to-r from-transparent via-accent/8 to-transparent"
                  animate={{ left: ["-35%", "105%"] }}
                  transition={{
                    duration: 4.5,
                    repeat: Infinity,
                    repeatDelay: 2.5,
                    ease: "easeInOut",
                  }}
                />
              )}
            </Panel>

            <div className="flex flex-col gap-3">
              {SIGNALS.map((signal, index) => (
                <div
                  key={signal.label}
                  className="rounded-input border border-border bg-surface/70 px-4 py-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-body-xs text-subtle-foreground">
                      {signal.label}
                    </span>
                    <span
                      className={cn(
                        "text-body-xs font-medium",
                        index === 0 ? "text-accent-text" : "text-foreground",
                      )}
                    >
                      {signal.value}
                    </span>
                  </div>

                  <span className="mt-2.5 block h-1 overflow-hidden rounded-full bg-surface-hover">
                    <motion.span
                      className={cn(
                        "block h-full rounded-full",
                        index === 0 ? "bg-accent" : "bg-border-strong",
                      )}
                      initial={
                        prefersReducedMotion ? undefined : { width: "0%" }
                      }
                      whileInView={
                        prefersReducedMotion ? undefined : { width: signal.fill }
                      }
                      viewport={{ once: true, margin: "-60px" }}
                      transition={{
                        duration: 1.1,
                        delay: 0.35 + index * 0.15,
                        ease: EASE,
                      }}
                      style={
                        prefersReducedMotion ? { width: signal.fill } : undefined
                      }
                    />
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div variants={riseIn} className="sm:pl-12">
          <Drift distance={5} duration={9}>
            <div className="rounded-input border border-border bg-surface-raised p-4 shadow-soft sm:p-5">
              <div className="flex items-center gap-2.5">
                <span className="size-1.5 shrink-0 rounded-full bg-accent" />
                <span className="text-body-sm font-medium text-foreground">
                  Why was PostgreSQL recommended?
                </span>
              </div>
              <div className="mt-3.5 flex flex-col gap-2 pl-4">
                <TextLine width="100%" />
                <TextLine width="84%" />
                <TextLine width="62%" />
              </div>
            </div>
          </Drift>
        </motion.div>
      </StaggerGroup>
    </IllustrationStage>
  );
}
