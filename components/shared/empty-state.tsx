import { cn } from "@/lib/utils/cn";

export function EmptyState({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-4 rounded-card border border-dashed border-border bg-surface/50 px-6 py-16 text-center",
        className,
      )}
    >
      <EmptyPlansMark />
      <div className="flex flex-col gap-2">
        <h3 className="text-h6 font-semibold text-foreground">{title}</h3>
        <p className="mx-auto max-w-md text-body-sm text-muted-foreground">
          {description}
        </p>
      </div>
      {action}
    </div>
  );
}

function EmptyPlansMark() {
  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden="true"
      fill="none"
      className="size-14"
      strokeLinecap="round"
    >
      <rect
        x="14"
        y="10"
        width="36"
        height="44"
        rx="6"
        className="stroke-border-strong"
        strokeWidth="2"
      />
      <path d="M24 24h16" className="stroke-accent" strokeWidth="2" />
      <path d="M24 33h16" className="stroke-subtle-foreground" strokeWidth="2" />
      <path d="M24 42h10" className="stroke-subtle-foreground" strokeWidth="2" />
    </svg>
  );
}
