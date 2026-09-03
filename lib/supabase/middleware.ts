import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { env, isSupabaseConfigured } from "@/lib/env";
import { CANONICAL_SITE_URL } from "@/lib/site-config";

/**
 * Handles canonical hostname redirect for /admin routes and refreshes the Supabase auth session cookie.
 */
export async function updateSession(request: NextRequest) {
  // 1. Hostname-aware canonical redirect for /admin routes
  const rawHost =
    request.headers.get("x-forwarded-host") ||
    request.headers.get("host") ||
    request.nextUrl.host ||
    "";
  const hostname = rawHost.split(":")[0].trim().toLowerCase();

  // Redirect legacy / alias domains (e.g. takete.netlify.app, *.netlify.app, taketeideamuro.org) to https://takete-ide.org
  const isLegacyHost =
    hostname === "takete.netlify.app" ||
    (hostname.endsWith(".netlify.app") && hostname !== "localhost") ||
    hostname === "taketeideamuro.org";

  if (isLegacyHost && request.nextUrl.pathname.startsWith("/admin")) {
    // Preserve clean path and search parameters safely without open-redirect risk
    const cleanPath = request.nextUrl.pathname.replace(/\/+/g, "/");
    const destination = new URL(
      `${cleanPath}${request.nextUrl.search}`,
      CANONICAL_SITE_URL
    );
    return NextResponse.redirect(destination.toString(), 308);
  }

  const response = NextResponse.next({ request });
  if (!isSupabaseConfigured) return response;

  const supabase = createServerClient(env.supabaseUrl!, env.supabaseAnonKey!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  await supabase.auth.getUser();
  return response;
}
