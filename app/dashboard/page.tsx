import { ArrowRightIcon } from "@heroicons/react/24/outline";
import type { Metadata } from "next";
import Link from "next/link";
import { ContinueCard } from "@/components/dashboard/continue-card";
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

const RECENT_LIMIT = 5;

export default async function DashboardPage() {
  const profile = await requireUser();
  const plans = await listPlans();

  const firstName = toFirstName(profile.name);
  const [latest, ...rest] = plans;
  const recent = rest.slice(0, RECENT_LIMIT - 1);

  if (plans.length === 0) {
    return (
      <DashboardShell profile={profile} title="Dashboard">
        <section className="flex min-h-[calc(100dvh-10rem)] flex-col">
          <div className="flex flex-col gap-1.5">
            <h2 className="text-h5 font-bold text-foreground md:text-h4">
              Welcome, {firstName}.
            </h2>
            <p className="text-body text-muted-foreground">
              Describe what you are building and BuildWise AI will turn it into a
              structured backend plan you can follow and understand.
            </p>
          </div>

          <EmptyState
            className="mt-6 flex-1"
            title="You haven't created any backend plans yet"
            description="Create your first backend plan to get started. Your plans will appear here so you can return to them whenever you need."
            action={
              <Button asChild size="sm">
                <Link href="/create-plan">Create New Plan</Link>
              </Button>
            }
          />
        </section>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell profile={profile} title="Dashboard">
      <div className="flex flex-col gap-10">
        <ContinueCard plan={latest} firstName={firstName} />

        {recent.length > 0 ? (
          <section aria-labelledby="recent-heading">
            <div className="flex items-baseline justify-between gap-4">
              <h2
                id="recent-heading"
                className="text-h6 font-bold text-foreground"
              >
                Recent plans
              </h2>
              <Link
                href="/saved-plans"
                className="inline-flex items-center gap-1.5 text-body-sm font-medium text-accent-text underline-offset-4 transition-opacity duration-200 hover:opacity-80 hover:underline"
              >
                View all plans
                <ArrowRightIcon aria-hidden="true" className="size-4" />
              </Link>
            </div>

            <div className="mt-4">
              <PlanList plans={recent} />
            </div>
          </section>
        ) : null}
      </div>
    </DashboardShell>
  );
}
