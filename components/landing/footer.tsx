import Link from "next/link";
import { WordmarkCloud } from "@/components/landing/wordmark-cloud";
import { Container } from "@/components/shared/container";
import { Logo } from "@/components/shared/logo";
import { FOOTER_LINK_GROUPS } from "@/lib/constants/navigation";

export function Footer() {
  return (
    <footer className="border-t border-border/70">
      <Container className="pt-14 md:pt-16">
        <div className="flex flex-col gap-12 md:flex-row md:justify-between">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-4 text-body-sm text-muted-foreground">
              An AI-powered backend mentor that helps beginner developers plan
              their applications and understand the decisions behind every
              recommendation.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-12 sm:gap-16">
            {FOOTER_LINK_GROUPS.map((group) => (
              <div key={group.title}>
                <h2 className="text-body-sm font-semibold text-foreground">
                  {group.title}
                </h2>
                <ul className="mt-4 flex flex-col gap-3">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-body-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <WordmarkCloud />

        <p className="border-t border-border/70 py-8 text-body-xs text-subtle-foreground">
          BuildWise AI. Built to help you learn while you plan.
        </p>
      </Container>
    </footer>
  );
}
