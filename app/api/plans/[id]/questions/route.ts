import { NextResponse } from "next/server";
import { getPlan } from "@/lib/services/plans";
import { askQuestion } from "@/lib/services/questions";
import { createClient } from "@/lib/supabase/server";

/** An answer is short, but still a model call. Comfortably above the default. */
export const maxDuration = 60;

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
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

  const { id } = await params;

  // Loaded here rather than trusted from the request. Row Level Security means
  // a plan belonging to someone else simply is not found, so this doubles as
  // the ownership check.
  const saved = await getPlan(id);

  if (!saved) {
    return NextResponse.json({ error: "Plan not found." }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const question = typeof body?.question === "string" ? body.question : "";

  const result = await askQuestion(id, question, saved.plan);

  if (!result.ok) {
    return NextResponse.json({ error: result.message }, { status: 400 });
  }

  return NextResponse.json({ question: result.question });
}
