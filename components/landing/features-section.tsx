import { Container } from "@/components/shared/container";
import { FadeIn, Reveal, RevealItem } from "@/components/shared/fade-in";
import {
  PlanStructureArt,
  ReasoningArt,
  RoadmapArt,
  TechnologyArt,
} from "@/components/shared/illustrations/feature-art";
import { SectionHeading } from "@/components/shared/section-heading";
import { LANDING_FEATURES } from "@/lib/constants/landing";
import { cn } from "@/lib/utils/cn";

const FEATURE_ART = [
  PlanStructureArt,
  ReasoningArt,
  TechnologyArt,
  RoadmapArt,
] as const;

export function FeaturesSection() {
  return (
    <section id="features" className="scroll-mt-24 py-20 md:py-28">
      <Container>
        <FadeIn>
          <SectionHeading
            eyebrow="Features"
            title="Understand every technical decision"
            description="BuildWise AI is built to teach, not to build for you. Each part of your plan is written so a beginner can follow the reasoning."
          />
        </FadeIn>

        <ul className="mt-16 flex flex-col gap-16 md:gap-24">
          {LANDING_FEATURES.map((feature, index) => {
            const Art = FEATURE_ART[index];
            const isReversed = index % 2 === 1;

            return (
              <Reveal
                as="li"
                key={feature.title}
                className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16"
                stagger={0.14}
              >
                <RevealItem
                  direction={isReversed ? "left" : "right"}
                  className={cn(
                    "flex flex-col items-start",
                    isReversed && "lg:order-2",
                  )}
                >
                  <h3 className="text-balance text-h5 font-bold text-foreground md:text-h4">
                    {feature.title}
                  </h3>

                  <p className="mt-5 text-body text-muted-foreground md:text-body-lg">
                    {feature.description}
                  </p>
                </RevealItem>

                <RevealItem
                  direction={isReversed ? "right" : "left"}
                  distance={30}
                  className={cn(isReversed && "lg:order-1")}
                >
                  <Art />
                </RevealItem>
              </Reveal>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
