"use client";

import React, { useState, useMemo } from "react";
import {
  Cpu,
  Zap,
  CircuitBoard,
  MemoryStick,
  HardDrive,
  Monitor,
  Keyboard,
  Mouse,
  Headphones,
  PcCase,
  SquarePower,
  Camera,
  Package2,
  Search,
  X,
  type LucideIcon,
} from "lucide-react";
import type { BuildCoresPart } from "@/lib/buildcores-types";

// Category Icons Mapping
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

function getCategoryIcon(categoryId: string): LucideIcon {
  return categoryIcons[categoryId] ?? Package2;
}

// Curated, beautiful visual styles per category
interface CategoryTheme {
  iconBg: string;
  iconText: string;
  glowBorder: string;
  shadowColor: string;
}

function getCategoryTheme(categoryId: string): CategoryTheme {
  switch (categoryId) {
    case "CPU":
      return {
        iconBg: "bg-sky-500/10 border-sky-500/20",
        iconText: "text-sky-400",
        glowBorder: "hover:border-sky-500/30 hover:shadow-[0_0_20px_rgba(56,189,248,0.15)]",
        shadowColor: "shadow-sky-950/20",
      };
    case "GPU":
      return {
        iconBg: "bg-purple-500/10 border-purple-500/20",
        iconText: "text-purple-400",
        glowBorder: "hover:border-purple-500/30 hover:shadow-[0_0_20px_rgba(192,132,252,0.15)]",
        shadowColor: "shadow-purple-950/20",
      };
    case "RAM":
      return {
        iconBg: "bg-emerald-500/10 border-emerald-500/20",
        iconText: "text-emerald-400",
        glowBorder: "hover:border-emerald-500/30 hover:shadow-[0_0_20px_rgba(52,211,153,0.15)]",
        shadowColor: "shadow-emerald-950/20",
      };
    case "Storage":
      return {
        iconBg: "bg-amber-500/10 border-amber-500/20",
        iconText: "text-amber-400",
        glowBorder: "hover:border-amber-500/30 hover:shadow-[0_0_20px_rgba(251,191,36,0.15)]",
        shadowColor: "shadow-amber-950/20",
      };
    case "Monitor":
      return {
        iconBg: "bg-rose-500/10 border-rose-500/20",
        iconText: "text-rose-400",
        glowBorder: "hover:border-rose-500/30 hover:shadow-[0_0_20px_rgba(251,113,133,0.15)]",
        shadowColor: "shadow-rose-950/20",
      };
    case "Keyboard":
    case "Mouse":
    case "Headphones":
      return {
        iconBg: "bg-teal-500/10 border-teal-500/20",
        iconText: "text-teal-400",
        glowBorder: "hover:border-teal-500/30 hover:shadow-[0_0_20px_rgba(45,212,191,0.15)]",
        shadowColor: "shadow-teal-950/20",
      };
    default:
      return {
        iconBg: "bg-zinc-500/10 border-zinc-500/20",
        iconText: "text-zinc-400",
        glowBorder: "hover:border-zinc-500/20 hover:shadow-[0_0_20px_rgba(161,161,170,0.1)]",
        shadowColor: "shadow-zinc-950/20",
      };
  }
}

function compactName(part: BuildCoresPart) {
  return part.name.startsWith(part.manufacturer)
    ? part.name
    : `${part.manufacturer} ${part.name}`.trim();
}

interface PartsShowcaseProps {
  initialParts: BuildCoresPart[];
  cores: BuildCoresPart[];
}

