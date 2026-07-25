"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ParticlesBackground } from "@/components/particles-background";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global Error Boundary caught an error:", error);
  }, [error]);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-background text-foreground overflow-hidden">
      {/* Background visuals */}
      <div className="orb orb-purple absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 opacity-20 pointer-events-none" />
      <div className="orb orb-blue absolute right-1/4 top-1/4 h-[400px] w-[400px] opacity-10 pointer-events-none" />
      <div className="grid-field absolute inset-0 opacity-[0.15] pointer-events-none" />
      <ParticlesBackground />

      <div className="relative z-10 flex max-w-md flex-col items-center text-center p-6">
        {/* Error icon with glow */}
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10 shadow-[0_0_60px_-10px_rgba(239,68,68,0.4)] backdrop-blur">
          <AlertCircle className="h-10 w-10 text-red-400" />
        </div>

        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Something went wrong</h1>

        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          An unexpected error occurred while loading this page. The issue has been logged.
        </p>

        {/* Error digest for debugging */}
        {error.digest && (
          <div className="mt-4 rounded-lg border border-border bg-secondary/30 px-3 py-2">
            <p className="font-mono text-[11px] text-muted-foreground">
              Error ID: <span className="text-foreground/80">{error.digest}</span>
            </p>
          </div>
        )}

        <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Button
            onClick={() => reset()}
            size="lg"
            variant="default"
            className="gap-2 shadow-soft"
          >
            <RefreshCw className="h-4 w-4" />
            Try again
          </Button>
          <Button asChild size="lg" variant="outline" className="gap-2">
            <Link href="/">
              <Home className="h-4 w-4" />
              Return Home
            </Link>
          </Button>
        </div>

        {/* Subtle hint */}
        <p className="mt-8 font-mono text-[10px] uppercase tracking-widest text-muted-foreground/50">
          rigtree.io · hardware profiles
        </p>
      </div>
    </main>
  );
}
