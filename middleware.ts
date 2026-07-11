import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextFetchEvent } from "next/server";

const isProtectedRoute = createRouteMatcher(["/editor(.*)", "/dashboard(.*)"]);

export default function middleware(request: NextRequest, event: NextFetchEvent) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ctx = (globalThis as any)[Symbol.for("__cloudflare-request-context__")];

  if (ctx && ctx.env) {
    // Polyfill process.env at runtime using Cloudflare bindings
    if (ctx.env.CLERK_SECRET_KEY) {
      process.env["CLERK_SECRET_KEY"] = ctx.env.CLERK_SECRET_KEY;
    }
    if (ctx.env.SUPABASE_SERVICE_ROLE_KEY) {
      process.env["SUPABASE_SERVICE_ROLE_KEY"] = ctx.env.SUPABASE_SERVICE_ROLE_KEY;
    }
  }

  const clerk = clerkMiddleware(async (auth, req) => {
    if (isProtectedRoute(req)) {
      await auth.protect({
        unauthenticatedUrl: new URL("/sign-in", req.url).toString(),
      });
    }
  });

  return clerk(request, event);
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/:path*",
  ],
};
