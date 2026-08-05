import { AcademicCapIcon, LightBulbIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils/cn";

export function PlanSection({
  id,
  eyebrow,
  title,
  children,
  className,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={cn(
        "scroll-mt-24 rounded-card border border-border bg-surface p-6 md:p-8",
        className,
      )}
    >
      <span className="text-body-xs font-semibold uppercase tracking-[0.16em] text-accent-text">
        {eyebrow}
      </span>
      <h2
        id={`${id}-heading`}
        className="mt-3 text-h5 font-bold text-foreground md:text-h4"
      >
        {title}
      </h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export function Recommendation({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-input border border-accent-line bg-accent-soft px-5 py-4 text-body font-medium text-foreground md:text-body-lg">
      {children}
    </p>
  );
}

export function Reasoning({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-5">
      <h3 className="flex items-center gap-2 text-body-sm font-semibold text-foreground">
        <LightBulbIcon aria-hidden="true" className="size-4 text-accent-text" />
        Why this was recommended
      </h3>
      <p className="mt-2 text-body text-muted-foreground">{children}</p>
    </div>
  );
}

export function LearningTip({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-5 flex gap-3 rounded-input border border-border bg-background/50 px-4 py-3.5">
      <AcademicCapIcon
        aria-hidden="true"
        className="mt-0.5 size-4 shrink-0 text-accent-text"
      />
      <p className="text-body-sm text-muted-foreground">
        <span className="font-semibold text-foreground">Worth learning: </span>
        {children}
      </p>
    </div>
  );
}

export function Considerations({ items }: { items: readonly string[] }) {
  return (
    <div className="mt-5">
      <h3 className="text-body-sm font-semibold text-foreground">
        Worth keeping in mind
      </h3>
      <ul className="mt-3 flex flex-col gap-2.5">
        {items.map((item) => (
          <li
            key={item}
            className="flex gap-3 text-body-sm text-muted-foreground"
          >
            <span
              aria-hidden="true"
              className="mt-2 size-1.5 shrink-0 rounded-full bg-accent"
            />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
