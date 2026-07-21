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
      <div className="grid-field absolute inset-0 opacity-[0.15] pointer-events-none" />
      <ParticlesBackground />

      <div className="relative z-10 flex max-w-md flex-col items-center text-center p-6">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10 shadow-[0_0_40px_-10px_rgba(239,68,68,0.3)] backdrop-blur">
          <AlertCircle className="h-10 w-10 text-red-500" />
        </div>

        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Something went wrong</h1>
        
        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          An unexpected error occurred while loading this page. Our systems have logged the issue.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
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
      </div>
    </main>
  );
}
