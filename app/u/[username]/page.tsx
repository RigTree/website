import {
  Camera,
  CircuitBoard,
  Cpu,
  ExternalLink,
  HardDrive,
  Headphones,
  Keyboard,
  MemoryStick,
  Monitor,
  Mouse,
  Package2,
  PcCase,
  SquarePower,
  Zap,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { RigTreeMark } from "@/components/rigtree-mark";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { BuildCoresPart } from "@/lib/buildcores-types";
import { getPublicSetup, type SavedSetup } from "@/lib/setups";
import { hasSupabaseConfig } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";
export const runtime = "edge";

type PartGroup = {
  id: string;
  label: string;
  parts: BuildCoresPart[];
};

const categoryIcons: Record<string, LucideIcon> = {
  CPU: Cpu,
  GPU: Zap,
  Motherboard: CircuitBoard,
  RAM: MemoryStick,
  Storage: HardDrive,
  Monitor,
  Keyboard,
  Mouse,
  Headphones,
  PCCase: PcCase,
  PSU: SquarePower,
  Webcam: Camera,
};

const showcaseOrder = ["CPU", "GPU", "RAM", "Storage", "Monitor"];

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

function categoryIcon(categoryId: string) {
  return categoryIcons[categoryId] ?? Package2;
}

function compactName(part: BuildCoresPart) {
  return part.name.startsWith(part.manufacturer)
    ? part.name
    : `${part.manufacturer} ${part.name}`.trim();
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
    <main className="min-h-screen bg-background text-foreground">
      <ProfileNav />

      <section className="container py-5 md:py-8">
        <div className="mx-auto max-w-4xl overflow-hidden rounded-lg border border-border bg-card shadow-soft">
          <header className="border-b border-border bg-secondary/20 p-4 md:p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className="flex size-16 shrink-0 items-center justify-center rounded-full border border-foreground/30 bg-secondary bg-cover bg-center md:size-20"
                  style={avatarStyle}
                >
                  {!avatarStyle ? (
                    <RigTreeMark className="size-8" />
                  ) : (
                    <span className="sr-only">{saved.profile.display_name}</span>
                  )}
                </span>
                <div className="min-w-0">
                  <p className="font-mono text-xs uppercase text-muted-foreground">
                    @{saved.profile.username}
                  </p>
                  <h1 className="truncate text-3xl font-bold leading-tight md:text-4xl">
                    {saved.profile.display_name}
                  </h1>
                  <p className="mt-1 truncate text-sm text-muted-foreground">
                    {saved.setup?.title ?? "No public setup yet"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 divide-x divide-border border border-border bg-background/45 text-center md:min-w-72">
                <Metric label="Parts" value={saved.parts.length} />
                <Metric label="Groups" value={groups.length} />
                <Metric label="OpenDB" value={sourceLabel(saved.setup)} />
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {groups.map((group) => {
                const Icon = categoryIcon(group.id);

                return (
                  <span
                    key={group.id}
                    className="inline-flex items-center gap-2 rounded-md border border-border bg-background/50 px-2.5 py-1.5 text-xs text-muted-foreground"
                  >
                    <Icon className="size-3.5" aria-hidden="true" />
                    <span>{group.label}</span>
                    <span className="font-mono">{group.parts.length}</span>
                  </span>
                );
              })}
            </div>
          </header>

          <section className="grid gap-px bg-border md:grid-cols-[1fr_260px]">
            <div className="bg-card p-4 md:p-5">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <p className="font-mono text-xs uppercase text-muted-foreground">
                    Core setup
                  </p>
                  <h2 className="text-lg font-semibold">Main loadout</h2>
                </div>
                <Badge variant="secondary">{saved.setup?.visibility ?? "public"}</Badge>
              </div>

              <div className="grid gap-2">
                {cores.map((part) => (
                  <CorePart key={part.id} part={part} />
                ))}
              </div>
            </div>

            <aside className="bg-card p-4 md:p-5">
              <p className="font-mono text-xs uppercase text-muted-foreground">
                Snapshot
              </p>
              <dl className="mt-3 grid gap-2 text-sm">
                <SnapshotRow label="Status" value={saved.setup?.visibility ?? "public"} />
                <SnapshotRow
                  label="Updated"
                  value={
                    saved.setup?.published_at
                      ? new Date(saved.setup.published_at).toLocaleDateString("en-US", {
                          day: "2-digit",
                          month: "short",
                        })
                      : "-"
                  }
                />
                <SnapshotRow
                  label="Largest"
                  value={
                    groups.length
                      ? groups.reduce((largest, group) =>
                          group.parts.length > largest.parts.length ? group : largest,
                        ).label
                      : "-"
                  }
                />
              </dl>

              {saved.setup?.source_repository ? (
                <a
                  href={saved.setup.source_repository}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md border border-border bg-secondary px-3 py-2 text-sm font-medium transition hover:bg-accent"
                >
                  Source
                  <ExternalLink className="size-3.5" aria-hidden="true" />
                </a>
              ) : null}
            </aside>
          </section>

          {!groups.length ? (
            <section className="border-t border-border p-5 text-sm text-muted-foreground">
              This profile exists, but there is no public RigTree setup to show.
            </section>
          ) : null}
        </div>
      </section>
    </main>
  );
}

function ProfileStorageUnavailable({ username }: { username: string }) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <ProfileNav />

      <section className="container py-5 md:py-8">
        <div className="mx-auto max-w-3xl rounded-lg border border-border bg-card p-5 shadow-soft">
          <div className="flex items-center gap-3">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-md border border-border bg-secondary text-muted-foreground">
              <RigTreeMark className="size-6" />
            </span>
            <div className="min-w-0">
              <p className="font-mono text-xs uppercase text-muted-foreground">
                @{username}
              </p>
              <h1 className="text-xl font-semibold">Profile storage is not configured</h1>
            </div>
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            Supabase environment variables are missing in this environment, so RigTree
            cannot load public profile data here.
          </p>
        </div>
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: number | string }) {
  const display = typeof value === "number" ? value.toLocaleString() : value;

  return (
    <div className="min-w-0 px-3 py-2.5">
      <p className="truncate font-mono text-sm font-semibold md:text-base">{display}</p>
      <p className="mt-0.5 text-[11px] text-muted-foreground">{label}</p>
    </div>
  );
}

