import Link from "next/link";
import { Clock, Rocket, Smartphone, Cpu, Layers, Globe, Search } from "lucide-react";

import { RigTreeMark } from "@/components/rigtree-mark";
import { Button } from "@/components/ui/button";
import { NavAuthControls } from "@/components/auth-actions";
import { ParticlesBackground } from "@/components/particles-background";
import { ScrollReveal } from "@/components/scroll-reveal";
import { Separator } from "@/components/ui/separator";

export const metadata = {
  title: "Changelog — RigTree",
  description:
    "See what's new on RigTree — recent updates, new features, and improvements to the hardware profile platform.",
};

const changelog = [
  {
    date: "July 2025",
    version: "0.4",
    entries: [
      {
        title: "Explore page",
        description:
          "A new public directory to browse all shared hardware setups from the community.",
        icon: Search,
        type: "feature" as const,
      },
      {
        title: "About & Changelog pages",
        description:
          "New pages explaining the RigTree mission, tech stack, and a public log of all changes.",
        icon: Globe,
        type: "feature" as const,
      },
      {
        title: "Removed mock data",
        description:
          "All pages now pull live data from the production database — no more hardcoded fallbacks.",
        icon: Layers,
        type: "improvement" as const,
      },
    ],
  },
  {
    date: "June 2025",
    version: "0.3",
    entries: [
      {
        title: "Phone picker",
        description:
          "Search and add mobile phones to your setup via the GSMArena-powered phone picker in the editor.",
        icon: Smartphone,
        type: "feature" as const,
      },
      {
        title: "Status page",
        description:
          "Real-time system health dashboard showing database, auth, and dataset uptime.",
        icon: Layers,
        type: "feature" as const,
      },
    ],
  },
  {
    date: "May 2025",
    version: "0.2",
    entries: [
      {
        title: "Public profiles",
        description:
          "Link-in-bio style profile pages at /u/username with avatar, setup title, and full part list.",
        icon: Layers,
        type: "feature" as const,
      },
      {
        title: "Desktop part picker",
        description:
          "Full editor for desktop PCs with searchable parts from the BuildCores open database.",
        icon: Cpu,
        type: "feature" as const,
      },
    ],
  },
  {
    date: "April 2025",
    version: "0.1",
    entries: [
      {
        title: "Initial launch",
        description:
          "Landing page, authentication via Clerk, and core infrastructure on Cloudflare + Supabase.",
        icon: Rocket,
        type: "feature" as const,
      },
    ],
  },
];

const typeColors = {
  feature: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  improvement: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  fix: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

const typeLabels = {
  feature: "New",
  improvement: "Improved",
  fix: "Fixed",
};

export default function ChangelogPage() {
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
        <div className="orb orb-purple absolute right-[-15%] top-[10%] h-[500px] w-[500px] opacity-25" />
        <ParticlesBackground />

        <div className="container relative z-10">
          <div className="reveal mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/30 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-4">
              <Clock className="size-3" />
              History
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
              Changelog
            </h1>
            <p className="mt-4 text-base leading-7 text-muted-foreground md:text-lg">
              A running log of new features, improvements, and fixes shipped to
              RigTree.
            </p>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="relative pb-24">
        <div className="container max-w-3xl">
          <div className="relative space-y-16">
            {/* Timeline line */}
            <div className="absolute left-[19px] top-0 bottom-0 w-px bg-border/60 hidden md:block" />

            {changelog.map((release, releaseIndex) => (
              <div key={release.version} className={`reveal reveal-delay-${(releaseIndex % 3) + 1}`}>
                {/* Release header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-xl border border-border bg-card shadow-sm">
                    <span className="font-mono text-xs font-bold text-foreground">
                      v{release.version}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold tracking-tight">
                      Version {release.version}
                    </h2>
                    <p className="font-mono text-xs text-muted-foreground">
                      {release.date}
                    </p>
                  </div>
                </div>

                {/* Entries */}
                <div className="ml-0 md:ml-14 space-y-3">
                  {release.entries.map((entry) => (
                    <div
                      key={entry.title}
                      className="glow-card rounded-xl border border-border bg-card/60 backdrop-blur-sm p-5"
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`flex size-9 shrink-0 items-center justify-center rounded-lg border ${typeColors[entry.type]}`}
                        >
                          <entry.icon className="size-4" aria-hidden="true" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-sm font-semibold">
                              {entry.title}
                            </h3>
                            <span
                              className={`rounded-full border px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider ${typeColors[entry.type]}`}
                            >
                              {typeLabels[entry.type]}
                            </span>
                          </div>
                          <p className="text-xs leading-5 text-muted-foreground">
                            {entry.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {releaseIndex < changelog.length - 1 && (
                  <Separator className="mt-16" />
                )}
              </div>
            ))}
          </div>
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
              <Link href="/explore" className="hover:text-foreground transition-colors">Explore</Link>
              <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
