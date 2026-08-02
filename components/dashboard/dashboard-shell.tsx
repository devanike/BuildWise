"use client";

import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useState, useSyncExternalStore } from "react";

import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { cn } from "@/lib/utils/cn";
import {
  getSidebarCollapsed,
  setSidebarCollapsed,
  subscribeToSidebar,
} from "@/lib/utils/sidebar";
import type { AccountProfile } from "@/types/user";

export function DashboardShell({
  profile,
  title,
  children,
}: {
  profile: AccountProfile;
  title: string;
  children: React.ReactNode;
}) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const isCollapsed = useSyncExternalStore(
    subscribeToSidebar,
    getSidebarCollapsed,
    () => false,
  );

  useEffect(() => {
    if (!isDrawerOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsDrawerOpen(false);
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isDrawerOpen]);

  function toggleCollapsed() {
    setSidebarCollapsed(!isCollapsed);
  }

  const railWidth = isCollapsed ? "w-20" : "w-72";

  return (
    <div className="flex min-h-dvh">
      <aside
        className={cn(
          "hidden shrink-0 transition-[width] duration-300 ease-out lg:block",
          railWidth,
        )}
      >
        <div
          className={cn(
            "fixed inset-y-0 z-50 transition-[width] duration-300 ease-out",
            railWidth,
          )}
        >
          <DashboardSidebar
            profile={profile}
            collapsed={isCollapsed}
            onToggleCollapsed={toggleCollapsed}
          />
        </div>
      </aside>

      {isDrawerOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setIsDrawerOpen(false)}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[85vw]">
            <DashboardSidebar
              profile={profile}
              onNavigate={() => setIsDrawerOpen(false)}
            />
          </div>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
          <div className="flex h-16 items-center gap-4 px-5 md:px-8">
            <button
              type="button"
              onClick={() => setIsDrawerOpen((open) => !open)}
              aria-expanded={isDrawerOpen}
              aria-label={isDrawerOpen ? "Close navigation" : "Open navigation"}
              className="inline-flex size-10 items-center justify-center rounded-button text-foreground transition-colors duration-200 hover:bg-surface lg:hidden"
            >
              {isDrawerOpen ? (
                <XMarkIcon aria-hidden="true" className="size-5" />
              ) : (
                <Bars3Icon aria-hidden="true" className="size-5" />
              )}
            </button>

            <h1 className="truncate text-h6 font-bold text-foreground">
              {title}
            </h1>

            <div className="ml-auto">
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main id="main-content" className="flex-1 px-5 py-8 md:px-8 md:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
