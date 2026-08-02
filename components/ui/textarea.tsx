import * as React from "react";
import { cn } from "@/lib/utils/cn";

export function Textarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "min-h-32 w-full resize-y rounded-input border border-border bg-surface px-4 py-3 text-body text-foreground",
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
