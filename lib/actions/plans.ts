"use server";

import { revalidatePath } from "next/cache";
import { deletePlan } from "@/lib/services/plans";

export type DeletePlanResult = { error?: string };

export async function deletePlanById(id: string): Promise<DeletePlanResult> {
  if (!id) {
    return { error: "We couldn't tell which plan to delete." };
  }

  const ok = await deletePlan(id);

  if (!ok) {
    return { error: "We couldn't delete that plan. Please try again." };
  }

  revalidatePath("/saved-plans");
  revalidatePath("/dashboard");

  return {};
}
