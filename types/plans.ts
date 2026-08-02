export type PlanDraft = {
  projectName: string;
  projectDescription: string;
  targetUsers: string;
  coreFeatures: string;
  authRequirement: string;
  databasePreference: string;
  apiPreference: string;
  deploymentPreference: string;
};

export type PlanFieldErrors = Partial<Record<keyof PlanDraft, string>>;
