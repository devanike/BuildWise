"use client";

import Link from "next/link";
import { useActionState } from "react";
import { FormField } from "@/components/shared/form-field";
import { FormMessage } from "@/components/shared/form-message";
import { SubmitButton } from "@/components/shared/submit-button";
import { useDismissibleError } from "@/lib/hooks/use-dismissible-error";
import { requestPasswordResetAction } from "@/lib/actions/auth";
import type { AuthActionState } from "@/types/auth";

export function ForgotPasswordForm() {
  const [state, formAction] = useActionState<AuthActionState, FormData>(
    requestPasswordResetAction,
    {},
  );
  const { visibleError, dismissError } = useDismissibleError(state);

  return (
    <div className="flex flex-col gap-6">
      {state.success ? (
        <FormMessage tone="success">{state.success}</FormMessage>
      ) : (
        <form
          action={formAction}
          onInput={dismissError}
          className="flex flex-col gap-5"
          noValidate
        >
          <FormField
            label="Email address"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="Enter your email"
            defaultValue={state.values?.email}
            required
          />

          {visibleError ? (
            <FormMessage tone="error">{visibleError}</FormMessage>
          ) : null}

          <SubmitButton pendingLabel="Sending your link...">
            Send reset link
          </SubmitButton>
        </form>
      )}

      <Link
        href="/sign-in"
        className="text-body-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
      >
        Return to sign in
      </Link>
    </div>
  );
}