export function ProfilePartsShowcase({ initialParts, cores }: PartsShowcaseProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredParts = useMemo(() => {
    if (!searchQuery.trim()) {
      return initialParts;
    }
    const q = searchQuery.toLowerCase().trim();
    return initialParts.filter((part) => {
      return (
        part.name.toLowerCase().includes(q) ||
        part.manufacturer.toLowerCase().includes(q) ||
        part.categoryLabel.toLowerCase().includes(q) ||
        (part.series && part.series.toLowerCase().includes(q)) ||
        (part.variant && part.variant.toLowerCase().includes(q)) ||
        part.specs.some(
          (spec) =>
            spec.label.toLowerCase().includes(q) || spec.value.toLowerCase().includes(q)
        )
      );
    });
  }, [initialParts, searchQuery]);

  const groupedParts = useMemo(() => {
    const groups = new Map<string, { id: string; label: string; parts: BuildCoresPart[] }>();

    for (const part of filteredParts) {
      const current = groups.get(part.category) ?? {
        id: part.category,
        label: part.categoryLabel,
        parts: [],
      };

      current.parts.push(part);
      groups.set(part.category, current);
    }

    return Array.from(groups.values());
  }, [filteredParts]);

  return (
    <div className="space-y-8">
      {/* Search Input */}
      <div className="relative group">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
          <Search className="size-4.5 text-muted-foreground group-focus-within:text-foreground transition-colors duration-200" />
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter specs (e.g. ryzen, oled, 64gb)..."
          className="w-full pl-11 pr-10 py-3 bg-secondary/20 hover:bg-secondary/35 focus:bg-secondary/45 border border-border hover:border-border/120 focus:border-foreground/30 focus:outline-none rounded-xl text-sm transition-all duration-200 placeholder:text-muted-foreground/70"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-muted-foreground hover:text-foreground transition-colors duration-150"
            aria-label="Clear search"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {/* Core Loadout Grid (Only show if not filtering or if cores match search) */}
      {!searchQuery && cores.length > 0 && (
        <section className="space-y-4 site-enter-slow">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                Core Setup
              </p>
              <h2 className="text-xl font-bold tracking-tight">Main loadout</h2>
            </div>
            <span className="text-xs text-muted-foreground bg-secondary/50 border border-border px-2 py-1 rounded-md font-mono">
              5 components
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {cores.map((part) => {
              const theme = getCategoryTheme(part.category);
              const Icon = getCategoryIcon(part.category);

              return (
                <div
                  key={part.id}
                  className={`glow-card relative group flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-card/40 p-4 transition-all duration-300 ${theme.shadowColor} ${theme.glowBorder}`}
                >
                  <div className="flex gap-4">
                    <span
                      className={`flex size-11 shrink-0 items-center justify-center rounded-lg border ${theme.iconBg} ${theme.iconText} transition-all duration-300 group-hover:scale-105`}
                    >
                      <Icon className="size-5.5" />
                    </span>
                    <div className="min-w-0">
                      <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                        {part.categoryLabel}
                      </p>
                      <h3 className="truncate text-base font-semibold tracking-tight text-foreground/90 group-hover:text-foreground transition-colors duration-150 mt-0.5">
                        {compactName(part)}
                      </h3>
                      {part.series && (
                        <p className="text-xs text-muted-foreground/80 truncate mt-0.5">
                          {part.series} {part.variant}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Specs Row */}
                  {part.specs.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5 pt-3 border-t border-border/40">
                      {part.specs.slice(0, 3).map((spec) => (
                        <span
                          key={`${spec.label}-${spec.value}`}
                          className="truncate rounded-md border border-border/80 bg-background/30 px-2 py-0.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors duration-150"
                          title={`${spec.label}: ${spec.value}`}
                        >
                          <span className="font-mono text-[9px] uppercase text-muted-foreground/70 mr-1">
                            {spec.label}
                          </span>
                          {spec.value}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* All Hardware List */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-border/80 pb-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Components list
            </p>
            <h2 className="text-xl font-bold tracking-tight">
              {searchQuery ? "Search results" : "All hardware"}
            </h2>
          </div>
          <span className="text-xs font-mono text-muted-foreground">
            {filteredParts.length} {filteredParts.length === 1 ? "component" : "components"}
          </span>
        </div>

        {groupedParts.length === 0 ? (
          <div className="py-12 text-center rounded-xl border border-dashed border-border bg-secondary/5">
            <Package2 className="size-10 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-sm font-medium text-muted-foreground">
              No parts found matching your query
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="mt-3 text-xs text-foreground/80 hover:text-foreground underline underline-offset-4"
            >
              Reset filter
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {groupedParts.map((group) => {
              const Icon = getCategoryIcon(group.id);
              const theme = getCategoryTheme(group.id);

              return (
                <div key={group.id} className="space-y-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Icon className={`size-4 ${theme.iconText}`} />
                    <h3 className="font-mono text-xs uppercase tracking-wider font-semibold">
                      {group.label}
                    </h3>
                  </div>

                  <div className="grid gap-3">
                    {group.parts.map((part) => (
                      <div
                        key={part.id}
                        className="group flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl border border-border bg-secondary/10 hover:bg-secondary/20 hover:border-foreground/15 transition-all duration-200"
                      >
                        <div className="min-w-0 flex items-start gap-3">
                          <span className={`flex size-8 shrink-0 items-center justify-center rounded-md border ${theme.iconBg} ${theme.iconText} mt-0.5`}>
                            <Icon className="size-4" />
                          </span>
                          <div className="min-w-0">
                            <h4 className="truncate text-sm font-semibold tracking-tight text-foreground group-hover:text-foreground/95">
                              {compactName(part)}
                            </h4>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {[part.series, part.variant, part.releaseYear].filter(Boolean).join(" · ")}
                            </p>
                          </div>
                        </div>

                        {/* Specs */}
                        {part.specs.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 md:justify-end max-w-full md:max-w-[60%]">
                            {part.specs.map((spec) => (
                              <span
                                key={`${spec.label}-${spec.value}`}
                                className="truncate rounded-md border border-border bg-card px-2 py-0.5 text-[11px] text-muted-foreground hover:text-foreground hover:border-border/120 transition-all duration-150"
                                title={`${spec.label}: ${spec.value}`}
                              >
                                <span className="font-mono text-[9px] uppercase text-muted-foreground/60 mr-1">
                                  {spec.label}
                                </span>
                                {spec.value}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
