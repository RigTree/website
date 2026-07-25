"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Laptop,
  Search,
  ChevronLeft,
  Save,
  Loader2,
  Cpu,
  HardDrive,
  MemoryStick,
  Monitor,
  Plus,
  Check,
  Sparkles,
} from "lucide-react";

import type { BuildCoresPart, PartSpec } from "@/lib/buildcores-types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type LaptopPreset = {
  id: string;
  brand: string;
  model: string;
  type: "Ultrabook" | "Workstation" | "Gaming" | "Creator";
  cpu: string;
  gpu?: string;
  ram: string;
  storage: string;
  display: string;
  releaseYear?: number;
};

const POPULAR_LAPTOPS: LaptopPreset[] = [
  {
    id: "apple-mbp-16-m3-max",
    brand: "Apple",
    model: 'MacBook Pro 16" (M3 Max)',
    type: "Workstation",
    cpu: "Apple M3 Max (16-core CPU, 40-core GPU)",
    ram: "48 GB Unified Memory",
    storage: "1 TB NVMe SSD",
    display: '16.2" Liquid Retina XDR (3456×2234, 120Hz ProMotion)',
    releaseYear: 2023,
  },
  {
    id: "apple-mba-15-m3",
    brand: "Apple",
    model: 'MacBook Air 15" (M3)',
    type: "Ultrabook",
    cpu: "Apple M3 (8-core CPU, 10-core GPU)",
    ram: "16 GB Unified Memory",
    storage: "512 GB NVMe SSD",
    display: '15.3" Liquid Retina (2880×1864, 500 nits)',
    releaseYear: 2024,
  },
  {
    id: "lenovo-thinkpad-x1-carbon-g12",
    brand: "Lenovo",
    model: "ThinkPad X1 Carbon Gen 12",
    type: "Ultrabook",
    cpu: "Intel Core Ultra 7 155H",
    gpu: "Intel Arc Graphics",
    ram: "32 GB LPDDR5X-6400",
    storage: "1 TB PCIe 4.0 NVMe",
    display: '14" 2.8K OLED (2880×1800, 120Hz, HDR500)',
    releaseYear: 2024,
  },
  {
    id: "asus-rog-zephyrus-g16-2024",
    brand: "ASUS",
    model: "ROG Zephyrus G16 (2024)",
    type: "Gaming",
    cpu: "Intel Core Ultra 9 185H",
    gpu: "NVIDIA GeForce RTX 4080 Laptop (12GB)",
    ram: "32 GB LPDDR5X",
    storage: "2 TB PCIe 4.0 NVMe",
    display: '16" 2.5K ROG Nebula OLED (2560×1600, 240Hz)',
    releaseYear: 2024,
  },
  {
    id: "dell-xps-16-9640",
    brand: "Dell",
    model: "XPS 16 (9640)",
    type: "Creator",
    cpu: "Intel Core Ultra 7 155H",
    gpu: "NVIDIA GeForce RTX 4070 Laptop (8GB)",
    ram: "32 GB LPDDR5X-7467",
    storage: "1 TB PCIe 4.0 NVMe",
    display: '16.3" 4K+ OLED Touch (3840×2400, 400 nits)',
    releaseYear: 2024,
  },
  {
    id: "razer-blade-16-2024",
    brand: "Razer",
    model: "Razer Blade 16 (2024)",
    type: "Gaming",
    cpu: "Intel Core i9-14900HX",
    gpu: "NVIDIA GeForce RTX 4090 Laptop (16GB)",
    ram: "64 GB DDR5-5600",
    storage: "2 TB PCIe 4.0 NVMe",
    display: '16" Dual-Mode Mini-LED (4K 120Hz / FHD+ 240Hz)',
    releaseYear: 2024,
  },
  {
    id: "framework-laptop-13-amd-7040",
    brand: "Framework",
    model: "Framework Laptop 13 (AMD Ryzen 7040)",
    type: "Ultrabook",
    cpu: "AMD Ryzen 7 7840U",
    gpu: "AMD Radeon 780M",
    ram: "32 GB DDR5-5600",
    storage: "1 TB NVMe M.2 2280",
    display: '13.5" IPS (2256×1504, 3:2 aspect ratio)',
    releaseYear: 2023,
  },
  {
    id: "hp-spectre-x360-14-2024",
    brand: "HP",
    model: "Spectre x360 14 (2024)",
    type: "Creator",
    cpu: "Intel Core Ultra 7 155H",
    gpu: "Intel Arc Graphics",
    ram: "32 GB LPDDR5X-7467",
    storage: "2 TB PCIe 4.0 NVMe",
    display: '14" 2.8K OLED Touch (2880×1800, 120Hz Variable)',
    releaseYear: 2024,
  },
];

