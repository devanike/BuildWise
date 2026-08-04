"use client";

import {
  ArrowLeftIcon,
  CheckIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FeatureListInput } from "@/components/plans/feature-list-input";
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
  coreFeatures: [],
  authRequirement: "",
  databasePreference: NO_PREFERENCE,
  apiPreference: NO_PREFERENCE,
  deploymentPreference: NO_PREFERENCE,
};

const MIN_DESCRIPTION = 30;
const MIN_FEATURES = 2;

type Step = {
  id: "project" | "features" | "technical";
  label: string;
  title: string;
  description: string;
  fields: readonly (keyof PlanDraft)[];
};

const STEPS: readonly Step[] = [
  {
    id: "project",
    label: "Project",
    title: "Tell us about your project",
    description: "What you are building, and who it is for.",
    fields: ["projectName", "projectDescription", "targetUsers"],
  },
  {
    id: "features",
    label: "Features",
    title: "What does it need to do?",
    description:
      "List the main things your application needs to do. Add them one at a time.",
    fields: ["coreFeatures"],
  },
  {
    id: "technical",
    label: "Technical",
    title: "Any technical preferences?",
    description:
      "Only the first is required. Leave the rest as they are and BuildWise AI will recommend something and explain why.",
    fields: ["authRequirement"],
  },
];

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

  if (draft.coreFeatures.length < MIN_FEATURES) {
    errors.coreFeatures = `Add at least ${MIN_FEATURES} features so your plan has something to work from.`;
  }

  if (!draft.authRequirement) {
    errors.authRequirement = "Please choose how people will sign in.";
  }

  return errors;
}

export function CreatePlanForm() {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [draft, setDraft] = useState<PlanDraft>(EMPTY_DRAFT);
  const [errors, setErrors] = useState<PlanFieldErrors>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const isFirstRender = useRef(true);

  const step = STEPS[stepIndex];
  const isLastStep = stepIndex === STEPS.length - 1;

  // Move focus to the new step heading so keyboard and screen reader users land
  // on the new content instead of staying on the button they just pressed.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [stepIndex]);

  function update<K extends keyof PlanDraft>(field: K, value: PlanDraft[K]) {
    setDraft((current) => ({ ...current, [field]: value }));

    if (errors[field]) {
      setErrors((current) => {
        const next = { ...current };
        delete next[field];
        return next;
      });
    }
  }

  /** Validates only the fields belonging to the current step. */
  function checkStep(): boolean {
    const all = validate(draft);
    const stepErrors: PlanFieldErrors = {};

    for (const field of step.fields) {
      const message = all[field];
      if (message) stepErrors[field] = message;
    }

    setErrors(stepErrors);

    const firstInvalid = Object.keys(stepErrors)[0];
    if (firstInvalid) {
      document.getElementById(firstInvalid)?.focus();
      return false;
    }

    return true;
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!checkStep()) return;

    if (!isLastStep) {
      setStepIndex((current) => current + 1);
      return;
    }

    // Guard against an earlier step having been left incomplete.
    const all = validate(draft);
    if (Object.keys(all).length > 0) {
      setErrors(all);
      const firstBadStep = STEPS.findIndex((candidate) =>
        candidate.fields.some((field) => all[field]),
      );
      setStepIndex(firstBadStep === -1 ? 0 : firstBadStep);
      return;
    }

    setIsGenerating(true);
    router.push("/generated-plan");
  }

  const errorCount = Object.keys(errors).length;

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-8">
      <StepIndicator current={stepIndex} />

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <span className="text-body-xs font-semibold uppercase tracking-[0.16em] text-accent-text">
            Step {stepIndex + 1} of {STEPS.length}
          </span>
          <h2
            ref={headingRef}
            tabIndex={-1}
            className="text-h5 font-bold text-foreground outline-none md:text-h4"
          >
            {step.title}
          </h2>
          <p className="max-w-xl text-body text-muted-foreground">
            {step.description}
          </p>
        </div>

        {errorCount > 0 ? (
          <FormMessage tone="error">
            {errorCount === 1
              ? "One field still needs your attention."
              : `${errorCount} fields still need your attention.`}
          </FormMessage>
        ) : null}

        {step.id === "project" ? (
          <div className="flex flex-col gap-6">
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
                aria-describedby={
                  errors.projectName ? "projectName-error" : undefined
                }
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
                onChange={(event) =>
                  update("projectDescription", event.target.value)
                }
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
                aria-describedby={
                  errors.targetUsers ? "targetUsers-error" : undefined
                }
              />
            </Field>
          </div>
        ) : null}

        {step.id === "features" ? (
          <Field
            id="coreFeatures"
            label="Core features"
            hint="Type a feature and press Enter to add it to the list."
            error={errors.coreFeatures}
            required
          >
            <FeatureListInput
              id="coreFeatures"
              features={draft.coreFeatures}
              onChange={(features) => update("coreFeatures", features)}
              invalid={Boolean(errors.coreFeatures)}
              describedBy={cn(
                "coreFeatures-hint",
                errors.coreFeatures && "coreFeatures-error",
              )}
            />
          </Field>
        ) : null}

        {step.id === "technical" ? (
          <div className="flex flex-col gap-6">
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
          </div>
        ) : null}
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
        {stepIndex > 0 ? (
          <Button
            type="button"
            variant="secondary"
            size="lg"
            onClick={() => setStepIndex((current) => current - 1)}
          >
            <ArrowLeftIcon aria-hidden="true" />
            Back
          </Button>
        ) : (
          <span className="hidden sm:block" />
        )}

        <Button type="submit" size="lg" disabled={isGenerating}>
          {isLastStep
            ? isGenerating
              ? "Preparing your recommendations..."
              : "Generate Plan"
            : "Continue"}
        </Button>
      </div>
    </form>
  );
}

function StepIndicator({ current }: { current: number }) {
  return (
    <ol className="flex items-center gap-2 sm:gap-4">
      {STEPS.map((step, index) => {
        const isDone = index < current;
        const isCurrent = index === current;

        return (
          <li key={step.id} className="flex flex-1 items-center gap-2 sm:gap-4">
            <div className="flex min-w-0 items-center gap-2.5">
              <span
                aria-hidden="true"
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-badge border text-body-xs font-semibold",
                  "transition-colors duration-300",
                  isDone && "border-accent bg-accent text-accent-foreground",
                  isCurrent && "border-accent bg-accent-soft text-accent-text",
                  !isDone &&
                    !isCurrent &&
                    "border-border text-subtle-foreground",
                )}
              >
                {isDone ? (
                  <CheckIcon aria-hidden="true" className="size-4" />
                ) : (
                  index + 1
                )}
              </span>
              <span
                aria-current={isCurrent ? "step" : undefined}
                className={cn(
                  "hidden truncate text-body-sm transition-colors duration-300 sm:block",
                  isCurrent
                    ? "font-medium text-foreground"
                    : "text-subtle-foreground",
                )}
              >
                {step.label}
              </span>
            </div>

            {index < STEPS.length - 1 ? (
              <span
                aria-hidden="true"
                className={cn(
                  "h-px flex-1 transition-colors duration-300",
                  isDone ? "bg-accent" : "bg-border",
                )}
              />
            ) : null}
          </li>
        );
      })}
    </ol>
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
