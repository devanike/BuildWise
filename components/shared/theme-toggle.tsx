"use client";

import { MoonIcon, SunIcon, SwatchIcon } from "@heroicons/react/24/outline";
import { useSyncExternalStore } from "react";
import { cn } from "@/lib/utils/cn";
import {
  getStoredTheme,
  setTheme,
  subscribeToTheme,
  type Theme,
} from "@/lib/utils/theme";

const OPTIONS: { value: Theme; label: string; Icon: typeof SunIcon }[] = [
  { value: "light", label: "Light theme", Icon: SunIcon },
  { value: "neutral", label: "Neutral theme", Icon: SwatchIcon },
  { value: "dark", label: "Dark theme", Icon: MoonIcon },
];

export function ThemeToggle({ className }: { className?: string }) {
  const theme = useSyncExternalStore(
    subscribeToTheme,
    getStoredTheme,
    () => "dark" as Theme,
  );

  return (
    <div
      role="radiogroup"
      aria-label="Colour theme"
      className={cn(
        "inline-flex items-center gap-0.5 rounded-badge border border-border bg-surface p-1",
        className,
      )}
    >
      {OPTIONS.map((option) => {
        const isSelected = theme === option.value;

        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-label={option.label}
            title={option.label}
            onClick={() => setTheme(option.value)}
            className={cn(
              "inline-flex size-8 items-center justify-center rounded-badge transition-colors duration-200",
              isSelected
                ? "bg-accent text-accent-foreground"
                : "text-subtle-foreground hover:bg-surface-hover hover:text-foreground",
            )}
          >
            <option.Icon aria-hidden="true" className="size-4" />
          </button>
        );
      })}
    </div>
  );
}
