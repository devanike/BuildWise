import type { AuthError } from "@supabase/supabase-js";

export function toFriendlyAuthError(error: AuthError) {
  switch (error.code) {
    case "invalid_credentials":
      return "That email address and password do not match. Please try again.";
    case "email_not_confirmed":
      return "Please verify your email address before signing in.";
    case "user_already_exists":
    case "email_exists":
      return "An account with this email address already exists. Please sign in instead.";
    case "weak_password":
      return "Please choose a stronger password.";
    case "same_password":
      return "Please choose a password you have not used before.";
    case "over_email_send_rate_limit":
    case "over_request_rate_limit":
      return "Too many attempts. Please wait a moment and try again.";
    case "otp_expired":
      return "That link has expired. Please request a new one.";
    default:
      return "Something went wrong. Please try again.";
  }
}