type CurrentSetupResponse = {
  setup?: {
    parts?: BuildCoresPart[];
    setup?: {
      title?: string;
      visibility?: "public" | "private";
    };
  } | null;
};

export function LaptopPicker() {
  const [query, setQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<string>("All");
  const [selectedPreset, setSelectedPreset] = useState<LaptopPreset | null>(null);
  const [isCustomMode, setIsCustomMode] = useState(false);

  // Custom Form state
  const [customBrand, setCustomBrand] = useState("");
  const [customModel, setCustomModel] = useState("");
  const [customCpu, setCustomCpu] = useState("");
  const [customGpu, setCustomGpu] = useState("");
  const [customRam, setCustomRam] = useState("");
  const [customStorage, setCustomStorage] = useState("");
  const [customDisplay, setCustomDisplay] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const brands = ["All", ...Array.from(new Set(POPULAR_LAPTOPS.map((l) => l.brand)))];

  const filteredLaptops = POPULAR_LAPTOPS.filter((laptop) => {
    const matchesBrand = selectedBrand === "All" || laptop.brand === selectedBrand;
    const matchesQuery =
      !query.trim() ||
      `${laptop.brand} ${laptop.model} ${laptop.cpu} ${laptop.gpu || ""}`
        .toLowerCase()
        .includes(query.toLowerCase());
    return matchesBrand && matchesQuery;
  });

  const saveLaptopToSetup = async (laptop: LaptopPreset) => {
    setIsSaving(true);
    setError("");

    try {
      // 1. Fetch current setup
      const currentRes = await fetch("/api/setups/me");
      if (!currentRes.ok) throw new Error("Failed to fetch current setup");
      const currentPayload = (await currentRes.json()) as CurrentSetupResponse;
      const currentParts = currentPayload.setup?.parts || [];

      // 2. Format specs
      const specs: PartSpec[] = [
        { label: "Processor", value: laptop.cpu },
        ...(laptop.gpu ? [{ label: "Graphics", value: laptop.gpu }] : []),
        { label: "Memory", value: laptop.ram },
        { label: "Storage", value: laptop.storage },
        { label: "Display", value: laptop.display },
        { label: "Workload Profile", value: laptop.type },
      ];

      const partId = `laptop-${laptop.brand}-${laptop.model}`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-");

      const laptopPart: BuildCoresPart = {
        id: partId,
        category: "Laptop",
        categoryLabel: "Laptop",
        name: laptop.model,
        manufacturer: laptop.brand,
        series: laptop.type,
        variant: "",
        releaseYear: laptop.releaseYear || new Date().getFullYear(),
        specs,
        searchText: `${laptop.brand} ${laptop.model} ${laptop.cpu} ${laptop.ram} ${laptop.storage}`.toLowerCase(),
      };

      const newParts = currentParts.filter((p: BuildCoresPart) => p.id !== laptopPart.id);
      newParts.push(laptopPart);

      // 3. Save to setup API
      const saveRes = await fetch("/api/setups/me", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parts: newParts,
          title: currentPayload.setup?.setup?.title || `${laptop.model} Kit`,
          visibility: currentPayload.setup?.setup?.visibility || "public",
        }),
      });

      if (!saveRes.ok) throw new Error("Failed to save laptop to setup");

      const savePayload = (await saveRes.json()) as { profileUrl?: string };
      if (savePayload.profileUrl) {
        router.push(savePayload.profileUrl);
        router.refresh();
      } else {
        throw new Error("Failed to get profile URL after saving");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save laptop");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customBrand.trim() || !customModel.trim()) {
      setError("Brand and Model name are required.");
      return;
    }

    const customLaptop: LaptopPreset = {
      id: `custom-laptop-${Date.now()}`,
      brand: customBrand.trim(),
      model: customModel.trim(),
      type: "Workstation",
      cpu: customCpu.trim() || "Standard Processor",
      gpu: customGpu.trim() || undefined,
      ram: customRam.trim() || "16 GB RAM",
      storage: customStorage.trim() || "512 GB SSD",
      display: customDisplay.trim() || "14.0 inch Display",
      releaseYear: new Date().getFullYear(),
    };

    saveLaptopToSetup(customLaptop);
  };

  if (selectedPreset) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => setSelectedPreset(null)}
            className="w-fit"
            disabled={isSaving}
          >
            <ChevronLeft className="mr-2 size-4" />
            Back to catalog
          </Button>

          <Button onClick={() => saveLaptopToSetup(selectedPreset)} disabled={isSaving}>
            {isSaving ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <Save className="mr-2 size-4" />
            )}
            Add to RigTree
          </Button>
        </div>

        {error && (
          <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <Card className="overflow-hidden border-border bg-card/60 backdrop-blur-md">
          <CardHeader className="border-b border-border bg-secondary/30 pb-6">
            <div className="flex items-start justify-between">
              <div>
                <Badge variant="outline" className="mb-2 font-mono text-[10px]">
                  {selectedPreset.type}
                </Badge>
                <CardTitle className="text-2xl font-bold">
                  {selectedPreset.brand} {selectedPreset.model}
                </CardTitle>
              </div>
              {selectedPreset.releaseYear && (
                <span className="font-mono text-xs text-muted-foreground">
                  {selectedPreset.releaseYear}
                </span>
              )}
            </div>
          </CardHeader>

          <CardContent className="grid gap-4 p-6 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-lg border border-border bg-background/40 p-4">
              <Cpu className="size-5 shrink-0 text-[#a3e635]" />
              <div>
                <p className="font-mono text-[11px] uppercase text-muted-foreground">
                  Processor / SoC
                </p>
                <p className="text-sm font-semibold">{selectedPreset.cpu}</p>
              </div>
            </div>

            {selectedPreset.gpu && (
              <div className="flex items-center gap-3 rounded-lg border border-border bg-background/40 p-4">
                <Sparkles className="size-5 shrink-0 text-[#a3e635]" />
                <div>
                  <p className="font-mono text-[11px] uppercase text-muted-foreground">
                    Graphics
                  </p>
                  <p className="text-sm font-semibold">{selectedPreset.gpu}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 rounded-lg border border-border bg-background/40 p-4">
              <MemoryStick className="size-5 shrink-0 text-[#a3e635]" />
              <div>
                <p className="font-mono text-[11px] uppercase text-muted-foreground">
                  Memory / RAM
                </p>
                <p className="text-sm font-semibold">{selectedPreset.ram}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border border-border bg-background/40 p-4">
              <HardDrive className="size-5 shrink-0 text-[#a3e635]" />
              <div>
                <p className="font-mono text-[11px] uppercase text-muted-foreground">
                  Storage
                </p>
                <p className="text-sm font-semibold">{selectedPreset.storage}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border border-border bg-background/40 p-4 sm:col-span-2">
              <Monitor className="size-5 shrink-0 text-[#a3e635]" />
              <div>
                <p className="font-mono text-[11px] uppercase text-muted-foreground">
                  Display
                </p>
                <p className="text-sm font-semibold">{selectedPreset.display}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isCustomMode) {
    return (
      <div className="flex flex-col gap-6 max-w-2xl mx-auto">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => setIsCustomMode(false)}
            disabled={isSaving}
          >
            <ChevronLeft className="mr-2 size-4" />
            Back to preset list
          </Button>
          <h2 className="text-lg font-bold">Log Custom Laptop</h2>
        </div>

        {error && (
          <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <form onSubmit={handleCustomSubmit} className="space-y-4 rounded-xl border border-border bg-card/60 p-6 backdrop-blur-md">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-mono text-muted-foreground uppercase">Brand / Manufacturer *</label>
              <Input
                placeholder="e.g. Apple, ThinkPad, ASUS, Custom"
                value={customBrand}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomBrand(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-muted-foreground uppercase">Model Name *</label>
              <Input
                placeholder="e.g. MacBook Pro 14, XPS 15"
                value={customModel}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomModel(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono text-muted-foreground uppercase">Processor / SoC</label>
            <Input
              placeholder="e.g. Apple M3 Pro, Intel Core i7-13700H, AMD Ryzen 7"
              value={customCpu}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomCpu(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono text-muted-foreground uppercase">Dedicated GPU (Optional)</label>
            <Input
              placeholder="e.g. RTX 4070 Laptop, Radeon RX 7600M"
              value={customGpu}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomGpu(e.target.value)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-mono text-muted-foreground uppercase">RAM Capacity</label>
              <Input
                placeholder="e.g. 32 GB DDR5"
                value={customRam}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomRam(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-muted-foreground uppercase">Storage Capacity</label>
              <Input
                placeholder="e.g. 1 TB NVMe SSD"
                value={customStorage}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomStorage(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono text-muted-foreground uppercase">Display Specs</label>
            <Input
              placeholder="e.g. 15.6 in 4K OLED 120Hz"
              value={customDisplay}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomDisplay(e.target.value)}
            />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setIsCustomMode(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Check className="mr-2 size-4" />}
              Save Laptop
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search laptops by name, CPU, GPU, brand..."
            value={query}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <Button onClick={() => setIsCustomMode(true)} variant="outline" className="gap-2 shrink-0">
          <Plus className="size-4" />
          Add Custom Laptop Specs
        </Button>
      </div>

      {/* Brand pills */}
      <div className="flex flex-wrap gap-2">
        {brands.map((b) => (
          <Button
            key={b}
            variant={selectedBrand === b ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedBrand(b)}
            className="h-7 text-xs rounded-full font-mono"
          >
            {b}
          </Button>
        ))}
      </div>

      {/* Laptop grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredLaptops.map((laptop) => (
          <div
            key={laptop.id}
            onClick={() => setSelectedPreset(laptop)}
            className="glow-card group cursor-pointer flex flex-col justify-between rounded-xl border border-border bg-card/60 p-5 backdrop-blur-md transition-all hover:border-[#a3e635]/40"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-[10px] text-[#a3e635] font-bold uppercase tracking-wider">
                  {laptop.brand}
                </span>
                <Badge variant="secondary" className="text-[10px]">
                  {laptop.type}
                </Badge>
              </div>

              <h3 className="text-base font-semibold group-hover:text-[#a3e635] transition-colors">
                {laptop.model}
              </h3>

              <div className="mt-4 space-y-1.5 font-mono text-xs text-muted-foreground">
                <p className="truncate flex items-center gap-2">
                  <Cpu className="size-3 text-[#a3e635] shrink-0" />
                  {laptop.cpu}
                </p>
                {laptop.gpu && (
                  <p className="truncate flex items-center gap-2">
                    <Sparkles className="size-3 text-[#a3e635] shrink-0" />
                    {laptop.gpu}
                  </p>
                )}
                <p className="truncate flex items-center gap-2">
                  <MemoryStick className="size-3 text-[#a3e635] shrink-0" />
                  {laptop.ram} &bull; {laptop.storage}
                </p>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground group-hover:text-foreground">
              <span>View Specs</span>
              <span className="font-mono text-[10px] text-[#a3e635]">&rarr;</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
