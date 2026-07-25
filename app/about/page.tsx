import Link from "next/link";
import {
  Code,
  Database,
  Globe,
  Heart,
  Lock,
  Server,
  Sparkles,
} from "lucide-react";

import { RigTreeMark } from "@/components/rigtree-mark";
import { Button } from "@/components/ui/button";
import { NavAuthControls } from "@/components/auth-actions";
import { ParticlesBackground } from "@/components/particles-background";
import { ScrollReveal } from "@/components/scroll-reveal";
import { Separator } from "@/components/ui/separator";

export const metadata = {
  title: "About — RigTree",
  description:
    "Learn about RigTree — a clean, shareable profile for the hardware you actually use. Built for builders, by builders.",
};

const techStack = [
  {
    name: "Next.js",
    description: "React framework for the web app and server-side rendering.",
    icon: Globe,
    accent: "bg-blue-500/10 border-blue-500/20 text-blue-400",
  },
  {
    name: "Supabase",
    description: "Postgres database for profiles, setups, and part data.",
    icon: Database,
    accent: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
  },
  {
    name: "Clerk",
    description: "Authentication and identity management for user accounts.",
    icon: Lock,
    accent: "bg-violet-500/10 border-violet-500/20 text-violet-400",
  },
  {
    name: "Cloudflare",
    description: "Edge deployment, CDN, and DNS for global performance.",
    icon: Server,
    accent: "bg-orange-500/10 border-orange-500/20 text-orange-400",
  },
  {
    name: "BuildCores DB",
    description: "Open-source hardware catalog powering part specifications.",
    icon: Sparkles,
    accent: "bg-cyan-500/10 border-cyan-500/20 text-cyan-400",
  },
  {
    name: "Open Source",
    description: "RigTree is built in the open. Contributions are welcome.",
    icon: Code,
    accent: "bg-pink-500/10 border-pink-500/20 text-pink-400",
  },
];

export default function AboutPage() {
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
        <div className="orb orb-blue absolute left-[-15%] top-[10%] h-[500px] w-[500px] opacity-25" />
        <div className="orb orb-purple absolute right-[-10%] bottom-[10%] h-[400px] w-[400px] opacity-20" />
        <ParticlesBackground />

        <div className="container relative z-10">
          <div className="reveal mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/30 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-4">
              <Heart className="size-3" />
              About
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
              Built for builders.
            </h1>
            <p className="mt-6 text-base leading-8 text-muted-foreground md:text-lg max-w-2xl mx-auto">
              RigTree is a clean, shareable profile for the hardware you actually
              use. No social clutter, no engagement farming &mdash; just your
              machines, your desk, and the parts that make it all work.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="relative border-y border-border/60 bg-secondary/20 py-20 md:py-28 overflow-hidden">
        <div className="noise absolute inset-0 opacity-[0.03]" />
        <div className="container relative z-10">
          <div className="reveal mx-auto max-w-3xl">
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4">
              Why we built this
            </p>
            <h2 className="text-2xl font-bold tracking-tight md:text-4xl mb-6">
              Hardware deserves a better home.
            </h2>
            <div className="space-y-4 text-sm leading-7 text-muted-foreground md:text-base md:leading-8">
              <p>
                Most people track their tech builds in spreadsheets, forum
                signatures, or scattered across social media profiles. There was
                no single place to document your entire setup — desktop, laptop,
                phone, peripherals, and desk gear — in a way that looks good
                and is easy to share.
              </p>
              <p>
                RigTree exists to solve that. One URL, one profile, all your
                hardware. Whether you are a developer showing off your
                workstation, a gamer sharing your rig, or a creator documenting
                your studio — RigTree gives your setup the home it deserves.
              </p>
              <p>
                We believe in signal over noise. The design is intentionally
                restrained — no ads, no follower counts, no engagement
                mechanics. Just clean hardware profiles that speak for
                themselves.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="relative overflow-hidden py-20 md:py-28">
        <div className="grid-field absolute inset-0 opacity-[0.1]" />
        <ParticlesBackground />

        <div className="container relative z-10">
          <div className="reveal mb-14 max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Built with
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
              The stack behind RigTree.
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {techStack.map((tech, i) => (
              <div
                key={tech.name}
                className={`reveal reveal-delay-${(i % 3) + 1} glow-card rounded-xl border border-border bg-card p-6`}
              >
                <div
                  className={`icon-glow mb-5 flex size-10 items-center justify-center rounded-lg border ${tech.accent}`}
                >
                  <tech.icon className="size-5" aria-hidden="true" />
                </div>
                <h3 className="mb-2 text-base font-semibold">{tech.name}</h3>
                <p className="text-sm leading-6 text-muted-foreground">
                  {tech.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Source CTA */}
      <section className="relative border-t border-border/60 bg-secondary/20 py-20 md:py-28 overflow-hidden">
        <div className="noise absolute inset-0 opacity-[0.03]" />
        <div className="container relative z-10">
          <div className="reveal mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Want to contribute?
            </h2>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              RigTree is open source. Report bugs, request features, or submit
              a pull request on GitHub.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg">
                <a
                  href="https://github.com/AltamashRafworx/RigTree"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Code className="size-4" />
                  View on GitHub
                </a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/changelog">View Changelog</Link>
              </Button>
            </div>
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
              <Link href="/explore" className="hover:text-foreground transition-colors">Explore</Link>
              <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
