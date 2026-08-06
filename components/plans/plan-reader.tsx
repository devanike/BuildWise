"use client";

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import {
  Considerations,
  LearningTip,
  Reasoning,
  Recommendation,
} from "@/components/plans/plan-section";
import { cn } from "@/lib/utils/cn";
import type { GeneratedPlan } from "@/types/plans";

type Plan = GeneratedPlan;

type Section = {
  id: string;
  eyebrow: string;
  title: string;
  summary: string;
  content: React.ReactNode;
};

const INITIAL_OPEN = ["architecture"];

export function PlanReader({ plan }: { plan: Plan }) {
  const sections = buildSections(plan);
  const [open, setOpen] = useState<string[]>(INITIAL_OPEN);

  const allOpen = open.length === sections.length;

  function reveal(id: string) {
    setOpen((current) =>
      current.includes(id) ? current : [...current, id],
    );

    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ block: "start" });
    });
  }

  return (
    <div className="flex flex-col gap-8">
      <PlanSummary plan={plan} />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] lg:gap-10">
        <nav
          aria-label="Plan contents"
          className="lg:sticky lg:top-24 lg:self-start"
        >
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-body-xs font-semibold uppercase tracking-[0.16em] text-subtle-foreground">
              Contents
            </h2>
            <button
              type="button"
              onClick={() =>
                setOpen(allOpen ? [] : sections.map((section) => section.id))
              }
              className="text-body-xs font-medium text-accent-text transition-opacity duration-200 hover:opacity-80"
            >
              {allOpen ? "Collapse all" : "Expand all"}
            </button>
          </div>

          <ul className="mt-4 flex flex-col">
            {sections.map((section) => {
              const isOpen = open.includes(section.id);

              return (
                <li key={section.id}>
                  <button
                    type="button"
                    onClick={() => reveal(section.id)}
                    className={cn(
                      "flex w-full items-center gap-2.5 border-l-2 py-2 pl-3 text-left text-body-sm",
                      "transition-colors duration-200",
                      isOpen
                        ? "border-accent text-foreground"
                        : "border-border text-subtle-foreground hover:border-border-strong hover:text-foreground",
                    )}
                  >
                    {section.title}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <AccordionPrimitive.Root
          type="multiple"
          value={open}
          onValueChange={setOpen}
          className="flex min-w-0 flex-col gap-4"
        >
          {sections.map((section) => (
            <AccordionPrimitive.Item
              key={section.id}
              value={section.id}
              id={section.id}
              className="scroll-mt-24 overflow-hidden rounded-card border border-border bg-surface"
            >
              <AccordionPrimitive.Header>
                <AccordionPrimitive.Trigger
                  className={cn(
                    "group flex w-full items-start gap-4 p-6 text-left md:p-7",
                    "transition-colors duration-200 hover:bg-surface-hover",
                  )}
                >
                  <span className="flex min-w-0 flex-1 flex-col gap-1.5">
                    <span className="text-body-xs font-semibold uppercase tracking-[0.16em] text-accent-text">
                      {section.eyebrow}
                    </span>
                    <span className="text-h6 font-bold text-foreground">
                      {section.title}
                    </span>
                    <span className="text-body-sm text-muted-foreground group-data-[state=open]:hidden">
                      {section.summary}
                    </span>
                  </span>

                  <span
                    aria-hidden="true"
                    className={cn(
                      "mt-1 flex size-8 shrink-0 items-center justify-center rounded-badge border border-border",
                      "transition-[transform,border-color,background-color] duration-300",
                      "group-hover:border-border-strong",
                      "group-data-[state=open]:rotate-180 group-data-[state=open]:border-accent group-data-[state=open]:bg-accent-soft",
                    )}
                  >
                    <ChevronDownIcon className="size-4 text-accent-text" />
                  </span>
                </AccordionPrimitive.Trigger>
              </AccordionPrimitive.Header>

              <AccordionPrimitive.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                <div className="border-t border-border p-6 md:p-7">
                  {section.content}
                </div>
              </AccordionPrimitive.Content>
            </AccordionPrimitive.Item>
          ))}

          <PlanDisclaimer />
        </AccordionPrimitive.Root>
      </div>
    </div>
  );
}

function PlanDisclaimer() {
  return (
    <p className="rounded-card border border-dashed border-border px-6 py-5 text-body-sm text-subtle-foreground">
      These recommendations are a starting point, not a verdict. Read the
      reasoning behind each one, check anything that surprises you, and change
      what does not fit your project.
    </p>
  );
}

function PlanSummary({ plan }: { plan: Plan }) {
  return (
    <section
      aria-labelledby="overview-heading"
      className="rounded-card border border-border bg-linear-to-b from-surface-raised to-surface p-6 md:p-8"
    >
      <span className="text-body-xs font-semibold uppercase tracking-[0.16em] text-accent-text">
        At a glance
      </span>
      <h2
        id="overview-heading"
        className="mt-3 text-h4 font-bold text-foreground md:text-h3"
      >
        {plan.project.name}
      </h2>
      <p className="mt-4 max-w-2xl text-body text-muted-foreground md:text-body-lg">
        {plan.project.summary}
      </p>

      <dl className="mt-8 grid gap-4 sm:grid-cols-2">
        {plan.overview.map((item) => (
          <div
            key={item.label}
            className="rounded-input border border-border bg-background/50 px-4 py-3"
          >
            <dt className="text-body-xs font-medium text-subtle-foreground">
              {item.label}
            </dt>
            <dd className="mt-1 text-body-sm text-foreground">{item.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function buildSections(plan: Plan): Section[] {
  return [
    {
      id: "architecture",
      eyebrow: "Backend architecture",
      title: "Recommended architecture",
      summary: plan.architecture.recommendation,
      content: (
        <>
          <Recommendation>{plan.architecture.recommendation}</Recommendation>
          <Reasoning>{plan.architecture.reasoning}</Reasoning>
          <Considerations items={plan.architecture.considerations} />
          <LearningTip>{plan.architecture.learningTip}</LearningTip>
        </>
      ),
    },
    {
      id: "authentication",
      eyebrow: "Authentication",
      title: "Authentication strategy",
      summary: plan.authentication.recommendation,
      content: (
        <>
          <Recommendation>{plan.authentication.recommendation}</Recommendation>
          <Reasoning>{plan.authentication.reasoning}</Reasoning>
          <Considerations items={plan.authentication.considerations} />
          <LearningTip>{plan.authentication.learningTip}</LearningTip>
        </>
      ),
    },
    {
      id: "database",
      eyebrow: "Database",
      title: "Database recommendation",
      summary: plan.database.recommendation,
      content: (
        <>
          <Recommendation>{plan.database.recommendation}</Recommendation>
          <Reasoning>{plan.database.reasoning}</Reasoning>
          <Considerations items={plan.database.considerations} />
          <LearningTip>{plan.database.learningTip}</LearningTip>
        </>
      ),
    },
    {
      id: "api",
      eyebrow: "API design",
      title: "API structure",
      summary: plan.api.recommendation,
      content: (
        <>
          <Recommendation>{plan.api.recommendation}</Recommendation>
          <Reasoning>{plan.api.reasoning}</Reasoning>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-136 border-collapse text-left">
              <caption className="sr-only">Suggested endpoints</caption>
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-3 pr-4 text-body-xs font-semibold uppercase tracking-wide text-subtle-foreground">
                    Method
                  </th>
                  <th className="pb-3 pr-4 text-body-xs font-semibold uppercase tracking-wide text-subtle-foreground">
                    Path
                  </th>
                  <th className="pb-3 text-body-xs font-semibold uppercase tracking-wide text-subtle-foreground">
                    Purpose
                  </th>
                </tr>
              </thead>
              <tbody>
                {plan.api.endpoints.map((endpoint) => (
                  <tr
                    key={`${endpoint.method}-${endpoint.path}`}
                    className="border-b border-border/60 last:border-0"
                  >
                    <td className="py-3 pr-4 align-top">
                      <span className="rounded-badge border border-accent-line bg-accent-soft px-2.5 py-1 text-body-xs font-semibold text-accent-text">
                        {endpoint.method}
                      </span>
                    </td>
                    <td className="py-3 pr-4 align-top text-body-sm text-foreground">
                      {endpoint.path}
                    </td>
                    <td className="py-3 align-top text-body-sm text-muted-foreground">
                      {endpoint.purpose}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <LearningTip>{plan.api.learningTip}</LearningTip>
        </>
      ),
    },
    {
      id: "folders",
      eyebrow: "Project structure",
      title: "Suggested folder structure",
      summary: `${plan.folders.length} top-level folders, each with a clear job`,
      content: (
        <ul className="flex flex-col gap-2.5">
          {plan.folders.map((folder) => (
            <li
              key={folder.path}
              className="flex flex-col gap-1 rounded-input border border-border bg-background/50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
            >
              <span className="text-body-sm font-medium text-foreground">
                {folder.path}
              </span>
              <span className="text-body-sm text-muted-foreground">
                {folder.note}
              </span>
            </li>
          ))}
        </ul>
      ),
    },
    {
      id: "deployment",
      eyebrow: "Deployment",
      title: "Deployment recommendation",
      summary: plan.deployment.recommendation,
      content: (
        <>
          <Recommendation>{plan.deployment.recommendation}</Recommendation>
          <Reasoning>{plan.deployment.reasoning}</Reasoning>
          <Considerations items={plan.deployment.considerations} />
          <LearningTip>{plan.deployment.learningTip}</LearningTip>
        </>
      ),
    },
    {
      id: "next-steps",
      eyebrow: "Roadmap",
      title: "Next steps",
      summary: `${plan.nextSteps.length} steps, in the order worth doing them`,
      content: (
        <ol className="flex flex-col gap-4">
          {plan.nextSteps.map((step, index) => (
            <li key={step.title} className="flex gap-4">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-badge border border-accent-line bg-accent-soft text-body-sm font-semibold text-accent-text">
                {index + 1}
              </span>
              <div>
                <h3 className="text-body font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-1 text-body-sm text-muted-foreground">
                  {step.detail}
                </p>
              </div>
            </li>
          ))}
        </ol>
      ),
    },
    {
      id: "resources",
      eyebrow: "Learning",
      title: "What to read next",
      summary: `${plan.resources.length} topics worth understanding before you build`,
      content: (
        <ul className="divide-y divide-border border-y border-border">
          {plan.resources.map((resource, index) => (
            <li key={resource.title}>
              <div className="group flex items-start gap-5 py-5">
                <span className="font-display text-h5 font-bold leading-none text-border-strong transition-colors duration-200 group-hover:text-accent-text">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-body font-semibold text-foreground">
                    {resource.title}
                  </h3>
                  <p className="mt-1.5 text-body-sm text-muted-foreground">
                    {resource.description}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ),
    },
  ];
}
