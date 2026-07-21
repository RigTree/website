import {
  ArrowRight,
  Box,
  Cable,
  Cpu,
  Code,
  Keyboard,
  Laptop,
  Monitor,
  MousePointer2,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  UserRound,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AuthPrimaryAction, NavAuthControls } from "@/components/auth-actions";
import { RigTreeMark } from "@/components/rigtree-mark";
import { Separator } from "@/components/ui/separator";
import { ScrollReveal } from "@/components/scroll-reveal";
import { ScrollProgress } from "@/components/scroll-progress";
import { SectionNav } from "@/components/section-nav";
import { ScrollText } from "@/components/scroll-text";
import { ParticlesBackground } from "@/components/particles-background";
import buildCoresIndex from "@/data/buildcores-index.json";
import type { BuildCoresIndex } from "@/lib/buildcores-types";
import { getGlobalStats } from "@/lib/setups";

const data = buildCoresIndex as BuildCoresIndex;

/* ─── Static data ─── */

const profileStats = [
  ["Desktop", "1"],
  ["Laptops", "2"],
  ["Displays", "3"],
];

const specRows = [
  ["CPU", "Ryzen 9 7950X"],
  ["GPU", "RTX 4080 Super"],
  ["Memory", "64 GB DDR5"],
  ["Display", "2 × 27 in 4K"],
];

const features = [
  {
    icon: Cpu,
    title: "Deep spec cards",
    description:
      "List parts, peripherals, screens, upgrades, and what each machine is built for.",
    accent: "blue",
  },
  {
    icon: UserRound,
    title: "One public profile",
    description:
      "Share a clean handle that feels like a hardware portfolio, not a spreadsheet.",
    accent: "purple",
  },
  {
    icon: Search,
    title: "Browse real rigs",
    description:
      "Discover setups by device type, workload, budget, and the parts people actually run.",
    accent: "cyan",
  },
  {
    icon: Cable,
    title: "Desk context",
    description:
      "Show the whole setup around the machine: monitors, input gear, docks, and cables.",
    accent: "blue",
  },
  {
    icon: Code,
    title: "Creator friendly",
    description:
      "Point viewers toward your GitHub, channels, projects, and build notes in one place.",
    accent: "purple",
  },
  {
    icon: ShieldCheck,
    title: "Signal over noise",
    description:
      "A restrained layout keeps the focus on the machines instead of social clutter.",
    accent: "cyan",
  },
];

const profileIdeas = [
  {
    owner: "nora.dev",
    label: "SFF workstation",
    parts: "7950X3D · 64 GB · RTX 4090 FE",
    purpose: "Compact powerhouse for 3D rendering and game dev.",
    icon: Box,
    color: "from-blue-500/10 to-transparent",
    dot: "bg-blue-400",
  },
  {
    owner: "axis",
    label: "Travel laptop kit",
    parts: "14-in OLED · eGPU dock · 2 TB NVMe",
    purpose: "Everything needed for remote dev, no desk required.",
    icon: Laptop,
    color: "from-violet-500/10 to-transparent",
    dot: "bg-violet-400",
  },
  {
    owner: "mira",
    label: "Studio desk",
    parts: "Mac Studio · 2 × 5K · MX Keys S",
    purpose: "Color-accurate creative station for video and design.",
    icon: Monitor,
    color: "from-cyan-500/10 to-transparent",
    dot: "bg-cyan-400",
  },
];

const steps = [
  {
    num: "01",
    title: "Claim your handle",
    desc: "Sign up and grab a short, clean username like rigtree.io/you.",
  },
  {
    num: "02",
    title: "Add your rigs",
    desc: "Create a card for every machine — desktop, laptop, or mobile.",
  },
  {
    num: "03",
    title: "Fill in the specs",
    desc: "Log CPU, GPU, memory, storage, peripherals, and desk gear.",
  },
  {
    num: "04",
    title: "Share your page",
    desc: "Drop the link anywhere — social bios, GitHub readmes, forums.",
  },
];

const techPills = [
  "Ryzen 9 7950X", "RTX 4090", "DDR5-6000", "PCIe 5.0 NVMe",
  "Apple M4 Pro", "OLED display", "eGPU dock", "Thunderbolt 4",
  "MX Master 3S", "QMK keyboard", "4K 144 Hz", "10 GbE NAS",
  "Pixel 9 Pro", "AirPods Max", "USB-C hub", "HomePod mini",
];

const commitSha =
  process.env.NEXT_PUBLIC_COMMIT_SHA?.slice(0, 7) ??
  process.env.CF_PAGES_COMMIT_SHA?.slice(0, 7) ??
  "6072e7b";

/* ─── Sub-components ─── */

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

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col gap-1 px-4 py-4 first:pl-0 last:pr-0">
      <p className="stat-value font-mono text-2xl font-bold md:text-3xl">
        {value}
      </p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

