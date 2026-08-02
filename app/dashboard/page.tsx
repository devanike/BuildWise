import { ArrowRightIcon, PlusIcon } from "@heroicons/react/24/outline";
import type { Metadata } from "next";
import Link from "next/link";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/lib/helpers/require-user";
import { toFirstName } from "@/lib/helpers/account-profile";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your BuildWise AI dashboard.",
};

export default async function DashboardPage() {
  const profile = await requireUser();

  return (
    <DashboardShell profile={profile} title="Dashboard">
      <div className="flex flex-col gap-8">
        <section className="rounded-card border border-border bg-linear-to-b from-surface-raised to-surface p-8 md:p-10">
          <h2 className="text-h4 font-bold text-foreground md:text-h3">
            Welcome back, {toFirstName(profile.name)}.
          </h2>
          <p className="mt-3 max-w-2xl text-body text-muted-foreground md:text-body-lg">
            What would you like to build today? Describe your project and
            BuildWise AI will turn it into a structured backend plan you can
            follow and understand.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/create-plan">
                <PlusIcon aria-hidden="true" />
                Create New Plan
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="/generated-plan">
                See an example plan
                <ArrowRightIcon aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </section>

        <section aria-labelledby="recent-plans-heading">
          <div className="flex items-baseline justify-between gap-4">
            <h2
              id="recent-plans-heading"
              className="text-h6 font-bold text-foreground"
            >
              Recent plans
            </h2>
          </div>

          <EmptyState
            className="mt-5"
            title="You haven't created any backend plans yet"
            description="Create your first backend plan to get started. Your plans will appear here so you can return to them whenever you need."
            action={
              <Button asChild size="md">
                <Link href="/create-plan">Create New Plan</Link>
              </Button>
            }
          />
        </section>
      </div>
    </DashboardShell>
  );
}
