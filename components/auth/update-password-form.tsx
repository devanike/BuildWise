"use client";

import { CheckCircleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useActionState } from "react";
import { FormField } from "@/components/shared/form-field";
import { FormMessage } from "@/components/shared/form-message";
import { SubmitButton } from "@/components/shared/submit-button";
import { Button } from "@/components/ui/button";
import { useDismissibleError } from "@/lib/hooks/use-dismissible-error";
import { updatePasswordAction } from "@/lib/actions/auth";
import { MIN_PASSWORD_LENGTH } from "@/lib/helpers/auth-validation";
import type { AuthActionState } from "@/types/auth";

export function UpdatePasswordForm() {
  const [state, formAction] = useActionState<AuthActionState, FormData>(
    updatePasswordAction,
    {},
  );
  const { visibleError, dismissError } = useDismissibleError(state);

  if (state.success) {
    return <PasswordUpdated message={state.success} />;
  }

  return (
    <form
      action={formAction}
      onInput={dismissError}
      className="flex flex-col gap-5"
      noValidate
    >
      <FormField
        label="New password"
        name="password"
        type="password"
        autoComplete="new-password"
        placeholder="Create a new password"
        hint={`Use at least ${MIN_PASSWORD_LENGTH} characters.`}
        required
      />

      <FormField
        label="Confirm new password"
        name="confirmPassword"
        type="password"
        autoComplete="new-password"
        placeholder="Confirm your new password"
        required
      />

      {visibleError ? (
        <FormMessage tone="error">{visibleError}</FormMessage>
      ) : null}

      <SubmitButton pendingLabel="Saving your password...">
        Save new password
      </SubmitButton>
    </form>
  );
}

function PasswordUpdated({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-start gap-6 rounded-card border border-border bg-surface p-8">
      <span className="inline-flex size-12 items-center justify-center rounded-input bg-accent-soft text-accent-text">
        <CheckCircleIcon aria-hidden="true" className="size-6" />
      </span>

      <div className="flex flex-col gap-3">
        <h2 className="text-h6 font-bold text-foreground">Password updated</h2>
        <p role="status" className="text-body-sm text-muted-foreground">
          {message} You are signed in and can carry on where you left off.
        </p>
      </div>

      <Button asChild size="lg">
        <Link href="/dashboard">Return to Dashboard</Link>
      </Button>
    </div>
  );
}
