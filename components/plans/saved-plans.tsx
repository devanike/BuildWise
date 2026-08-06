"use client";

import { MagnifyingGlassIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { PlanMark } from "@/components/plans/plan-mark";
import { FormMessage } from "@/components/shared/form-message";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { deletePlanById } from "@/lib/actions/plans";
import type { PlanSummary } from "@/types/plans";

const formatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const PAGE_SIZE = 20;

export function SavedPlans({ plans }: { plans: PlanSummary[] }) {
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [pending, setPending] = useState<PlanSummary | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [isDeleting, startDelete] = useTransition();

  function confirmDelete() {
    const plan = pending;
    if (!plan) return;

    setError("");
    setNotice("");

    startDelete(async () => {
      const result = await deletePlanById(plan.id);

      if (result.error) {
        setError(result.error);
      } else {
        setNotice(`"${plan.title}" has been deleted.`);
      }

      setPending(null);
    });
  }

  const matches = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return plans;
    return plans.filter((plan) => plan.title.toLowerCase().includes(term));
  }, [plans, query]);

  const shown = matches.slice(0, visible);
  const remaining = matches.length - shown.length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-md">
          <MagnifyingGlassIcon
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-subtle-foreground"
          />
          <label htmlFor="plan-search" className="sr-only">
            Search your plans by name
          </label>
          <Input
            id="plan-search"
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setVisible(PAGE_SIZE);
              setNotice("");
            }}
            placeholder="Search your plans"
            className="pl-12"
          />
        </div>

        <p
          aria-live="polite"
          className="shrink-0 text-body-sm text-subtle-foreground"
        >
          {matches.length === plans.length
            ? `${plans.length} ${plans.length === 1 ? "plan" : "plans"}`
            : `${matches.length} of ${plans.length} plans`}
        </p>
      </div>

      {error ? <FormMessage tone="error">{error}</FormMessage> : null}
      {notice ? <FormMessage tone="success">{notice}</FormMessage> : null}

      {matches.length === 0 ? (
        <p className="rounded-card border border-dashed border-border px-6 py-12 text-center text-body text-muted-foreground">
          No plans match &ldquo;{query.trim()}&rdquo;.
        </p>
      ) : (
        <>
          <ul className="flex flex-col divide-y divide-border border-y border-border">
            {shown.map((plan) => (
              <li
                key={plan.id}
                className="group flex items-center gap-4 px-2 transition-colors duration-200 hover:bg-surface/60"
              >
                <Link
                  href={`/plans/${plan.id}`}
                  className="flex min-w-0 flex-1 items-center gap-5 py-5"
                >
                  <PlanMark />

                  <span className="flex min-w-0 flex-1 flex-col gap-1">
                    <span className="truncate text-body font-semibold text-foreground">
                      {plan.title}
                    </span>
                    <span className="text-body-sm text-subtle-foreground">
                      {formatter.format(new Date(plan.createdAt))}
                    </span>
                  </span>
                </Link>

                <button
                  type="button"
                  onClick={() => setPending(plan)}
                  aria-label={`Delete ${plan.title}`}
                  className="shrink-0 rounded-button p-2 text-subtle-foreground transition-colors duration-200 hover:bg-surface-hover hover:text-error"
                >
                  <TrashIcon aria-hidden="true" className="size-5" />
                </button>
              </li>
            ))}
          </ul>

          {remaining > 0 ? (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="w-fit"
              onClick={() => setVisible((current) => current + PAGE_SIZE)}
            >
              Show {Math.min(remaining, PAGE_SIZE)} more
            </Button>
          ) : null}
        </>
      )}

      <AlertDialog
        open={pending !== null}
        onOpenChange={(open) => {
          if (!open && !isDeleting) setPending(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogTitle>Delete this plan?</AlertDialogTitle>
          <AlertDialogDescription>
            {pending
              ? `"${pending.title}" and every question you have asked about it will be permanently deleted. This cannot be undone.`
              : ""}
          </AlertDialogDescription>

          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button type="button" variant="secondary" size="sm" disabled={isDeleting}>
                Keep this plan
              </Button>
            </AlertDialogCancel>

            <button
              type="button"
              onClick={confirmDelete}
              disabled={isDeleting}
              className="h-10 rounded-button bg-error px-4 text-body-sm font-medium text-background transition-opacity duration-200 hover:opacity-90 disabled:pointer-events-none disabled:opacity-60"
            >
              {isDeleting ? "Deleting..." : "Delete plan"}
            </button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
