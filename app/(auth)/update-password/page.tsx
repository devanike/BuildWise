import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthSplitLayout } from "@/components/auth/auth-split-layout";
import { UpdatePasswordForm } from "@/components/auth/update-password-form";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "New Password",
  description: "Choose a new password for your BuildWise AI account.",
};

export default async function UpdatePasswordPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/forgot-password");
  }

  return (
    <AuthSplitLayout
      title="Choose a new password"
      description="Create a new password for your account. You will be signed in once it is saved."
    >
      <UpdatePasswordForm />
    </AuthSplitLayout>
  );
}
