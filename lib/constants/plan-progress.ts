export const PLAN_PROGRESS_STAGES = [
  { at: 0, message: "Analysing your requirements" },
  { at: 3000, message: "Planning your backend architecture" },
  { at: 8000, message: "Working out a second way to build it" },
  { at: 14000, message: "Comparing the trade-offs between them" },
  { at: 20000, message: "Preparing your recommendations" },
  { at: 27000, message: "Almost done" },
] as const;

export type PlanStreamEvent =
  | { type: "status"; message: string }
  | { type: "plan"; plan: unknown; id: string | null }
  | { type: "error"; kind: string; message: string };
