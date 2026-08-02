"use client";

import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PlanSelectField } from "@/components/plans/plan-select-field";
import { FormMessage } from "@/components/shared/form-message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  API_OPTIONS,
  AUTH_REQUIREMENT_OPTIONS,
  DATABASE_OPTIONS,
  DEPLOYMENT_OPTIONS,
  NO_PREFERENCE,
} from "@/lib/constants/plan-options";
import { cn } from "@/lib/utils/cn";
import type { PlanDraft, PlanFieldErrors } from "@/types/plans";

const EMPTY_DRAFT: PlanDraft = {
  projectName: "",
  projectDescription: "",
  targetUsers: "",
  coreFeatures: "",
  authRequirement: "",
  databasePreference: NO_PREFERENCE,
  apiPreference: NO_PREFERENCE,
  deploymentPreference: NO_PREFERENCE,
};

const MIN_DESCRIPTION = 30;
const MIN_FEATURES = 20;

function validate(draft: PlanDraft): PlanFieldErrors {
  const errors: PlanFieldErrors = {};

  if (!draft.projectName.trim()) {
    errors.projectName = "Please give your project a name.";
  }

  if (!draft.projectDescription.trim()) {
    errors.projectDescription = "Please describe what you are building.";
  } else if (draft.projectDescription.trim().length < MIN_DESCRIPTION) {
    errors.projectDescription = `A little more detail helps. Aim for at least ${MIN_DESCRIPTION} characters.`;
  }

  if (!draft.targetUsers.trim()) {
    errors.targetUsers = "Please say who this application is for.";
  }

  if (!draft.coreFeatures.trim()) {
    errors.coreFeatures = "Please list the main things your application needs to do.";
  } else if (draft.coreFeatures.trim().length < MIN_FEATURES) {
    errors.coreFeatures = `A little more detail helps. Aim for at least ${MIN_FEATURES} characters.`;
  }

  if (!draft.authRequirement) {
    errors.authRequirement = "Please choose how people will sign in.";
  }

  return errors;
}

