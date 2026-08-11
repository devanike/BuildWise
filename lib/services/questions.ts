import "server-only";
import {
  QUESTION_SYSTEM_PROMPT,
  buildQuestionPrompt,
} from "@/lib/constants/question-prompt";
import { QUESTION_RESPONSE_SCHEMA } from "@/lib/constants/question-schema";
import { GeminiError, generateJson } from "@/lib/services/gemini";
import { createClient } from "@/lib/supabase/server";
import type { GeneratedPlan, PlanQuestion } from "@/types/plans";

const MAX_QUESTION_LENGTH = 400;

const COLUMNS =
  "id, question, answer, related_section, path_index, suggested_follow_ups, created_at";

type QuestionRow = {
  id: string;
  question: string;
  answer: string;
  related_section: string | null;
  path_index: number | null;
  suggested_follow_ups: unknown;
  created_at: string;
};

function toQuestion(row: QuestionRow): PlanQuestion {
  return {
    id: row.id,
    question: row.question,
    answer: row.answer,
    relatedSection: row.related_section,
    pathIndex: row.path_index,
    suggestedFollowUps: Array.isArray(row.suggested_follow_ups)
      ? (row.suggested_follow_ups as string[]).filter(
          (item) => typeof item === "string",
        )
      : [],
    createdAt: row.created_at,
  };
}

export async function listQuestions(planId: string): Promise<PlanQuestion[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("plan_questions")
    .select(COLUMNS)
    .eq("plan_id", planId)
    .order("created_at", { ascending: true })
    .returns<QuestionRow[]>();

  if (error || !data) return [];

  return data.map(toQuestion);
}

export type AskResult =
  | { ok: true; question: PlanQuestion }
  | { ok: false; message: string };

export async function askQuestion(
  planId: string,
  rawQuestion: string,
  plan: GeneratedPlan,
  pathIndex: number,
): Promise<AskResult> {
  const question = rawQuestion.trim().slice(0, MAX_QUESTION_LENGTH);

  if (!question) {
    return { ok: false, message: "Please enter a question before continuing." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, message: "Please sign in to continue." };
  }

  const path = plan.paths[pathIndex] ?? plan.paths[0];

  if (!path) {
    return { ok: false, message: "We couldn't find that plan. Please try again." };
  }

  const history = (await listQuestions(planId)).filter(
    (entry) => (entry.pathIndex ?? 0) === pathIndex,
  );

  let answer: {
    answer?: unknown;
    relatedSection?: unknown;
    suggestedFollowUps?: unknown;
  };

  try {
    answer = await generateJson({
      systemPrompt: QUESTION_SYSTEM_PROMPT,
      userPrompt: buildQuestionPrompt({
        project: plan.project,
        path,
        history,
        question,
      }),
      schema: QUESTION_RESPONSE_SCHEMA,
      maxOutputTokens: 2048,
    });
  } catch (error) {
    if (error instanceof GeminiError && error.kind === "rate-limited") {
      return {
        ok: false,
        message:
          "We are handling a lot of requests right now. Please try again in a moment.",
      };
    }
    console.error("[ask-question]", error);
    return {
      ok: false,
      message: "We couldn't answer that just now. Please try again.",
    };
  }

  if (typeof answer.answer !== "string" || !answer.answer.trim()) {
    return {
      ok: false,
      message: "We couldn't answer that just now. Please try again.",
    };
  }

  const followUps = Array.isArray(answer.suggestedFollowUps)
    ? answer.suggestedFollowUps
        .filter((item): item is string => typeof item === "string")
        .slice(0, 3)
    : [];

  const { data, error } = await supabase
    .from("plan_questions")
    .insert({
      plan_id: planId,
      user_id: user.id,
      question,
      answer: answer.answer.trim(),
      path_index: pathIndex,
      related_section:
        typeof answer.relatedSection === "string" &&
        answer.relatedSection !== "general"
          ? answer.relatedSection
          : null,
      suggested_follow_ups: followUps,
    })
    .select(COLUMNS)
    .single<QuestionRow>();

  if (error || !data) {
    console.error("[ask-question] could not save", error);
    return {
      ok: false,
      message: "We answered your question but could not save it. Please try again.",
    };
  }

  return { ok: true, question: toQuestion(data) };
}
