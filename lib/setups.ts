import "server-only";

import type { BuildCoresIndex, BuildCoresPart, PartSpec } from "@/lib/buildcores-types";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export type SetupVisibility = "public" | "private";

type ProfileRow = {
  id: string;
  clerk_user_id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

type SetupRow = {
  id: string;
  profile_id: string;
  slug: string;
  title: string;
  description: string | null;
  visibility: SetupVisibility;
  source_name: string | null;
  source_repository: string | null;
  source_commit: string | null;
  source_license: string | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
};

type SetupPartRow = {
  buildcores_part_id: string;
  category: string;
  category_label: string;
  name: string;
  manufacturer: string;
  series: string | null;
  variant: string | null;
  release_year: number | null;
  specs: PartSpec[] | null;
};

export type SavedSetup = {
  profile: ProfileRow;
  setup: SetupRow | null;
  parts: BuildCoresPart[];
};

type SaveSetupInput = {
  clerkUserId: string;
  usernameBase: string;
  displayName: string;
  avatarUrl: string | null;
  title: string;
  description?: string;
  visibility: SetupVisibility;
  source: BuildCoresIndex["source"];
  parts: BuildCoresPart[];
};

function sanitizeUsername(value: string) {
  const username = value
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 32);

  return username || "builder";
}

function buildPartSearchText(part: SetupPartRow) {
  return [
    part.category,
    part.name,
    part.manufacturer,
    part.series,
    part.variant,
    ...(part.specs ?? []).flatMap((spec) => [spec.label, spec.value]),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function mapPartRow(part: SetupPartRow): BuildCoresPart {
  return {
    id: part.buildcores_part_id,
    category: part.category,
    categoryLabel: part.category_label,
    name: part.name,
    manufacturer: part.manufacturer,
    series: part.series ?? "",
    variant: part.variant ?? "",
    releaseYear: part.release_year,
    specs: part.specs ?? [],
    searchText: buildPartSearchText(part),
  };
}

async function getExistingProfile(clerkUserId: string) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("clerk_user_id", clerkUserId)
    .maybeSingle<ProfileRow>();

  if (error) {
    throw error;
  }

  return data;
}

async function reserveUsername(usernameBase: string, clerkUserId: string) {
  const supabase = getSupabaseAdmin();
  const base = sanitizeUsername(usernameBase);

  for (let index = 0; index < 25; index += 1) {
    const username = index ? `${base}-${index + 1}` : base;
    const { data, error } = await supabase
      .from("profiles")
      .select("clerk_user_id")
      .eq("username", username)
      .maybeSingle<{ clerk_user_id: string }>();

    if (error) {
      throw error;
    }

    if (!data || data.clerk_user_id === clerkUserId) {
      return username;
    }
  }

  return `${base}-${clerkUserId.slice(-6).toLowerCase()}`;
}

async function ensureProfile({
  clerkUserId,
  usernameBase,
  displayName,
  avatarUrl,
}: Pick<
  SaveSetupInput,
  "avatarUrl" | "clerkUserId" | "displayName" | "usernameBase"
>) {
  const supabase = getSupabaseAdmin();
  const existing = await getExistingProfile(clerkUserId);

  if (existing) {
    const { data, error } = await supabase
      .from("profiles")
      .update({
        avatar_url: avatarUrl,
        display_name: displayName,
      })
      .eq("id", existing.id)
      .select("*")
      .single<ProfileRow>();

    if (error) {
      throw error;
    }

    return data;
  }

  const username = await reserveUsername(usernameBase, clerkUserId);
  const { data, error } = await supabase
    .from("profiles")
    .insert({
      avatar_url: avatarUrl,
      clerk_user_id: clerkUserId,
      display_name: displayName,
      username,
    })
    .select("*")
    .single<ProfileRow>();

  if (error) {
    throw error;
  }

  return data;
}

export async function saveSetup(input: SaveSetupInput) {
  const supabase = getSupabaseAdmin();
  const profile = await ensureProfile(input);
  const title = input.title.trim() || "My RigTree setup";
  const now = new Date().toISOString();

  const { data: setup, error: setupError } = await supabase
    .from("setups")
    .upsert(
      {
        clerk_user_id: input.clerkUserId,
        description: input.description?.trim() || null,
        profile_id: profile.id,
        published_at: input.visibility === "public" ? now : null,
        slug: "main",
        source_commit: input.source.commit,
        source_license: input.source.license,
        source_name: input.source.name,
        source_repository: input.source.repository,
        title,
        visibility: input.visibility,
      },
      { onConflict: "profile_id,slug" },
    )
    .select("*")
    .single<SetupRow>();

  if (setupError) {
    throw setupError;
  }

  const { error: deleteError } = await supabase
    .from("setup_parts")
    .delete()
    .eq("setup_id", setup.id);

  if (deleteError) {
    throw deleteError;
  }

  if (input.parts.length) {
    const { error: partsError } = await supabase.from("setup_parts").insert(
      input.parts.map((part, index) => ({
        buildcores_part_id: part.id,
        category: part.category,
        category_label: part.categoryLabel,
        manufacturer: part.manufacturer,
        name: part.name,
        release_year: part.releaseYear,
        series: part.series || null,
        setup_id: setup.id,
        sort_order: index,
        specs: part.specs,
        variant: part.variant || null,
      })),
    );

    if (partsError) {
      throw partsError;
    }
  }

  return {
    parts: input.parts,
    profile,
    setup,
  };
}

async function getSetupParts(setupId: string) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("setup_parts")
    .select(
      "buildcores_part_id, category, category_label, name, manufacturer, series, variant, release_year, specs",
    )
    .eq("setup_id", setupId)
    .order("sort_order", { ascending: true });

  if (error) {
    throw error;
  }

  return (data as SetupPartRow[]).map(mapPartRow);
}

