import { Container } from "@/components/shared/container";
import { FadeIn } from "@/components/shared/fade-in";
import { SectionHeading } from "@/components/shared/section-heading";
import { HOW_IT_WORKS_STEPS } from "@/lib/constants/landing";
import { cn } from "@/lib/utils/cn";

const STEP_MOTIFS = [DescribeMotif, ReviewMotif, AskMotif] as const;

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-24 border-y border-border/70 bg-background-deep py-20 md:py-28"
    >
      <Container>
        <FadeIn>
          <SectionHeading
            eyebrow="How It Works"
            title="From an idea to a plan you understand"
            description="Three steps, with no prior backend architecture experience required."
          />
        </FadeIn>

        <ol className="relative mt-16 grid gap-6 md:grid-cols-3 md:gap-5">
          <span
            aria-hidden="true"
            className="absolute left-0 right-0 top-12 hidden h-px bg-linear-to-r from-transparent via-border to-transparent md:block"
          />

          {HOW_IT_WORKS_STEPS.map((step, index) => {
            const Motif = STEP_MOTIFS[index];

            return (
              <FadeIn
                as="li"
                key={step.title}
                delay={index * 0.08}
                className="relative"
              >
                <div
                  className={cn(
                    "group flex h-full flex-col rounded-card border border-border p-7",
                    "bg-linear-to-b from-surface-raised to-surface",
                    "transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-border-strong",
                  )}
                >
                  <span className="font-display text-h2 font-bold leading-none text-border-strong transition-colors duration-300 group-hover:text-accent-text">
                    0{index + 1}
                  </span>

                  <h3 className="mt-6 text-h6 font-bold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-body-sm text-muted-foreground">
                    {step.description}
                  </p>

                  <div className="mt-auto pt-7">
                    <Motif />
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}

function MotifFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-input border border-border bg-background/60 p-4">
      {children}
    </div>
  );
}

function DescribeMotif() {
  return (
    <MotifFrame>
      <div className="flex flex-col gap-2.5">
        <span className="block h-7 rounded-lg border border-border bg-surface" />
        <span className="block h-7 w-4/5 rounded-lg border border-border bg-surface" />
        <span className="block h-7 w-3/5 rounded-lg border border-accent-line bg-accent-soft" />
      </div>
    </MotifFrame>
  );
}

function ReviewMotif() {
  return (
    <MotifFrame>
      <div className="flex flex-col gap-3">
        {["Database", "Authentication"].map((row, index) => (
          <div key={row} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-body-xs font-medium text-foreground">
                {row}
              </span>
              <span
                className={cn(
                  "size-1.5 rounded-full",
                  index === 0 ? "bg-accent" : "bg-border-strong",
                )}
              />
            </div>
            <span
              className={cn(
                "block h-1.5 rounded-full",
                index === 0 ? "w-full bg-accent-line" : "w-3/4 bg-surface-hover",
              )}
            />
          </div>
        ))}
      </div>
    </MotifFrame>
  );
}

function AskMotif() {
  return (
    <MotifFrame>
      <div className="flex flex-wrap gap-2">
        <span className="rounded-badge border border-accent-line bg-accent-soft px-2.5 py-1 text-body-xs text-accent-text">
          Why PostgreSQL?
        </span>
        <span className="rounded-badge border border-border px-2.5 py-1 text-body-xs text-subtle-foreground">
          Will it scale?
        </span>
        <span className="rounded-badge border border-border px-2.5 py-1 text-body-xs text-subtle-foreground">
          What is JWT?
        </span>
      </div>
    </MotifFrame>
  );
}
