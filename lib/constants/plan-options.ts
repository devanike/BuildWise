export const NO_PREFERENCE = "no-preference";

export const AUTH_REQUIREMENT_OPTIONS = [
  { value: "email-password", label: "Email and password" },
  { value: "email-social", label: "Email and social sign in" },
  { value: "social-only", label: "Social sign in only" },
  { value: "roles", label: "Accounts with different roles or permissions" },
  { value: "none", label: "No accounts needed" },
  { value: "unsure", label: "I am not sure yet" },
] as const;

export const DATABASE_OPTIONS = [
  { value: NO_PREFERENCE, label: "No preference" },
  { value: "relational", label: "Relational, such as PostgreSQL" },
  { value: "document", label: "Document, such as MongoDB" },
  { value: "unsure", label: "I am not sure yet" },
] as const;

export const API_OPTIONS = [
  { value: NO_PREFERENCE, label: "No preference" },
  { value: "rest", label: "REST" },
  { value: "graphql", label: "GraphQL" },
  { value: "unsure", label: "I am not sure yet" },
] as const;

export const DEPLOYMENT_OPTIONS = [
  { value: NO_PREFERENCE, label: "No preference" },
  { value: "managed", label: "Managed platform, such as Vercel" },
  { value: "container", label: "Containers, such as Docker" },
  { value: "traditional", label: "A traditional server" },
  { value: "unsure", label: "I am not sure yet" },
] as const;
