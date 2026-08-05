"use client";

import {
  ArrowUpIcon,
  ChevronDownIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { useState } from "react";
import { FormMessage } from "@/components/shared/form-message";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/cn";
import type { PlanQuestion } from "@/types/plans";

const OPENING_QUESTIONS = [
  "Why was this database chosen?",
  "Could I use something else instead?",
  "How would this handle more users?",
];

const SECTION_LABELS: Record<string, string> = {
  architecture: "Recommended architecture",
  authentication: "Authentication strategy",
  database: "Database recommendation",
  api: "API structure",
  folders: "Suggested folder structure",
  deployment: "Deployment recommendation",
  "next-steps": "Next steps",
  resources: "What to read next",
};

export function PlanQuestions({
  planId,
  initialQuestions,
}: {
  planId: string;
  initialQuestions: PlanQuestion[];
}) {
  const [questions, setQuestions] = useState(initialQuestions);
  const [draft, setDraft] = useState("");
  const [open, setOpen] = useState<string[]>([]);
  const [isAsking, setIsAsking] = useState(false);
  const [error, setError] = useState("");

  const suggestions =
    questions.length > 0
      ? questions[questions.length - 1].suggestedFollowUps
      : OPENING_QUESTIONS;

  async function ask(text: string) {
    const question = text.trim();
    if (!question || isAsking) return;

    setIsAsking(true);
    setError("");
    setDraft("");

    try {
      const response = await fetch(`/api/plans/${planId}/questions`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ question }),
      });

      const body = await response.json().catch(() => null);

      if (!response.ok || !body?.question) {
        setError(body?.error ?? "We couldn't answer that just now. Please try again.");
        setDraft(question);
        return;
      }

      const next = body.question as PlanQuestion;
      setQuestions((current) => [...current, next]);
      setOpen((current) => [...current, next.id]);
    } catch {
      setError("We couldn't reach the server. Please try again.");
      setDraft(question);
    } finally {
      setIsAsking(false);
    }
  }

  return (
    <section
      aria-labelledby="questions-heading"
      className="flex flex-col gap-6 border-t border-border pt-10"
    >
      <div className="flex flex-col gap-2">
        <span className="text-body-xs font-semibold uppercase tracking-[0.16em] text-accent-text">
          Questions
        </span>
        <h2
          id="questions-heading"
          className="text-h5 font-bold text-foreground md:text-h4"
        >
          Ask about this plan
        </h2>
        <p className="max-w-2xl text-body text-muted-foreground">
          Anything here you would like explained further? Answers stay with this
          plan, so you can come back to them.
        </p>
      </div>

      {questions.length > 0 ? (
        <AccordionPrimitive.Root
          type="multiple"
          value={open}
          onValueChange={setOpen}
          className="flex flex-col divide-y divide-border border-y border-border"
        >
          {questions.map((entry) => (
            <AccordionPrimitive.Item key={entry.id} value={entry.id}>
              <AccordionPrimitive.Header>
                <AccordionPrimitive.Trigger className="group flex w-full items-start gap-4 py-5 text-left transition-colors duration-200 hover:text-accent-text">
                  <QuestionMarkCircleIcon
                    aria-hidden="true"
                    className="mt-0.5 size-5 shrink-0 text-subtle-foreground transition-colors duration-200 group-hover:text-accent-text group-data-[state=open]:text-accent-text"
                  />
                  <span className="min-w-0 flex-1 text-body font-medium text-foreground transition-colors duration-200 group-hover:text-accent-text group-data-[state=open]:text-accent-text">
                    {entry.question}
                  </span>
                  <ChevronDownIcon
                    aria-hidden="true"
                    className="mt-0.5 size-5 shrink-0 text-subtle-foreground transition-transform duration-300 group-data-[state=open]:rotate-180"
                  />
                </AccordionPrimitive.Trigger>
              </AccordionPrimitive.Header>

              <AccordionPrimitive.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                <div className="flex flex-col gap-3 pb-6 pl-9 pr-4">
                  <p className="max-w-3xl text-body text-muted-foreground">
                    {entry.answer}
                  </p>

                  {entry.relatedSection &&
                  SECTION_LABELS[entry.relatedSection] ? (
                    <a
                      href={`#${entry.relatedSection}`}
                      className="inline-flex w-fit items-center gap-1.5 text-body-sm font-medium text-accent-text underline-offset-4 transition-opacity duration-200 hover:opacity-80 hover:underline"
                    >
                      Read {SECTION_LABELS[entry.relatedSection]}
                    </a>
                  ) : null}
                </div>
              </AccordionPrimitive.Content>
            </AccordionPrimitive.Item>
          ))}
        </AccordionPrimitive.Root>
      ) : null}

      {error ? <FormMessage tone="error">{error}</FormMessage> : null}

      <form
        onSubmit={(event) => {
          event.preventDefault();
          void ask(draft);
        }}
        className="flex flex-col gap-4"
      >
        <div className="relative">
          <label htmlFor="plan-question" className="sr-only">
            Ask a question about this plan
          </label>
          <Input
            id="plan-question"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            disabled={isAsking}
            maxLength={400}
            placeholder={
              isAsking ? "Working on your answer..." : "Ask a question"
            }
            className="pr-14"
          />
          <button
            type="submit"
            disabled={isAsking || !draft.trim()}
            aria-label="Ask this question"
            className={cn(
              "absolute right-2 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-button",
              "bg-accent text-accent-foreground transition-colors duration-200",
              "hover:bg-accent-hover",
              "disabled:pointer-events-none disabled:opacity-40",
            )}
          >
            <ArrowUpIcon aria-hidden="true" className="size-4" />
          </button>
        </div>

        {suggestions.length > 0 && !isAsking ? (
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => void ask(suggestion)}
                className="rounded-badge border border-border px-3.5 py-1.5 text-body-sm text-muted-foreground transition-colors duration-200 hover:border-accent-line hover:bg-accent-soft hover:text-accent-text"
              >
                {suggestion}
              </button>
            ))}
          </div>
        ) : null}
      </form>

      <span aria-live="polite" className="sr-only">
        {isAsking ? "Working on your answer" : ""}
      </span>
    </section>
  );
}
