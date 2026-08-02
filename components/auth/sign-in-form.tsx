"use client";

import Link from "next/link";
import { useActionState } from "react";
import { AuthDivider } from "@/components/auth/auth-divider";
import { GoogleAuthButton } from "@/components/auth/google-auth-button";
import { FormField } from "@/components/shared/form-field";
import { FormMessage } from "@/components/shared/form-message";
import { SubmitButton } from "@/components/shared/submit-button";
import { useDismissibleError } from "@/lib/hooks/use-dismissible-error";
import { signInAction } from "@/lib/actions/auth";
import type { AuthActionState } from "@/types/auth";

export function SignInForm({
  redirectTo,
  linkError,
}: {
  redirectTo?: string;
  linkError?: boolean;
}) {
  const [state, formAction] = useActionState<AuthActionState, FormData>(
    signInAction,
    {},
  );
  const { visibleError, dismissError } = useDismissibleError(state);

  return (
    <div className="flex flex-col gap-6">
      {linkError && !visibleError ? (
        <FormMessage tone="error">
          That link is no longer valid. Please sign in, or request a new link.
        </FormMessage>
      ) : null}

      <form
        action={formAction}
        onInput={dismissError}
        className="flex flex-col gap-5"
        noValidate
      >
        {redirectTo ? (
          <input type="hidden" name="redirectTo" value={redirectTo} />
        ) : null}

        <FormField
          label="Email address"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="Enter your email"
          defaultValue={state.values?.email}
          required
        />

        <div className="flex flex-col gap-2">
          <FormField
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            required
          />
          <Link
            href="/forgot-password"
            className="self-end text-body-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
          >
            Forgot password?
          </Link>
        </div>

        {visibleError ? (
          <FormMessage tone="error">{visibleError}</FormMessage>
        ) : null}

        <SubmitButton pendingLabel="Signing you in...">Sign In</SubmitButton>
      </form>

      <AuthDivider />

      <GoogleAuthButton redirectTo={redirectTo} />
    </div>
  );
}
