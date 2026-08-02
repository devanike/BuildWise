import Link from "next/link";
import { cn } from "@/lib/utils/cn";

export function Logo({
  className,
  href = "/",
}: {
  className?: string;
  href?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2.5 font-display text-body-lg font-bold tracking-tight text-foreground",
        "transition-opacity duration-200 hover:opacity-80",
        className,
      )}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" className="size-6 shrink-0" fill="none">
        <rect x="3" y="4" width="18" height="4" rx="1.5" className="fill-accent" />
        <rect
          x="3"
          y="10"
          width="18"
          height="4"
          rx="1.5"
          className="fill-subtle-foreground"
        />
        <rect
          x="3"
          y="16"
          width="12"
          height="4"
          rx="1.5"
          className="fill-border-strong"
        />
      </svg>
      BuildWise AI
    </Link>
  );
}
