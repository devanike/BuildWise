"use client";

import { useActionState } from "react";
import { FormField } from "@/components/shared/form-field";
import { FormMessage } from "@/components/shared/form-message";
import { SubmitButton } from "@/components/shared/submit-button";
import { changePasswordAction } from "@/lib/actions/profile";
import { useDismissibleError } from "@/lib/hooks/use-dismissible-error";
import { MIN_PASSWORD_LENGTH } from "@/lib/helpers/auth-validation";
import type { AuthActionState } from "@/types/auth";

export function PasswordForm() {
  const [state, formAction] = useActionState<AuthActionState, FormData>(
    changePasswordAction,
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
        id="currentPassword"
        name="currentPassword"
        type="password"
        label="Current password"
        autoComplete="current-password"
        required
      />

      <FormField
        id="password"
        name="password"
        type="password"
        label="New password"
        hint={`At least ${MIN_PASSWORD_LENGTH} characters.`}
        autoComplete="new-password"
        required
      />

      <FormField
        id="confirmPassword"
        name="confirmPassword"
        type="password"
        label="Confirm new password"
        autoComplete="new-password"
        required
      />

      <SubmitButton pendingLabel="Updating">Update password</SubmitButton>
    </form>
  );
}
