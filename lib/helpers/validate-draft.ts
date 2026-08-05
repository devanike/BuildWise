import type { PlanDraft, PlanFieldErrors } from "@/types/plans";

export const MIN_DESCRIPTION = 30;
export const MIN_FEATURES = 2;

export function validateDraft(draft: PlanDraft): PlanFieldErrors {
  const errors: PlanFieldErrors = {};

  if (!draft.projectName?.trim()) {
    errors.projectName = "Please give your project a name.";
  }

  if (!draft.projectDescription?.trim()) {
    errors.projectDescription = "Please describe what you are building.";
  } else if (draft.projectDescription.trim().length < MIN_DESCRIPTION) {
    errors.projectDescription = `A little more detail helps. Aim for at least ${MIN_DESCRIPTION} characters.`;
  }

  if (!draft.targetUsers?.trim()) {
    errors.targetUsers = "Please say who this application is for.";
  }

  if (!Array.isArray(draft.coreFeatures) || draft.coreFeatures.length < MIN_FEATURES) {
    errors.coreFeatures = `Add at least ${MIN_FEATURES} features so your plan has something to work from.`;
  }

  if (!draft.authRequirement) {
    errors.authRequirement = "Please choose how people will sign in.";
  }

  return errors;
}

export function readDraft(input: unknown): PlanDraft | null {
  if (typeof input !== "object" || input === null) return null;

  const value = input as Record<string, unknown>;
  const string = (key: string) =>
    typeof value[key] === "string" ? (value[key] as string) : "";

  const features = Array.isArray(value.coreFeatures)
    ? value.coreFeatures.filter((item): item is string => typeof item === "string")
    : [];

  return {
    projectName: string("projectName"),
    projectDescription: string("projectDescription"),
    targetUsers: string("targetUsers"),
    coreFeatures: features,
    authRequirement: string("authRequirement"),
    techStack: string("techStack"),
    databasePreference: string("databasePreference"),
    apiPreference: string("apiPreference"),
    deploymentPreference: string("deploymentPreference"),
  };
}
