"use client";

import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { LogoutButton } from "@/components/dashboard/logout-button";
import { Logo } from "@/components/shared/logo";
import { DASHBOARD_NAV_ITEMS } from "@/lib/constants/dashboard-navigation";
import { cn } from "@/lib/utils/cn";
import type { AccountProfile } from "@/types/user";

export function DashboardSidebar({
  profile,
  collapsed = false,
  onToggleCollapsed,
  onNavigate,
}: {
  profile: AccountProfile;
  collapsed?: boolean;
  onToggleCollapsed?: () => void;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <div className="relative flex h-full flex-col border-r border-border bg-surface">
      {onToggleCollapsed ? (
        <button
          type="button"
          onClick={onToggleCollapsed}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={cn(
            "absolute right-0 top-20 z-10 translate-x-1/2",
            "flex size-7 items-center justify-center rounded-badge",
            "border border-border bg-surface-raised text-subtle-foreground",
            "transition-colors duration-200",
            "hover:border-accent hover:bg-accent-soft hover:text-accent-text",
          )}
        >
          {collapsed ? (
            <ChevronDoubleRightIcon aria-hidden="true" className="size-3.5" />
          ) : (
            <ChevronDoubleLeftIcon aria-hidden="true" className="size-3.5" />
          )}
        </button>
      ) : null}
      <div
        className={cn(
          "flex h-16 items-center border-b border-border",
          collapsed ? "justify-center px-3" : "justify-between px-5",
        )}
      >
        {collapsed ? (
          <Link
            href="/dashboard"
            aria-label="BuildWise AI"
            className="transition-opacity duration-200 hover:opacity-80"
          >
            <LogoMark />
          </Link>
        ) : (
          <Logo href="/dashboard" />
        )}
      </div>

      <nav
        aria-label="Dashboard"
        className={cn("flex-1 pt-8 md:pt-10", collapsed ? "px-3" : "px-2")}
      >
        <ul className="flex flex-col gap-1">
          {DASHBOARD_NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const label = item.available ? item.label : `${item.label} (soon)`;

            const inner = (
              <>
                <item.icon aria-hidden="true" className="size-5 shrink-0" />
                {collapsed ? (
                  <span className="sr-only">{label}</span>
                ) : (
                  <>
                    {item.label}
                    {!item.available ? (
                      <span className="ml-auto rounded-badge border border-border px-2 py-0.5 text-body-xs">
                        Soon
                      </span>
                    ) : null}
                  </>
                )}
              </>
            );

            const shared = cn(
              "flex items-center gap-3 rounded-button py-2.5 text-body-sm transition-colors duration-200",
              collapsed ? "justify-center px-0" : "px-3",
            );

            if (!item.available) {
              return (
                <li key={item.label}>
                  <span
                    aria-disabled="true"
                    title={collapsed ? label : undefined}
                    className={cn(shared, "text-subtle-foreground opacity-60")}
                  >
                    {inner}
                  </span>
                </li>
              );
            }

            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  title={collapsed ? item.label : undefined}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    shared,
                    isActive
                      ? "bg-accent-soft text-accent-text"
                      : "text-muted-foreground hover:bg-surface-hover hover:text-foreground",
                  )}
                >
                  {inner}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div
        className={cn("border-t border-border", collapsed ? "p-3" : "px-5 py-4")}
      >
        {collapsed ? (
          <div className="flex flex-col items-center gap-3">
            <span
              title={profile.email}
              className="flex size-9 items-center justify-center rounded-badge bg-accent-soft text-body-sm font-semibold text-accent-text"
            >
              {profile.name.charAt(0).toUpperCase()}
            </span>
            <LogoutButton iconOnly />
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 pb-3">
              <span
                aria-hidden="true"
                className="flex size-9 shrink-0 items-center justify-center rounded-badge bg-accent-soft text-body-sm font-semibold text-accent-text"
              >
                {profile.name.charAt(0).toUpperCase()}
              </span>
              <div className="min-w-0">
                <p className="truncate text-body-sm font-medium text-foreground">
                  {profile.name}
                </p>
                <p className="truncate text-body-xs text-subtle-foreground">
                  {profile.email}
                </p>
              </div>
            </div>
            <LogoutButton block />
          </>
        )}

      </div>
    </div>
  );
}

function LogoMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-7" fill="none">
      <rect x="3" y="4" width="18" height="4" rx="1.5" className="fill-accent" />
      <rect
        x="3"
        y="10"
        width="18"
        height="4"
        rx="1.5"
        className="fill-subtle-foreground"
      />
      <rect
        x="3"
        y="16"
        width="12"
        height="4"
        rx="1.5"
        className="fill-border-strong"
      />
    </svg>
  );
}
