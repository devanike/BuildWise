import { PlusIcon } from "@heroicons/react/24/outline";
import type { Metadata } from "next";
import Link from "next/link";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { SavedPlans } from "@/components/plans/saved-plans";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/lib/helpers/require-user";
import { listPlans } from "@/lib/services/plans";

export const metadata: Metadata = {
  title: "Saved Plans",
  description: "Every backend plan you have created.",
};

export default async function SavedPlansPage() {
  const profile = await requireUser();
  const plans = await listPlans();

  return (
    <DashboardShell profile={profile} title="Saved Plans">
      <section className="flex min-h-[calc(100dvh-10rem)] flex-col">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-1.5">
            <h2 className="text-h5 font-bold text-foreground md:text-h4">
              Your plans
            </h2>
            <p className="text-body text-muted-foreground">
              Everything you have planned, newest first.
            </p>
          </div>

          <Button asChild size="sm">
            <Link href="/create-plan">
              <PlusIcon aria-hidden="true" />
              Create New Plan
            </Link>
          </Button>
        </div>

        {plans.length === 0 ? (
          <EmptyState
            className="mt-6 flex-1"
            title="No saved plans yet"
            description="Once you create a backend plan it will be saved here, so you can search it, return to it and keep asking questions about it."
            action={
              <Button asChild size="sm">
                <Link href="/create-plan">Create New Plan</Link>
              </Button>
            }
          />
        ) : (
          <div className="mt-6">
            <SavedPlans plans={plans} />
          </div>
        )}
      </section>
    </DashboardShell>
  );
}
