-- ==============================================================================
-- Birthday Scene Studio - Supabase Database Schema
-- Run this SQL in your Supabase Dashboard -> SQL Editor
-- ==============================================================================

-- 1. Create scenes table
CREATE TABLE IF NOT EXISTS public.scenes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  slug TEXT UNIQUE,
  recipient_name TEXT NOT NULL,
  sender_name TEXT,
  theme TEXT NOT NULL DEFAULT 'gold',
  config JSONB NOT NULL,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.scenes ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
-- Allow anyone (public & anonymous) to read/view scenes
CREATE POLICY "Public scenes can be viewed by anyone"
  ON public.scenes
  FOR SELECT
  USING (true);

-- Allow authenticated users and anonymous creators to insert scenes
CREATE POLICY "Anyone can create scenes"
  ON public.scenes
  FOR INSERT
  WITH CHECK (true);

-- Allow users to update their own saved scenes
CREATE POLICY "Users can update their own scenes"
  ON public.scenes
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own saved scenes
CREATE POLICY "Users can delete their own scenes"
  ON public.scenes
  FOR DELETE
  USING (auth.uid() = user_id);

-- 4. Auto-update updated_at timestamp function & trigger
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

-- 5. Helper function to increment view count safely
CREATE OR REPLACE FUNCTION public.increment_scene_views(scene_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.scenes
  SET view_count = view_count + 1
  WHERE id = scene_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
