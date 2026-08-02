import type { Metadata } from "next";
import Link from "next/link";
import { AuthSplitLayout } from "@/components/auth/auth-split-layout";
import { SignUpForm } from "@/components/auth/sign-up-form";

export const metadata: Metadata = {
  title: "Create Account",
  description:
    "Create a BuildWise AI account and start planning your backend architecture.",
};

export default function SignUpPage() {
  return (
    <AuthSplitLayout
      title="Create your account"
      description={
        <>
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="font-medium text-accent-text underline-offset-4 transition-opacity duration-200 hover:opacity-80 hover:underline"
          >
            Sign in
          </Link>
        </>
      }
    >
      <SignUpForm />
    </AuthSplitLayout>
  );
}
