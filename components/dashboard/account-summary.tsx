import { CheckBadgeIcon } from "@heroicons/react/24/outline";

import type { AccountProfile } from "@/types/user";

export function AccountSummary({ profile }: { profile: AccountProfile }) {
  return (
    <section
      aria-labelledby="account-heading"
      className="rounded-card border border-border bg-linear-to-b from-surface-raised to-surface p-8"
    >
      <h2 id="account-heading" className="text-h6 font-bold text-foreground">
        Your account
      </h2>

      <dl className="mt-6 flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <dt className="text-body-xs font-medium text-subtle-foreground">Name</dt>
          <dd className="text-body text-foreground">{profile.name}</dd>
        </div>

        <div className="flex flex-col gap-1">
          <dt className="text-body-xs font-medium text-subtle-foreground">
            Email address
          </dt>
          <dd className="flex flex-wrap items-center gap-2 text-body text-foreground">
            {profile.email}
            <span className="inline-flex items-center gap-1.5 rounded-badge border border-accent-line bg-accent-soft px-3 py-1 text-body-xs font-medium text-accent-text">
              <CheckBadgeIcon aria-hidden="true" className="size-4" />
              Verified
            </span>
          </dd>
        </div>

        <div className="flex flex-col gap-1">
          <dt className="text-body-xs font-medium text-subtle-foreground">
            Sign in method
          </dt>
          <dd className="text-body text-foreground">
            {profile.isGoogleAccount ? "Google" : "Email and password"}
          </dd>
        </div>
      </dl>
    </section>
  );
}
