import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseEnv } from "./env";

const MAX_SESSION_DAYS = 14;

const PROTECTED_ROUTES = [
  "/dashboard",
  "/create-plan",
  "/generated-plan",
  "/plans",
  "/saved-plans",
  "/settings",
];
const AUTH_ROUTES = ["/sign-in", "/sign-up", "/forgot-password"];

function matchesRoute(pathname: string, routes: string[]) {
  return routes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const { url, anonKey } = getSupabaseEnv();

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  if (user && isSessionTooOld(user.last_sign_in_at)) {
    await supabase.auth.signOut();

    if (!matchesRoute(pathname, PROTECTED_ROUTES)) {
      return supabaseResponse;
    }

    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/sign-in";
    redirectUrl.search = "";
    redirectUrl.searchParams.set("redirectTo", pathname);

    return copyCookies(supabaseResponse, NextResponse.redirect(redirectUrl));
  }

  if (!user && matchesRoute(pathname, PROTECTED_ROUTES)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/sign-in";
    redirectUrl.searchParams.set("redirectTo", pathname);
    return copyCookies(supabaseResponse, NextResponse.redirect(redirectUrl));
  }

  if (user && matchesRoute(pathname, AUTH_ROUTES)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/dashboard";
    redirectUrl.search = "";
    return copyCookies(supabaseResponse, NextResponse.redirect(redirectUrl));
  }

  return supabaseResponse;
}

function isSessionTooOld(lastSignInAt: string | undefined): boolean {
  if (!lastSignInAt) return false;

  const signedInAt = new Date(lastSignInAt).getTime();
  if (Number.isNaN(signedInAt)) return false;

  return Date.now() - signedInAt > MAX_SESSION_DAYS * 24 * 60 * 60 * 1000;
}

function copyCookies(from: NextResponse, to: NextResponse) {
  from.cookies.getAll().forEach((cookie) => to.cookies.set(cookie));
  return to;
}
