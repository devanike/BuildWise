import { NextResponse } from "next/server";
import {
  PLAN_PROGRESS_STAGES,
  type PlanStreamEvent,
} from "@/lib/constants/plan-progress";
import { readDraft, validateDraft } from "@/lib/helpers/validate-draft";
import {
  PlanGenerationError,
  generatePlan,
  planFailureMessage,
} from "@/lib/services/generate-plan";
import { createPlan } from "@/lib/services/plans";
import { createClient } from "@/lib/supabase/server";

/**
 * The ceiling for one generation, including retries.
 *
 * Measured generation is 6-8 seconds on flash-lite, and the service retries up
 * to three times, so the realistic worst case is around 25 seconds. Vercel's
 * default of 10 would kill a normal request; 60 is the Hobby maximum and leaves
 * room for a slow day.
 */
export const maxDuration = 60;

function encode(event: PlanStreamEvent): Uint8Array {
  return new TextEncoder().encode(`data: ${JSON.stringify(event)}\n\n`);
}

export async function POST(request: Request) {
  // A generation costs quota, so it is behind the same gate as the pages.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Please sign in to continue." },
      { status: 401 },
    );
  }

  const draft = readDraft(await request.json().catch(() => null));

  if (!draft) {
    return NextResponse.json(
      { error: "We couldn't read your project details. Please try again." },
      { status: 400 },
    );
  }

  const fieldErrors = validateDraft(draft);

  if (Object.keys(fieldErrors).length > 0) {
    return NextResponse.json(
      { error: "Some details are missing.", fieldErrors },
      { status: 422 },
    );
  }

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let open = true;

      const send = (event: PlanStreamEvent) => {
        if (!open) return;
        try {
          controller.enqueue(encode(event));
        } catch {
          open = false;
        }
      };

      // Progress messages keep the response flowing while the model works, so
      // the connection never looks idle and the user always sees movement.
      const timers = PLAN_PROGRESS_STAGES.map((stage) =>
        setTimeout(() => send({ type: "status", message: stage.message }), stage.at),
      );

      try {
        const plan = await generatePlan(draft, { signal: request.signal });

        // Saving is best effort. A plan that generated but failed to store is
        // still worth showing: losing it to a database error after the user
        // waited would be worse than showing it without a permanent home.
        let id: string | null = null;
        try {
          id = await createPlan(draft, plan);
        } catch (saveError) {
          console.error("[generate-plan] could not save", saveError);
        }

        send({ type: "plan", plan, id });
      } catch (error) {
        if (error instanceof PlanGenerationError) {
          // Detail goes to the server log; the user gets the friendly version.
          console.error("[generate-plan]", error.kind, error.message, error.problems);
          send({
            type: "error",
            kind: error.kind,
            message: planFailureMessage(error),
          });
        } else {
          console.error("[generate-plan] unexpected", error);
          send({
            type: "error",
            kind: "unavailable",
            message: "We couldn't generate your backend plan. Please try again.",
          });
        }
      } finally {
        timers.forEach(clearTimeout);
        open = false;
        try {
          controller.close();
        } catch {
          // Already closed because the client disconnected.
        }
      }
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": "text/event-stream; charset=utf-8",
      "cache-control": "no-cache, no-transform",
      connection: "keep-alive",
    },
  });
}
