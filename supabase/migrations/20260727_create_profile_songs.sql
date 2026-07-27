-- Create profile_songs table for Spotify song pinning (premium feature)
CREATE TABLE IF NOT EXISTS profile_songs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  spotify_track_id TEXT NOT NULL,
  track_name TEXT NOT NULL,
  artist_name TEXT NOT NULL,
  album_name TEXT NOT NULL DEFAULT '',
  album_art_url TEXT NOT NULL DEFAULT '',
  spotify_url TEXT NOT NULL DEFAULT '',
  preview_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for quick lookups by profile
CREATE INDEX IF NOT EXISTS idx_profile_songs_profile_id ON profile_songs(profile_id);

-- Unique constraint: one track per profile
CREATE UNIQUE INDEX IF NOT EXISTS idx_profile_songs_unique_track ON profile_songs(profile_id, spotify_track_id);

-- Enable RLS
ALTER TABLE profile_songs ENABLE ROW LEVEL SECURITY;

-- Allow the service role to do everything (matches existing pattern)
CREATE POLICY "Service role full access" ON profile_songs
  FOR ALL
  USING (true)
  WITH CHECK (true);
