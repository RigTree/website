import "server-only";

import type { BuildCoresIndex, BuildCoresPart, PartSpec, SpotifySong } from "@/lib/buildcores-types";
import { getSupabaseAdmin, hasSupabaseConfig } from "@/lib/supabase-admin";

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

type SongRow = {
  id: string;
  profile_id: string;
  spotify_track_id: string;
  track_name: string;
  artist_name: string;
  album_name: string;
  album_art_url: string;
  spotify_url: string;
  preview_url: string | null;
  sort_order: number;
  created_at: string;
};

export type SavedSetup = {
  profile: ProfileRow;
  setup: SetupRow | null;
  parts: BuildCoresPart[];
  songs: SpotifySong[];
};

type SaveSetupInput = {
  clerkUserId: string;
  usernameBase: string;
  customUsername?: string | null;
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
  customUsername,
  displayName,
  avatarUrl,
}: Pick<
  SaveSetupInput,
  "avatarUrl" | "clerkUserId" | "customUsername" | "displayName" | "usernameBase"
>) {
  const supabase = getSupabaseAdmin();
  const existing = await getExistingProfile(clerkUserId);

  let targetUsername: string | null = null;
  if (customUsername && customUsername.trim()) {
    targetUsername = await reserveUsername(customUsername.trim(), clerkUserId);
  }

  if (existing) {
    const updateData: Record<string, unknown> = {
      avatar_url: avatarUrl,
      display_name: displayName,
    };
    if (targetUsername) {
      updateData.username = targetUsername;
    }

    const { data, error } = await supabase
      .from("profiles")
      .update(updateData)
      .eq("id", existing.id)
      .select("*")
      .single<ProfileRow>();

    if (error) {
      throw error;
    }

    return data;
  }

  const username = targetUsername || (await reserveUsername(usernameBase, clerkUserId));
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

export async function getOrCreateProfileForUser(
  clerkUserId: string,
  user: {
    username?: string | null;
    primaryEmailAddress?: { emailAddress: string } | null;
    firstName?: string | null;
    fullName?: string | null;
    imageUrl?: string | null;
  } | null,
) {
  const usernameBase =
    user?.username ||
    user?.primaryEmailAddress?.emailAddress.split("@")[0] ||
    user?.firstName ||
    "builder";
  const displayName =
    user?.fullName ||
    user?.username ||
    user?.primaryEmailAddress?.emailAddress.split("@")[0] ||
    "RigTree builder";

  return ensureProfile({
    avatarUrl: user?.imageUrl ?? null,
    clerkUserId,
    displayName,
    usernameBase,
  });
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

function mapSongRow(row: SongRow): SpotifySong {
  return {
    spotifyTrackId: row.spotify_track_id,
    trackName: row.track_name,
    artistName: row.artist_name,
    albumName: row.album_name,
    albumArtUrl: row.album_art_url,
    spotifyUrl: row.spotify_url,
    previewUrl: row.preview_url,
  };
}

export async function getSongsForProfile(profileId: string): Promise<SpotifySong[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("profile_songs")
    .select("*")
    .eq("profile_id", profileId)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Failed to fetch profile songs", error);
    return [];
  }

  return (data as SongRow[]).map(mapSongRow);
}

export async function saveSongsForProfile(
  profileId: string,
  songs: SpotifySong[],
): Promise<void> {
  const supabase = getSupabaseAdmin();
  const limited = songs.slice(0, 5);

  // Delete existing songs
  const { error: deleteError } = await supabase
    .from("profile_songs")
    .delete()
    .eq("profile_id", profileId);

  if (deleteError) {
    throw deleteError;
  }

  if (!limited.length) return;

  const { error: insertError } = await supabase.from("profile_songs").insert(
    limited.map((song, index) => ({
      profile_id: profileId,
      spotify_track_id: song.spotifyTrackId,
      track_name: song.trackName,
      artist_name: song.artistName,
      album_name: song.albumName,
      album_art_url: song.albumArtUrl,
      spotify_url: song.spotifyUrl,
      preview_url: song.previewUrl,
      sort_order: index,
    })),
  );

  if (insertError) {
    throw insertError;
  }
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

  const songs = await getSongsForProfile(profile.id);

  return {
    parts: setup ? await getSetupParts(setup.id) : [],
    profile,
    setup,
    songs,
  };
}



export async function getPublicSetup(username: string): Promise<SavedSetup | null> {
  if (!hasSupabaseConfig()) {
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

  const songs = await getSongsForProfile(profile.id);

  return {
    parts: setup ? await getSetupParts(setup.id) : [],
    profile,
    setup,
    songs,
  };
}

export type PublicSetupSummary = {
  profile: Pick<ProfileRow, "username" | "display_name" | "avatar_url">;
  setup: Pick<SetupRow, "title" | "description" | "published_at"> | null;
  partCount: number;
  topParts: string[];
};

export async function getPublicSetups(): Promise<PublicSetupSummary[]> {
  if (!hasSupabaseConfig()) {
    return [];
  }
  const supabase = getSupabaseAdmin();

  const { data: setups, error: setupsError } = await supabase
    .from("setups")
    .select("id, profile_id, title, description, published_at")
    .eq("visibility", "public")
    .order("published_at", { ascending: false })
    .limit(50);

  if (setupsError) {
    console.error("Failed to fetch public setups", setupsError);
    return [];
  }

  if (!setups?.length) return [];

  const profileIds = [...new Set(setups.map((s) => s.profile_id))];
  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, username, display_name, avatar_url")
    .in("id", profileIds);

  if (profilesError) {
    console.error("Failed to fetch profiles for explore", profilesError);
    return [];
  }

  const profileMap = new Map(
    (profiles ?? []).map((p: { id: string; username: string; display_name: string; avatar_url: string | null }) => [p.id, p]),
  );

  const results: PublicSetupSummary[] = [];

  for (const setup of setups) {
    const profile = profileMap.get(setup.profile_id);
    if (!profile) continue;

    const { data: parts } = await supabase
      .from("setup_parts")
      .select("name, manufacturer")
      .eq("setup_id", setup.id)
      .order("sort_order", { ascending: true })
      .limit(4);

    results.push({
      profile: {
        username: profile.username,
        display_name: profile.display_name,
        avatar_url: profile.avatar_url,
      },
      setup: {
        title: setup.title,
        description: setup.description,
        published_at: setup.published_at,
      },
      partCount: parts?.length ?? 0,
      topParts: (parts ?? []).map(
        (p: { manufacturer: string; name: string }) => `${p.manufacturer} ${p.name}`,
      ),
    });
  }

  return results;
}

export async function getGlobalStats() {
  if (!hasSupabaseConfig()) {
    return {
      totalSetups: 0,
      totalPartsLogged: 0,
    };
  }
  const supabase = getSupabaseAdmin();

  const { count: setupsCount, error: setupsError } = await supabase
    .from("setups")
    .select("*", { count: "exact", head: true })
    .eq("visibility", "public");

  if (setupsError) {
    console.error("Failed to fetch setups count", setupsError);
  }

  const { count: partsCount, error: partsError } = await supabase
    .from("setup_parts")
    .select("*", { count: "exact", head: true });

  if (partsError) {
    console.error("Failed to fetch parts count", partsError);
  }

  return {
    totalSetups: setupsCount ?? 0,
    totalPartsLogged: partsCount ?? 0,
  };
}

