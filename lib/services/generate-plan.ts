import "server-only";

import { PLAN_RESPONSE_SCHEMA } from "@/lib/constants/plan-schema";
import { PLAN_SYSTEM_PROMPT, buildPlanPrompt } from "@/lib/constants/plan-prompt";
import { validatePlan } from "@/lib/helpers/validate-plan";
import { GeminiError, generateJson } from "@/lib/services/gemini";
import type { GeneratedPlan, PlanDraft } from "@/types/plans";

export type PlanFailureKind =
  | "not-configured"
  | "rate-limited"
  | "unavailable"
  | "invalid-response";

export class PlanGenerationError extends Error {
  readonly kind: PlanFailureKind;
  /** Validation detail, for logs. Never shown to the user. */
  readonly problems?: string[];
  /** Seconds to wait, when rate limited. */
  readonly retryAfter?: number;

  constructor(
    kind: PlanFailureKind,
    message: string,
    options: { problems?: string[]; retryAfter?: number } = {},
  ) {
    super(message);
    this.name = "PlanGenerationError";
    this.kind = kind;
    this.problems = options.problems;
    this.retryAfter = options.retryAfter;
  }
}

/** Turns a failure into copy the user can act on. */
export function planFailureMessage(error: PlanGenerationError): string {
  if (error.kind === "rate-limited" && error.retryAfter) {
    const wait =
      error.retryAfter < 90
        ? "about a minute"
        : `about ${Math.ceil(error.retryAfter / 60)} minutes`;
    return `We are handling a lot of requests right now. Please try again in ${wait}.`;
  }

  return PLAN_FAILURE_MESSAGES[error.kind];
}

/** Beginner-friendly copy, following CONTENT_GUIDELINES.md. */
export const PLAN_FAILURE_MESSAGES: Record<PlanFailureKind, string> = {
  "not-configured":
    "Plan generation is not set up yet. Please try again later.",
  "rate-limited":
    "We are handling a lot of requests right now. Please wait a moment and try again.",
  unavailable: "We couldn't generate your backend plan. Please try again.",
  "invalid-response":
    "We couldn't generate your backend plan. Please try again.",
};

/**
 * Turns a user's answers into a validated backend plan.
 *
 * Everything the model returns passes through `validatePlan` before it leaves
 * this function, so callers can trust the shape and never have to defend
 * against a half-formed plan.
 */
export async function generatePlan(
  draft: PlanDraft,
  options: { signal?: AbortSignal } = {},
): Promise<GeneratedPlan> {
  let raw: unknown;

  try {
    raw = await generateJson({
      systemPrompt: PLAN_SYSTEM_PROMPT,
      userPrompt: buildPlanPrompt(draft),
      schema: PLAN_RESPONSE_SCHEMA,
      signal: options.signal,
    });
  } catch (error) {
    if (error instanceof GeminiError) {
      throw new PlanGenerationError(error.kind, error.message, {
        retryAfter: error.retryAfter,
      });
    }
    throw error;
  }

  const result = validatePlan(raw);

  if (!result.ok) {
    throw new PlanGenerationError(
      "invalid-response",
      "The generated plan did not match the expected structure.",
      { problems: result.problems },
    );
  }

  return result.plan;
}
