import {
  Armchair,
  Camera,
  CircuitBoard,
  Cpu,
  Disc3,
  ExternalLink,
  Fan,
  Gamepad2,
  Gem,
  HardDrive,
  Headphones,
  Keyboard,
  Laptop,
  Lightbulb,
  MemoryStick,
  Mic,
  Monitor,
  MonitorUp,
  Mouse,
  Network,
  Package2,
  PcCase,
  Snowflake,
  Speaker,
  SquarePower,
  Table2,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { RigTreeMark } from "@/components/rigtree-mark";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  CPUCooler: Snowflake,
  CaptureCard: Camera,
  CaseFan: Fan,
  Chair: Armchair,
  Desk: Table2,
  GPU: Zap,
  Headphones,
  Keyboard,
  Laptop,
  Lighting: Lightbulb,
  Microphone: Mic,
  Monitor,
  Motherboard: CircuitBoard,
  Mouse,
  NetworkCard: Network,
  OS: Disc3,
  PCCase: PcCase,
  PSU: SquarePower,
  PrebuiltDesktop: Laptop,
  RAM: MemoryStick,
  SoundCard: Gamepad2,
  Speaker,
  Stand: MonitorUp,
  Storage: HardDrive,
  ThermalCompound: Wrench,
  VRHeadset: Gem,
  Webcam: Camera,
};

const featuredOrder = [
  "CPU",
  "GPU",
  "Motherboard",
  "RAM",
  "Storage",
  "Monitor",
  "PCCase",
  "PSU",
];

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

function partSubtitle(part: BuildCoresPart) {
  return [part.series, part.variant, part.releaseYear].filter(Boolean).join(" / ");
}

function sourceLabel(setup: SavedSetup["setup"]) {
  if (!setup?.source_name) {
    return "OpenDB";
  }

  return `${setup.source_name} @ ${setup.source_commit?.slice(0, 7) ?? "latest"}`;
}