function CorePart({ part }: { part: BuildCoresPart }) {
  const Icon = categoryIcon(part.category);

  return (
    <article className="grid gap-3 rounded-md border border-border bg-background/45 p-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-md border border-border bg-secondary text-muted-foreground">
          <Icon className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="font-mono text-[11px] uppercase text-muted-foreground">
            {part.categoryLabel}
          </p>
          <h3 className="truncate text-sm font-semibold">{compactName(part)}</h3>
        </div>
      </div>

      <SpecPills specs={part.specs.slice(0, 3)} />
    </article>
  );
}

function SpecPills({
  alignEnd = false,
  specs,
}: {
  alignEnd?: boolean;
  specs: BuildCoresPart["specs"];
}) {
  if (!specs.length) {
    return null;
  }

  return (
    <div className={`flex min-w-0 flex-wrap gap-1.5 ${alignEnd ? "md:justify-end" : ""}`}>
      {specs.map((spec) => (
        <span
          key={`${spec.label}-${spec.value}`}
          className="max-w-full truncate rounded-md border border-border bg-card px-2 py-1 text-xs"
          title={`${spec.label}: ${spec.value}`}
        >
          <span className="font-mono text-[10px] uppercase text-muted-foreground">
            {spec.label}
          </span>{" "}
          {spec.value}
        </span>
      ))}
    </div>
  );
}

function SnapshotRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[72px_1fr] gap-2 border-b border-border/70 pb-2 last:border-0 last:pb-0">
      <dt className="font-mono text-xs uppercase text-muted-foreground">{label}</dt>
      <dd className="min-w-0 truncate text-right">{value}</dd>
    </div>
  );
}

function ProfileNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-xl">
      <nav className="container flex min-h-16 items-center justify-between gap-3 py-3">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-md border border-border bg-secondary text-foreground">
            <RigTreeMark className="size-5" />
          </span>
          <span className="text-sm font-semibold">RigTree</span>
        </Link>

        <Button asChild variant="ghost" size="sm">
          <Link href="/editor">Editor</Link>
        </Button>
      </nav>
    </header>
  );
}
