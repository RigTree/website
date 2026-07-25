"use client";

import {
  Armchair,
  Box,
  Camera,
  Check,
  CircuitBoard,
  Cpu,
  Database,
  Disc3,
  Download,
  ExternalLink,
  Fan,
  Filter,
  Gamepad2,
  HardDrive,
  Headphones,
  Keyboard,
  Laptop,
  Lightbulb,
  Loader2,
  MemoryStick,
  Mic,
  Monitor,
  MonitorUp,
  Mouse,
  Network,
  Package,
  PanelTop,
  PcCase,
  Plus,
  RotateCcw,
  Save,
  Search,
  Server,
  Snowflake,
  Speaker,
  SquarePower,
  Table2,
  Video,
  Wrench,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type {
  BuildCoresIndex,
  BuildCoresPart,
  DraftState,
} from "@/lib/buildcores-types";
import { cn } from "@/lib/utils";

type CategoryPayload = {
  category: string;
  label: string;
  total: number;
  parts: BuildCoresPart[];
};

type SpecFilters = Record<string, string>;
type SaveState = "idle" | "loading" | "saving" | "saved" | "error";
type SetupVisibility = "public" | "private";
type SavedSetupResponse = {
  setup: {
    profile: {
      username: string;
    };
    setup: {
      title: string;
      visibility: SetupVisibility;
    } | null;
    parts: BuildCoresPart[];
  } | null;
};

const draftStorageKey = "rigtree.editor.draft.v2";
const initialVisibleCount = 72;
const visibleStep = 72;
const maxSpecFilterValues = 140;

const preferredSpecFilters: Record<string, string[]> = {
  CPU: ["Socket", "Cores", "Threads", "Memory", "TDP", "Boost"],
  GPU: ["VRAM", "Memory", "TDP", "Chipset"],
  Motherboard: ["Socket", "Form", "Slots", "Max RAM", "Chipset"],
  RAM: ["Capacity", "Speed", "CAS", "Voltage"],
  Storage: ["Type", "Capacity", "Interface", "Form"],
  PSU: ["Wattage", "Rating", "Modular", "Form"],
  PCCase: ["Color", "Side panel", "PSU", "Cooler clearance"],
  CPUCooler: ["Height", "Radiator", "Water Cooled", "Fanless"],
  CaseFan: ["Size", "PWM", "Lighting"],
  Monitor: ["Size", "Refresh", "Panel", "Sync", "Response"],
  Keyboard: ["Switch", "Connectivity", "Backlighting", "Size"],
  Mouse: ["Connectivity", "Rgb"],
  Headphones: ["Headphone Type", "Connection Types", "Has Microphone", "Use Cases"],
  Microphone: ["Pattern", "Connectivity Type", "Features"],
  Webcam: ["Resolution"],
};

const categoryIcons = {
  Accessory: Package,
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
  Mousepad: PanelTop,
  NetworkCard: Network,
  OS: Disc3,
  PCCase: PcCase,
  PSU: SquarePower,
  PrebuiltDesktop: Server,
  RAM: MemoryStick,
  SoundCard: Gamepad2,
  Speaker,
  Stand: MonitorUp,
  Storage: HardDrive,
  ThermalCompound: Wrench,
  VRHeadset: Box,
  Webcam: Video,
};

function getCategoryIcon(categoryId: string) {
  return categoryIcons[categoryId as keyof typeof categoryIcons] ?? Database;
}

function labelFor(part: BuildCoresPart) {
  return part.manufacturer && part.name.startsWith(part.manufacturer)
    ? part.name
    : `${part.manufacturer} ${part.name}`.trim();
}

function getSpecValue(part: BuildCoresPart, label: string) {
  return part.specs.find((spec) => spec.label === label)?.value ?? "";
}

function getCardSpecs(part: BuildCoresPart) {
  const specsByLabel = new Map(part.specs.map((spec) => [spec.label, spec]));

  if (part.category === "GPU") {
    const gpuLabels = ["Memory", "Cooling", "Base", "Boost"];

    return gpuLabels
      .map((label) => specsByLabel.get(label))
      .filter((spec): spec is BuildCoresPart["specs"][number] => Boolean(spec));
  }

  if (part.category !== "CPU") {
    return part.specs.slice(0, 4);
  }

  const cpuLabels = [
    "Cores",
    "Threads",
    "Base",
    "Boost",
    "Boxed",
    "Socket",
    "TDP",
    "Memory",
  ];

  return cpuLabels
    .map((label) => specsByLabel.get(label))
    .filter((spec): spec is BuildCoresPart["specs"][number] => Boolean(spec))
    .slice(0, 4);
}

function getPartMeta(part: BuildCoresPart) {
  const segments = [part.series, part.variant, part.releaseYear];

  if (part.category === "CPU") {
    const boxed = getSpecValue(part, "Boxed");

    if (boxed === "Yes") {
      segments.push("Boxed");
    } else if (boxed === "No") {
      segments.push("OEM/Tray");
    }
  }

  return segments.filter(Boolean).join(" / ");
}

function sortFilterValues(values: Iterable<string>) {
  return Array.from(values).sort((left, right) => {
    const leftNumber = Number.parseFloat(left.replace(/,/g, ""));
    const rightNumber = Number.parseFloat(right.replace(/,/g, ""));

    if (Number.isFinite(leftNumber) && Number.isFinite(rightNumber)) {
      return leftNumber - rightNumber;
    }

    return left.localeCompare(right, undefined, {
      numeric: true,
      sensitivity: "base",
    });
  });
}

function getFilterableSpecs(categoryId: string, parts: BuildCoresPart[]) {
  const labels = preferredSpecFilters[categoryId];

  if (!labels?.length) {
    return [];
  }

  const valuesByLabel = new Map<string, Set<string>>();
  const countsByLabel = new Map<string, number>();

  for (const part of parts) {
    for (const spec of part.specs) {
      if (!spec.value) {
        continue;
      }

      countsByLabel.set(spec.label, (countsByLabel.get(spec.label) ?? 0) + 1);

      if (!valuesByLabel.has(spec.label)) {
        valuesByLabel.set(spec.label, new Set());
      }

      valuesByLabel.get(spec.label)?.add(spec.value);
    }
  }

  return labels
    .map((label) => ({
      label,
      values: sortFilterValues(valuesByLabel.get(label) ?? []),
      count: countsByLabel.get(label) ?? 0,
    }))
    .filter(
      (filter) =>
        filter.count >= Math.max(6, parts.length * 0.08) &&
        filter.values.length > 1 &&
        filter.values.length <= maxSpecFilterValues,
    )
    .slice(0, 4);
}

function normalizeDraft(raw: unknown): DraftState {
  if (!raw || typeof raw !== "object") {
    return {};
  }

  const draft: DraftState = {};

  for (const [category, value] of Object.entries(raw)) {
    if (!Array.isArray(value)) {
      continue;
    }

    const parts = value.filter(
      (part): part is BuildCoresPart =>
        Boolean(part) &&
        typeof part === "object" &&
        "id" in part &&
        "name" in part &&
        "category" in part,
    );

    if (parts.length) {
      draft[category] = parts;
    }
  }

  return draft;
}

function downloadDraft(
  selectedParts: BuildCoresPart[],
  source: BuildCoresIndex["source"],
) {
  const payload = {
    exportedAt: new Date().toISOString(),
    source: {
      name: source.name,
      repository: source.repository,
      commit: source.commit,
      license: source.license,
    },
    parts: selectedParts.map((part) => ({
      id: part.id,
      category: part.category,
      name: part.name,
      manufacturer: part.manufacturer,
      specs: part.specs,
    })),
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "rigtree-build.json";
  anchor.click();
  URL.revokeObjectURL(url);
}

function groupPartsByCategory(parts: BuildCoresPart[]) {
  return parts.reduce<DraftState>((groups, part) => {
    groups[part.category] = [...(groups[part.category] ?? []), part];
    return groups;
  }, {});
}

export function PartPicker({ index }: { index: BuildCoresIndex }) {
  const [activeCategory, setActiveCategory] = useState(
    index.categories[0]?.id ?? "CPU",
  );
  const [query, setQuery] = useState("");
  const [manufacturer, setManufacturer] = useState("all");
  const [year, setYear] = useState("all");
  const [sortMode, setSortMode] = useState("newest");
  const [selectedOnly, setSelectedOnly] = useState(false);
  const [specFilters, setSpecFilters] = useState<SpecFilters>({});
  const [setupTitle, setSetupTitle] = useState("My RigTree setup");
  const [visibility, setVisibility] = useState<SetupVisibility>("public");
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [saveMessage, setSaveMessage] = useState("");
  const [savedProfileUrl, setSavedProfileUrl] = useState("");
  const [draft, setDraft] = useState<DraftState>({});
  const [draftHydrated, setDraftHydrated] = useState(false);
  const [visibleCount, setVisibleCount] = useState(initialVisibleCount);
  const [categoryParts, setCategoryParts] = useState<
    Record<string, BuildCoresPart[]>
  >({});
  const [loadingCategory, setLoadingCategory] = useState(activeCategory);
  const [loadError, setLoadError] = useState("");
  const hasLocalDraftRef = useRef(false);
  const hasLoadedRemoteSetupRef = useRef(false);

  const activeCategoryData = index.categories.find(
    (category) => category.id === activeCategory,
  );
  const activeParts = useMemo(
    () => categoryParts[activeCategory] ?? [],
    [activeCategory, categoryParts],
  );

  useEffect(() => {
    const raw = window.localStorage.getItem(draftStorageKey);
    if (!raw) {
      setDraftHydrated(true);
      return;
    }

    try {
      const nextDraft = normalizeDraft(JSON.parse(raw));
      hasLocalDraftRef.current = Boolean(Object.values(nextDraft).flat().length);
      setDraft(nextDraft);
    } catch {
      window.localStorage.removeItem(draftStorageKey);
    } finally {
      setDraftHydrated(true);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(draftStorageKey, JSON.stringify(draft));
  }, [draft]);

  useEffect(() => {
    if (!draftHydrated || hasLoadedRemoteSetupRef.current) {
      return;
    }

    hasLoadedRemoteSetupRef.current = true;
    let cancelled = false;

    async function loadSavedSetup() {
      setSaveState("loading");

      try {
        const response = await fetch("/api/setups/me");
        if (!response.ok) {
          throw new Error("Could not load saved setup.");
        }

        const payload = (await response.json()) as SavedSetupResponse;
        if (cancelled) {
          return;
        }



        if (payload.setup?.setup) {
          setSetupTitle(payload.setup.setup.title);
          setVisibility(payload.setup.setup.visibility);
          setSavedProfileUrl(`/u/${payload.setup.profile.username}`);
        }

        if (payload.setup?.parts.length && !hasLocalDraftRef.current) {
          setDraft(groupPartsByCategory(payload.setup.parts));
        }

        setSaveState("idle");
      } catch (error) {
        if (!cancelled) {
          setSaveState("idle");
          setSaveMessage(
            error instanceof Error ? error.message : "Could not load saved setup.",
          );
        }
      }
    }

    loadSavedSetup();

    return () => {
      cancelled = true;
    };
  }, [draftHydrated]);

  useEffect(() => {
    let cancelled = false;

    async function loadCategory() {
      if (!activeCategoryData || categoryParts[activeCategory]) {
        setLoadingCategory("");
        return;
      }

      setLoadingCategory(activeCategory);
      setLoadError("");

      try {
        const response = await fetch(activeCategoryData.file);
        if (!response.ok) {
          throw new Error(`Failed to load ${activeCategoryData.label}`);
        }

        const payload = (await response.json()) as CategoryPayload;
        if (!cancelled) {
          setCategoryParts((current) => ({
            ...current,
            [activeCategory]: payload.parts,
          }));
        }
      } catch (error) {
        if (!cancelled) {
          setLoadError(error instanceof Error ? error.message : "Failed to load parts");
        }
      } finally {
        if (!cancelled) {
          setLoadingCategory("");
        }
      }
    }

    loadCategory();

    return () => {
      cancelled = true;
    };
  }, [activeCategory, activeCategoryData, categoryParts]);

  useEffect(() => {
    setVisibleCount(initialVisibleCount);
  }, [activeCategory, manufacturer, query, selectedOnly, sortMode, specFilters, year]);

  const selectedParts = useMemo(
    () => Object.values(draft).flat(),
    [draft],
  );

  const selectedIds = useMemo(
    () => new Set(selectedParts.map((part) => part.id)),
    [selectedParts],
  );

  const filterableSpecs = useMemo(
    () => getFilterableSpecs(activeCategory, activeParts),
    [activeCategory, activeParts],
  );

  const yearOptions = useMemo(
    () =>
      Array.from(
        new Set(
          activeParts
            .map((part) => part.releaseYear)
            .filter((partYear): partYear is number => typeof partYear === "number"),
        ),
      ).sort((left, right) => right - left),
    [activeParts],
  );

  const filteredParts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const activeSpecFilters = Object.entries(specFilters).filter(
      ([, value]) => value !== "all",
    );

    return activeParts
      .filter((part) => manufacturer === "all" || part.manufacturer === manufacturer)
      .filter((part) => year === "all" || String(part.releaseYear) === year)
      .filter((part) => !selectedOnly || selectedIds.has(part.id))
      .filter((part) => !normalizedQuery || part.searchText.includes(normalizedQuery))
      .filter((part) =>
        activeSpecFilters.every(
          ([label, value]) => getSpecValue(part, label) === value,
        ),
      )
      .sort((left, right) => {
        if (sortMode === "newest") {
          return (
            (right.releaseYear ?? 0) - (left.releaseYear ?? 0) ||
            left.name.localeCompare(right.name, undefined, {
              numeric: true,
              sensitivity: "base",
            })
          );
        }

        if (sortMode === "maker") {
          return (
            left.manufacturer.localeCompare(right.manufacturer, undefined, {
              sensitivity: "base",
            }) ||
            left.name.localeCompare(right.name, undefined, {
              numeric: true,
              sensitivity: "base",
            })
          );
        }

        return left.name.localeCompare(right.name, undefined, {
          numeric: true,
          sensitivity: "base",
        });
      });
  }, [
    activeParts,
    manufacturer,
    query,
    selectedIds,
    selectedOnly,
    sortMode,
    specFilters,
    year,
  ]);

  const visibleParts = filteredParts.slice(0, visibleCount);
  const selectedCount = selectedParts.length;
  const categorySelectedCount = draft[activeCategory]?.length ?? 0;
  const coreCount = ["CPU", "GPU", "Motherboard", "RAM", "Storage", "PSU", "PCCase"].filter(
    (category) => draft[category]?.length,
  ).length;
  const hasActiveFilters =
    Boolean(query.trim()) ||
    manufacturer !== "all" ||
    year !== "all" ||
    selectedOnly ||
    Object.values(specFilters).some((value) => value !== "all");

  const resetFilters = () => {
    setQuery("");
    setManufacturer("all");
    setYear("all");
    setSelectedOnly(false);
    setSpecFilters({});
  };

  const togglePart = (part: BuildCoresPart) => {
    setDraft((current) => {
      const categoryParts = current[part.category] ?? [];
      const exists = categoryParts.some((selected) => selected.id === part.id);
      const nextCategoryParts = exists
        ? categoryParts.filter((selected) => selected.id !== part.id)
        : [...categoryParts, part];
      const next = { ...current };

      if (nextCategoryParts.length) {
        next[part.category] = nextCategoryParts;
      } else {
        delete next[part.category];
      }

      return next;
    });
  };

  const removePart = (part: BuildCoresPart) => {
    setDraft((current) => {
      const nextCategoryParts = (current[part.category] ?? []).filter(
        (selected) => selected.id !== part.id,
      );
      const next = { ...current };

      if (nextCategoryParts.length) {
        next[part.category] = nextCategoryParts;
      } else {
        delete next[part.category];
      }

      return next;
    });
  };

  const publishSetup = async () => {
    setSaveState("saving");
    setSaveMessage("");
    setSavedProfileUrl("");

    try {
      const response = await fetch("/api/setups/me", {
        body: JSON.stringify({
          parts: selectedParts,
          title: setupTitle,
          visibility,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
      const payload = (await response.json()) as {
        error?: string;
        profileUrl?: string;
      };

      if (!response.ok) {
        throw new Error(payload.error ?? "Could not publish setup.");
      }

      setSaveState("saved");
      setSaveMessage(
        visibility === "public"
          ? "Published to your public profile."
          : "Saved as a private setup.",
      );
      setSavedProfileUrl(visibility === "public" ? payload.profileUrl ?? "" : "");
    } catch (error) {
      setSaveState("error");
      setSaveMessage(
        error instanceof Error ? error.message : "Could not publish setup.",
      );
    }
  };

  return (
    <div className="grid gap-4 xl:grid-cols-[250px_minmax(0,1fr)] 2xl:grid-cols-[260px_minmax(0,1fr)_330px]">
      <aside className="xl:sticky xl:top-24 xl:h-fit">
        <Card className="editor-panel overflow-hidden">
          <CardHeader className="border-b border-border">
            <div className="flex items-center justify-between gap-3">
              <div>
                <CardTitle>Parts</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                  {index.totalParts.toLocaleString()} OpenDB records
                </p>
              </div>
              <Badge variant="secondary">{selectedCount}</Badge>
            </div>
          </CardHeader>
          <CardContent className="grid max-h-[calc(100vh-11rem)] gap-2 overflow-y-auto p-3">
            {index.categories.map((category) => {
              const Icon = getCategoryIcon(category.id);
              const isActive = category.id === activeCategory;
              const count = draft[category.id]?.length ?? 0;

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => {
                    setActiveCategory(category.id);
                    resetFilters();
                  }}
                  className={cn(
                    "group flex w-full items-center justify-between gap-3 rounded-md border px-3 py-2.5 text-left transition-all duration-200",
                    isActive
                      ? "border-foreground bg-foreground text-background shadow-sm"
                      : "border-border bg-background/35 text-muted-foreground hover:-translate-y-0.5 hover:border-foreground/40 hover:bg-accent hover:text-foreground",
                  )}
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <Icon className="size-4 shrink-0" aria-hidden="true" />
                    <span className="truncate text-sm font-medium">
                      {category.label}
                    </span>
                  </span>
                  <span className="flex shrink-0 items-center gap-2">
                    {count ? (
                      <span
                        className={cn(
                          "rounded-full px-1.5 py-0.5 font-mono text-[10px]",
                          isActive ? "bg-background/15" : "bg-secondary",
                        )}
                      >
                        {count}
                      </span>
                    ) : null}
                    <span className="font-mono text-[11px]">
                      {category.total.toLocaleString()}
                    </span>
                  </span>
                </button>
              );
            })}
          </CardContent>
        </Card>
      </aside>

      <section className="min-w-0">
        <div className="editor-panel rounded-lg border border-border bg-card/95 p-4 shadow-sm backdrop-blur-xl">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="font-mono text-xs uppercase text-muted-foreground">
                  {activeCategoryData?.total.toLocaleString()} source records
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <h2 className="text-2xl font-bold">
                    {activeCategoryData?.label ?? "Parts"}
                  </h2>
                  {categorySelectedCount ? (
                    <Badge variant="secondary">
                      {categorySelectedCount} selected
                    </Badge>
                  ) : null}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Showing {visibleParts.length.toLocaleString()} of{" "}
                  {filteredParts.length.toLocaleString()} matches
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant={selectedOnly ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedOnly((current) => !current)}
                  disabled={!selectedCount}
                >
                  <Check aria-hidden="true" />
                  Selected
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                  disabled={!hasActiveFilters}
                >
                  Clear filters
                </Button>
              </div>
            </div>

            <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
              <label className="relative md:col-span-2 xl:col-span-1">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search model, socket, chipset..."
                  className="h-10 w-full rounded-md border border-border bg-background pl-9 pr-3 text-sm outline-none ring-offset-background transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/30"
                />
              </label>

              <label className="relative">
                <Filter
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <select
                  value={manufacturer}
                  onChange={(event) => setManufacturer(event.target.value)}
                  className="h-10 w-full appearance-none rounded-md border border-border bg-background pl-9 pr-3 text-sm outline-none ring-offset-background transition-colors focus:border-ring focus:ring-2 focus:ring-ring/30"
                >
                  <option value="all">All makers</option>
                  {(activeCategoryData?.manufacturers ?? []).map((maker) => (
                    <option key={maker} value={maker}>
                      {maker}
                    </option>
                  ))}
                </select>
              </label>

              <label className="relative">
                <select
                  value={year}
                  onChange={(event) => setYear(event.target.value)}
                  className="h-10 w-full appearance-none rounded-md border border-border bg-background px-3 text-sm outline-none ring-offset-background transition-colors focus:border-ring focus:ring-2 focus:ring-ring/30"
                >
                  <option value="all">All years</option>
                  {yearOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label className="relative">
                <select
                  value={sortMode}
                  onChange={(event) => setSortMode(event.target.value)}
                  className="h-10 w-full appearance-none rounded-md border border-border bg-background px-3 text-sm outline-none ring-offset-background transition-colors focus:border-ring focus:ring-2 focus:ring-ring/30"
                >
                  <option value="newest">Newest first</option>
                  <option value="name">Name A-Z</option>
                  <option value="maker">Maker A-Z</option>
                </select>
              </label>

              {filterableSpecs.map((filter) => (
                <label key={filter.label} className="relative">
                  <select
                    value={specFilters[filter.label] ?? "all"}
                    onChange={(event) =>
                      setSpecFilters((current) => ({
                        ...current,
                        [filter.label]: event.target.value,
                      }))
                    }
                    className="h-10 w-full appearance-none rounded-md border border-border bg-background px-3 text-sm outline-none ring-offset-background transition-colors focus:border-ring focus:ring-2 focus:ring-ring/30"
                  >
                    <option value="all">All {filter.label}</option>
                    {filter.values.map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
            </div>

            {hasActiveFilters ? (
              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                {query.trim() ? (
                  <span className="rounded-full border border-border bg-background px-2 py-1">
                    Search: {query.trim()}
                  </span>
                ) : null}
                {manufacturer !== "all" ? (
                  <span className="rounded-full border border-border bg-background px-2 py-1">
                    Maker: {manufacturer}
                  </span>
                ) : null}
                {year !== "all" ? (
                  <span className="rounded-full border border-border bg-background px-2 py-1">
                    Year: {year}
                  </span>
                ) : null}
                {Object.entries(specFilters)
                  .filter(([, value]) => value !== "all")
                  .map(([label, value]) => (
                    <span
                      key={`${label}-${value}`}
                      className="rounded-full border border-border bg-background px-2 py-1"
                    >
                      {label}: {value}
                    </span>
                  ))}
              </div>
            ) : null}
          </div>
        </div>

        {loadingCategory === activeCategory ? (
          <div className="mt-5 flex min-h-80 items-center justify-center rounded-lg border border-border bg-card">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Loading {activeCategoryData?.label.toLowerCase()} records
            </div>
          </div>
        ) : loadError ? (
          <div className="mt-5 rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
            {loadError}
          </div>
        ) : (
          <>
            <div className="mt-5 grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr))]">
              {visibleParts.map((part, index) => {
                const isSelected = selectedIds.has(part.id);
                const Icon = getCategoryIcon(part.category);
                const cardSpecs = getCardSpecs(part);
                const partMeta = getPartMeta(part);

                return (
                  <button
                    key={part.id}
                    type="button"
                    onClick={() => togglePart(part)}
                    className={cn(
                      "editor-part group min-h-[220px] rounded-lg border border-border bg-card p-4 text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-foreground/35 hover:bg-accent/30 hover:shadow-xl hover:shadow-black/20",
                      isSelected && "border-foreground bg-secondary",
                    )}
                    style={{ animationDelay: `${Math.min(index, 18) * 18}ms` }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="mb-3 flex items-center gap-2">
                          <span className="flex size-8 items-center justify-center rounded-md border border-border bg-background transition-colors group-hover:border-foreground/40">
                            <Icon
                              className="size-4 text-muted-foreground"
                              aria-hidden="true"
                            />
                          </span>
                          <span className="truncate font-mono text-xs text-muted-foreground">
                            {part.manufacturer}
                          </span>
                        </div>
                        <h3 className="line-clamp-3 text-base font-semibold leading-6 text-foreground">
                          {part.name}
                        </h3>
                        {partMeta ? (
                          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                            {partMeta}
                          </p>
                        ) : null}
                      </div>
                      <span
                        className={cn(
                          "flex size-9 shrink-0 items-center justify-center rounded-md border transition-colors",
                          isSelected
                            ? "border-foreground bg-foreground text-background"
                            : "border-border bg-background text-muted-foreground group-hover:text-foreground",
                        )}
                      >
                        {isSelected ? (
                          <Check className="size-4" aria-hidden="true" />
                        ) : (
                          <Plus className="size-4" aria-hidden="true" />
                        )}
                      </span>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-1.5">
                      {cardSpecs.length ? (
                        cardSpecs.map((spec) => (
                          <div
                            key={`${part.id}-${spec.label}`}
                            className="min-w-0 rounded-md border border-border bg-background/45 px-2.5 py-1.5"
                          >
                            <p className="truncate font-mono text-[10px] uppercase leading-4 text-muted-foreground">
                              {spec.label}
                            </p>
                            <p className="mt-0.5 truncate text-sm leading-5 text-foreground">
                              {spec.value}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-2 rounded-md border border-dashed border-border bg-background/30 px-3 py-4 text-sm text-muted-foreground">
                          No structured specs in OpenDB for this record.
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {!visibleParts.length ? (
              <div className="mt-5 rounded-lg border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
                No parts match those filters.
              </div>
            ) : null}

            {visibleCount < filteredParts.length ? (
              <div className="mt-5 flex justify-center">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setVisibleCount((count) => count + visibleStep)}
                >
                  Load more
                  <span className="font-mono text-xs">
                    {Math.min(
                      visibleStep,
                      filteredParts.length - visibleCount,
                    ).toLocaleString()}
                  </span>
                </Button>
              </div>
            ) : null}
          </>
        )}
      </section>

      <aside className="xl:col-span-2 2xl:col-span-1 2xl:sticky 2xl:top-24 2xl:h-fit">
        <Card className="editor-panel overflow-hidden">
          <CardHeader className="border-b border-border">
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle>Build draft</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                  {coreCount}/7 core groups, {selectedCount} total parts
                </p>
              </div>
              <Badge variant={coreCount >= 5 ? "default" : "secondary"}>
                {coreCount >= 5 ? "Solid" : "Draft"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-5 2xl:max-h-[calc(100vh-14rem)] 2xl:overflow-y-auto">
            <div className="rounded-lg border border-border bg-background/35 p-3">
              <label className="block">
                <span className="font-mono text-[11px] uppercase text-muted-foreground">
                  Setup title
                </span>
                <input
                  value={setupTitle}
                  onChange={(event) => setSetupTitle(event.target.value)}
                  maxLength={80}
                  className="mt-2 h-10 w-full rounded-md border border-border bg-card px-3 text-sm outline-none ring-offset-background transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/30"
                />
              </label>

              <label className="mt-3 block">
                <span className="font-mono text-[11px] uppercase text-muted-foreground">
                  Visibility
                </span>
                <select
                  value={visibility}
                  onChange={(event) =>
                    setVisibility(event.target.value as SetupVisibility)
                  }
                  className="mt-2 h-10 w-full appearance-none rounded-md border border-border bg-card px-3 text-sm outline-none ring-offset-background transition-colors focus:border-ring focus:ring-2 focus:ring-ring/30"
                >
                  <option value="public">Public profile</option>
                  <option value="private">Private draft</option>
                </select>
              </label>

              <div className="mt-3 grid gap-2">
                <Button
                  type="button"
                  onClick={publishSetup}
                  disabled={!selectedParts.length || saveState === "saving"}
                  className="w-full"
                >
                  {saveState === "saving" ? (
                    <Loader2 className="animate-spin" aria-hidden="true" />
                  ) : (
                    <Save aria-hidden="true" />
                  )}
                  {saveState === "saving" ? "Publishing" : "Publish setup"}
                </Button>

                {savedProfileUrl ? (
                  <Button asChild type="button" variant="outline" className="w-full">
                    <a href={savedProfileUrl}>
                      View profile
                      <ExternalLink aria-hidden="true" />
                    </a>
                  </Button>
                ) : null}
              </div>

              {saveMessage ? (
                <p
                  className={cn(
                    "mt-3 text-xs leading-5",
                    saveState === "error"
                      ? "text-red-300"
                      : "text-muted-foreground",
                  )}
                >
                  {saveMessage}
                </p>
              ) : null}
            </div>

            <div className="space-y-3">
              {index.categories
                .filter((category) => draft[category.id]?.length)
                .map((category) => {
                  const Icon = getCategoryIcon(category.id);
                  const parts = draft[category.id] ?? [];

                  return (
                    <div
                      key={category.id}
                      className="rounded-lg border border-border bg-background/35 p-3"
                    >
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="flex size-8 items-center justify-center rounded-md border border-border bg-secondary">
                            <Icon
                              className="size-4 text-muted-foreground"
                              aria-hidden="true"
                            />
                          </span>
                          <p className="font-mono text-[11px] uppercase text-muted-foreground">
                            {category.label}
                          </p>
                        </div>
                        <Badge variant="secondary">{parts.length}</Badge>
                      </div>
                      <div className="space-y-2">
                        {parts.map((part) => (
                          <div
                            key={part.id}
                            className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2"
                          >
                            <p className="min-w-0 flex-1 truncate text-sm font-medium">
                              {labelFor(part)}
                            </p>
                            <button
                              type="button"
                              onClick={() => removePart(part)}
                              className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                            >
                              <X className="size-4" aria-hidden="true" />
                              <span className="sr-only">Remove {part.name}</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}

              {!selectedCount ? (
                <div className="rounded-lg border border-dashed border-border bg-background/30 p-6 text-center text-sm text-muted-foreground">
                  Pick any number of parts from any category.
                </div>
              ) : null}
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => downloadDraft(selectedParts, index.source)}
                disabled={!selectedParts.length}
              >
                <Download aria-hidden="true" />
                Export
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDraft({})}
                disabled={!selectedParts.length}
              >
                <RotateCcw aria-hidden="true" />
                Reset
              </Button>
            </div>

            <div className="rounded-md border border-border bg-secondary/40 p-4 text-xs leading-5 text-muted-foreground">
              <p className="font-mono text-foreground">
                {index.source.name} @ {index.source.commit.slice(0, 7)}
              </p>
              <p className="mt-2">{index.source.license}</p>
              <a
                href={index.source.repository}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex text-foreground underline-offset-4 hover:underline"
              >
                Source repository
              </a>
            </div>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}
