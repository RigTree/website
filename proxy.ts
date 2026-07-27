
import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextRequest, NextFetchEvent } from "next/server";

export default function middleware(request: NextRequest, event: NextFetchEvent) {
  const globalObj = globalThis as unknown as Record<symbol, { env?: Record<string, string> }>;
  const ctx = globalObj[Symbol.for("__cloudflare-request-context__")];

  if (ctx && ctx.env) {
    // Polyfill process.env at runtime using Cloudflare bindings
    const keys = [
      "CLERK_SECRET_KEY",
      "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
      "NEXT_PUBLIC_CLERK_SIGN_IN_URL",
      "NEXT_PUBLIC_CLERK_SIGN_UP_URL",
      "NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL",
      "NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL",
      "SUPABASE_SERVICE_ROLE_KEY",
      "NEXT_PUBLIC_SUPABASE_URL"
    ];

    for (const key of keys) {
      if (ctx.env[key]) {
        process.env[key] = ctx.env[key];
      }
    }
  }

  const clerk = clerkMiddleware();
  return clerk(request, event);
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/:path*",
  ],
};
