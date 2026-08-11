"use client";

import { useState } from "react";
import { PlanQuestions } from "@/components/plans/plan-questions";
import { PlanReader } from "@/components/plans/plan-reader";
import type { GeneratedPlan, PlanQuestion } from "@/types/plans";

const PANEL_ID = "plan-path-panel";

export function PlanView({
  plan,
  planId,
  initialQuestions = [],
}: {
  plan: GeneratedPlan;
  planId?: string;
  initialQuestions?: PlanQuestion[];
}) {
  const [active, setActive] = useState(plan.recommendedPath);

  const path = plan.paths[active] ?? plan.paths[0];
  const hasChoice = plan.paths.length > 1;

  return (
    <div className="flex flex-col gap-8">
      <PlanReader
        key={active}
        plan={plan}
        path={path}
        active={active}
        onPathChange={setActive}
        panelId={hasChoice ? PANEL_ID : undefined}
        labelledBy={hasChoice ? `${PANEL_ID}-tab-${active}` : undefined}
      />

      {planId ? (
        <PlanQuestions
          planId={planId}
          initialQuestions={initialQuestions}
          pathIndex={active}
          pathName={hasChoice ? path.name : undefined}
        />
      ) : null}
    </div>
  );
}
