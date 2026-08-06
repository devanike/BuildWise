import { ArrowLeftIcon, PlusIcon } from "@heroicons/react/24/outline";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { PlanQuestions } from "@/components/plans/plan-questions";
import { PlanReader } from "@/components/plans/plan-reader";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/lib/helpers/require-user";
import { getPlan } from "@/lib/services/plans";
import { listQuestions } from "@/lib/services/questions";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const saved = await getPlan(id);

  return {
    title: saved ? saved.title : "Plan",
    description: "Your structured backend plan, with the reasoning behind it.",
  };
}

export default async function PlanPage({ params }: Props) {
  const profile = await requireUser();
  const { id } = await params;
  const saved = await getPlan(id);

  if (!saved) notFound();

  const questions = await listQuestions(saved.id);

  return (
    <DashboardShell profile={profile} title={saved.title}>
      <div className="flex flex-col gap-6">
        <Link
          href="/saved-plans"
          className="inline-flex w-fit items-center gap-2 text-body-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
        >
          <ArrowLeftIcon aria-hidden="true" className="size-4" />
          Back to your plans
        </Link>

        <PlanReader plan={saved.plan} />

        <PlanQuestions planId={saved.id} initialQuestions={questions} />

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild size="sm">
            <Link href="/create-plan">
              <PlusIcon aria-hidden="true" />
              Create another plan
            </Link>
          </Button>
          <Button asChild variant="secondary" size="sm">
            <Link href="/saved-plans">View all plans</Link>
          </Button>
        </div>
      </div>
    </DashboardShell>
  );
}
