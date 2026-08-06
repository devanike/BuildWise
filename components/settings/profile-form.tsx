"use client";

import { useActionState } from "react";
import { FormField } from "@/components/shared/form-field";
import { FormMessage } from "@/components/shared/form-message";
import { SubmitButton } from "@/components/shared/submit-button";
import { useDismissibleError } from "@/lib/hooks/use-dismissible-error";
import { updateNameAction } from "@/lib/actions/profile";
import type { AuthActionState } from "@/types/auth";

export function ProfileForm({
  name,
  email,
}: {
  name: string;
  email: string;
}) {
  const [state, formAction] = useActionState<AuthActionState, FormData>(
    updateNameAction,
    {},
  );
  const { visibleError, dismissError } = useDismissibleError(state);

  return (
    <form
      action={formAction}
      onInput={dismissError}
      className="flex flex-col gap-5"
    >
      {visibleError ? (
        <FormMessage tone="error">{visibleError}</FormMessage>
      ) : null}
      {state.success ? (
        <FormMessage tone="success">{state.success}</FormMessage>
      ) : null}

      <FormField
        id="name"
        name="name"
        label="Display name"
        defaultValue={name}
        autoComplete="name"
        required
      />

      <div className="flex flex-col gap-2">
        <span className="text-body-sm font-medium text-foreground">
          Email address
        </span>
        <p className="rounded-input border border-border bg-background/50 px-4 py-3 text-body text-muted-foreground">
          {email}
        </p>
        <p className="text-body-xs text-subtle-foreground">
          Your email address is how you sign in, so it cannot be changed here.
        </p>
      </div>

      <SubmitButton pendingLabel="Saving">Save changes</SubmitButton>
    </form>
  );
}
