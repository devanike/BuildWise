import { cn } from "@/lib/utils/cn";

export function LoadingState({
  message = "Preparing your page",
  className,
}: {
  message?: string;
  className?: string;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex min-h-[60vh] flex-col items-center justify-center gap-4",
        className,
      )}
    >
      <Spinner />
      <p className="text-body-sm text-muted-foreground">{message}...</p>
    </div>
  );
}

function Spinner() {
  return (
    <svg
      viewBox="0 0 48 48"
      aria-hidden="true"
      fill="none"
      className="size-8 motion-safe:animate-spin"
    >
      <circle
        cx="24"
        cy="24"
        r="20"
        stroke="var(--border)"
        strokeWidth="4"
      />
      <path
        d="M44 24a20 20 0 0 0-20-20"
        stroke="var(--accent)"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}
