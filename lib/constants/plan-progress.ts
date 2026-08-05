export const PLAN_PROGRESS_STAGES = [
  { at: 0, message: "Analysing your requirements" },
  { at: 2500, message: "Planning your backend architecture" },
  { at: 5500, message: "Choosing technologies and explaining why" },
  { at: 9000, message: "Preparing your recommendations" },
  { at: 14000, message: "Almost done" },
] as const;

export type PlanStreamEvent =
  | { type: "status"; message: string }
  | { type: "plan"; plan: unknown; id: string | null }
  | { type: "error"; kind: string; message: string };
