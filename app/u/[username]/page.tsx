import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { RigTreeMark } from "@/components/rigtree-mark";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { BuildCoresPart } from "@/lib/buildcores-types";
import { getPublicSetup } from "@/lib/setups";
import { hasSupabaseConfig } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";
export const runtime = "edge";

function groupParts(parts: BuildCoresPart[]) {
  return parts.reduce<Record<string, BuildCoresPart[]>>((groups, part) => {
    groups[part.categoryLabel] = [...(groups[part.categoryLabel] ?? []), part];
    return groups;
  }, {});
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
        <section className="container py-24">
          <Card>
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
  const groupEntries = Object.entries(groups);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <ProfileNav />

      <section className="border-b border-border bg-secondary/20">
        <div className="container py-10 md:py-14">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span
                  className="flex size-12 items-center justify-center rounded-md border border-border bg-secondary bg-cover bg-center"
                  style={avatarStyle}
                >
                  {!avatarStyle ? (
                    <RigTreeMark />
                  ) : (
                    <span className="sr-only">{saved.profile.display_name}</span>
                  )}
                </span>
                <div>
                  <p className="font-mono text-xs uppercase text-muted-foreground">
                    @{saved.profile.username}
                  </p>
                  <h1 className="text-3xl font-bold leading-tight md:text-5xl">
                    {saved.profile.display_name}
                  </h1>
                </div>
              </div>

              <div className="mt-6">
                <Badge variant="secondary">
                  {saved.setup?.visibility ?? "public"}
                </Badge>
                <h2 className="mt-3 text-2xl font-semibold">
                  {saved.setup?.title ?? "No public setup yet"}
                </h2>
                <p className="mt-2 max-w-2xl text-muted-foreground">
                  {saved.setup
                    ? `${saved.parts.length.toLocaleString()} parts published to this RigTree profile.`
                    : "This builder has not published a public setup yet."}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 divide-x divide-border border border-border bg-background/40 text-center md:min-w-72">
              <div className="px-4 py-3">
                <p className="font-mono text-lg font-semibold">
                  {saved.parts.length.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">Parts</p>
              </div>
              <div className="px-4 py-3">
                <p className="font-mono text-lg font-semibold">
                  {groupEntries.length.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">Groups</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-8 md:py-10">
        {groupEntries.length ? (
          <div className="grid gap-5">
            {groupEntries.map(([category, parts]) => (
              <Card key={category} className="overflow-hidden">
                <CardHeader className="border-b border-border">
                  <div className="flex items-center justify-between gap-3">
                    <CardTitle>{category}</CardTitle>
                    <Badge variant="secondary">{parts.length}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="grid gap-3 p-4 md:grid-cols-2 xl:grid-cols-3">
                  {parts.map((part) => (
                    <article
                      key={part.id}
                      className="rounded-lg border border-border bg-background/45 p-4"
                    >
                      <p className="font-mono text-xs text-muted-foreground">
                        {part.manufacturer}
                      </p>
                      <h3 className="mt-2 line-clamp-2 text-base font-semibold">
                        {part.name}
                      </h3>
                      <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                        {[part.series, part.variant, part.releaseYear]
                          .filter(Boolean)
                          .join(" / ")}
                      </p>

                      {part.specs.length ? (
                        <div className="mt-4 grid grid-cols-2 gap-1.5">
                          {part.specs.slice(0, 4).map((spec) => (
                            <div
                              key={`${part.id}-${spec.label}`}
                              className="min-w-0 rounded-md border border-border bg-card px-2.5 py-1.5"
                            >
                              <p className="truncate font-mono text-[10px] uppercase leading-4 text-muted-foreground">
                                {spec.label}
                              </p>
                              <p className="mt-0.5 truncate text-sm leading-5">
                                {spec.value}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </article>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>No public setup yet</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              This profile exists, but there is no public RigTree setup to show.
            </CardContent>
          </Card>
        )}

        {saved.setup?.source_repository ? (
          <div className="mt-6 rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
            <p className="font-mono text-foreground">
              {saved.setup.source_name} @ {saved.setup.source_commit?.slice(0, 7)}
            </p>
            <p className="mt-2">{saved.setup.source_license}</p>
            <a
              href={saved.setup.source_repository}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-2 text-foreground underline-offset-4 hover:underline"
            >
              Source repository
              <ExternalLink className="size-3" aria-hidden="true" />
            </a>
          </div>
        ) : null}
      </section>
    </main>
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
