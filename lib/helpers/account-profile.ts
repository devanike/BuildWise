import type { User } from "@supabase/supabase-js";
import type { AccountProfile } from "@/types/user";

export function toAccountProfile(user: User): AccountProfile {
  const email = user.email ?? "";
  const metadataName =
    typeof user.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name
      : typeof user.user_metadata?.name === "string"
        ? user.user_metadata.name
        : "";

  return {
    id: user.id,
    email,
    name: metadataName.trim() || email.split("@")[0] || "there",
    isGoogleAccount: user.app_metadata?.provider === "google",
  };
}

export function toFirstName(name: string) {
  return name.split(" ")[0];
}