function featuredParts(groups: PartGroup[]) {
  const byCategory = new Map(groups.map((group) => [group.id, group.parts[0]]));
  const featured = featuredOrder
    .map((category) => byCategory.get(category))
    .filter((part): part is BuildCoresPart => Boolean(part));

  return featured.length ? featured.slice(0, 5) : groups.flatMap((group) => group.parts).slice(0, 5);
}

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  if (!hasSupabaseConfig()) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <ProfileNav />
        <section className="container py-20">
          <Card className="mx-auto max-w-xl">
            <CardHeader>
              <CardTitle>Profile storage is not configured.</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Add Supabase environment variables and apply the database migration
              to show published RigTree profiles.
            </CardContent>
          </Card>
        </section>
      </main>
    );
  }

  const saved = await getPublicSetup(username);

  if (!saved) {
    notFound();
  }

  const avatarStyle =
    saved.profile.avatar_url?.startsWith("https://")
      ? { backgroundImage: `url("${saved.profile.avatar_url}")` }
      : undefined;
  const groups = groupParts(saved.parts);
  const highlights = featuredParts(groups);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <ProfileNav />

      <section className="container py-6 md:py-10">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-lg border border-border bg-card shadow-soft">
          <div className="grid-field absolute inset-0 opacity-20" />
          <div className="noise absolute inset-0 opacity-20" />

          <div className="relative border-b border-border px-4 pb-4 pt-6 text-center md:px-6">
            <div className="mx-auto flex size-20 items-center justify-center rounded-full border border-foreground/30 bg-secondary bg-cover bg-center shadow-soft md:size-24">
              <span
                className="flex size-full items-center justify-center rounded-full bg-cover bg-center"
                style={avatarStyle}
              >
                {!avatarStyle ? (
                  <RigTreeMark className="size-9" />
                ) : (
                  <span className="sr-only">{saved.profile.display_name}</span>
                )}
              </span>
            </div>

            <h1 className="mx-auto mt-3 max-w-xl truncate text-3xl font-bold leading-tight md:text-4xl">
              {saved.profile.display_name}
            </h1>
            <p className="mt-1 font-mono text-sm text-muted-foreground">
              @{saved.profile.username}
            </p>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
              <Badge variant="secondary">{saved.setup?.visibility ?? "public"}</Badge>
              <span className="max-w-full truncate text-sm text-muted-foreground">
                {saved.setup?.title ?? "No public setup yet"}
              </span>
            </div>

            {groups.length ? <CategoryDock groups={groups} /> : null}
          </div>

          <div className="relative grid gap-4 p-4 md:p-5 lg:grid-cols-[minmax(0,1fr)_280px]">
            <section className="min-w-0 rounded-lg border border-border bg-background/45">
              <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="font-mono text-xs uppercase text-muted-foreground">
                    Published setup
                  </p>
                  <h2 className="mt-1 truncate text-lg font-semibold">
                    {saved.setup?.title ?? "No public setup yet"}
                  </h2>
                </div>
                <div className="grid grid-cols-2 divide-x divide-border border border-border bg-card text-center sm:min-w-52">
                  <Metric label="Parts" value={saved.parts.length} />
                  <Metric label="Groups" value={groups.length} />
                </div>
              </div>

              {highlights.length ? (
                <div className="grid gap-px bg-border sm:grid-cols-2">
                  {highlights.map((part) => (
                    <FeaturedPart key={part.id} part={part} />
                  ))}
                </div>
              ) : (
                <p className="p-4 text-sm text-muted-foreground">
                  This profile exists, but there is no public RigTree setup to show.
                </p>
              )}
            </section>

            <aside className="rounded-lg border border-border bg-background/45 p-4">
              <p className="font-mono text-xs uppercase text-muted-foreground">
                Snapshot
              </p>
              <dl className="mt-3 grid gap-2 text-sm">
                <SnapshotRow label="Source" value={sourceLabel(saved.setup)} />
                <SnapshotRow
                  label="Updated"
                  value={
                    saved.setup?.published_at
                      ? new Date(saved.setup.published_at).toLocaleDateString("en-US", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "-"
                  }
                />
                <SnapshotRow
                  label="Largest group"
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
                  Open source
                  <ExternalLink className="size-3.5" aria-hidden="true" />
                </a>
              ) : null}
            </aside>
          </div>

          {groups.length ? (
            <div className="relative border-t border-border p-4 md:p-5">
              <div className="grid gap-3 lg:grid-cols-2">
                {groups.map((group) => (
                  <PartGroupBlock key={group.id} group={group} />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: number | string }) {
  const display = typeof value === "number" ? value.toLocaleString() : value;

  return (
    <div className="min-w-0 px-3 py-2.5">
      <p className="truncate font-mono text-base font-semibold">{display}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function CategoryDock({ groups }: { groups: PartGroup[] }) {
  return (
    <div className="mx-auto mt-4 flex max-w-3xl gap-2 overflow-x-auto px-1 pb-1">
      {groups.map((group) => {
        const Icon = categoryIcon(group.id);

        return (
          <a
            key={group.id}
            href={`#${group.id}`}
            className="group flex shrink-0 items-center gap-2 rounded-md border border-border bg-background/55 px-3 py-2 text-sm transition hover:border-foreground/40 hover:bg-secondary"
            title={group.label}
          >
            <Icon
              className="size-4 text-muted-foreground transition group-hover:text-foreground"
              aria-hidden="true"
            />
            <span className="max-w-28 truncate">{group.label}</span>
            <span className="font-mono text-xs text-muted-foreground">
              {group.parts.length}
            </span>
          </a>
        );
      })}
    </div>
  );
}

function FeaturedPart({ part }: { part: BuildCoresPart }) {
  const Icon = categoryIcon(part.category);

  return (
    <article className="min-w-0 bg-card p-3.5">
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-md border border-border bg-secondary text-muted-foreground">
          <Icon className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="truncate font-mono text-[11px] uppercase text-muted-foreground">
            {part.categoryLabel} / {part.manufacturer}
          </p>
          <h3 className="mt-1 line-clamp-2 text-sm font-semibold leading-5">
            {part.name}
          </h3>
        </div>
      </div>
    </article>
  );
}

function SnapshotRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[80px_1fr] gap-3 border-b border-border/70 pb-2 last:border-0 last:pb-0">
      <dt className="font-mono text-xs uppercase text-muted-foreground">{label}</dt>
      <dd className="min-w-0 truncate text-right text-foreground">{value}</dd>
    </div>
  );
}

function PartGroupBlock({ group }: { group: PartGroup }) {
  const Icon = categoryIcon(group.id);

  return (
    <section
      id={group.id}
      className="scroll-mt-24 overflow-hidden rounded-lg border border-border bg-background/45"
    >
      <div className="flex items-center justify-between gap-3 border-b border-border bg-secondary/20 px-3 py-2.5">
        <div className="flex min-w-0 items-center gap-2">
          <Icon className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          <h3 className="truncate text-sm font-semibold">{group.label}</h3>
        </div>
        <Badge variant="secondary">{group.parts.length}</Badge>
      </div>
      <div className="divide-y divide-border">
        {group.parts.map((part) => (
          <PartRow key={part.id} part={part} />
        ))}
      </div>
    </section>
  );
}

function PartRow({ part }: { part: BuildCoresPart }) {
  const subtitle = partSubtitle(part);

  return (
    <article className="grid gap-2 px-3 py-2.5 transition hover:bg-secondary/40 sm:grid-cols-[minmax(0,1fr)_minmax(180px,0.72fr)] sm:items-center">
      <div className="min-w-0">
        <p className="truncate font-mono text-[11px] uppercase text-muted-foreground">
          {part.manufacturer}
        </p>
        <h4 className="mt-0.5 truncate text-sm font-medium">{part.name}</h4>
        {subtitle ? (
          <p className="mt-0.5 truncate text-xs text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>

      {part.specs.length ? (
        <div className="flex min-w-0 flex-wrap gap-1.5 sm:justify-end">
          {part.specs.slice(0, 3).map((spec) => (
            <span
              key={`${part.id}-${spec.label}`}
              className="max-w-full truncate rounded-md border border-border bg-card px-2 py-1 text-xs text-foreground"
              title={`${spec.label}: ${spec.value}`}
            >
              <span className="font-mono text-[10px] uppercase text-muted-foreground">
                {spec.label}
              </span>{" "}
              {spec.value}
            </span>
          ))}
        </div>
      ) : null}
    </article>
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
