import type { Metadata } from "next";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { CreatePlanForm } from "@/components/plans/create-plan-form";
import { requireUser } from "@/lib/helpers/require-user";

export const metadata: Metadata = {
  title: "Create Backend Plan",
  description:
    "Describe your project and BuildWise AI will turn it into a structured backend plan.",
};

export default async function CreatePlanPage() {
  const profile = await requireUser();

  return (
    <DashboardShell profile={profile} title="Create Backend Plan">
      <div className="flex flex-col gap-8">
        <header className="max-w-3xl">
          <h2 className="text-h4 font-bold text-foreground md:text-h3">
            Describe your project
          </h2>
          <p className="mt-3 max-w-2xl text-body text-muted-foreground md:text-body-lg">
            The more you share, the more specific your plan can be. Write in
            plain language, and do not worry about technical terms you have not
            met yet.
          </p>
        </header>

        <CreatePlanForm />
      </div>
    </DashboardShell>
  );
}