export async function getOwnSetup(clerkUserId: string): Promise<SavedSetup | null> {
  const supabase = getSupabaseAdmin();
  const profile = await getExistingProfile(clerkUserId);

  if (!profile) {
    return null;
  }

  const { data: setup, error } = await supabase
    .from("setups")
    .select("*")
    .eq("profile_id", profile.id)
    .eq("slug", "main")
    .maybeSingle<SetupRow>();

  if (error) {
    throw error;
  }

  return {
    parts: setup ? await getSetupParts(setup.id) : [],
    profile,
    setup,
  };
}

const MOCK_SETUP: SavedSetup = {
  profile: {
    id: "mock-profile-id",
    clerk_user_id: "user_mock",
    username: "alexbuilds",
    display_name: "Alex Builds",
    avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  setup: {
    id: "mock-setup-id",
    profile_id: "mock-profile-id",
    slug: "main",
    title: "Dual-Chamber Workstation & Dev Rig",
    description: "Sleek dual-chamber build designed for heavy compilation, virtualization, and some casual 4K gaming. Clean cable management, custom lighting profiles, and a focus on keeping noise levels to an absolute minimum under sustained loads.",
    visibility: "public",
    source_name: "GitHub",
    source_repository: "https://github.com/alexbuilds/my-workstation",
    source_commit: "6072e7bde935a8df2d8f99e3a6c518b0ee2f3c78",
    source_license: "MIT",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    published_at: new Date().toISOString(),
  },
  parts: [
    {
      id: "part-1",
      category: "CPU",
      categoryLabel: "CPU",
      name: "Ryzen 9 7950X",
      manufacturer: "AMD",
      series: "Ryzen 9",
      variant: "",
      releaseYear: 2022,
      specs: [
        { label: "Cores", value: "16" },
        { label: "Threads", value: "32" },
        { label: "Base Clock", value: "4.5 GHz" },
      ],
      searchText: "cpu amd ryzen 9 7950x",
    },
    {
      id: "part-2",
      category: "GPU",
      categoryLabel: "GPU",
      name: "GeForce RTX 4080 Super",
      manufacturer: "NVIDIA",
      series: "RTX 40-series",
      variant: "Founders Edition",
      releaseYear: 2024,
      specs: [
        { label: "VRAM", value: "16 GB GDDR6X" },
        { label: "Architecture", value: "Ada Lovelace" },
      ],
      searchText: "gpu nvidia geforce rtx 4080 super founders edition",
    },
    {
      id: "part-3",
      category: "RAM",
      categoryLabel: "RAM",
      name: "Dominator Titanium 64GB",
      manufacturer: "Corsair",
      series: "Dominator Titanium",
      variant: "RGB Black",
      releaseYear: 2023,
      specs: [
        { label: "Capacity", value: "64 GB (2x32)" },
        { label: "Speed", value: "DDR5-6000" },
        { label: "CAS Latency", value: "CL30" },
      ],
      searchText: "ram corsair dominator titanium 64gb rgb black ddr5-6000 cl30",
    },
    {
      id: "part-4",
      category: "Storage",
      categoryLabel: "Storage",
      name: "990 Pro 2TB",
      manufacturer: "Samsung",
      series: "990 Pro",
      variant: "Heatsink",
      releaseYear: 2023,
      specs: [
        { label: "Capacity", value: "2 TB" },
        { label: "Interface", value: "PCIe 4.0 NVMe" },
      ],
      searchText: "storage samsung 990 pro 2tb heatsink pcie 4.0 nvme",
    },
    {
      id: "part-5",
      category: "Monitor",
      categoryLabel: "Monitor",
      name: "UltraGear 27GR95QE-B",
      manufacturer: "LG",
      series: "UltraGear",
      variant: "",
      releaseYear: 2023,
      specs: [
        { label: "Size", value: "27\"" },
        { label: "Panel", value: "OLED" },
        { label: "Refresh Rate", value: "240 Hz" },
      ],
      searchText: "monitor lg ultragear 27gr95qe-b oled 240 hz",
    },
    {
      id: "part-6",
      category: "Keyboard",
      categoryLabel: "Keyboard",
      name: "Voyager",
      manufacturer: "ZSA",
      series: "",
      variant: "Glow Black",
      releaseYear: 2023,
      specs: [
        { label: "Type", value: "Split Ergonomic" },
        { label: "Switches", value: "Kailh Choc Sunset" },
      ],
      searchText: "keyboard zsa voyager split ergonomic kailh choc sunset",
    },
    {
      id: "part-7",
      category: "Mouse",
      categoryLabel: "Mouse",
      name: "MX Master 3S",
      manufacturer: "Logitech",
      series: "MX",
      variant: "Graphite",
      releaseYear: 2022,
      specs: [
        { label: "Sensor", value: "8K DPI" },
        { label: "Buttons", value: "Quiet Click" },
      ],
      searchText: "mouse logitech mx master 3s graphite",
    },
    {
      id: "part-8",
      category: "PCCase",
      categoryLabel: "PC Case",
      name: "O11 Vision",
      manufacturer: "Lian Li",
      series: "O11",
      variant: "Chrome Edition",
      releaseYear: 2023,
      specs: [
        { label: "Type", value: "Dual-Chamber Mid-Tower" },
        { label: "Glass", value: "3-Sided Tempered" },
      ],
      searchText: "pccase lian li o11 vision chrome edition dual-chamber mid-tower",
    }
  ]
};

export async function getPublicSetup(username: string): Promise<SavedSetup | null> {
  const isDev = process.env.NODE_ENV === "development";
  const hasUrl = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const hasKey = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);

  if (isDev && (!hasUrl || !hasKey)) {
    if (sanitizeUsername(username) === "alexbuilds") {
      return MOCK_SETUP;
    }
    return null;
  }

  const supabase = getSupabaseAdmin();
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", sanitizeUsername(username))
    .maybeSingle<ProfileRow>();

  if (profileError) {
    throw profileError;
  }

  if (!profile) {
    return null;
  }

  const { data: setup, error: setupError } = await supabase
    .from("setups")
    .select("*")
    .eq("profile_id", profile.id)
    .eq("slug", "main")
    .eq("visibility", "public")
    .maybeSingle<SetupRow>();

  if (setupError) {
    throw setupError;
  }

  return {
    parts: setup ? await getSetupParts(setup.id) : [],
    profile,
    setup,
  };
}

