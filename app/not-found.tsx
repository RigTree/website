import Link from "next/link";
import { Monitor, Cpu, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ParticlesBackground } from "@/components/particles-background";

export const metadata = {
  title: "404 - Not Found | RigTree",
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
        <div className="mb-8 flex space-x-4 animate-bounce duration-1000">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-secondary/50 shadow-soft backdrop-blur">
            <Cpu className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-secondary/50 shadow-soft backdrop-blur">
            <Monitor className="h-8 w-8 text-muted-foreground" />
          </div>
        </div>

        <h1 className="text-6xl font-extrabold tracking-tight md:text-8xl">404</h1>
        <h2 className="mt-4 text-2xl font-bold tracking-tight text-foreground/90">Page not found</h2>
        
        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          We couldn&apos;t find the page or profile you were looking for. It might have been moved or the builder may have changed their username.
        </p>

        <div className="mt-8 flex gap-4">
          <Button asChild size="lg" className="gap-2 shadow-soft">
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
