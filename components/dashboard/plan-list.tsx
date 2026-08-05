import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import type { PlanSummary } from "@/types/plans";

const formatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export function PlanList({ plans }: { plans: PlanSummary[] }) {
  return (
    <ul className="flex flex-col divide-y divide-border border-y border-border">
      {plans.map((plan) => (
        <li key={plan.id}>
          <Link
            href={`/plans/${plan.id}`}
            className="group flex items-center gap-5 px-2 py-5 transition-colors duration-200 hover:bg-surface/60"
          >
            <PlanMark />

            <span className="flex min-w-0 flex-1 flex-col gap-1">
              <span className="truncate text-body font-semibold text-foreground">
                {plan.title}
              </span>
              <span className="text-body-sm text-subtle-foreground">
                {formatter.format(new Date(plan.createdAt))}
              </span>
            </span>

            <ArrowRightIcon
              aria-hidden="true"
              className="size-5 shrink-0 text-subtle-foreground opacity-0 transition-[opacity,transform] duration-200 group-hover:translate-x-0.5 group-hover:opacity-100 group-hover:text-foreground"
            />
          </Link>
        </li>
      ))}
    </ul>
  );
}

function PlanMark() {
  return (
    <svg
      viewBox="0 0 24 28"
      aria-hidden="true"
      fill="none"
      className="size-7 shrink-0"
    >
      <path
        d="M4 14 h6 M10 14 V5 h6 M10 14 v9 h6"
        className="stroke-border-strong transition-colors duration-200 group-hover:stroke-accent-line"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="19"
        cy="5"
        r="3"
        className="fill-accent-soft stroke-accent transition-colors duration-200"
        strokeWidth="1.5"
      />
      <circle
        cx="19"
        cy="23"
        r="3"
        className="fill-surface stroke-subtle-foreground transition-colors duration-200 group-hover:stroke-border-strong"
        strokeWidth="1.5"
      />
      <circle
        cx="2.5"
        cy="14"
        r="2.5"
        className="fill-surface stroke-border-strong transition-colors duration-200 group-hover:stroke-accent"
        strokeWidth="1.5"
      />
    </svg>
  );
}
