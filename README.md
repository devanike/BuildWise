# BuildWise AI

An AI-powered backend mentor for beginner developers. You describe what you want to build; BuildWise returns two complete architectural paths and explains the reasoning behind every recommendation, so you learn to make the decision yourself next time.

It is deliberately **not** a code generator. The output is a plan you can reason about, argue with, and ask follow-up questions on.

---

## What it does

- **Two paths per plan, not one.** Every generated plan offers two ways to build the same thing — each named after the trade-off it makes ("the simple path", "the scalable path"), with a tagline naming what it optimises for and what it costs, and a `bestWhen` line describing the situation it suits.
- **Reasoning, not just recommendations.** Each decision — architecture, authentication, database, API, deployment — carries the choice, why it suits *this* project, the alternative that was rejected and why, two to four genuine trade-offs, and one concept to go and learn.
- **Follow-up questions.** Ask about any section of a generated plan and get an answer scoped to that plan, with suggested next questions.
- **Persistence and accounts.** Plans are saved per user and can be revisited.

## Tech stack

**Frontend** — Next.js (App Router), TypeScript, TailwindCSS, Radix UI, Framer Motion, Heroicons
**Backend** — Next.js route handlers, Supabase (Postgres + Auth), Google Gemini
**Deployment** — Vercel

---

## Architecture

### Schema-constrained generation

The core design decision is that the model is **structurally constrained rather than parsed hopefully**. Requests go to the Gemini API with `responseMimeType: "application/json"` and a hand-authored `responseSchema`, so the response shape is enforced at generation time instead of being validated after the fact.

The schema itself does most of the prompt engineering. Field descriptions carry the instruction:

```
considerations: "Two to four trade-offs the reader could not already work out
from the recommendation itself. Each must be something that costs them,
constrains them, or that they would otherwise get wrong. Do not restate what
the recommendation is, and do not list its benefits. Two genuine items are
better than four with padding."
```

Putting the constraint next to the field it governs keeps instruction and structure from drifting apart, and makes each rule enforceable at the point it applies. The API section goes further and constrains *consistency*: if the model recommends server actions rather than HTTP routes, the endpoint list must be expressed in that approach's own terms rather than inventing REST paths alongside it.

`lib/constants/plan-schema.ts` — plan structure
`lib/constants/question-schema.ts` — follow-up structure

### Reliability

Generation is a paid, rate-limited, occasionally-flaky network call, so the service is built around it failing:

| Concern | Handling |
|---|---|
| Transient failures | 3 attempts with linear backoff, classifying 5xx and `400 invalid argument` as retryable |
| Rate limiting | `retryAfter` parsed out of the provider's message and surfaced to the user in human terms |
| Error taxonomy | Typed `GeminiError` — `not-configured`, `rate-limited`, `unavailable`, `invalid-response` |
| Malformed output | Every response passes `validatePlan` before it leaves the service |
| Timeouts | `maxDuration = 60` — measured generation is ~25s for two paths; Vercel's default of 10s would kill every request. See the note below on retries. |

A normal generation runs comfortably inside the 60s ceiling. Three failed attempts would not: at ~25s each plus backoff, the worst case runs past the limit and the function is killed mid-request rather than returning the friendly error the retry logic exists to produce. It has not been hit in practice, because a transient failure has always cleared on the second attempt. The honest fix is to make the retry budget aware of elapsed time rather than counting attempts.

### Streaming

Generation takes long enough that a silent connection looks broken. The route returns **Server-Sent Events**, emitting staged progress messages on a timer while the model works, then the finished plan. The connection never looks idle and the user always sees movement.

### Graceful degradation

Saving is deliberately best-effort. A plan that generated but failed to persist is still returned to the user:

> Losing it to a database error after the user waited would be worse than showing it without a permanent home.

The failure is logged; the user still gets their plan.

### Data layer

Postgres via Supabase, with schema changes tracked as ordered migrations:

- `plans` — draft input and generated plan as `jsonb`, keyed to `auth.users` with `on delete cascade`, indexed on `(user_id, created_at desc)` for the dashboard query
- `plan_questions` — follow-ups scoped to a plan, with **row-level security** so users can only read and write their own
- A later migration adds `path_index` to questions, so a follow-up knows which of the two paths it refers to — nullable, because questions asked before multi-path plans existed have no path

### Key handling

`lib/services/gemini.ts` is `server-only`. The API key is read from `GEMINI_API_KEY` and the missing-key error states explicitly that it must not carry the `NEXT_PUBLIC_` prefix, which would ship it to the browser.

---

## Project layout

```
app/
  api/plans/generate/route.ts      SSE generation endpoint
  api/plans/[id]/questions/route.ts Follow-up questions
  (auth)/                          Sign in, sign up, password reset
  plans/[id]/                      A saved plan: paths, sections, questions
  create-plan/  saved-plans/  dashboard/  settings/
  generated-plan/                  Static worked example
lib/
  services/     gemini.ts, generate-plan.ts, plans.ts, questions.ts
  constants/    plan-schema.ts, plan-prompt.ts, question-schema.ts
  helpers/      validate-plan.ts, validate-draft.ts, require-user.ts
  supabase/     client, server, middleware
supabase/migrations/               Ordered SQL migrations
```

---

## Running locally

```bash
npm install
cp .env.example .env.local   # add GEMINI_API_KEY and Supabase credentials
npm run dev
```

Apply the migrations in `supabase/migrations/` to your Supabase project in filename order.

---

## Status

MVP. Generation, follow-up questions, authentication, persistence, saved plans and settings are implemented.

Interface work is verified rather than assumed: zero axe-core violations across four pages in each of three themes, and no horizontal overflow from 320px upwards.
