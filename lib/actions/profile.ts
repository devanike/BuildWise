"use server";

import { revalidatePath } from "next/cache";
import { toFriendlyAuthError } from "@/lib/helpers/auth-errors";
import {
  validateName,
  validatePassword,
  validatePasswordConfirmation,
} from "@/lib/helpers/auth-validation";
import { createClient } from "@/lib/supabase/server";
import type { AuthActionState } from "@/types/auth";

function readField(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

function fail(previous: AuthActionState, error: string): AuthActionState {
  return { error, nonce: (previous.nonce ?? 0) + 1 };
}

export async function updateNameAction(
  previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const name = readField(formData, "name").trim();

  const validationError = validateName(name);
  if (validationError) return fail(previousState, validationError);

  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({
    data: { full_name: name },
  });

  if (error) return fail(previousState, toFriendlyAuthError(error));

  revalidatePath("/", "layout");

  return { success: "Your name has been updated." };
}

export async function changePasswordAction(
  previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const currentPassword = readField(formData, "currentPassword");
  const password = readField(formData, "password");
  const confirmPassword = readField(formData, "confirmPassword");

  if (!currentPassword) {
    return fail(previousState, "Please enter your current password.");
  }

  const validationError =
    validatePassword(password) ??
    validatePasswordConfirmation(password, confirmPassword);

  if (validationError) return fail(previousState, validationError);

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return fail(previousState, "Please sign in to continue.");
  }

  const { error: verifyError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPassword,
  });

  if (verifyError) {
    return fail(previousState, "Your current password is not correct.");
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) return fail(previousState, toFriendlyAuthError(error));

  revalidatePath("/", "layout");

  return { success: "Your password has been updated." };
}
