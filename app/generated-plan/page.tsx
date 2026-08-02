import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import type { Metadata } from "next";
import Link from "next/link";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import {
  Considerations,
  PlanSection,
  Reasoning,
  Recommendation,
} from "@/components/plans/plan-section";
import { Button } from "@/components/ui/button";
import { EXAMPLE_PLAN } from "@/lib/constants/example-plan";
import { requireUser } from "@/lib/helpers/require-user";

export const metadata: Metadata = {
  title: "Generated Plan",
  description: "Your structured backend plan, with the reasoning behind it.",
};

const plan = EXAMPLE_PLAN;

export default async function GeneratedPlanPage() {
  const profile = await requireUser();

  return (
    <DashboardShell profile={profile} title="Generated Plan">
      <div className="flex max-w-4xl flex-col gap-6">
        <Link
          href="/create-plan"
          className="inline-flex w-fit items-center gap-2 text-body-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
        >
          <ArrowLeftIcon aria-hidden="true" className="size-4" />
          Edit your inputs
        </Link>

        <section
          aria-labelledby="overview-heading"
          className="rounded-card border border-border bg-linear-to-b from-surface-raised to-surface p-6 md:p-8"
        >
          <span className="text-body-xs font-semibold uppercase tracking-[0.16em] text-accent-text">
            Project overview
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
                <dd className="mt-1 text-body-sm text-foreground">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <PlanSection
          id="architecture"
          eyebrow="Backend architecture"
          title="Recommended architecture"
        >
          <Recommendation>{plan.architecture.recommendation}</Recommendation>
          <Reasoning>{plan.architecture.reasoning}</Reasoning>
          <Considerations items={plan.architecture.considerations} />
        </PlanSection>

        <PlanSection
          id="authentication"
          eyebrow="Authentication"
          title="Authentication strategy"
        >
          <Recommendation>{plan.authentication.recommendation}</Recommendation>
          <Reasoning>{plan.authentication.reasoning}</Reasoning>
          <Considerations items={plan.authentication.considerations} />
        </PlanSection>

        <PlanSection
          id="database"
          eyebrow="Database"
          title="Database recommendation"
        >
          <Recommendation>{plan.database.recommendation}</Recommendation>
          <Reasoning>{plan.database.reasoning}</Reasoning>
          <Considerations items={plan.database.considerations} />
        </PlanSection>

        <PlanSection id="api" eyebrow="API design" title="API structure">
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
        </PlanSection>

        <PlanSection
          id="folders"
          eyebrow="Project structure"
          title="Suggested folder structure"
        >
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
        </PlanSection>

        <PlanSection
          id="deployment"
          eyebrow="Deployment"
          title="Deployment recommendation"
        >
          <Recommendation>{plan.deployment.recommendation}</Recommendation>
          <Reasoning>{plan.deployment.reasoning}</Reasoning>
          <Considerations items={plan.deployment.considerations} />
        </PlanSection>

        <PlanSection
          id="resources"
          eyebrow="Learning"
          title="What to read next"
        >
          <ul className="divide-y divide-border border-y border-border">
            {plan.resources.map((resource, index) => (
              <li key={resource.title}>
                <div className="group flex items-start gap-5 py-5 transition-colors duration-200">
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
        </PlanSection>

        <PlanSection id="next-steps" eyebrow="Roadmap" title="Next steps">
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
        </PlanSection>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/dashboard">Return to Dashboard</Link>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <Link href="/create-plan">Create another plan</Link>
          </Button>
        </div>

      </div>
    </DashboardShell>
  );
}
