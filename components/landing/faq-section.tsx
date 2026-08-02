import Link from "next/link";
import { Container } from "@/components/shared/container";
import { FadeIn } from "@/components/shared/fade-in";
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
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
          <FadeIn>
            <div className="lg:sticky lg:top-32">
              <span className="text-body-xs font-semibold uppercase tracking-[0.16em] text-accent-text">
                Questions
              </span>
              <h2 className="mt-4 text-h4 font-bold text-foreground md:text-h3">
                Frequently asked questions
              </h2>
              <p className="mt-4 max-w-sm text-body text-muted-foreground">
                Still unsure about something? The answers below cover what most
                people ask before their first plan.
              </p>
              <Link
                href="/sign-up"
                className="mt-6 inline-block text-body-sm font-medium text-accent-text underline-offset-4 transition-opacity duration-200 hover:opacity-80 hover:underline"
              >
                Create an account
              </Link>
            </div>
          </FadeIn>

          <FadeIn delay={0.05}>
            <Accordion type="single" collapsible>
              {LANDING_FAQS.map((faq, index) => (
                <AccordionItem key={faq.question} value={`faq-${index}`}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </FadeIn>
        </div>
      </Container>
    </section>
  );
}
