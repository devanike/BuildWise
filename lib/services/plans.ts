import "server-only";
import { validatePlan } from "@/lib/helpers/validate-plan";
import { createClient } from "@/lib/supabase/server";
import type { GeneratedPlan, PlanDraft, PlanSummary, SavedPlan } from "@/types/plans";

type PlanRow = {
  id: string;
  title: string;
  draft: unknown;
  plan: unknown;
  created_at: string;
  updated_at: string;
};

export async function createPlan(
  draft: PlanDraft,
  plan: GeneratedPlan,
): Promise<string> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Cannot save a plan without a signed-in user.");
  }

  const { data, error } = await supabase
    .from("plans")
    .insert({
      user_id: user.id,
      title: draft.projectName.trim() || "Untitled plan",
      draft,
      plan,
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(`Could not save the plan: ${error.message}`);
  }

  return data.id;
}

export async function getPlan(id: string): Promise<SavedPlan | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("plans")
    .select("id, title, draft, plan, created_at, updated_at")
    .eq("id", id)
    .maybeSingle<PlanRow>();

  if (error || !data) return null;

  const result = validatePlan(data.plan);
  if (!result.ok) return null;

  return {
    id: data.id,
    title: data.title,
    draft: data.draft as PlanDraft,
    plan: result.plan,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

export async function listPlans(): Promise<PlanSummary[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("plans")
    .select("id, title, created_at")
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id,
    title: row.title,
    createdAt: row.created_at,
  }));
}

export async function deletePlan(id: string): Promise<boolean> {
  const supabase = await createClient();
  const { error } = await supabase.from("plans").delete().eq("id", id);
  return !error;
}
