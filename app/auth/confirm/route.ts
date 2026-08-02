import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { toInternalPath } from "@/lib/utils/site-url";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const code = searchParams.get("code");
  const next = toInternalPath(searchParams.get("next"));

  const supabase = await createClient();

  const destination = (pathname: string, search = "") => {
    const url = request.nextUrl.clone();
    url.pathname = pathname;
    url.search = search;
    return url;
  };

  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });
    if (!error) {
      return NextResponse.redirect(destination(next));
    }
  }

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(destination(next));
    }
  }

  return NextResponse.redirect(destination("/sign-in", "?error=link-invalid"));
}
