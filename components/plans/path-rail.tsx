"use client";

import { cn } from "@/lib/utils/cn";
import type { PlanPath } from "@/types/plans";

export function PathRail({
  paths,
  active,
  recommended,
  onChange,
  panelId,
}: {
  paths: readonly PlanPath[];
  active: number;
  recommended: number;
  onChange: (index: number) => void;
  panelId: string;
}) {
  return (
    <div className="mb-7">
      <h2 className="text-body-xs font-semibold uppercase tracking-[0.16em] text-subtle-foreground">
        Approach
      </h2>

      <div
        role="tablist"
        aria-label="Ways to build this project"
        aria-orientation="vertical"
        className="mt-3 flex flex-col"
      >
        {paths.map((path, index) => {
          const isActive = index === active;

          return (
            <button
              key={path.name}
              role="tab"
              type="button"
              id={`${panelId}-tab-${index}`}
              aria-selected={isActive}
              aria-controls={panelId}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onChange(index)}
              onKeyDown={(event) => {
                if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
                event.preventDefault();
                const next =
                  event.key === "ArrowDown"
                    ? (index + 1) % paths.length
                    : (index - 1 + paths.length) % paths.length;
                onChange(next);
                document.getElementById(`${panelId}-tab-${next}`)?.focus();
              }}
              className={cn(
                "flex flex-col gap-0.5 border-l-2 py-2.5 pl-3 text-left",
                "transition-colors duration-200",
                isActive
                  ? "border-accent"
                  : "border-border hover:border-border-strong",
              )}
            >
              <span
                className={cn(
                  "text-body-sm font-medium transition-colors duration-200",
                  isActive ? "text-foreground" : "text-subtle-foreground",
                )}
              >
                {path.name}
              </span>
              <span className="text-body-xs text-subtle-foreground">
                {index === recommended ? (
                  <span className="text-accent-text">Recommended · </span>
                ) : null}
                {path.tagline}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
