import Link from "next/link";
import { Container } from "@/components/shared/container";
import { FadeIn } from "@/components/shared/fade-in";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="py-20 md:py-28">
      <Container>
        <FadeIn>
          <div className="relative isolate overflow-hidden rounded-card border border-border bg-linear-to-b from-surface-raised to-surface px-6 py-16 text-center shadow-soft md:px-16 md:py-20">
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-10 size-full"
              style={{
                maskImage:
                  "radial-gradient(ellipse at 50% 0%, black 10%, transparent 70%)",
                WebkitMaskImage:
                  "radial-gradient(ellipse at 50% 0%, black 10%, transparent 70%)",
              }}
            >
              <defs>
                <pattern
                  id="cta-grid"
                  width="32"
                  height="32"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M32 0H0V32"
                    fill="none"
                    stroke="var(--illo-line)"
                    strokeWidth="1"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#cta-grid)" />
            </svg>

            <div className="flex flex-col items-center">
              <span className="text-body-xs font-semibold uppercase tracking-[0.16em] text-accent-text">
                Get started
              </span>

              <h2 className="mt-5 max-w-2xl text-h4 font-bold text-foreground md:text-h2">
                Start your first backend plan
              </h2>
              <p className="mt-5 max-w-xl text-body text-muted-foreground md:text-body-lg">
                Create an account and turn your next project idea into a
                structured plan you can understand and build from.
              </p>

              <div className="mt-9 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                <Button asChild size="lg">
                  <Link href="/sign-up">Create Account</Link>
                </Button>
                <Button asChild variant="secondary" size="lg">
                  <Link href="/sign-in">Sign In</Link>
                </Button>
              </div>
            </div>
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
