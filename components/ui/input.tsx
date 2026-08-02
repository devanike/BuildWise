import * as React from "react";
import { cn } from "@/lib/utils/cn";

export function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        "h-12 w-full rounded-input border border-border bg-surface px-4 text-body text-foreground",
        "transition-[border-color,background-color] duration-200",
        "hover:border-border-strong",
        "focus-visible:border-accent focus-visible:bg-surface-raised",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-error",
        className,
      )}
      {...props}
    />
  );
}
