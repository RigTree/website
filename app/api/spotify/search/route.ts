import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { hasSpotifyConfig, searchSpotifyTracks } from "@/lib/spotify";

export async function GET(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await currentUser();
  const plan = (user?.publicMetadata as Record<string, unknown>)?.plan;

  if (plan !== "premium") {
    return NextResponse.json(
      { error: "Premium plan required to search Spotify tracks." },
      { status: 403 },
    );
  }

  if (!hasSpotifyConfig()) {
    return NextResponse.json(
      { error: "Spotify integration is not configured." },
      { status: 503 },
    );
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim();

  if (!query || query.length < 2) {
    return NextResponse.json({ tracks: [] });
  }

  try {
    const tracks = await searchSpotifyTracks(query);
    return NextResponse.json({ tracks });
  } catch (error) {
    console.error("Spotify search error:", error);
    return NextResponse.json(
      { error: "Failed to search Spotify." },
      { status: 500 },
    );
  }
}
