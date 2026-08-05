import { ArrowRightIcon, PlusIcon } from "@heroicons/react/24/outline";
import type { Metadata } from "next";
import Link from "next/link";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { PlanList } from "@/components/dashboard/plan-list";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/lib/helpers/require-user";
import { toFirstName } from "@/lib/helpers/account-profile";
import { listPlans } from "@/lib/services/plans";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your BuildWise AI dashboard.",
};

export default async function DashboardPage() {
  const profile = await requireUser();
  const plans = await listPlans();

  return (
    <DashboardShell profile={profile} title="Dashboard">
      {/* Fills the shell's content area so recent plans is the whole page,
          rather than padding a card out to an arbitrary height. */}
      <section
        aria-labelledby="recent-plans-heading"
        className="flex min-h-[calc(100dvh-10rem)] flex-col"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-1.5">
            <h2
              id="recent-plans-heading"
              className="text-h5 font-bold text-foreground md:text-h4"
            >
              Recent plans
            </h2>
            <p className="text-body text-muted-foreground">
              Welcome back, {toFirstName(profile.name)}. Your plans live here so
              you can return to them whenever you need.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="sm">
              <Link href="/create-plan">
                <PlusIcon aria-hidden="true" />
                Create New Plan
              </Link>
            </Button>
            <Button asChild variant="secondary" size="sm">
              <Link href="/generated-plan">
                See an example
                <ArrowRightIcon aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>

        {plans.length > 0 ? (
          <div className="mt-6">
            <PlanList plans={plans} />
          </div>
        ) : (
          <EmptyState
            className="mt-6 flex-1"
            title="You haven't created any backend plans yet"
            description="Create your first backend plan to get started. Describe what you are building and BuildWise AI will turn it into a structured plan you can follow and understand."
            action={
              <Button asChild size="sm">
                <Link href="/create-plan">Create New Plan</Link>
              </Button>
            }
          />
        )}
      </section>
    </DashboardShell>
  );
}
