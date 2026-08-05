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

type QuestionRow = {
  id: string;
  question: string;
  answer: string;
  related_section: string | null;
  suggested_follow_ups: unknown;
  created_at: string;
};

function toQuestion(row: QuestionRow): PlanQuestion {
  return {
    id: row.id,
    question: row.question,
    answer: row.answer,
    relatedSection: row.related_section,
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
    .select("id, question, answer, related_section, suggested_follow_ups, created_at")
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

  const history = await listQuestions(planId);

  let answer: {
    answer?: unknown;
    relatedSection?: unknown;
    suggestedFollowUps?: unknown;
  };

  try {
    answer = await generateJson({
      systemPrompt: QUESTION_SYSTEM_PROMPT,
      userPrompt: buildQuestionPrompt({ plan, history, question }),
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
      related_section:
        typeof answer.relatedSection === "string" &&
        answer.relatedSection !== "general"
          ? answer.relatedSection
          : null,
      suggested_follow_ups: followUps,
    })
    .select("id, question, answer, related_section, suggested_follow_ups, created_at")
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
