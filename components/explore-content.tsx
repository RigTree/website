"use client";

import { useState } from "react";
import Link from "next/link";
import { Box, Cpu, Search, UserRound, Filter } from "lucide-react";
import type { PublicSetupSummary } from "@/lib/setups";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function SetupCard({ entry }: { entry: PublicSetupSummary }) {
  const avatarStyle =
    entry.profile.avatar_url?.startsWith("https://")
      ? { backgroundImage: `url("${entry.profile.avatar_url}")` }
      : undefined;

  return (
    <Link
      href={`/u/${entry.profile.username}`}
      className="glow-card group flex flex-col overflow-hidden rounded-xl border border-border bg-card/60 backdrop-blur-md transition-all hover:border-[#a3e635]/40"
    >
      {/* Card header */}
      <div className="flex items-center gap-3 border-b border-border bg-secondary/30 px-5 py-4">
        <div className="relative size-10 shrink-0 rounded-full p-[1.5px] bg-gradient-to-tr from-[#a3e635] via-lime-400 to-[#a3e635]">
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
          <p className="truncate text-sm font-semibold group-hover:text-[#a3e635] transition-colors">
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

function EmptyState({ searchActive }: { searchActive: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-border/60 bg-card/20 backdrop-blur-md py-20 px-8 text-center">
      <div className="mb-5 flex size-16 items-center justify-center rounded-2xl border border-border bg-secondary/50 shadow-soft">
        <Cpu className="size-7 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-bold">
        {searchActive ? "No matching setups found" : "No public setups yet"}
      </h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        {searchActive
          ? "Try searching for a different username, part name, or build title."
          : "Be the first to share your hardware setup with the community. Create a profile and publish your rig."}
      </p>
      <Button asChild className="mt-6" size="lg">
        <Link href="/editor">Build your profile</Link>
      </Button>
    </div>
  );
}

export function ExploreContent({ setups }: { setups: PublicSetupSummary[] }) {
  const [search, setSearch] = useState("");

  const filteredSetups = setups.filter((entry) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    const username = entry.profile.username.toLowerCase();
    const displayName = entry.profile.display_name.toLowerCase();
    const title = (entry.setup?.title || "").toLowerCase();
    const desc = (entry.setup?.description || "").toLowerCase();
    const parts = entry.topParts.join(" ").toLowerCase();

    return (
      username.includes(q) ||
      displayName.includes(q) ||
      title.includes(q) ||
      desc.includes(q) ||
      parts.includes(q)
    );
  });

  return (
    <div className="space-y-8">
      {/* Search Bar */}
      {setups.length > 0 && (
        <div className="mx-auto max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by username, rig title, CPU, GPU..."
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
              className="pl-9 bg-card/60 backdrop-blur-md"
            />
          </div>
        </div>
      )}

      {/* Grid */}
      {filteredSetups.length === 0 ? (
        <EmptyState searchActive={Boolean(search.trim())} />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSetups.map((entry, i) => (
            <div key={entry.profile.username} className={`reveal reveal-delay-${(i % 3) + 1}`}>
              <SetupCard entry={entry} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
