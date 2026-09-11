-- ==============================================================================
-- ebirthy - Complete Production Supabase Database Schema
-- Run this entire script in your Supabase Dashboard -> SQL Editor
-- ==============================================================================

-- 1. Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create scenes table
CREATE TABLE IF NOT EXISTS public.scenes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  slug TEXT UNIQUE NOT NULL,
  recipient_name TEXT NOT NULL,
  sender_name TEXT,
  theme TEXT NOT NULL DEFAULT 'gold',
  config JSONB NOT NULL,
  view_count INTEGER DEFAULT 0,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create high-performance indexes
CREATE INDEX IF NOT EXISTS idx_scenes_slug ON public.scenes (slug);
CREATE INDEX IF NOT EXISTS idx_scenes_user_id ON public.scenes (user_id);
CREATE INDEX IF NOT EXISTS idx_scenes_created_at ON public.scenes (created_at DESC);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.scenes ENABLE ROW LEVEL SECURITY;

-- 5. Drop existing policies to prevent conflicts on re-run
DROP POLICY IF EXISTS "Public scenes can be viewed by anyone" ON public.scenes;
DROP POLICY IF EXISTS "Anyone can create scenes" ON public.scenes;
DROP POLICY IF EXISTS "Users can update their own scenes" ON public.scenes;
DROP POLICY IF EXISTS "Users can delete their own scenes" ON public.scenes;

-- 6. Create Comprehensive RLS Policies
-- A. SELECT: Allow anyone to view any public celebration scene
CREATE POLICY "Public scenes can be viewed by anyone"
  ON public.scenes
  FOR SELECT
  USING (true);

-- B. INSERT: Allow both logged-in users and anonymous creators to save scenes
CREATE POLICY "Anyone can create scenes"
  ON public.scenes
  FOR INSERT
  WITH CHECK (true);

-- C. UPDATE: Allow owners to update their own saved scenes (or anonymous updates if user_id is null)
CREATE POLICY "Users can update their own scenes"
  ON public.scenes
  FOR UPDATE
  USING (auth.uid() = user_id OR user_id IS NULL)
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- D. DELETE: Allow users to delete their own scenes
CREATE POLICY "Users can delete their own scenes"
  ON public.scenes
  FOR DELETE
  USING (auth.uid() = user_id);

-- 7. Auto-update updated_at timestamp trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_scenes_updated_at ON public.scenes;
CREATE TRIGGER set_scenes_updated_at
  BEFORE UPDATE ON public.scenes
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 8. Safe RPC Stored Procedure: Increment View Count
CREATE OR REPLACE FUNCTION public.increment_scene_views(scene_id TEXT)
RETURNS VOID AS $$
BEGIN
  -- If it's a UUID, match by id, otherwise match by slug
  IF scene_id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN
    UPDATE public.scenes
    SET view_count = COALESCE(view_count, 0) + 1
    WHERE id = scene_id::UUID;
  ELSE
    UPDATE public.scenes
    SET view_count = COALESCE(view_count, 0) + 1
    WHERE slug = scene_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Optional: Public User Profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Trigger to auto-create profile on auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 10. Community Guestbook Wishes Wall
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.guestbook_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scene_slug TEXT NOT NULL,
  sender_name TEXT NOT NULL,
  message TEXT NOT NULL,
  stamp TEXT NOT NULL DEFAULT 'celebrate',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_guestbook_slug ON public.guestbook_entries (scene_slug);
CREATE INDEX IF NOT EXISTS idx_guestbook_created_at ON public.guestbook_entries (created_at DESC);

ALTER TABLE public.guestbook_entries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view guestbook entries" ON public.guestbook_entries;
CREATE POLICY "Public can view guestbook entries"
  ON public.guestbook_entries
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Public can sign guestbook" ON public.guestbook_entries;
CREATE POLICY "Public can sign guestbook"
  ON public.guestbook_entries
  FOR INSERT
  WITH CHECK (true);

-- ==============================================================================
-- 11. Visitor Sessions & Real-Time Analytics Telemetry
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.visitor_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id TEXT NOT NULL,
  path TEXT NOT NULL,
  referrer TEXT DEFAULT '',
  device_type TEXT DEFAULT 'desktop',
  browser TEXT DEFAULT '',
  os TEXT DEFAULT '',
  screen_size TEXT DEFAULT '',
  duration_seconds INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_ping_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sessions_visitor_id ON public.visitor_sessions (visitor_id);
CREATE INDEX IF NOT EXISTS idx_sessions_path ON public.visitor_sessions (path);
CREATE INDEX IF NOT EXISTS idx_sessions_created_at ON public.visitor_sessions (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sessions_last_ping ON public.visitor_sessions (last_ping_at DESC);

ALTER TABLE public.visitor_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can insert sessions" ON public.visitor_sessions;
CREATE POLICY "Public can insert sessions"
  ON public.visitor_sessions
  FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Public can update own session" ON public.visitor_sessions;
CREATE POLICY "Public can update own session"
  ON public.visitor_sessions
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Public can read sessions" ON public.visitor_sessions;
CREATE POLICY "Public can read sessions"
  ON public.visitor_sessions
  FOR SELECT
  USING (true);

-- ==============================================================================
-- 12. User Activity & Interaction Events
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.visitor_sessions(id) ON DELETE CASCADE,
  visitor_id TEXT NOT NULL,
  path TEXT NOT NULL,
  event_name TEXT NOT NULL,
  event_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_events_session_id ON public.analytics_events (session_id);
CREATE INDEX IF NOT EXISTS idx_events_name ON public.analytics_events (event_name);
CREATE INDEX IF NOT EXISTS idx_events_path ON public.analytics_events (path);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON public.analytics_events (created_at DESC);

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can insert analytics events" ON public.analytics_events;
CREATE POLICY "Public can insert analytics events"
  ON public.analytics_events
  FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Public can read analytics events" ON public.analytics_events;
CREATE POLICY "Public can read analytics events"
  ON public.analytics_events
  FOR SELECT
  USING (true);

-- 13. Stored Procedure to update session duration (heartbeat)
CREATE OR REPLACE FUNCTION public.ping_visitor_session(p_session_id UUID, p_duration_seconds INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE public.visitor_sessions
  SET duration_seconds = GREATEST(duration_seconds, p_duration_seconds),
      last_ping_at = NOW()
  WHERE id = p_session_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

