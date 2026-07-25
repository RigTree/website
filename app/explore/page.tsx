import Link from "next/link";
import {
  Box,
  Cpu,
  Layers,
  Search,
  UserRound,
} from "lucide-react";

import { RigTreeMark } from "@/components/rigtree-mark";
import { Button } from "@/components/ui/button";
import { NavAuthControls } from "@/components/auth-actions";
import { ParticlesBackground } from "@/components/particles-background";
import { ScrollReveal } from "@/components/scroll-reveal";
import { getPublicSetups, type PublicSetupSummary } from "@/lib/setups";

export const metadata = {
  title: "Explore Setups — RigTree",
  description:
    "Browse hardware setups shared by the RigTree community. Discover desktops, laptops, and tech rigs from real builders.",
};

export const dynamic = "force-dynamic";

function SetupCard({ entry }: { entry: PublicSetupSummary }) {
  const avatarStyle =
    entry.profile.avatar_url?.startsWith("https://")
      ? { backgroundImage: `url("${entry.profile.avatar_url}")` }
      : undefined;

  return (
    <Link
      href={`/u/${entry.profile.username}`}
      className="glow-card group flex flex-col overflow-hidden rounded-xl border border-border bg-card/60 backdrop-blur-md transition-all"
    >
      {/* Card header */}
      <div className="flex items-center gap-3 border-b border-border bg-secondary/30 px-5 py-4">
        <div className="relative size-10 shrink-0 rounded-full p-[1.5px] bg-gradient-to-tr from-sky-400 via-violet-400 to-emerald-400">
          <span
            className="flex h-full w-full items-center justify-center rounded-full bg-card bg-cover bg-center border border-background"
            style={avatarStyle}
          >
            {!avatarStyle && (
              <UserRound className="size-4 text-muted-foreground" />
            )}
          </span>
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold group-hover:text-sky-400 transition-colors">
            {entry.profile.display_name}
          </p>
          <p className="truncate font-mono text-[10px] tracking-wider text-muted-foreground">
            @{entry.profile.username}
          </p>
        </div>
      </div>

      {/* Card body */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="text-base font-semibold leading-snug line-clamp-2">
          {entry.setup?.title ?? "Untitled Setup"}
        </h3>
        {entry.setup?.description && (
          <p className="text-xs leading-5 text-muted-foreground line-clamp-2">
            {entry.setup.description}
          </p>
        )}

        {/* Top parts */}
        {entry.topParts.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
            {entry.topParts.map((part) => (
              <span
                key={part}
                className="rounded-full border border-border bg-background/40 px-2 py-0.5 font-mono text-[10px] text-muted-foreground"
              >
                {part}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Card footer */}
      <div className="flex items-center justify-between border-t border-border bg-secondary/20 px-5 py-3">
        <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <Box className="size-3" />
            {entry.partCount} part{entry.partCount !== 1 ? "s" : ""}
          </span>
        </div>
        {entry.setup?.published_at && (
          <span className="font-mono text-[10px] text-muted-foreground">
            {new Date(entry.setup.published_at).toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            })}
          </span>
        )}
      </div>
    </Link>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-border/60 bg-card/20 backdrop-blur-md py-20 px-8 text-center">
      <div className="mb-5 flex size-16 items-center justify-center rounded-2xl border border-border bg-secondary/50 shadow-soft">
        <Cpu className="size-7 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-bold">No public setups yet</h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        Be the first to share your hardware setup with the community. Create a
        profile and publish your rig.
      </p>
      <Button asChild className="mt-6" size="lg">
        <Link href="/editor">Build your profile</Link>
      </Button>
    </div>
  );
}

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
              <Search className="size-3" />
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
          <div className="reveal mx-auto mt-10 flex max-w-sm items-center justify-center gap-6 rounded-xl border border-border bg-card/40 px-6 py-4 backdrop-blur-sm">
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

      {/* Grid */}
      <section className="relative pb-24">
        <div className="container">
          {setups.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {setups.map((entry, i) => (
                <div key={entry.profile.username} className={`reveal reveal-delay-${(i % 3) + 1}`}>
                  <SetupCard entry={entry} />
                </div>
              ))}
            </div>
          )}
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
