import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { PlanMark } from "@/components/plans/plan-mark";
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
              className="size-5 shrink-0 text-subtle-foreground opacity-0 transition-[opacity,transform] duration-200 group-hover:translate-x-0.5 group-hover:text-foreground group-hover:opacity-100"
            />
          </Link>
        </li>
      ))}
    </ul>
  );
}
