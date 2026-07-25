import Link from "next/link";
import { Layers, Search } from "lucide-react";

import { RigTreeMark } from "@/components/rigtree-mark";
import { Button } from "@/components/ui/button";
import { NavAuthControls } from "@/components/auth-actions";
import { ParticlesBackground } from "@/components/particles-background";
import { ScrollReveal } from "@/components/scroll-reveal";
import { ExploreContent } from "@/components/explore-content";
import { getPublicSetups } from "@/lib/setups";

export const metadata = {
  title: "Explore Setups — RigTree",
  description:
    "Browse hardware setups shared by the RigTree community. Discover desktops, laptops, and tech rigs from real builders.",
};

export const dynamic = "force-dynamic";

export default async function ExplorePage() {
  const setups = await getPublicSetups();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <ScrollReveal />

      {/* Nav */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background/75 backdrop-blur-xl">
        <nav className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-md border border-border bg-secondary text-foreground transition-colors hover:bg-accent">
              <RigTreeMark className="size-5" />
            </span>
            <span className="text-sm font-semibold tracking-tight">
              RigTree
            </span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            <Button asChild variant="ghost" size="sm">
              <Link href="/">Home</Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/explore">Explore</Link>
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <NavAuthControls />
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-20">
        <div className="grid-field absolute inset-0 opacity-[0.12]" />
        <div className="orb orb-blue absolute left-[-10%] top-[15%] h-[500px] w-[500px] opacity-25" />
        <div className="orb orb-purple absolute right-[-10%] bottom-[5%] h-[400px] w-[400px] opacity-20" />
        <ParticlesBackground />

        <div className="container relative z-10">
          <div className="reveal mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/30 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-4">
              <Search className="size-3 text-[#a3e635]" />
              Community
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
              Explore setups
            </h1>
            <p className="mt-4 text-base leading-7 text-muted-foreground md:text-lg">
              Discover hardware rigs shared by the RigTree community. See what
              real builders are running.
            </p>
          </div>

          {/* Stats bar */}
          <div className="reveal mx-auto mt-8 flex max-w-sm items-center justify-center gap-6 rounded-xl border border-border bg-card/40 px-6 py-3 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-sm">
              <Layers className="size-4 text-muted-foreground" />
              <span className="font-mono font-semibold">{setups.length}</span>
              <span className="text-muted-foreground">
                public setup{setups.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Grid Content */}
      <section className="relative pb-24">
        <div className="container">
          <ExploreContent setups={setups} />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background">
        <div className="container py-8">
          <div className="flex flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>&copy; {new Date().getFullYear()} RigTree. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
              <Link href="/about" className="hover:text-foreground transition-colors">About</Link>
              <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
