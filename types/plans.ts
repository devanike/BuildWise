export type PlanDraft = {
  projectName: string;
  projectDescription: string;
  targetUsers: string;
  coreFeatures: string[];
  authRequirement: string;
  techStack: string;
  databasePreference: string;
  apiPreference: string;
  deploymentPreference: string;
};

export type PlanFieldErrors = Partial<Record<keyof PlanDraft, string>>;

export type PlanRecommendation = {
  recommendation: string;
  reasoning: string;
  considerations: readonly string[];
  learningTip: string;
};

export type PlanEndpoint = {
  method: string;
  path: string;
  purpose: string;
};

export type PlanPath = {
  name: string;
  tagline: string;
  bestWhen: string;
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

export type GeneratedPlan = {
  project: {
    name: string;
    summary: string;
    targetUsers: string;
    scale: string;
  };
  paths: readonly PlanPath[];
  recommendedPath: number;
  recommendationReason: string;
};

export type SavedPlan = {
  id: string;
  title: string;
  draft: PlanDraft;
  plan: GeneratedPlan;
  createdAt: string;
  updatedAt: string;
};

export type PlanSummary = {
  id: string;
  title: string;
  createdAt: string;
};

export type PlanQuestion = {
  id: string;
  question: string;
  answer: string;
  relatedSection: string | null;
  pathIndex: number | null;
  suggestedFollowUps: readonly string[];
  createdAt: string;
};
