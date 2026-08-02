import type { Metadata } from "next";
import Link from "next/link";
import { AuthSplitLayout } from "@/components/auth/auth-split-layout";
import { SignInForm } from "@/components/auth/sign-in-form";
import { toInternalPath } from "@/lib/utils/site-url";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to BuildWise AI to continue planning your backend.",
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ redirectTo?: string; error?: string }>;
}) {
  const params = await searchParams;
  const redirectTo = toInternalPath(params.redirectTo);

  return (
    <AuthSplitLayout
      title="Welcome back"
      description={
        <>
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            className="font-medium text-accent-text underline-offset-4 transition-opacity duration-200 hover:opacity-80 hover:underline"
          >
            Create one
          </Link>
        </>
      }
    >
      <SignInForm
        redirectTo={redirectTo}
        linkError={params.error === "link-invalid"}
      />
    </AuthSplitLayout>
  );
}
