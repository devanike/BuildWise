import Link from "next/link";
import { Container } from "@/components/shared/container";
import { FadeIn } from "@/components/shared/fade-in";
import { ArchitectureArt } from "@/components/shared/illustrations/architecture-art";
import { IllustrationStage } from "@/components/shared/illustrations/stage";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="flex min-h-[calc(100dvh-5rem)] items-center py-16 md:py-20">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16">
          <FadeIn className="flex flex-col items-start">
            <h1 className="max-w-2xl text-h3 font-bold text-foreground md:text-h2 lg:text-h1">
              Plan your backend with confidence
            </h1>

            <p className="mt-6 max-w-xl text-body text-muted-foreground md:text-body-lg">
              BuildWise AI turns your project idea into a structured backend
              plan, and explains the reasoning behind every recommendation so
              you learn while you plan.
            </p>

            <div className="mt-9 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Button asChild size="lg">
                <Link href="/sign-up">Get Started</Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href="#how-it-works">See how it works</Link>
              </Button>
            </div>

            <p className="mt-6 text-body-sm text-subtle-foreground">
              Free to start. No credit card required.
            </p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <IllustrationStage contentClassName="p-6 md:p-10">
              <ArchitectureArt />
            </IllustrationStage>
          </FadeIn>
        </div>
      </Container>
    </section>
  );
}