export function CreatePlanForm() {
  const router = useRouter();
  const [draft, setDraft] = useState<PlanDraft>(EMPTY_DRAFT);
  const [errors, setErrors] = useState<PlanFieldErrors>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  function update<K extends keyof PlanDraft>(field: K, value: string) {
    setDraft((current) => ({ ...current, [field]: value }));

    if (errors[field]) {
      setErrors((current) => {
        const next = { ...current };
        delete next[field];
        return next;
      });
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setHasSubmitted(true);

    const found = validate(draft);
    setErrors(found);

    if (Object.keys(found).length > 0) {
      const firstField = Object.keys(found)[0];
      document.getElementById(firstField)?.focus();
      return;
    }

    setIsGenerating(true);
    router.push("/generated-plan");
  }

  const errorCount = Object.keys(errors).length;

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-8">
      {hasSubmitted && errorCount > 0 ? (
        <FormMessage tone="error">
          {errorCount === 1
            ? "One field still needs your attention."
            : `${errorCount} fields still need your attention.`}
        </FormMessage>
      ) : null}

      <Fieldset
        legend="About your project"
        description="Tell BuildWise AI what you are building and who it is for."
      >
        <Field
          id="projectName"
          label="Project name"
          error={errors.projectName}
          required
        >
          <Input
            id="projectName"
            name="projectName"
            value={draft.projectName}
            onChange={(event) => update("projectName", event.target.value)}
            placeholder="Study Planner"
            aria-invalid={errors.projectName ? true : undefined}
            aria-describedby={errors.projectName ? "projectName-error" : undefined}
          />
        </Field>

        <Field
          id="projectDescription"
          label="Project description"
          hint="What does it do, and what problem does it solve?"
          error={errors.projectDescription}
          required
        >
          <Textarea
            id="projectDescription"
            name="projectDescription"
            value={draft.projectDescription}
            onChange={(event) => update("projectDescription", event.target.value)}
            placeholder="A study planner that helps students organise their coursework, track deadlines and revise on a schedule."
            aria-invalid={errors.projectDescription ? true : undefined}
            aria-describedby={cn(
              "projectDescription-hint",
              errors.projectDescription && "projectDescription-error",
            )}
          />
        </Field>

        <Field
          id="targetUsers"
          label="Target users"
          error={errors.targetUsers}
          required
        >
          <Input
            id="targetUsers"
            name="targetUsers"
            value={draft.targetUsers}
            onChange={(event) => update("targetUsers", event.target.value)}
            placeholder="University students"
            aria-invalid={errors.targetUsers ? true : undefined}
            aria-describedby={errors.targetUsers ? "targetUsers-error" : undefined}
          />
        </Field>

        <Field
          id="coreFeatures"
          label="Core features"
          hint="List the main things your application needs to do, one per line."
          error={errors.coreFeatures}
          required
        >
          <Textarea
            id="coreFeatures"
            name="coreFeatures"
            value={draft.coreFeatures}
            onChange={(event) => update("coreFeatures", event.target.value)}
            placeholder={"Create and organise study plans\nTrack deadlines\nShare a plan with a study group"}
            aria-invalid={errors.coreFeatures ? true : undefined}
            aria-describedby={cn(
              "coreFeatures-hint",
              errors.coreFeatures && "coreFeatures-error",
            )}
          />
        </Field>
      </Fieldset>

      <Fieldset
        legend="Technical preferences"
        description="Only the first is required. Leave the rest as they are if you do not have a preference yet, and BuildWise AI will recommend something and explain why."
      >
        <Field
          id="authRequirement"
          label="Authentication requirements"
          error={errors.authRequirement}
          required
        >
          <PlanSelectField
            id="authRequirement"
            value={draft.authRequirement}
            onChange={(value) => update("authRequirement", value)}
            options={AUTH_REQUIREMENT_OPTIONS}
            placeholder="Select an option"
            invalid={Boolean(errors.authRequirement)}
            describedBy={
              errors.authRequirement ? "authRequirement-error" : undefined
            }
          />
        </Field>

        <Field id="databasePreference" label="Database preference">
          <PlanSelectField
            id="databasePreference"
            value={draft.databasePreference}
            onChange={(value) => update("databasePreference", value)}
            options={DATABASE_OPTIONS}
            placeholder="No preference"
          />
        </Field>

        <Field id="apiPreference" label="API preference">
          <PlanSelectField
            id="apiPreference"
            value={draft.apiPreference}
            onChange={(value) => update("apiPreference", value)}
            options={API_OPTIONS}
            placeholder="No preference"
          />
        </Field>

        <Field id="deploymentPreference" label="Deployment preference">
          <PlanSelectField
            id="deploymentPreference"
            value={draft.deploymentPreference}
            onChange={(value) => update("deploymentPreference", value)}
            options={DEPLOYMENT_OPTIONS}
            placeholder="No preference"
          />
        </Field>
      </Fieldset>

      <div className="flex flex-col gap-3 border-t border-border pt-8 sm:flex-row">
        <Button type="submit" size="lg" disabled={isGenerating}>
          {isGenerating ? "Planning your backend architecture..." : "Generate Plan"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="lg"
          disabled={isGenerating}
          onClick={() => {
            setDraft({ ...EMPTY_DRAFT });
            setErrors({});
            setHasSubmitted(false);
          }}
        >
          Clear form
        </Button>
      </div>
    </form>
  );
}

function Fieldset({
  legend,
  description,
  children,
}: {
  legend: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="rounded-card border border-border bg-surface p-6 md:p-8">
      <legend className="px-2 text-body-xs font-semibold uppercase tracking-[0.16em] text-accent-text">
        {legend}
      </legend>
      <p className="mt-2 max-w-2xl text-body-sm text-muted-foreground">
        {description}
      </p>
      <div className="mt-7 flex flex-col gap-6">{children}</div>
    </fieldset>
  );
}

function Field({
  id,
  label,
  hint,
  error,
  required,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>
        {label}
        {required ? null : (
          <span className="ml-2 font-normal text-subtle-foreground">
            Optional
          </span>
        )}
      </Label>

      {hint ? (
        <p id={`${id}-hint`} className="text-body-xs text-subtle-foreground">
          {hint}
        </p>
      ) : null}

      {children}

      {error ? (
        <p
          id={`${id}-error`}
          role="alert"
          className="flex items-center gap-1.5 text-body-xs text-error"
        >
          <ExclamationCircleIcon aria-hidden="true" className="size-4 shrink-0" />
          {error}
        </p>
      ) : null}
    </div>
  );
}
