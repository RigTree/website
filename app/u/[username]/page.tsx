import {
  ExternalLink,
  Globe,
  Calendar,
  GitBranch,
  Info,
  Github,
  Laptop,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { RigTreeMark } from "@/components/rigtree-mark";
import { Button } from "@/components/ui/button";
import type { BuildCoresPart } from "@/lib/buildcores-types";
import { getPublicSetup, type SavedSetup } from "@/lib/setups";
import { hasSupabaseConfig } from "@/lib/supabase-admin";
import { ParticlesBackground } from "@/components/particles-background";
import { ProfilePartsShowcase } from "@/components/profile-parts-showcase";

export const dynamic = "force-dynamic";
export const runtime = "edge";

type PartGroup = {
  id: string;
  label: string;
  parts: BuildCoresPart[];
};

const showcaseOrder = ["CPU", "GPU", "RAM", "Storage", "Monitor"];

// Metadata Generation for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  if (!hasSupabaseConfig()) {
    return {
      title: `@${username} - RigTree`,
      description: "Profile storage is not configured.",
    };
  }

  const saved = await getPublicSetup(username);

  if (!saved) {
    return {
      title: "Profile Not Found - RigTree",
    };
  }

  const displayName = saved.profile.display_name;
  const setupTitle = saved.setup?.title ?? "Hardware Setup";
  const setupDesc =
    saved.setup?.description ??
    `Explore @${saved.profile.username}'s custom rig build specs, benchmarks, and desk setup components on RigTree.`;

  return {
    title: `${displayName} (@${saved.profile.username}) - ${setupTitle} | RigTree`,
    description: setupDesc.slice(0, 160),
    openGraph: {
      title: `${displayName}'s Setup - RigTree`,
      description: setupDesc.slice(0, 160),
      type: "website",
    },
  };
}

function groupParts(parts: BuildCoresPart[]) {
  const groups = new Map<string, PartGroup>();

  for (const part of parts) {
    const current = groups.get(part.category) ?? {
      id: part.category,
      label: part.categoryLabel,
      parts: [],
    };

    current.parts.push(part);
    groups.set(part.category, current);
  }

  return Array.from(groups.values());
}

function sourceLabel(setup: SavedSetup["setup"]) {
  return setup?.source_commit?.slice(0, 7) ?? "none";
}

