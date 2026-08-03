import { Container } from "@/components/shared/container";
import { FadeIn, Reveal, RevealItem } from "@/components/shared/fade-in";
import { SectionHeading } from "@/components/shared/section-heading";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LANDING_FAQS } from "@/lib/constants/landing";

export function FaqSection() {
  return (
    <section id="faq" className="scroll-mt-24 py-20 md:py-28">
      <Container>
        <FadeIn>
          <SectionHeading
            eyebrow="Questions"
            title="Frequently asked questions"
            description="Still unsure about something? The answers below cover what most people ask before their first plan."
          />
        </FadeIn>

        <Reveal className="mt-14 lg:mt-16" stagger={0.07}>
          <Accordion type="single" collapsible>
            {LANDING_FAQS.map((faq, index) => (
              <RevealItem key={faq.question} distance={18}>
                <AccordionItem value={`faq-${index}`}>
                  <AccordionTrigger className="gap-8 py-7 text-h6 md:py-8">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="max-w-3xl pb-8 text-body-lg">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </RevealItem>
            ))}
          </Accordion>
        </Reveal>
      </Container>
    </section>
  );
}
