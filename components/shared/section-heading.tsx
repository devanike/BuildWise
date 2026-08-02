import { cn } from "@/lib/utils/cn";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      <span className="text-body-xs font-semibold uppercase tracking-[0.16em] text-accent-text">
        {eyebrow}
      </span>
      <h2 className="max-w-4xl text-balance text-h4 font-bold text-foreground md:text-h3">
        {title}
      </h2>
      {description ? (
        <p className="max-w-3xl text-body text-muted-foreground md:text-body-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}