function coreParts(groups: PartGroup[]) {
  const byCategory = new Map(groups.map((group) => [group.id, group.parts[0]]));
  const ordered = showcaseOrder
    .map((category) => byCategory.get(category))
    .filter((part): part is BuildCoresPart => Boolean(part));

  return ordered.length ? ordered : groups.flatMap((group) => group.parts).slice(0, 5);
}

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  if (!hasSupabaseConfig()) {
    return <ProfileStorageUnavailable username={username} />;
  }

  const saved = await getPublicSetup(username);

  if (!saved) {
    notFound();
  }

  const groups = groupParts(saved.parts);
  const cores = coreParts(groups);
  const avatarStyle =
    saved.profile.avatar_url?.startsWith("https://")
      ? { backgroundImage: `url("${saved.profile.avatar_url}")` }
      : undefined;

  return (
    <main className="relative min-h-screen bg-background text-foreground overflow-hidden pb-16">
      {/* Background visual components */}
      <div className="orb orb-blue absolute left-[-10%] top-[8%] h-[550px] w-[550px] opacity-40 z-0 pointer-events-none" />
      <div className="orb orb-purple absolute right-[-10%] bottom-[15%] h-[500px] w-[500px] opacity-35 z-0 pointer-events-none" />
      <div className="grid-field absolute inset-0 opacity-[0.18] z-0 pointer-events-none" />
      <div className="noise absolute inset-0 opacity-[0.02] z-0 pointer-events-none" />
      <ParticlesBackground />

      {/* Main navigation */}
      <ProfileNav />

      {/* Profile Body */}
      <section className="container relative z-10 py-6 md:py-10 max-w-5xl">
        <div className="space-y-6 md:space-y-8">
          {/* Header Showcase Card */}
          <header className="site-enter overflow-hidden rounded-2xl border border-border/80 bg-card/25 backdrop-blur-xl shadow-soft">
            <div className="p-6 md:p-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-5 min-w-0">
                {/* Glowing Avatar Frame */}
                <div className="relative size-20 md:size-24 shrink-0 rounded-full p-[2px] bg-gradient-to-tr from-sky-400 via-violet-400 to-emerald-400 shadow-md">
                  <span
                    className="flex h-full w-full items-center justify-center rounded-full bg-card bg-cover bg-center border border-background/20"
                    style={avatarStyle}
                  >
                    {!avatarStyle ? (
                      <RigTreeMark className="size-10 text-muted-foreground" />
                    ) : (
                      <span className="sr-only">{saved.profile.display_name}</span>
                    )}
                  </span>
                </div>

                <div className="min-w-0 space-y-1">
                  <p className="font-mono text-xs uppercase tracking-wider text-sky-400 font-semibold">
                    @{saved.profile.username}
                  </p>
                  <h1 className="truncate text-3xl font-extrabold tracking-tight leading-tight md:text-4xl">
                    {saved.profile.display_name}
                  </h1>
                  <p className="text-sm font-medium text-muted-foreground tracking-tight">
                    {saved.setup?.title ?? "No public setup yet"}
                  </p>
                </div>
              </div>

              {/* Stats dashboard */}
              <div className="grid grid-cols-3 divide-x divide-border/60 border border-border bg-background/20 rounded-xl text-center min-w-[280px] shadow-sm backdrop-blur-md">
                <Metric label="Parts" value={saved.parts.length} />
                <Metric label="Categories" value={groups.length} />
                <Metric label="OpenDB" value={sourceLabel(saved.setup)} />
              </div>
            </div>

            {/* Description / Bio section */}
            {saved.setup?.description && (
              <div className="border-t border-border/60 bg-secondary/10 px-6 py-5 md:px-8">
                <p className="text-sm leading-relaxed text-muted-foreground/90 font-medium">
                  {saved.setup.description}
                </p>
              </div>
            )}
          </header>

          {!groups.length ? (
            <div className="site-enter-slow flex flex-col items-center justify-center text-center p-12 rounded-2xl border border-border bg-card/20 backdrop-blur-md">
              <Laptop className="size-12 text-muted-foreground/45 mb-4 animate-bounce" />
              <h3 className="text-lg font-bold">No public setups found</h3>
              <p className="text-sm text-muted-foreground mt-2 max-w-sm">
                This builder profile exists, but there is no public hardware loadout to show yet.
              </p>
              <Button asChild className="mt-6 shadow-md" size="sm">
                <Link href="/editor">Launch Editor</Link>
              </Button>
            </div>
          ) : (
            /* Main Content columns */
            <div className="grid gap-6 md:gap-8 lg:grid-cols-[1fr_300px]">
              {/* Left Column: Interactive parts listing */}
              <div className="bg-card/10 backdrop-blur-md rounded-2xl border border-border/70 p-5 md:p-6 shadow-sm min-w-0">
                <ProfilePartsShowcase initialParts={saved.parts} cores={cores} />
              </div>

              {/* Right Column: Metadata Sidebar */}
              <aside className="space-y-6">
                {/* System details card */}
                <div className="site-enter-slow rounded-2xl border border-border/70 bg-card/25 backdrop-blur-md p-5 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 text-foreground pb-2 border-b border-border/40">
                    <Info className="size-4.5 text-sky-400" />
                    <h3 className="font-bold text-sm tracking-tight">System Info</h3>
                  </div>

                  <dl className="space-y-3.5 text-sm">
                    {/* Pulsating status row */}
                    <div className="flex justify-between items-center">
                      <dt className="font-mono text-xs uppercase text-muted-foreground">Status</dt>
                      <dd className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                        <span className="inline-block size-1.5 animate-pulse rounded-full bg-emerald-400" />
                        <span>Public & Active</span>
                      </dd>
                    </div>

                    <SnapshotRow
                      label="Updated"
                      icon={Calendar}
                      value={
                        saved.setup?.published_at
                          ? new Date(saved.setup.published_at).toLocaleDateString("en-US", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "-"
                      }
                    />

                    <SnapshotRow
                      label="Visibility"
                      icon={Globe}
                      value={saved.setup?.visibility ?? "public"}
                    />

                    {saved.setup?.source_license && (
                      <SnapshotRow
                        label="License"
                        icon={GitBranch}
                        value={saved.setup.source_license}
                      />
                    )}
                  </dl>
                </div>

                {/* Source code repository card */}
                {saved.setup?.source_repository && (
                  <div className="site-enter-slow rounded-2xl border border-border/70 bg-gradient-to-br from-card/30 to-secondary/15 backdrop-blur-md p-5 shadow-sm space-y-4">
                    <div className="flex items-center gap-2">
                      <Github className="size-5 text-violet-400" />
                      <h4 className="font-bold text-sm">Git Reference</h4>
                    </div>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      This setup configuration is tracked open-source. Inspect the source repository or check out commit history below.
                    </p>
                    <a
                      href={saved.setup.source_repository}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-secondary/50 hover:bg-secondary hover:text-foreground text-muted-foreground px-4 py-2.5 text-sm font-semibold transition-all duration-200 shadow-sm"
                    >
                      Browse Source
                      <ExternalLink className="size-4" aria-hidden="true" />
                    </a>
                  </div>
                )}
              </aside>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function ProfileStorageUnavailable({ username }: { username: string }) {
  return (
    <main className="relative min-h-screen bg-background text-foreground overflow-hidden">
      <div className="orb orb-blue absolute left-[-10%] top-[10%] h-[500px] w-[500px] opacity-35 z-0 pointer-events-none" />
      <div className="orb orb-purple absolute right-[-10%] bottom-[15%] h-[450px] w-[450px] opacity-30 z-0 pointer-events-none" />
      <div className="grid-field absolute inset-0 opacity-[0.15] z-0 pointer-events-none" />
      <ParticlesBackground />

      <ProfileNav />

      <section className="container relative z-10 py-16 max-w-3xl flex justify-center items-center min-h-[70svh]">
        <div className="rounded-2xl border border-border/80 bg-card/25 backdrop-blur-xl p-8 shadow-soft text-center space-y-4">
          <span className="flex size-14 mx-auto items-center justify-center rounded-xl border border-border bg-secondary/50 text-muted-foreground">
            <RigTreeMark className="size-7" />
          </span>
          <div className="space-y-1">
            <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              @{username}
            </p>
            <h1 className="text-2xl font-bold tracking-tight">Profile storage is not configured</h1>
          </div>

          <p className="text-sm leading-relaxed text-muted-foreground max-w-md mx-auto">
            Supabase environment variables are missing in this environment, so RigTree
            cannot load public profile data here.
          </p>
          <div className="pt-4">
            <Button asChild variant="outline" size="sm">
              <Link href="/">Return to Home</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: number | string }) {
  const display = typeof value === "number" ? value.toLocaleString() : value;

  return (
    <div className="min-w-0 px-4 py-3">
      <p className="truncate font-mono text-base font-extrabold text-foreground tracking-tight md:text-lg">{display}</p>
      <p className="mt-0.5 text-[9px] font-mono uppercase tracking-wider text-muted-foreground">{label}</p>
    </div>
  );
}

function SnapshotRow({
  label,
  icon: Icon,
  value,
}: {
  label: string;
  icon: LucideIcon;
  value: string;
}) {
  return (
    <div className="flex justify-between items-center border-b border-border/40 pb-2.5 last:border-0 last:pb-0">
      <dt className="flex items-center gap-1.5 font-mono text-xs uppercase text-muted-foreground">
        <Icon className="size-3.5 text-muted-foreground/60" />
        <span>{label}</span>
      </dt>
      <dd className="min-w-0 truncate text-sm font-semibold text-foreground/90">{value}</dd>
    </div>
  );
}

function ProfileNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <nav className="container flex min-h-16 items-center justify-between gap-3 py-3">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-md border border-border bg-secondary text-foreground hover:bg-accent transition-colors duration-200 shadow-sm">
            <RigTreeMark className="size-5" />
          </span>
          <span className="text-sm font-bold tracking-tight">RigTree</span>
        </Link>

        <Button asChild variant="ghost" size="sm" className="font-semibold text-muted-foreground hover:text-foreground">
          <Link href="/editor">Editor</Link>
        </Button>
      </nav>
    </header>
  );
}
