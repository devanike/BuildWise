"use client";

import { motion } from "framer-motion";
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

const RECOMMENDATIONS = [
  { title: "Database", detail: "PostgreSQL", accent: true },
  { title: "Authentication", detail: "Email and Google" },
  { title: "API Design", detail: "REST" },
];

const ROADMAP = [
  { title: "Design the database schema", done: true },
  { title: "Add authentication", done: true },
  { title: "Build the core endpoints" },
];

export function AuthShowcaseArt({ className }: { className?: string }) {
  return (
    <IllustrationStage
      className={cn("w-full", className)}
      contentClassName="p-8 md:p-10"
    >
      <div aria-hidden="true">
        <StaggerGroup className="flex flex-col gap-4">
          <motion.div
            variants={riseIn}
            className="flex items-center justify-between"
          >
            <span className="text-body font-semibold text-foreground">
              Study Planner
            </span>
            <span className="rounded-badge border border-border px-3 py-1 text-body-xs text-subtle-foreground">
              Education
            </span>
          </motion.div>

          {RECOMMENDATIONS.map((item) => (
            <motion.div key={item.title} variants={riseIn}>
              <Panel accent={item.accent}>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-body-sm font-medium text-foreground">
                    {item.title}
                  </span>
                  <span
                    className={cn(
                      "text-body-xs",
                      item.accent ? "text-accent-text" : "text-subtle-foreground",
                    )}
                  >
                    {item.detail}
                  </span>
                </div>
                <div className="mt-3 flex flex-col gap-1.5">
                  <TextLine width="90%" accent={item.accent} />
                  <TextLine width="64%" />
                </div>
              </Panel>
            </motion.div>
          ))}

          <motion.div variants={riseIn} className="mt-3 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-body-xs font-medium text-subtle-foreground">
                Implementation roadmap
              </span>
              <span className="text-body-xs text-accent-text">2 of 3</span>
            </div>

            <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-hover">
              <motion.span
                className="block h-full rounded-full bg-accent"
                initial={{ width: "0%" }}
                whileInView={{ width: "66%" }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.9,
                  delay: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />
            </div>

            <ul className="flex flex-col gap-2.5">
              {ROADMAP.map((step, index) => (
                <li key={step.title} className="flex items-center gap-3">
                  <span
                    className={cn(
                      "flex size-6 shrink-0 items-center justify-center rounded-badge border text-body-xs font-semibold",
                      step.done
                        ? "border-accent bg-accent text-accent-foreground"
                        : "border-border bg-surface text-subtle-foreground",
                    )}
                  >
                    {index + 1}
                  </span>
                  <span
                    className={cn(
                      "text-body-xs",
                      step.done ? "text-foreground" : "text-subtle-foreground",
                    )}
                  >
                    {step.title}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

          <Drift distance={4} duration={9} className="mt-2">
            <motion.div variants={scaleIn}>
              <span className="inline-block rounded-badge border border-accent-line bg-accent-soft px-3.5 py-2 text-body-xs text-accent-text">
                Why was PostgreSQL recommended?
              </span>
            </motion.div>
          </Drift>
        </StaggerGroup>
      </div>
    </IllustrationStage>
  );
}
