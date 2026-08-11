import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import type { Metadata } from "next";
import Link from "next/link";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { PlanView } from "@/components/plans/plan-view";
import { Button } from "@/components/ui/button";
import { EXAMPLE_PLAN } from "@/lib/constants/example-plan";
import { requireUser } from "@/lib/helpers/require-user";

export const metadata: Metadata = {
  title: "Generated Plan",
  description: "Your structured backend plan, with the reasoning behind it.",
};

export default async function GeneratedPlanPage() {
  const profile = await requireUser();

  return (
    <DashboardShell profile={profile} title="Generated Plan">
      <div className="flex flex-col gap-6">
        <Link
          href="/create-plan"
          className="inline-flex w-fit items-center gap-2 text-body-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
        >
          <ArrowLeftIcon aria-hidden="true" className="size-4" />
          Edit your inputs
        </Link>

        <PlanView plan={EXAMPLE_PLAN} />

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
