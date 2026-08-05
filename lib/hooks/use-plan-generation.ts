"use client";

import { useCallback, useRef, useState } from "react";
import type { PlanStreamEvent } from "@/lib/constants/plan-progress";
import { validatePlan } from "@/lib/helpers/validate-plan";
import type { GeneratedPlan, PlanDraft, PlanFieldErrors } from "@/types/plans";

type Status = "idle" | "generating" | "done" | "error";

export function usePlanGeneration() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [plan, setPlan] = useState<GeneratedPlan | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<PlanFieldErrors>({});
  const abortRef = useRef<AbortController | null>(null);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setStatus("idle");
    setMessage("");
    setPlan(null);
    setSavedId(null);
    setError("");
    setFieldErrors({});
  }, []);

  const generate = useCallback(async (draft: PlanDraft) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setStatus("generating");
    setMessage("Analysing your requirements");
    setPlan(null);
    setSavedId(null);
    setError("");
    setFieldErrors({});

    let response: Response;

    try {
      response = await fetch("/api/plans/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(draft),
        signal: controller.signal,
      });
    } catch {
      if (controller.signal.aborted) return;
      setStatus("error");
      setError("We couldn't reach the server. Please check your connection and try again.");
      return;
    }

    if (!response.ok || !response.body) {
      const body = await response.json().catch(() => null);
      setStatus("error");
      setError(body?.error ?? "We couldn't generate your backend plan. Please try again.");
      if (body?.fieldErrors) setFieldErrors(body.fieldErrors);
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;

          let event: PlanStreamEvent;
          try {
            event = JSON.parse(line.slice(6));
          } catch {
            continue;
          }

          if (event.type === "status") {
            setMessage(event.message);
          } else if (event.type === "error") {
            setStatus("error");
            setError(event.message);
          } else if (event.type === "plan") {
            const result = validatePlan(event.plan);
            if (result.ok) {
              setPlan(result.plan);
              setSavedId(event.id);
              setStatus("done");
            } else {
              setStatus("error");
              setError("We couldn't generate your backend plan. Please try again.");
            }
          }
        }
      }
    } catch {
      if (controller.signal.aborted) return;
      setStatus("error");
      setError("The connection was interrupted. Please try again.");
    }
  }, []);

  return {
    status,
    message,
    plan,
    savedId,
    error,
    fieldErrors,
    isGenerating: status === "generating",
    generate,
    reset,
  };
}
