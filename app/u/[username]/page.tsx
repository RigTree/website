import {
  Laptop,
  Database,
  Layers,
  Box,
  Microchip,
  Component,
  CircuitBoard,
  MemoryStick,
  Monitor,
  Keyboard,
  Mouse,
  Headphones,
  PcCase,
  PlugZap,
  Webcam,
  Package2,
  ChevronRight,
  Smartphone,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { RigTreeMark } from "@/components/rigtree-mark";
import { Button } from "@/components/ui/button";
import type { BuildCoresPart } from "@/lib/buildcores-types";
import { getPublicSetup } from "@/lib/setups";
import { ParticlesBackground } from "@/components/particles-background";

export const dynamic = "force-dynamic";

type PartGroup = {
  id: string;
  label: string;
  parts: BuildCoresPart[];
};

const showcaseOrder = ["Phone", "Laptop", "CPU", "GPU", "Motherboard", "RAM", "Storage", "PSU", "PCCase", "Monitor"];

const categoryIcons: Record<string, LucideIcon> = {
  CPU: Microchip,
  GPU: Component,
  Motherboard: CircuitBoard,
  RAM: MemoryStick,
  Storage: Database,
  Monitor,
  Keyboard,
  Mouse,
  Headphones,
  PCCase: PcCase,
  PSU: PlugZap,
  Webcam: Webcam,
  Phone: Smartphone,
};

function getCategoryIcon(categoryId: string): LucideIcon {
  return categoryIcons[categoryId] ?? Package2;
}

function compactName(part: BuildCoresPart) {
  return part.name.startsWith(part.manufacturer)
    ? part.name
    : `${part.manufacturer} ${part.name}`.trim();
}

// Metadata Generation for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

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

function orderedParts(parts: BuildCoresPart[]) {
  // Sort parts by showcase order, then alphabetically by category for the rest
  const sorted = [...parts].sort((a, b) => {
    const aIndex = showcaseOrder.indexOf(a.category);
    const bIndex = showcaseOrder.indexOf(b.category);
    
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    
    return a.category.localeCompare(b.category);
  });
  return sorted;
}

function formatDate(dateString?: string | null) {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  const saved = await getPublicSetup(username);

  if (!saved) {
    notFound();
  }

  const groups = groupParts(saved.parts);
  const partsList = orderedParts(saved.parts);
  
  const mobileDevices = partsList.filter(p => p.category === "Phone" || p.category === "Laptop");
  const hardwareParts = partsList.filter(p => p.category !== "Phone" && p.category !== "Laptop");

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

      <ProfileNav />

      {/* Main Container - Ultra Compact Width for Link-in-Bio Style */}
      <section className="container relative z-10 py-6 md:py-10 max-w-[480px]">
        <div className="flex flex-col items-center space-y-4">
          
          {/* Main Profile Header Card */}
          <header className="site-enter w-full rounded-[24px] border border-border/80 bg-card/25 backdrop-blur-xl shadow-soft p-6 flex flex-col items-center text-center">
            {/* Glowing Avatar Frame */}
            <div className="relative size-20 shrink-0 rounded-full p-[2px] bg-gradient-to-tr from-sky-400 via-violet-400 to-emerald-400 shadow-lg mb-4">
              <span
                className="flex h-full w-full items-center justify-center rounded-full bg-card bg-cover bg-center border-2 border-background"
                style={avatarStyle}
              >
                {!avatarStyle ? (
                  <RigTreeMark className="size-10 text-muted-foreground" />
                ) : (
                  <span className="sr-only">{saved.profile.display_name}</span>
                )}
              </span>
            </div>

            <div className="space-y-1 mb-3">
              <h1 className="text-2xl font-extrabold tracking-tight leading-tight">
                {saved.profile.display_name}
              </h1>
              <p className="font-mono text-xs tracking-widest text-sky-400 font-semibold uppercase">
                @{saved.profile.username}
              </p>
            </div>

            <p className="text-xs font-medium text-muted-foreground mb-5 px-2">
              {saved.setup?.title ?? "No public setup yet"}
              {saved.setup?.description ? ` • ${saved.setup.description}` : ""}
            </p>

            {/* Badges / Stats (similar to social icons row) */}
            <div className="flex flex-wrap justify-center gap-2.5">
              <BadgeStat icon={Box} label="Parts" value={saved.parts.length} />
              <BadgeStat icon={Layers} label="Categories" value={groups.length} />
            </div>
          </header>

          {!groups.length ? (
            <div className="site-enter-slow w-full flex flex-col items-center justify-center text-center p-8 rounded-[20px] border border-border bg-card/20 backdrop-blur-md">
              <Laptop className="size-10 text-muted-foreground/45 mb-3 animate-bounce" />
              <h3 className="text-base font-bold">No public setups found</h3>
              <p className="text-xs text-muted-foreground mt-1.5">
                This builder profile exists, but there is no public hardware loadout to show yet.
              </p>
              <Button asChild className="mt-5 shadow-md" size="sm">
                <Link href="/editor">Launch Editor</Link>
              </Button>
            </div>
          ) : (
            <div className="w-full space-y-6">
              
              {/* Mobile Devices Section */}
              {mobileDevices.length > 0 && (
                <div className="w-full pt-1 pb-1">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <div className="h-px w-8 bg-border/60"></div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Mobile Devices</span>
                    <div className="h-px w-8 bg-border/60"></div>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    {mobileDevices.map((part, index) => {
                      const Icon = getCategoryIcon(part.category);
                      const isPhone = part.category === "Phone";
                      const href = isPhone ? `https://www.gsmarena.com/res.php3?sSearch=${encodeURIComponent(part.name)}` : undefined;
                      
                      const Wrapper = href ? "a" : "div";
                      const wrapperProps = href ? { href, target: "_blank", rel: "noreferrer" } : {};

                      return (
                        <Wrapper
                          key={`${part.id}-${index}`}
                          {...wrapperProps}
                          className="site-enter-slow w-full group flex items-center justify-between rounded-[16px] border border-border/50 bg-card/20 hover:bg-card/40 backdrop-blur-md px-4 py-3 transition-all hover:border-border/80 shadow-sm"
                        >
                          <div className="flex items-center gap-3 min-w-0 pr-2">
                            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary/40 text-muted-foreground border border-border/40 group-hover:text-foreground group-hover:bg-secondary/60 transition-colors">
                              <Icon className="size-4.5" />
                            </div>
                            <div className="text-left min-w-0">
                              <h4 className="font-semibold text-[13px] text-foreground/90 group-hover:text-foreground truncate transition-colors">
                                {compactName(part)}
                              </h4>
                              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider truncate">
                                {part.categoryLabel}
                              </p>
                            </div>
                          </div>
                          {href && <ChevronRight className="size-4 shrink-0 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors group-hover:translate-x-0.5" />}
                        </Wrapper>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Hardware Parts Section */}
              {hardwareParts.length > 0 && (
                <div className="w-full pt-1 pb-1">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <div className="h-px w-8 bg-border/60"></div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Hardware Loadout</span>
                    <div className="h-px w-8 bg-border/60"></div>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    {hardwareParts.map((part, index) => {
                      const Icon = getCategoryIcon(part.category);
                      return (
                        <div
                          key={`${part.id}-${index}`}
                          className="site-enter-slow w-full group flex items-center justify-between rounded-[16px] border border-border/50 bg-card/20 hover:bg-card/40 backdrop-blur-md px-4 py-3 transition-all hover:border-border/80 shadow-sm"
                        >
                          <div className="flex items-center gap-3 min-w-0 pr-2">
                            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary/40 text-muted-foreground border border-border/40 group-hover:text-foreground group-hover:bg-secondary/60 transition-colors">
                              <Icon className="size-4.5" />
                            </div>
                            <div className="text-left min-w-0">
                              <h4 className="font-semibold text-[13px] text-foreground/90 group-hover:text-foreground truncate transition-colors">
                                {compactName(part)}
                              </h4>
                              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider truncate">
                                {part.categoryLabel}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
                
                {/* Profile Footer Info */}
                <div className="site-enter-slow mt-8 flex flex-col items-center justify-center gap-2 text-center text-[10px] text-muted-foreground">
                  <p>
                    Updated {formatDate(saved.setup?.published_at)}
                    {saved.setup?.source_license ? ` • ${saved.setup.source_license}` : ""}
                  </p>
                  {saved.setup?.source_repository && (
                    <p>
                      <a href={saved.setup.source_repository} target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors underline underline-offset-2">
                        View source repository
                      </a>
                      {saved.setup.source_commit && ` • commit ${saved.setup.source_commit.slice(0, 7)}`}
                    </p>
                  )}
                </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}


function BadgeStat({ icon: Icon, value }: { icon: LucideIcon; label: string; value: string | number }) {
  const display = typeof value === "number" ? value.toLocaleString() : value;
  
  return (
    <div className="flex items-center gap-1.5 rounded-full border border-border/60 bg-secondary/30 px-2.5 py-1 text-[10px] text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-colors shadow-sm cursor-default">
      <Icon className="size-3" />
      <span className="font-medium">{display}</span>
    </div>
  );
}

function ProfileNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <nav className="container flex min-h-16 max-w-[480px] mx-auto items-center justify-between gap-3 py-3">
        <Link href="/" className="flex items-center gap-3 group">
          <span className="flex size-8 items-center justify-center rounded-lg border border-border bg-secondary/80 text-foreground group-hover:bg-accent transition-colors duration-200 shadow-sm">
            <RigTreeMark className="size-4" />
          </span>
          <span className="text-sm font-bold tracking-tight group-hover:text-sky-400 transition-colors">RigTree</span>
        </Link>

        <Button asChild variant="ghost" size="sm" className="font-semibold text-muted-foreground hover:text-foreground h-8 text-xs rounded-lg">
          <Link href="/editor">Editor</Link>
        </Button>
      </nav>
    </header>
  );
}
