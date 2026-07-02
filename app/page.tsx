import {
  Box,
  Cable,
  Cpu,
  Github,
  Laptop,
  Monitor,
  MousePointer2,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  UserRound,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AuthPrimaryAction, NavAuthControls } from "@/components/auth-actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const profileStats = [
  ["Desktop", "1"],
  ["Laptops", "2"],
  ["Displays", "3"],
];

const specRows = [
  ["CPU", "Ryzen 9 7950X"],
  ["GPU", "RTX 4080 Super"],
  ["Memory", "64 GB DDR5"],
  ["Display", "2 x 27 in 4K"],
];

const features = [
  {
    icon: Cpu,
    title: "Deep spec cards",
    description:
      "List parts, peripherals, screens, upgrades, and what each machine is built for.",
  },
  {
    icon: UserRound,
    title: "One public profile",
    description:
      "Share a clean handle that feels like a hardware portfolio, not a spreadsheet.",
  },
  {
    icon: Search,
    title: "Browse real rigs",
    description:
      "Discover setups by device type, workload, budget, and the parts people actually run.",
  },
  {
    icon: Cable,
    title: "Desk context",
    description:
      "Show the whole setup around the machine: monitors, input gear, docks, and cables.",
  },
  {
    icon: Github,
    title: "Creator friendly",
    description:
      "Point viewers toward your GitHub, channels, projects, and build notes in one place.",
  },
  {
    icon: ShieldCheck,
    title: "Signal over noise",
    description:
      "A restrained layout keeps the focus on the machines instead of social clutter.",
  },
];

const profileIdeas = [
  {
    owner: "nora.dev",
    label: "SFF workstation",
    parts: "7950X3D / 64 GB / 4090 FE",
    icon: Box,
  },
  {
    owner: "axis",
    label: "Travel laptop kit",
    parts: "14 in OLED / eGPU dock / 2 TB",
    icon: Laptop,
  },
  {
    owner: "mira",
    label: "Studio desk",
    parts: "Mac Studio / 2 x 5K / MX Keys",
    icon: Monitor,
  },
];

const commitSha =
  process.env.NEXT_PUBLIC_COMMIT_SHA?.slice(0, 7) ??
  process.env.CF_PAGES_COMMIT_SHA?.slice(0, 7) ??
  "6072e7b";

function SpecPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border/70 py-3 last:border-b-0">
      <span className="font-mono text-xs text-muted-foreground">{label}</span>
      <span className="truncate text-right text-sm font-medium text-foreground">
        {value}
      </span>
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-xl">
        <nav className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-md border border-border bg-secondary font-mono text-sm font-semibold">
              RT
            </span>
            <span className="text-sm font-semibold">RigTree</span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            <Button asChild variant="ghost" size="sm">
              <Link href="#preview">Preview</Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="#features">Features</Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="#browse">Ideas</Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/editor">Editor</Link>
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <NavAuthControls />
          </div>
        </nav>
      </header>

      <section className="relative flex min-h-[88svh] items-center overflow-hidden pt-24">
        <Image
          src="/hero-rig-setup.png"
          alt="Monochrome desktop and laptop setup with dual monitors and an open PC case"
          fill
          priority
          sizes="100vw"
          className="hero-drift object-cover object-center"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,hsl(var(--background))_0%,hsl(var(--background)/0.92)_28%,hsl(var(--background)/0.48)_58%,hsl(var(--background)/0.15)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,hsl(var(--background))_0%,transparent_28%)]" />
        <div className="grid-field absolute inset-0 opacity-45" />

        <div className="container relative z-10 pb-24 pt-16">
          <div className="max-w-3xl">
            <Badge
              variant="outline"
              className="site-enter mb-6 bg-background/30 text-muted-foreground backdrop-blur"
            >
              Profiles for real setups
            </Badge>
            <h1 className="site-enter text-5xl font-extrabold leading-none text-foreground md:text-7xl lg:text-8xl">
              RigTree
            </h1>
            <p className="site-enter-slow mt-6 max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl">
              A clean profile for the desktop, laptop, and everyday tech you
              actually use. Show the build, the desk, the parts, and the story
              behind it.
            </p>

            <div className="site-enter-slow mt-8 flex flex-col gap-3 sm:flex-row">
              <AuthPrimaryAction
                signedOutText="Build your profile"
                signedInText="Open editor"
                size="lg"
              />
              <Button asChild variant="outline" size="lg">
                <Link href="#browse">
                  Profile ideas
                  <MousePointer2 aria-hidden="true" />
                </Link>
              </Button>
            </div>

            <div className="site-enter-slow mt-12 grid max-w-lg grid-cols-3 border-y border-border/70 bg-background/20 backdrop-blur">
              {[
                ["Rig profiles", "8.4k"],
                ["Parts logged", "92k"],
                ["Setups shared", "14k"],
              ].map(([label, value]) => (
                <div key={label} className="px-4 py-4 first:pl-0 last:pr-0">
                  <p className="font-mono text-xl font-semibold text-foreground md:text-2xl">
                    {value}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border/70 bg-background">
        <div className="container grid gap-3 py-4 text-sm text-muted-foreground md:grid-cols-4">
          {["Desktops", "Laptops", "Smartphones", "Peripherals"].map((item) => (
            <div key={item} className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-foreground/70" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="preview" className="relative py-20 md:py-28">
        <div className="noise absolute inset-0 opacity-[0.04]" />
        <div className="container relative">
          <div className="mb-10 flex max-w-3xl flex-col gap-4">
            <p className="font-mono text-xs uppercase text-muted-foreground">
              Profile preview
            </p>
            <h2 className="text-3xl font-bold leading-tight md:text-5xl">
              Turn a parts list into a page worth sharing.
            </h2>
          </div>

          <div className="surface-lift overflow-hidden rounded-lg border border-border bg-card shadow-soft">
            <div className="flex flex-col gap-5 border-b border-border bg-secondary/60 p-5 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex size-14 items-center justify-center rounded-lg border border-border bg-background">
                  <UserRound
                    className="size-6 text-muted-foreground"
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">alexbuilds</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Workstation, travel kit, and desk notes.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 divide-x divide-border border border-border bg-background/40">
                {profileStats.map(([label, value]) => (
                  <div key={label} className="min-w-24 px-4 py-3 text-center">
                    <p className="font-mono text-lg font-semibold">{value}</p>
                    <p className="text-xs text-muted-foreground">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="border-b border-border p-5 lg:border-b-0 lg:border-r">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Monitor
                      className="size-4 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <p className="text-sm font-medium">Main desk rig</p>
                  </div>
                  <Badge variant="secondary">Daily driver</Badge>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {specRows.map(([label, value]) => (
                    <SpecPill key={label} label={label} value={value} />
                  ))}
                </div>
              </div>

              <div className="p-5">
                <div className="mb-4 flex items-center gap-2">
                  <Sparkles
                    className="size-4 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <p className="text-sm font-medium">Setup notes</p>
                </div>
                <div className="space-y-3 text-sm leading-6 text-muted-foreground">
                  <p>
                    Quiet workstation for code, rendering, and gaming. Monitors
                    are color matched, laptop stays docked for travel days.
                  </p>
                  <Separator />
                  <div className="grid grid-cols-2 gap-3">
                    <div className="surface-lift rounded-md border border-border bg-background/35 p-3">
                      <Smartphone
                        className="mb-3 size-4 text-muted-foreground"
                        aria-hidden="true"
                      />
                      <p className="text-foreground">Pixel 9 Pro</p>
                      <p className="mt-1 text-xs">Mobile camera kit</p>
                    </div>
                    <div className="surface-lift rounded-md border border-border bg-background/35 p-3">
                      <Laptop
                        className="mb-3 size-4 text-muted-foreground"
                        aria-hidden="true"
                      />
                      <p className="text-foreground">ThinkPad X1</p>
                      <p className="mt-1 text-xs">Travel machine</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="features"
        className="border-y border-border/70 bg-secondary/30 py-20 md:py-28"
      >
        <div className="container">
          <div className="mb-10 max-w-2xl">
            <p className="font-mono text-xs uppercase text-muted-foreground">
              Why RigTree
            </p>
            <h2 className="mt-4 text-3xl font-bold leading-tight md:text-5xl">
              Built for people who care about the whole setup.
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="surface-lift bg-card/80">
                <CardHeader>
                  <feature.icon
                    className="mb-4 size-5 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="browse" className="py-20 md:py-28">
        <div className="container">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="font-mono text-xs uppercase text-muted-foreground">
                Profile ideas
              </p>
              <h2 className="mt-4 text-3xl font-bold leading-tight md:text-5xl">
                Start with the gear people ask about first.
              </h2>
            </div>
            <AuthPrimaryAction
              signedOutText="Save your first rig"
              signedInText="Add a rig"
              variant="outline"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {profileIdeas.map((idea) => (
              <Card key={idea.owner} className="surface-lift overflow-hidden bg-card">
                <CardHeader>
                  <div className="mb-6 flex h-28 items-center justify-center rounded-md border border-border bg-secondary/50">
                    <idea.icon
                      className="size-10 text-muted-foreground"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <CardTitle>{idea.label}</CardTitle>
                    <span className="font-mono text-xs text-muted-foreground">
                      @{idea.owner}
                    </span>
                  </div>
                  <CardDescription>{idea.parts}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-6 text-muted-foreground">
                    Use this format for a concise public card: purpose, core
                    specs, desk context, and upgrade notes.
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-secondary/30 py-16">
        <div className="container flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-mono text-xs uppercase text-muted-foreground">
              Claim your handle
            </p>
            <h2 className="mt-3 text-3xl font-bold">Start your RigTree.</h2>
          </div>
          <AuthPrimaryAction
            signedOutText="Create profile"
            signedInText="Open editor"
            size="lg"
          />
        </div>
      </section>

      <footer className="border-t border-border bg-background py-6">
        <div className="container flex flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>RigTree</p>
          <p className="font-mono">commit {commitSha}</p>
        </div>
      </footer>
    </main>
  );
}
