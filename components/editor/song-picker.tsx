"use client";

import {
  Crown,
  Loader2,
  Music,
  Pause,
  Play,
  Plus,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SpotifySong } from "@/lib/buildcores-types";
import { cn } from "@/lib/utils";

const MAX_SONGS = 5;

type SongPickerProps = {
  isPremium: boolean;
  songs: SpotifySong[];
  onSongsChange: (songs: SpotifySong[]) => void;
};

export function SongPicker({ isPremium, songs, onSongsChange }: SongPickerProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SpotifySong[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const searchTracks = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([]);
      return;
    }

    setSearching(true);
    setSearchError("");

    try {
      const response = await fetch(
        `/api/spotify/search?q=${encodeURIComponent(q)}`,
      );
      const data = (await response.json()) as {
        tracks?: SpotifySong[];
        error?: string;
      };

      if (!response.ok) {
        setSearchError(data.error ?? "Search failed.");
        setResults([]);
        return;
      }

      setResults(data.tracks ?? []);
    } catch {
      setSearchError("Could not search Spotify.");
      setResults([]);
    } finally {
      setSearching(false);
    }
  }, []);

  useEffect(() => {
    clearTimeout(debounceRef.current);

    if (!query.trim()) {
      setResults([]);
      return;
    }

    debounceRef.current = setTimeout(() => {
      searchTracks(query.trim());
    }, 400);

    return () => clearTimeout(debounceRef.current);
  }, [query, searchTracks]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  const addSong = (song: SpotifySong) => {
    if (songs.length >= MAX_SONGS) return;
    if (songs.some((s) => s.spotifyTrackId === song.spotifyTrackId)) return;
    onSongsChange([...songs, song]);
  };

  const removeSong = (trackId: string) => {
    onSongsChange(songs.filter((s) => s.spotifyTrackId !== trackId));
    if (playingId === trackId) {
      audioRef.current?.pause();
      setPlayingId(null);
    }
  };

  const togglePreview = (song: SpotifySong) => {
    if (!song.previewUrl) return;

    if (playingId === song.spotifyTrackId) {
      audioRef.current?.pause();
      setPlayingId(null);
      return;
    }

    audioRef.current?.pause();
    const audio = new Audio(song.previewUrl);
    audioRef.current = audio;
    audio.volume = 0.5;
    audio.play();
    audio.onended = () => setPlayingId(null);
    setPlayingId(song.spotifyTrackId);
  };

  const isSelected = (trackId: string) =>
    songs.some((s) => s.spotifyTrackId === trackId);

  // Premium lock overlay
  if (!isPremium) {
    return (
      <Card className="editor-panel relative overflow-hidden border-border/50">
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4 px-6 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-500/20 to-yellow-500/20 border border-amber-500/30">
              <Crown className="size-8 text-amber-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Premium Feature</h3>
              <p className="mt-1.5 text-sm text-muted-foreground max-w-[280px]">
                Upgrade to Premium to pin your favorite Spotify songs to your
                RigTree profile.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-amber-500/40 text-amber-400 hover:bg-amber-500/10 hover:text-amber-300"
              onClick={() => window.open("https://rigtree.io/pricing", "_blank")}
            >
              <Sparkles className="size-4" />
              Upgrade to Premium
            </Button>
          </div>
        </div>

        {/* Blurred background content */}
        <CardHeader className="border-b border-border">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-md bg-[#1DB954]/15 border border-[#1DB954]/25">
              <Music className="size-4 text-[#1DB954]" />
            </div>
            <CardTitle className="text-base">Soundtrack</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-4 blur-[2px] select-none pointer-events-none">
          <div className="h-10 rounded-md border border-border bg-card" />
          <div className="mt-3 space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 rounded-lg border border-border bg-card/50" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="editor-panel overflow-hidden border-[#1DB954]/20 bg-card/80">
      <CardHeader className="border-b border-border">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-md bg-[#1DB954]/15 border border-[#1DB954]/25">
              <Music className="size-4 text-[#1DB954]" />
            </div>
            <div>
              <CardTitle className="text-base">Soundtrack</CardTitle>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {songs.length}/{MAX_SONGS} songs pinned
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-[#1DB954]/10 border border-[#1DB954]/20 px-2.5 py-1">
            <Sparkles className="size-3 text-[#1DB954]" />
            <span className="text-[10px] font-semibold text-[#1DB954] uppercase tracking-wider">
              Premium
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Spotify songs..."
            className="h-10 w-full rounded-lg border border-border bg-background/50 pl-10 pr-4 text-sm outline-none ring-offset-background transition-colors placeholder:text-muted-foreground focus:border-[#1DB954]/50 focus:ring-2 focus:ring-[#1DB954]/20"
          />
          {searching && (
            <Loader2 className="absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-[#1DB954]" />
          )}
        </div>

        {searchError && (
          <p className="text-xs text-red-400">{searchError}</p>
        )}

        {/* Search Results */}
        {results.length > 0 && (
          <div className="max-h-[320px] space-y-1.5 overflow-y-auto rounded-lg border border-border bg-background/30 p-2">
            {results.map((track) => {
              const selected = isSelected(track.spotifyTrackId);
              return (
                <div
                  key={track.spotifyTrackId}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg p-2 transition-all",
                    selected
                      ? "bg-[#1DB954]/10 border border-[#1DB954]/20"
                      : "hover:bg-secondary/50 border border-transparent",
                  )}
                >
                  {/* Album Art */}
                  <div className="relative size-11 shrink-0 rounded-md overflow-hidden bg-secondary">
                    {track.albumArtUrl ? (
                      <img
                        src={track.albumArtUrl}
                        alt={track.albumName}
                        className="size-full object-cover"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center">
                        <Music className="size-5 text-muted-foreground" />
                      </div>
                    )}
                    {/* Preview play button overlay */}
                    {track.previewUrl && (
                      <button
                        type="button"
                        onClick={() => togglePreview(track)}
                        className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        {playingId === track.spotifyTrackId ? (
                          <Pause className="size-4 text-white" />
                        ) : (
                          <Play className="size-4 text-white" />
                        )}
                      </button>
                    )}
                  </div>

                  {/* Track Info */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{track.trackName}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {track.artistName}
                    </p>
                  </div>

                  {/* Add button */}
                  <button
                    type="button"
                    onClick={() => addSong(track)}
                    disabled={selected || songs.length >= MAX_SONGS}
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-full transition-all cursor-pointer",
                      selected
                        ? "bg-[#1DB954] text-black"
                        : songs.length >= MAX_SONGS
                          ? "bg-secondary/50 text-muted-foreground/40 cursor-not-allowed"
                          : "bg-secondary hover:bg-[#1DB954]/20 hover:text-[#1DB954] text-muted-foreground",
                    )}
                  >
                    {selected ? (
                      <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    ) : (
                      <Plus className="size-4" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Selected Songs */}
        {songs.length > 0 && (
          <div className="space-y-2">
            <p className="font-mono text-[11px] uppercase text-muted-foreground tracking-wider">
              Pinned Songs
            </p>
            <div className="space-y-1.5">
              {songs.map((song, index) => (
                <div
                  key={song.spotifyTrackId}
                  className="group flex items-center gap-3 rounded-lg border border-border/60 bg-card/40 p-2.5 transition-all hover:border-border"
                >
                  {/* Sort number */}
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-[#1DB954]/10 text-[10px] font-bold text-[#1DB954]">
                    {index + 1}
                  </span>

                  {/* Album Art */}
                  <div className="relative size-10 shrink-0 rounded-md overflow-hidden bg-secondary">
                    {song.albumArtUrl ? (
                      <img
                        src={song.albumArtUrl}
                        alt={song.albumName}
                        className="size-full object-cover"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center">
                        <Music className="size-4 text-muted-foreground" />
                      </div>
                    )}
                    {song.previewUrl && (
                      <button
                        type="button"
                        onClick={() => togglePreview(song)}
                        className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        {playingId === song.spotifyTrackId ? (
                          <Pause className="size-3.5 text-white" />
                        ) : (
                          <Play className="size-3.5 text-white" />
                        )}
                      </button>
                    )}
                  </div>

                  {/* Track Info */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{song.trackName}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {song.artistName}
                    </p>
                  </div>

                  {/* Remove */}
                  <button
                    type="button"
                    onClick={() => removeSong(song.spotifyTrackId)}
                    className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-red-500/15 hover:text-red-400 cursor-pointer"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {songs.length === 0 && !results.length && !query && (
          <div className="rounded-lg border border-dashed border-[#1DB954]/20 bg-[#1DB954]/5 p-6 text-center">
            <Music className="mx-auto size-8 text-[#1DB954]/40 mb-2" />
            <p className="text-sm font-medium text-muted-foreground">
              No songs pinned yet
            </p>
            <p className="mt-1 text-xs text-muted-foreground/70">
              Search above to find and pin up to {MAX_SONGS} songs to your
              profile.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
