import "server-only";

export const GEMINI_MODEL = "gemini-flash-lite-latest";
export const GEMINI_THINKING_ENABLED = false;

const THINKING_OFF_BUDGET = 512;

const ENDPOINT = "https://generativelanguage.googleapis.com/v1beta";

const MAX_ATTEMPTS = 3;

export type GeminiErrorKind =
  | "not-configured"
  | "rate-limited"
  | "unavailable"
  | "invalid-response";

export class GeminiError extends Error {
  readonly kind: GeminiErrorKind;
  readonly retryAfter?: number;

  constructor(kind: GeminiErrorKind, message: string, retryAfter?: number) {
    super(message);
    this.name = "GeminiError";
    this.kind = kind;
    this.retryAfter = retryAfter;
  }
}

function retryAfterSeconds(message: string): number | undefined {
  const match = message.match(/retry in ([\d.]+)s/i);
  if (!match) return undefined;
  return Math.ceil(Number(match[1]));
}

function getGeminiKey(): string {
  const key = process.env.GEMINI_API_KEY;

  if (!key) {
    throw new GeminiError(
      "not-configured",
      "GEMINI_API_KEY is not set. Copy .env.example to .env.local and add your key. " +
        "Do not prefix it with NEXT_PUBLIC_, which would expose it to the browser.",
    );
  }

  return key;
}

function isTransient(status: number, message: string): boolean {
  if (status >= 500) return true;
  return status === 400 && /invalid argument/i.test(message);
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function generateJson<T = unknown>({
  systemPrompt,
  userPrompt,
  schema,
  maxOutputTokens = 8192,
  signal,
}: {
  systemPrompt: string;
  userPrompt: string;
  schema: unknown;
  maxOutputTokens?: number;
  signal?: AbortSignal;
}): Promise<T> {
  const key = getGeminiKey();

  const body = JSON.stringify({
    systemInstruction: { parts: [{ text: systemPrompt }] },
    contents: [{ role: "user", parts: [{ text: userPrompt }] }],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: schema,
      maxOutputTokens,
      ...(GEMINI_THINKING_ENABLED
        ? {}
        : { thinkingConfig: { thinkingBudget: THINKING_OFF_BUDGET } }),
    },
  });

  let lastMessage = "";

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    let response: Response;

    try {
      response = await fetch(
        `${ENDPOINT}/models/${GEMINI_MODEL}:generateContent?key=${key}`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body,
          signal,
        },
      );
    } catch (error) {
      if (signal?.aborted) throw error;
      lastMessage = error instanceof Error ? error.message : "Network error";
      if (attempt === MAX_ATTEMPTS) {
        throw new GeminiError("unavailable", lastMessage);
      }
      await sleep(attempt * 1000);
      continue;
    }

    const payload = await response.json().catch(() => null);

    if (response.ok) {
      const raw = payload?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (typeof raw !== "string") {
        throw new GeminiError(
          "invalid-response",
          "The model returned no content.",
        );
      }

      try {
        return JSON.parse(raw) as T;
      } catch {
        throw new GeminiError(
          "invalid-response",
          "The model returned text that was not valid JSON.",
        );
      }
    }

    lastMessage = payload?.error?.message ?? `HTTP ${response.status}`;

    if (attempt < MAX_ATTEMPTS && isTransient(response.status, lastMessage)) {
      await sleep(attempt * 1000);
      continue;
    }

    if (response.status === 429) {
      throw new GeminiError("rate-limited", lastMessage, retryAfterSeconds(lastMessage));
    }

    throw new GeminiError("unavailable", lastMessage);
  }

  throw new GeminiError("unavailable", lastMessage);
}
