"use client";

import { useState } from "react";
import type { AuthActionState } from "@/types/auth";

export function useDismissibleError(state: AuthActionState) {
  const [dismissedNonce, setDismissedNonce] = useState<number | null>(null);

  const visibleError =
    state.error && state.nonce !== dismissedNonce ? state.error : null;

  function dismissError() {
    if (state.error) setDismissedNonce(state.nonce ?? null);
  }

  return { visibleError, dismissError };
}