/* ─── Page ─── */

export default async function Home() {
  const { totalSetups } = await getGlobalStats();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <ScrollReveal />
      <ScrollProgress />
      <SectionNav />

      {/* ── Nav ── */}
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
            {[
              ["#how-it-works", "How it works"],
              ["#preview", "Preview"],
              ["#features", "Features"],
              ["#browse", "Ideas"],
            ].map(([href, label]) => (
              <Button key={href} asChild variant="ghost" size="sm">
                <Link href={href}>{label}</Link>
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <NavAuthControls />
          </div>
        </nav>
      </header>

      {/* ── Hero ── */}
      <section id="hero" className="relative flex min-h-[90svh] items-center overflow-hidden pt-24">
        {/* Background image */}
        <Image
          src="/hero-rig-setup.png"
          alt="Monochrome desktop and laptop setup with dual monitors and an open PC case"
          fill
          priority
          sizes="100vw"
          className="hero-drift object-cover object-center"
        />

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,hsl(var(--background))_0%,hsl(var(--background)/0.94)_30%,hsl(var(--background)/0.5)_60%,hsl(var(--background)/0.12)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,hsl(var(--background))_0%,transparent_32%)]" />
        <div className="grid-field absolute inset-0 opacity-40" />

        {/* Ambient orbs */}
        <div className="orb orb-blue absolute left-[-8%] top-[10%] h-[520px] w-[520px] opacity-60" />
        <div className="orb orb-purple absolute bottom-[5%] right-[8%] h-[420px] w-[420px] opacity-50" />

        {/* Particles Background */}
        <ParticlesBackground />

        {/* Content */}
        <div className="container relative z-10 pb-28 pt-16">
          <div className="max-w-3xl">
            <Badge
              variant="outline"
              className="site-enter-badge mb-2 gap-2 border-border/80 bg-background/30 text-muted-foreground backdrop-blur"
            >
              <span className="inline-block size-1.5 animate-pulse rounded-full bg-green-400" />
              Profiles for real setups
            </Badge>

            <h1 className="site-enter shimmer-text text-6xl font-extrabold leading-none tracking-tight py-4 md:text-7xl lg:text-8xl">
              RigTree
            </h1>
            <p className="site-enter mt-2 text-2xl font-light text-muted-foreground md:text-3xl">
              Your hardware, in one place.
            </p>

            <p className="site-enter-slow mt-6 max-w-lg text-base leading-8 text-muted-foreground md:text-lg">
              A clean, shareable profile for the desktop, laptop, and everyday
              tech you actually use. Show the build, the desk, the parts, and
              the story behind it.
            </p>

            <div className="site-enter-cta mt-8 flex flex-col gap-3 sm:flex-row">
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

            {/* Stats */}
            <div className="site-enter-stats mt-12 grid max-w-sm grid-cols-2 border-y border-border/70 bg-background/15 backdrop-blur divide-x divide-border/60">
              <StatItem value={totalSetups.toLocaleString()} label="Total setups" />
              <StatItem value={data.totalParts.toLocaleString()} label="Total parts" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Device-type ticker ── */}
      <section
        className="border-y border-border/60 bg-background py-4"
        style={{ overflow: "hidden" }}
        aria-hidden="true"
      >
        <div className="marquee-track">
          {[...techPills, ...techPills].map((pill, i) => (
            <span key={i} className="tech-pill mx-2 cursor-default shrink-0">
              {pill}
            </span>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" className="relative overflow-hidden py-24 md:py-32">
        <div className="noise absolute inset-0 opacity-[0.035]" />
        <div className="grid-field absolute inset-0 opacity-[0.15]" />
        <div className="orb orb-purple absolute left-[-15%] top-1/4 h-[450px] w-[450px] opacity-25" />
        <ParticlesBackground />
        <div className="container relative">
          <div className="reveal mb-16 max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              How it works
            </p>
            <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight md:text-5xl">
              From sign-up to shareable in minutes.
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <div
                key={step.num}
                className={`reveal reveal-delay-${i + 1} glow-card relative rounded-lg border border-border bg-card p-6`}
              >
                <span className="mb-4 block font-mono text-4xl font-bold text-border">
                  {step.num}
                </span>
                <h3 className="mb-2 text-base font-semibold">{step.title}</h3>
                <p className="text-sm leading-6 text-muted-foreground">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Scroll-driven text runner ── */}
      <ScrollText />

      {/* ── Profile preview ── */}
      <section
        id="preview"
        className="relative overflow-hidden border-y border-border/60 bg-secondary/20 py-24 md:py-32"
      >
        <div className="noise absolute inset-0 opacity-[0.03]" />
        <div className="grid-field absolute inset-0 opacity-[0.12]" />
        <div className="orb orb-blue absolute right-[-15%] bottom-1/4 h-[450px] w-[450px] opacity-20" />
        <ParticlesBackground />
        <div className="container relative">
          <div className="reveal mb-12 max-w-3xl">
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Profile preview
            </p>
            <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight md:text-5xl">
              Turn a parts list into a page worth sharing.
            </h2>
          </div>

          {/* Mock profile card */}
          <div className="reveal surface-lift overflow-hidden rounded-xl border border-border bg-card shadow-soft">
            {/* Profile header */}
            <div className="flex flex-col gap-5 border-b border-border bg-secondary/50 p-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex size-14 items-center justify-center rounded-xl border border-border bg-background shadow-inner">
                  <UserRound className="size-6 text-muted-foreground" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">alexbuilds</h3>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    Workstation, travel kit, and desk notes.
                  </p>
                  <div className="mt-2 flex gap-1.5">
                    {["build", "gaming", "remote"].map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-border bg-background/50 px-2 py-0.5 font-mono text-[10px] text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 divide-x divide-border rounded-lg border border-border bg-background/40">
                {profileStats.map(([label, value]) => (
                  <div key={label} className="min-w-24 px-5 py-3 text-center">
                    <p className="font-mono text-lg font-semibold">{value}</p>
                    <p className="text-xs text-muted-foreground">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Spec + notes */}
            <div className="grid gap-0 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="border-b border-border p-6 lg:border-b-0 lg:border-r">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Monitor className="size-4 text-muted-foreground" aria-hidden="true" />
                    <p className="text-sm font-medium">Main desk rig</p>
                  </div>
                  <Badge variant="secondary">Daily driver</Badge>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {specRows.map(([label, value]) => (
                    <SpecPill key={label} label={label} value={value} />
                  ))}
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {["NVMe 2 TB", "AIO 360mm", "ATX Tower", "USB-C hub"].map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-border bg-background/40 px-2.5 py-1 font-mono text-[11px] text-muted-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-6">
                <div className="mb-4 flex items-center gap-2">
                  <Sparkles className="size-4 text-muted-foreground" aria-hidden="true" />
                  <p className="text-sm font-medium">Setup notes</p>
                </div>
                <div className="space-y-4 text-sm leading-6 text-muted-foreground">
                  <p>
                    Quiet workstation for code, rendering, and gaming. Monitors
                    are color matched; laptop stays docked for travel days.
                  </p>
                  <Separator />
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { icon: Smartphone, name: "Pixel 9 Pro", note: "Mobile camera" },
                      { icon: Laptop, name: "ThinkPad X1", note: "Travel machine" },
                      { icon: Keyboard, name: "ZSA Voyager", note: "Split keyboard" },
                      { icon: Zap, name: "UPS 1500VA", note: "Power protection" },
                    ].map(({ icon: Icon, name, note }) => (
                      <div
                        key={name}
                        className="surface-lift rounded-lg border border-border bg-background/30 p-3"
                      >
                        <Icon className="mb-2.5 size-4 text-muted-foreground" aria-hidden="true" />
                        <p className="text-xs font-medium text-foreground">{name}</p>
                        <p className="mt-0.5 text-[11px] text-muted-foreground">{note}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section
        id="features"
        className="relative overflow-hidden py-24 md:py-32"
      >
        <div className="noise absolute inset-0 opacity-[0.035]" />
        <div className="grid-field absolute inset-0 opacity-[0.12]" />
        {/* Ambient orb */}
        <div className="orb orb-blue absolute right-0 top-1/4 h-[500px] w-[500px] opacity-30" />
        <ParticlesBackground />

        <div className="container relative">
          <div className="reveal mb-14 max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Why RigTree
            </p>
            <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight md:text-5xl">
              Built for people who care about the whole setup.
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className={`reveal reveal-delay-${(i % 3) + 1} glow-card relative overflow-hidden rounded-xl border border-border bg-card p-6`}
              >
                {/* Subtle gradient top accent */}
                <div
                  className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r ${
                    feature.accent === "blue"
                      ? "from-transparent via-blue-500/40 to-transparent"
                      : feature.accent === "purple"
                      ? "from-transparent via-violet-500/40 to-transparent"
                      : "from-transparent via-cyan-500/40 to-transparent"
                  }`}
                />
                <div
                  className={`icon-glow mb-5 flex size-10 items-center justify-center rounded-lg border border-border ${
                    feature.accent === "blue"
                      ? "bg-blue-500/10"
                      : feature.accent === "purple"
                      ? "bg-violet-500/10"
                      : "bg-cyan-500/10"
                  }`}
                >
                  <feature.icon
                    className={`size-5 ${
                      feature.accent === "blue"
                        ? "text-blue-400"
                        : feature.accent === "purple"
                        ? "text-violet-400"
                        : "text-cyan-400"
                    }`}
                    aria-hidden="true"
                  />
                </div>
                <h3 className="mb-2 text-base font-semibold">{feature.title}</h3>
                <p className="text-sm leading-6 text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Profile ideas ── */}
      <section
        id="browse"
        className="relative overflow-hidden border-y border-border/60 bg-secondary/20 py-24 md:py-32"
      >
        <div className="noise absolute inset-0 opacity-[0.03]" />
        <div className="grid-field absolute inset-0 opacity-[0.12]" />
        <div className="orb orb-purple absolute left-[-15%] bottom-1/4 h-[450px] w-[450px] opacity-20" />
        <ParticlesBackground />
        <div className="container relative">
          <div className="reveal mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                Profile ideas
              </p>
              <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight md:text-5xl">
                Start with the gear people ask about first.
              </h2>
            </div>
            <AuthPrimaryAction
              signedOutText="Save your first rig"
              signedInText="Add a rig"
              variant="outline"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {profileIdeas.map((idea, i) => (
              <div
                key={idea.owner}
                className={`reveal reveal-delay-${i + 1} glow-card overflow-hidden rounded-xl border border-border bg-card`}
              >
                {/* Icon block with gradient */}
                <div
                  className={`flex h-36 items-center justify-center bg-gradient-to-b ${idea.color} border-b border-border`}
                >
                  <div className="flex size-16 items-center justify-center rounded-2xl border border-border bg-background/60 shadow-soft backdrop-blur">
                    <idea.icon className="size-7 text-foreground" aria-hidden="true" />
                  </div>
                </div>
                <div className="p-5">
                  <div className="mb-1 flex items-center justify-between gap-3">
                    <h3 className="font-semibold">{idea.label}</h3>
                    <span className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                      <span className={`size-1.5 rounded-full ${idea.dot}`} />
                      @{idea.owner}
                    </span>
                  </div>
                  <p className="mb-3 font-mono text-xs text-muted-foreground">
                    {idea.parts}
                  </p>
                  <Separator className="mb-3" />
                  <p className="text-sm leading-6 text-muted-foreground">
                    {idea.purpose}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <div className="orb orb-blue absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 opacity-25" />
        <div className="orb orb-purple absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 opacity-20" />
        <div className="grid-field absolute inset-0 opacity-30" />

        <div className="container relative">
          <div className="reveal mx-auto max-w-2xl text-center">
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Claim your handle
            </p>
            <h2 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
              Start your RigTree.
            </h2>
            <p className="mt-5 text-base leading-8 text-muted-foreground md:text-lg">
              Join thousands of builders who document and share their setups.
              It only takes a few minutes.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <AuthPrimaryAction
                signedOutText="Create profile — it's free"
                signedInText="Open editor"
                size="lg"
              />
              <Button asChild variant="outline" size="lg">
                <Link href="#features">
                  Learn more
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
            </div>

            {/* Trust row */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {[
                "No credit card required",
                "Shareable immediately",
                "Import from PCPartPicker",
              ].map((t) => (
                <span
                  key={t}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground"
                >
                  <span className="size-1 rounded-full bg-muted-foreground/60" />
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border bg-background">
        <div className="container py-10">
          <div className="grid gap-8 sm:grid-cols-[1fr_auto_auto_auto]">
            {/* Brand */}
            <div>
              <Link href="/" className="flex items-center gap-2.5">
                <span className="flex size-8 items-center justify-center rounded-md border border-border bg-secondary">
                  <RigTreeMark className="size-4" />
                </span>
                <span className="text-sm font-semibold">RigTree</span>
              </Link>
              <p className="mt-3 max-w-xs text-xs leading-5 text-muted-foreground">
                A clean profile for the hardware you actually use.
              </p>
            </div>

            {/* Links */}
            {[
              {
                heading: "Product",
                links: [
                  ["#preview", "Preview"],
                  ["#features", "Features"],
                  ["/editor", "Editor"],
                ],
              },
              {
                heading: "Community",
                links: [
                  ["#browse", "Profile ideas"],
                  ["https://github.com", "GitHub"],
                ],
              },
              {
                heading: "Legal",
                links: [
                  ["/privacy", "Privacy"],
                  ["/terms", "Terms"],
                ],
              },
            ].map((col) => (
              <div key={col.heading}>
                <p className="mb-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  {col.heading}
                </p>
                <ul className="space-y-2">
                  {col.links.map(([href, label]) => (
                    <li key={href}>
                      <Link
                        href={href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <Separator className="my-8" />

          <div className="flex flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} RigTree. All rights reserved. Hardware data powered by{" "}
              <a href="https://buildcores.com" target="_blank" rel="noreferrer" className="hover:text-foreground hover:underline">
                BuildCores DB
              </a>.
            </p>
            <p className="font-mono">commit {commitSha}</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
