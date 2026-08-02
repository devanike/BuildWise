import type { Metadata } from "next";
import { AuthSplitLayout } from "@/components/auth/auth-split-layout";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Request a link to reset your BuildWise AI password.",
};

export default function ForgotPasswordPage() {
  return (
    <AuthSplitLayout
      title="Reset your password"
      description="Enter the email address you signed up with and we will send you a link to create a new password."
    >
      <ForgotPasswordForm />
    </AuthSplitLayout>
  );
}
