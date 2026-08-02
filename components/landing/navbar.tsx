"use client";

import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Container } from "@/components/shared/container";
import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import { LANDING_NAV_LINKS } from "@/lib/constants/navigation";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (!isMenuOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsMenuOpen(false);
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMenuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-md">
      <Container>
        <nav
          aria-label="Main"
          className="flex h-20 items-center justify-between gap-6"
        >
          <div className="flex items-center gap-10">
            <Logo />

            <ul className="hidden items-center gap-7 lg:flex">
              {LANDING_NAV_LINKS.map((link) => (
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

          <div className="hidden items-center gap-3 lg:flex">
            <ThemeToggle />
            <Button asChild variant="ghost" size="sm">
              <Link href="/sign-in">Sign In</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/sign-up">Get Started</Link>
            </Button>
          </div>

          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="inline-flex size-11 items-center justify-center rounded-button text-foreground transition-colors duration-200 hover:bg-surface lg:hidden"
          >
            {isMenuOpen ? (
              <XMarkIcon aria-hidden="true" className="size-6" />
            ) : (
              <Bars3Icon aria-hidden="true" className="size-6" />
            )}
          </button>
        </nav>
      </Container>

      {isMenuOpen ? (
        <div id="mobile-menu" className="border-t border-border/70 bg-background lg:hidden">
          <Container className="flex flex-col gap-1 py-5">
            {LANDING_NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="rounded-button px-3 py-3 text-body text-muted-foreground transition-colors duration-200 hover:bg-surface hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 flex items-center justify-between gap-4 border-t border-border/70 pt-5">
              <span className="text-body-sm text-muted-foreground">Theme</span>
              <ThemeToggle />
            </div>

            <div className="mt-4 flex flex-col gap-3">
              <Button asChild variant="secondary" size="md" block>
                <Link href="/sign-in" onClick={() => setIsMenuOpen(false)}>
                  Sign In
                </Link>
              </Button>
              <Button asChild size="md" block>
                <Link href="/sign-up" onClick={() => setIsMenuOpen(false)}>
                  Get Started
                </Link>
              </Button>
            </div>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
