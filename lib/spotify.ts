import "server-only";

import type { SpotifySong } from "@/lib/buildcores-types";

const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
const SPOTIFY_SEARCH_URL = "https://api.spotify.com/v1/search";

let cachedToken: { token: string; expiresAt: number } | null = null;

export function hasSpotifyConfig() {
  return Boolean(
    process.env.SPOTIFY_CLIENT_ID && process.env.SPOTIFY_CLIENT_SECRET,
  );
}

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.token;
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      "Spotify is not configured. Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET.",
    );
  }

  const response = await fetch(SPOTIFY_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    throw new Error(`Spotify token request failed: ${response.status}`);
  }

  const data = (await response.json()) as {
    access_token: string;
    expires_in: number;
  };

  cachedToken = {
    token: data.access_token,
    // Refresh 60 seconds early to avoid edge cases
    expiresAt: Date.now() + (data.expires_in - 60) * 1000,
  };

  return cachedToken.token;
}

type SpotifyTrackResponse = {
  tracks: {
    items: Array<{
      id: string;
      name: string;
      artists: Array<{ name: string }>;
      album: {
        name: string;
        images: Array<{ url: string; width: number; height: number }>;
      };
      external_urls: { spotify: string };
      preview_url: string | null;
    }>;
  };
};

export async function searchSpotifyTracks(
  query: string,
  limit = 10,
): Promise<SpotifySong[]> {
  const token = await getAccessToken();

  const params = new URLSearchParams({
    q: query,
    type: "track",
    limit: String(limit),
    market: "US",
  });

  const response = await fetch(`${SPOTIFY_SEARCH_URL}?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Spotify search failed: ${response.status}`);
  }

  const data = (await response.json()) as SpotifyTrackResponse;

  return data.tracks.items.map((track) => ({
    spotifyTrackId: track.id,
    trackName: track.name,
    artistName: track.artists.map((a) => a.name).join(", "),
    albumName: track.album.name,
    albumArtUrl: track.album.images[0]?.url ?? "",
    spotifyUrl: track.external_urls.spotify,
    previewUrl: track.preview_url,
  }));
}
