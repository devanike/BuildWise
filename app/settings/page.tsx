import { InformationCircleIcon } from "@heroicons/react/24/outline";
import type { Metadata } from "next";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { LogoutButton } from "@/components/dashboard/logout-button";
import { PasswordForm } from "@/components/settings/password-form";
import { ProfileForm } from "@/components/settings/profile-form";
import { requireUser } from "@/lib/helpers/require-user";

export const metadata: Metadata = {
  title: "Settings",
  description: "Your profile and account settings.",
};

export default async function SettingsPage() {
  const profile = await requireUser();

  return (
    <DashboardShell profile={profile} title="Settings">
      <div className="flex max-w-2xl flex-col gap-10">
        <Section
          title="Profile"
          description="How your name appears across BuildWise AI."
        >
          <ProfileForm name={profile.name} email={profile.email} />
        </Section>

        <Section
          title="Password"
          description={
            profile.isGoogleAccount
              ? "How you sign in to your account."
              : "Change the password you use to sign in."
          }
        >
          {profile.isGoogleAccount ? (
            <div className="flex gap-3 rounded-input border border-border bg-background/50 px-4 py-4">
              <InformationCircleIcon
                aria-hidden="true"
                className="mt-0.5 size-5 shrink-0 text-accent-text"
              />
              <div className="flex flex-col gap-1.5">
                <p className="text-body-sm font-medium text-foreground">
                  You sign in with Google
                </p>
                <p className="text-body-sm text-muted-foreground">
                  Your password is managed by Google, so there is nothing to
                  change here. To update it, change your Google account
                  password.
                </p>
              </div>
            </div>
          ) : (
            <PasswordForm />
          )}
        </Section>

        <Section
          title="Account"
          description="Sign out of BuildWise AI on this device."
        >
          <LogoutButton />
        </Section>
      </div>
    </DashboardShell>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-5 border-b border-border pb-10 last:border-0 last:pb-0">
      <div className="flex flex-col gap-1.5">
        <h2 className="text-h6 font-bold text-foreground">{title}</h2>
        <p className="text-body-sm text-muted-foreground">{description}</p>
      </div>
      {children}
    </section>
  );
}
