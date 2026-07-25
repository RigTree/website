import Link from "next/link";
import { Monitor, Cpu, Home, PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ParticlesBackground } from "@/components/particles-background";

export const metadata = {
  title: "404 — Page Not Found | RigTree",
  description: "The page or profile you were looking for could not be found.",
};

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-background text-foreground overflow-hidden">
      {/* Background visuals */}
      <div className="orb orb-blue absolute left-1/4 top-1/4 h-[500px] w-[500px] opacity-20 pointer-events-none" />
      <div className="orb orb-purple absolute right-1/4 bottom-1/4 h-[400px] w-[400px] opacity-20 pointer-events-none" />
      <div className="grid-field absolute inset-0 opacity-[0.15] pointer-events-none" />
      <ParticlesBackground />

      <div className="relative z-10 flex max-w-md flex-col items-center text-center p-6">
        {/* Icon pair */}
        <div className="mb-8 flex space-x-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-secondary/50 shadow-soft backdrop-blur transition-transform hover:-translate-y-1 duration-300">
            <Cpu className="h-7 w-7 text-muted-foreground" />
          </div>
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-secondary/50 shadow-soft backdrop-blur transition-transform hover:-translate-y-1 duration-300">
            <Monitor className="h-7 w-7 text-muted-foreground" />
          </div>
        </div>

        {/* Shimmer 404 */}
        <h1 className="shimmer-text text-8xl font-extrabold tracking-tight md:text-9xl">404</h1>
        <h2 className="mt-4 text-2xl font-bold tracking-tight">Page not found</h2>

        <p className="mt-4 max-w-xs text-sm leading-6 text-muted-foreground">
          We couldn&apos;t find the page or profile you were looking for. It might have been moved or the builder may have changed their username.
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Button asChild size="lg" className="gap-2 shadow-soft">
            <Link href="/">
              <Home className="h-4 w-4" />
              Return Home
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="gap-2">
            <Link href="/editor">
              <PenLine className="h-4 w-4" />
              Build a profile
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
