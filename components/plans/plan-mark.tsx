export function PlanMark() {
  return (
    <svg
      viewBox="0 0 24 28"
      aria-hidden="true"
      fill="none"
      className="size-7 shrink-0"
    >
      <path
        d="M4 14 h6 M10 14 V5 h6 M10 14 v9 h6"
        className="stroke-border-strong transition-colors duration-200 group-hover:stroke-accent-line"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="19"
        cy="5"
        r="3"
        className="fill-accent-soft stroke-accent transition-colors duration-200"
        strokeWidth="1.5"
      />
      <circle
        cx="19"
        cy="23"
        r="3"
        className="fill-surface stroke-subtle-foreground transition-colors duration-200 group-hover:stroke-border-strong"
        strokeWidth="1.5"
      />
      <circle
        cx="2.5"
        cy="14"
        r="2.5"
        className="fill-surface stroke-border-strong transition-colors duration-200 group-hover:stroke-accent"
        strokeWidth="1.5"
      />
    </svg>
  );
}
