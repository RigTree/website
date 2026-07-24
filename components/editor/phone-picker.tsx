"use client";

import { Loader2, Search, ChevronLeft, Save } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { type BuildCoresPart } from "@/lib/buildcores-types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type PhoneSearchResult = {
  name: string;
  slug: string;
  imageUrl: string;
  thumbUrl: string;
  detail_url: string;
};

type PhoneSpecs = {
  brand: string;
  model: string;
  imageUrl: string;
  specifications: Record<string, Record<string, string>>;
};

type PhoneSearchResponse = {
  status?: boolean;
  data?: PhoneSearchResult[];
};

type PhoneDetailsResponse = {
  status?: boolean;
  data?: PhoneSpecs;
};

type CurrentSetupResponse = {
  setup?: {
    parts?: BuildCoresPart[];
    setup?: {
      title?: string;
      visibility?: "public" | "private";
    };
  } | null;
};

type SaveSetupResponse = {
  profileUrl?: string;
  error?: string;
};

export function PhonePicker() {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<PhoneSearchResult[]>([]);
  const [selectedPhone, setSelectedPhone] = useState<PhoneSpecs | null>(null);
  const [isLoadingPhone, setIsLoadingPhone] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const searchPhones = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setError("");
    setSelectedPhone(null);

    try {
      const response = await fetch(`https://mobile-specs-api-sandy.vercel.app/search?query=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error("Failed to search phones");
      
      const payload = (await response.json()) as PhoneSearchResponse;
      if (payload.status) {
        setSearchResults(payload.data || []);
      } else {
        setSearchResults([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSearching(false);
    }
  };

  const loadPhoneDetails = async (phone: PhoneSearchResult) => {
    setIsLoadingPhone(true);
    setError("");

    try {
      const response = await fetch(`https://mobile-specs-api-sandy.vercel.app/phone?name=${encodeURIComponent(phone.name)}`);
      if (!response.ok) throw new Error("Failed to load phone details");

      const payload = (await response.json()) as PhoneDetailsResponse;
      if (payload.status && payload.data) {
        setSelectedPhone(payload.data);
      } else {
        throw new Error("Phone details not found");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred loading specs");
    } finally {
      setIsLoadingPhone(false);
    }
  };

  const saveToRigTree = async () => {
    if (!selectedPhone) return;
    setIsSaving(true);
    setError("");

    try {
      // 1. Fetch current setup
      const currentRes = await fetch("/api/setups/me");
      if (!currentRes.ok) throw new Error("Failed to fetch current setup");
      const currentPayload = (await currentRes.json()) as CurrentSetupResponse;
      const currentParts = currentPayload.setup?.parts || [];

      // 2. Map phone to BuildCoresPart format
      const specs = Object.values(selectedPhone.specifications || {}).flatMap(catSpecs => 
        Object.entries(catSpecs).map(([key, value]) => ({ 
          label: key, 
          // strip html tags that come from the mobile specs api
          value: value.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim() 
        }))
      );

      const resolvedBrand = selectedPhone.brand || (selectedPhone.model ? selectedPhone.model.split(' ')[0] : "Unknown");
      const resolvedModel = selectedPhone.model || "Unknown Phone";

      const phonePart = {
        id: `phone-${resolvedBrand}-${resolvedModel}`.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        category: "Phone",
        categoryLabel: "Mobile Phone",
        name: resolvedModel,
        manufacturer: resolvedBrand,
        series: "",
        variant: "",
        releaseYear: null,
        specs,
        searchText: `${resolvedBrand} ${resolvedModel}`.toLowerCase()
      };

      // Ensure we don't add duplicates
      const newParts = currentParts.filter((p: BuildCoresPart) => p.id !== phonePart.id);
      newParts.push(phonePart);

      // 3. Save
      const saveRes = await fetch("/api/setups/me", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parts: newParts,
          title: currentPayload.setup?.setup?.title || "My RigTree setup",
          visibility: currentPayload.setup?.setup?.visibility || "public"
        })
      });

      if (!saveRes.ok) throw new Error("Failed to save to RigTree");

      const savePayload = (await saveRes.json()) as SaveSetupResponse;
      if (savePayload.profileUrl) {
        router.push(savePayload.profileUrl);
        router.refresh();
      } else {
        throw new Error("Failed to get profile URL after saving");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while saving");
    } finally {
      setIsSaving(false);
    }
  };

  if (selectedPhone) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => setSelectedPhone(null)}
            className="w-fit"
            disabled={isSaving}
          >
            <ChevronLeft className="mr-2 size-4" />
            Back to search
          </Button>

          <Button 
            onClick={saveToRigTree}
            disabled={isSaving}
          >
            {isSaving ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Save className="mr-2 size-4" />}
            Save to RigTree
          </Button>
        </div>

        {error && (
          <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-6 md:flex-row md:items-start">
          <div className="flex shrink-0 justify-center rounded-lg border border-border bg-background p-8 md:w-64">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={selectedPhone.imageUrl} 
              alt={selectedPhone.model}
              className="max-h-[300px] object-contain"
            />
          </div>

          <div className="flex-1 space-y-6">
            <div>
              <Badge variant="secondary" className="mb-2">
                {selectedPhone.brand}
              </Badge>
              <h2 className="text-3xl font-bold">{selectedPhone.model || selectedPhone.brand}</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {Object.entries(selectedPhone.specifications || {}).map(([category, specs]) => (
                <Card key={category} className="overflow-hidden">
                  <CardHeader className="bg-secondary/50 py-3">
                    <CardTitle className="text-sm">{category}</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-2 p-3 text-sm">
                    {Object.entries(specs).map(([key, value]) => (
                      <div key={key} className="grid grid-cols-[100px_1fr] gap-2 md:grid-cols-[120px_1fr]">
                        <span className="font-medium text-muted-foreground">{key}</span>
                        <span dangerouslySetInnerHTML={{ __html: value }} />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <h2 className="mb-4 text-2xl font-bold">Search Mobile Phones</h2>
        <form onSubmit={searchPhones} className="flex gap-2">
          <label className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for Samsung, Apple, Xiaomi..."
              className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </label>
          <Button type="submit" disabled={isSearching || !query.trim()}>
            {isSearching ? <Loader2 className="size-4 animate-spin" /> : "Search"}
          </Button>
        </form>

        {error && (
          <p className="mt-4 text-sm text-destructive">{error}</p>
        )}
      </div>

      {isLoadingPhone && (
        <div className="flex h-40 items-center justify-center rounded-lg border border-border bg-card">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      )}

      {!isLoadingPhone && searchResults.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {searchResults.map((phone) => (
            <button
              key={phone.slug}
              onClick={() => loadPhoneDetails(phone)}
              className="group flex flex-col items-center justify-between rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary hover:bg-accent"
            >
              <div className="mb-4 flex h-32 w-full items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={phone.thumbUrl} 
                  alt={phone.name} 
                  className="max-h-full max-w-full object-contain transition-transform group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXNtYXJ0cGhvbmUiPjxyZWN0IHdpZHRoPSIxNCIgaGVpZ2h0PSIyMCIgeD0iNSIgeT0iMiIgcng9IjIiIHJ5PSIyIi8+PHBhdGggZD0iTTEyIDE4aC4wMSIvPjwvc3ZnPg==';
                    (e.target as HTMLImageElement).className = 'size-8 text-muted-foreground opacity-50';
                  }}
                />
              </div>
              <span className="text-center text-sm font-medium leading-tight">
                {phone.name}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
