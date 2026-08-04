"use client";

import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/cn";

const MAX_FEATURE_LENGTH = 120;

export function FeatureListInput({
  id,
  features,
  onChange,
  invalid,
  describedBy,
}: {
  id: string;
  features: string[];
  onChange: (features: string[]) => void;
  invalid?: boolean;
  describedBy?: string;
}) {
  const [draft, setDraft] = useState("");
  const [notice, setNotice] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function commit() {
    const value = draft.trim().slice(0, MAX_FEATURE_LENGTH);

    if (!value) return;

    if (features.some((item) => item.toLowerCase() === value.toLowerCase())) {
      setNotice(`"${value}" is already on the list.`);
      setDraft("");
      return;
    }

    onChange([...features, value]);
    setDraft("");
    setNotice(`Added ${value}.`);
  }

  function remove(index: number) {
    const removed = features[index];
    onChange(features.filter((_, i) => i !== index));
    setNotice(`Removed ${removed}.`);
    inputRef.current?.focus();
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      commit();
      return;
    }

    if (event.key === "Backspace" && !draft && features.length > 0) {
      event.preventDefault();
      remove(features.length - 1);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <Input
          ref={inputRef}
          id={id}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={commit}
          maxLength={MAX_FEATURE_LENGTH}
          placeholder="Track deadlines"
          className="pr-28"
          aria-invalid={invalid ? true : undefined}
          aria-describedby={describedBy}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-body-xs text-subtle-foreground"
        >
          Press Enter
        </span>
      </div>

      {features.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {features.map((feature, index) => (
            <li
              key={feature}
              className={cn(
                "group flex items-center gap-3 rounded-input border border-border bg-surface px-4 py-3",
                "transition-colors duration-200 hover:border-border-strong",
              )}
            >
              <span className="flex size-5 shrink-0 items-center justify-center rounded-badge bg-accent-soft text-body-xs font-semibold text-accent-text">
                {index + 1}
              </span>
              <span className="min-w-0 flex-1 wrap-break-word text-body-sm text-foreground">
                {feature}
              </span>
              <button
                type="button"
                onClick={() => remove(index)}
                aria-label={`Remove ${feature}`}
                className="shrink-0 rounded-badge p-1 text-subtle-foreground transition-colors duration-200 hover:bg-surface-hover hover:text-foreground"
              >
                <XMarkIcon aria-hidden="true" className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="flex items-center gap-2 rounded-input border border-dashed border-border px-4 py-3 text-body-sm text-subtle-foreground">
          <PlusIcon aria-hidden="true" className="size-4 shrink-0" />
          Add each feature separately, one per line.
        </p>
      )}

      <span aria-live="polite" className="sr-only">
        {notice}
      </span>
    </div>
  );
}
