"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { toFriendlyAuthError } from "@/lib/helpers/auth-errors";
import {
  firstError,
  validateEmail,
  validateName,
  validatePassword,
  validatePasswordConfirmation,
} from "@/lib/helpers/auth-validation";
import { createClient } from "@/lib/supabase/server";
import { getSiteUrl, toInternalPath } from "@/lib/utils/site-url";
import type { AuthActionState } from "@/types/auth";

function readField(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

function fail(
  previous: AuthActionState,
  error: string,
  values?: AuthActionState["values"],
): AuthActionState {
  return { error, values, nonce: (previous.nonce ?? 0) + 1 };
}

export async function signUpAction(
  previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const name = readField(formData, "name").trim();
  const email = readField(formData, "email").trim();
  const password = readField(formData, "password");
  const confirmPassword = readField(formData, "confirmPassword");

  const values = { name, email };

  const validationError = firstError(
    validateName(name),
    validateEmail(email),
    validatePassword(password),
    validatePasswordConfirmation(password, confirmPassword),
  );

  if (validationError) {
    return fail(previousState, validationError, values);
  }

  const supabase = await createClient();
  const siteUrl = await getSiteUrl();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name },
      emailRedirectTo: `${siteUrl}/auth/confirm?next=/dashboard`,
    },
  });

  if (error) {
    return fail(previousState, toFriendlyAuthError(error), values);
  }

  return {
    success:
      "Check your inbox to verify your email address and finish setting up your account.",
  };
}

export async function signInAction(
  previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = readField(formData, "email").trim();
  const password = readField(formData, "password");
  const redirectTo = toInternalPath(readField(formData, "redirectTo"));

  const validationError = firstError(
    validateEmail(email),
    validatePassword(password),
  );

  if (validationError) {
    return fail(previousState, validationError, { email });
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return fail(previousState, toFriendlyAuthError(error), { email });
  }

  revalidatePath("/", "layout");
  redirect(redirectTo);
}

export async function requestPasswordResetAction(
  previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = readField(formData, "email").trim();

  const validationError = validateEmail(email);
  if (validationError) {
    return fail(previousState, validationError, { email });
  }

  const supabase = await createClient();
  const siteUrl = await getSiteUrl();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/auth/confirm?next=/update-password`,
  });

  if (error && error.code?.includes("rate_limit")) {
    return fail(previousState, toFriendlyAuthError(error), { email });
  }

  return {
    success:
      "If an account exists for that email address, a password reset link is on its way.",
  };
}

export async function updatePasswordAction(
  previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const password = readField(formData, "password");
  const confirmPassword = readField(formData, "confirmPassword");

  const validationError = firstError(
    validatePassword(password),
    validatePasswordConfirmation(password, confirmPassword),
  );

  if (validationError) {
    return fail(previousState, validationError);
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return fail(
      previousState,
      "That link has expired. Please request a new password reset link.",
    );
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return fail(previousState, toFriendlyAuthError(error));
  }

  revalidatePath("/", "layout");

  return { success: "Your password has been updated." };
}

export async function signOutAction() {
  const supabase = await createClient();

  await supabase.auth.signOut();

  revalidatePath("/", "layout");
  redirect("/sign-in");
}
