import { Container } from "@/components/shared/container";
import { FadeIn, Reveal, RevealItem } from "@/components/shared/fade-in";
import { ProductPreview } from "@/components/shared/illustrations/product-preview";
import { SectionHeading } from "@/components/shared/section-heading";
import { HOW_IT_WORKS_STEPS } from "@/lib/constants/landing";

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

        <div className="mt-14 grid items-center gap-12 lg:mt-16 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:gap-14">
          <Reveal as="ol" className="flex flex-col" stagger={0.12}>
            {HOW_IT_WORKS_STEPS.map((step, index) => (
              <RevealItem
                as="li"
                key={step.title}
                direction="right"
                className="border-t border-border py-7 first:border-t-0 first:pt-0 last:pb-0"
              >
                <span className="font-display text-h4 font-bold leading-none text-border-strong">
                  0{index + 1}
                </span>
                <h3 className="mt-4 text-h6 font-bold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2.5 max-w-md text-body text-muted-foreground">
                  {step.description}
                </p>
              </RevealItem>
            ))}
          </Reveal>

          <FadeIn direction="left" distance={32} delay={0.1}>
            <ProductPreview />
          </FadeIn>
        </div>
      </Container>
    </section>
  );
}
