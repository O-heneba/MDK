-- Fix RLS policies to allow public read access for display tables

-- Announcements: Allow anyone to view
DROP POLICY IF EXISTS "Anyone can view announcements" ON public.announcements;
CREATE POLICY "Anyone can view announcements"
ON public.announcements FOR SELECT
USING (true);

-- Albums: Allow anyone to view
DROP POLICY IF EXISTS "Anyone can view albums" ON public.albums;
CREATE POLICY "Anyone can view albums"
ON public.albums FOR SELECT
USING (true);

-- Events: Allow anyone to view
DROP POLICY IF EXISTS "Anyone can view events" ON public.events;
CREATE POLICY "Anyone can view events"
ON public.events FOR SELECT
USING (true);

-- Gallery: Allow anyone to view
DROP POLICY IF EXISTS "Anyone can view gallery" ON public.gallery;
CREATE POLICY "Anyone can view gallery"
ON public.gallery FOR SELECT
USING (true);

-- Bars: Allow anyone to view
DROP POLICY IF EXISTS "Anyone can view bars" ON public.bars;
CREATE POLICY "Anyone can view bars"
ON public.bars FOR SELECT
USING (true);

-- Fan Content: Allow anyone to view
DROP POLICY IF EXISTS "Anyone can view fan content" ON public.fan_content;
CREATE POLICY "Anyone can view fan content"
ON public.fan_content FOR SELECT
USING (true);

-- Profiles: Allow anyone to view public profile info (username)
DROP POLICY IF EXISTS "Anyone can view usernames" ON public.profiles;
CREATE POLICY "Anyone can view usernames"
ON public.profiles FOR SELECT
USING (true);
