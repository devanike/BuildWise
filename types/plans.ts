export type PlanDraft = {
  projectName: string;
  projectDescription: string;
  targetUsers: string;
  coreFeatures: string[];
  authRequirement: string;
  /** Free text, optional. Shapes folder structure and deployment advice. */
  techStack: string;
  databasePreference: string;
  apiPreference: string;
  deploymentPreference: string;
};

export type PlanFieldErrors = Partial<Record<keyof PlanDraft, string>>;

/**
 * One technical decision, and the teaching that goes with it. The reasoning is
 * not decoration: explaining why is the product, so no section may omit it.
 */
export type PlanRecommendation = {
  recommendation: string;
  /** Why this fits, including the alternative that was not chosen. */
  reasoning: string;
  /** The trade-offs worth knowing before acting on it. */
  considerations: readonly string[];
  /** One thing to go and understand. Kept short on purpose. */
  learningTip: string;
};

export type PlanEndpoint = {
  method: string;
  path: string;
  purpose: string;
};

/**
 * The shape a generated plan must take. This is the single contract shared by
 * three things: the example plan, what the model is instructed to return, and
 * what the reader renders. Change it here and all three move together.
 */
export type GeneratedPlan = {
  project: {
    name: string;
    summary: string;
    targetUsers: string;
    scale: string;
  };
  /** Four short pairs for the at-a-glance card. */
  overview: readonly { label: string; value: string }[];
  architecture: PlanRecommendation;
  authentication: PlanRecommendation;
  database: PlanRecommendation;
  api: {
    recommendation: string;
    reasoning: string;
    endpoints: readonly PlanEndpoint[];
    learningTip: string;
  };
  folders: readonly { path: string; note: string }[];
  deployment: PlanRecommendation;
  resources: readonly { title: string; description: string }[];
  nextSteps: readonly { title: string; detail: string }[];
};

/** A stored plan, with the answers that produced it. */
export type SavedPlan = {
  id: string;
  title: string;
  draft: PlanDraft;
  plan: GeneratedPlan;
  createdAt: string;
  updatedAt: string;
};

/** Enough to list a plan without loading its contents. */
export type PlanSummary = {
  id: string;
  title: string;
  createdAt: string;
};

/** One answered question, belonging to a plan. */
export type PlanQuestion = {
  id: string;
  question: string;
  answer: string;
  /** Which plan section the answer concerns, or null for the plan overall. */
  relatedSection: string | null;
  suggestedFollowUps: readonly string[];
  createdAt: string;
};
