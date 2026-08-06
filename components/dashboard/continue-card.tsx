import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import type { PlanSummary } from "@/types/plans";

const formatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function ContinueCard({
  plan,
  firstName,
}: {
  plan: PlanSummary;
  firstName: string;
}) {
  return (
    <Link
      href={`/plans/${plan.id}`}
      className="group flex flex-col gap-6 rounded-card border border-border bg-linear-to-b from-surface-raised to-surface p-6 transition-colors duration-200 hover:border-border-strong md:p-8"
    >
      <div className="flex flex-col gap-2">
        <span className="text-body-xs font-semibold uppercase tracking-[0.16em] text-accent-text">
          Pick up where you left off
        </span>
        <h2 className="text-h5 font-bold text-foreground md:text-h4">
          {plan.title}
        </h2>
        <p className="text-body text-muted-foreground">
          Welcome back, {firstName}. You planned this on{" "}
          {formatter.format(new Date(plan.createdAt))}.
        </p>
      </div>

      <span className="inline-flex items-center gap-2 text-body-sm font-medium text-accent-text">
        Open this plan
        <ArrowRightIcon
          aria-hidden="true"
          className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
        />
      </span>
    </Link>
  );
}
