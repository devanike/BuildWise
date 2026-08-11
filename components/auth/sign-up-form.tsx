"use client";

import { EnvelopeIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useActionState, useState } from "react";
import { AuthDivider } from "@/components/auth/auth-divider";
import { GoogleAuthButton } from "@/components/auth/google-auth-button";
import { FormField } from "@/components/shared/form-field";
import { FormMessage } from "@/components/shared/form-message";
import { SubmitButton } from "@/components/shared/submit-button";
import { Button } from "@/components/ui/button";
import { useDismissibleError } from "@/lib/hooks/use-dismissible-error";
import { signUpAction } from "@/lib/actions/auth";
import { MIN_PASSWORD_LENGTH, validateEmail } from "@/lib/helpers/auth-validation";
import type { AuthActionState } from "@/types/auth";

export function SignUpForm() {
  const [state, formAction] = useActionState<AuthActionState, FormData>(
    signUpAction,
    {},
  );
  const [step, setStep] = useState<"email" | "details">("email");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const { visibleError, dismissError } = useDismissibleError(state);

  if (state.success) {
    return <VerificationNotice message={state.success} email={email} />;
  }

  function handleEmailStep(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const error = validateEmail(email);

    if (error) {
      setEmailError(error);
      return;
    }

    setEmailError(null);
    setStep("details");
  }

  return (
    <div className="flex flex-col gap-6">
      <StepIndicator step={step} />

      {step === "email" ? (
        <>
          <form onSubmit={handleEmailStep} className="flex flex-col gap-5" noValidate>
            <FormField
              label="Email address"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              aria-invalid={emailError ? true : undefined}
              required
            />

            {emailError ? (
              <FormMessage tone="error">{emailError}</FormMessage>
            ) : null}

            <Button type="submit" size="lg" block>
              Continue
            </Button>
          </form>

          <AuthDivider />

          <GoogleAuthButton />
        </>
      ) : (
        <form
          action={formAction}
          onInput={dismissError}
          className="flex flex-col gap-5"
          noValidate
        >
          <input type="hidden" name="email" value={email} />

          <div className="flex items-center justify-between gap-4 rounded-input border border-border bg-surface px-4 py-3">
            <span className="truncate text-body-sm text-muted-foreground">
              {email}
            </span>
            <button
              type="button"
              onClick={() => setStep("email")}
              className="shrink-0 text-body-sm font-medium text-accent-text underline-offset-4 transition-opacity duration-200 hover:opacity-80 hover:underline"
            >
              Change
            </button>
          </div>

          <FormField
            label="Name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Enter your name"
            defaultValue={state.values?.name}
            autoFocus
            required
          />

          <FormField
            label="Password"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="Create a password"
            hint={`Use at least ${MIN_PASSWORD_LENGTH} characters.`}
            required
          />

          <FormField
            label="Confirm password"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            placeholder="Confirm your password"
            required
          />

          {visibleError ? (
            <FormMessage tone="error">{visibleError}</FormMessage>
          ) : null}

          <SubmitButton pendingLabel="Creating your account...">
            Create Account
          </SubmitButton>
        </form>
      )}
    </div>
  );
}

function StepIndicator({ step }: { step: "email" | "details" }) {
  const current = step === "email" ? 1 : 2;

  return (
    <div className="flex items-center gap-3">
      <span className="text-body-xs font-medium text-subtle-foreground">
        Step {current} of 2
      </span>
      <span aria-hidden="true" className="flex flex-1 gap-1.5">
        {[1, 2].map((index) => (
          <span
            key={index}
            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
              index <= current ? "bg-accent" : "bg-surface-hover"
            }`}
          />
        ))}
      </span>
    </div>
  );
}

function VerificationNotice({
  message,
  email,
}: {
  message: string;
  email: string;
}) {
  return (
    <div className="flex flex-col items-start gap-6 rounded-card border border-border bg-surface p-8">
      <span className="inline-flex size-12 items-center justify-center rounded-input bg-accent-soft text-accent-text">
        <EnvelopeIcon aria-hidden="true" className="size-6" />
      </span>

      <div className="flex flex-col gap-3">
        <h2 className="text-h6 font-bold text-foreground">Verify your email</h2>
        <p role="status" className="text-body-sm text-muted-foreground">
          {message}
        </p>
        {email ? (
          <p className="text-body-sm text-foreground">{email}</p>
        ) : null}
        <p className="text-body-sm text-muted-foreground">
          Once your email address is verified you will be signed in and taken to
          your dashboard.
        </p>
      </div>

      <Link
        href="/sign-in"
        className="text-body-sm font-medium text-accent-text underline-offset-4 transition-opacity duration-200 hover:opacity-80 hover:underline"
      >
        Return to sign in
      </Link>
    </div>
  );
}
