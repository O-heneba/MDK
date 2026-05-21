
-- Add social media handles to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS bio text,
ADD COLUMN IF NOT EXISTS avatar_url text,
ADD COLUMN IF NOT EXISTS twitter text,
ADD COLUMN IF NOT EXISTS instagram text,
ADD COLUMN IF NOT EXISTS tiktok text,
ADD COLUMN IF NOT EXISTS youtube text;

-- User-submitted bars
CREATE TABLE public.bars (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  song text NOT NULL,
  excerpt text NOT NULL,
  explanation text NOT NULL,
  tags text[] DEFAULT '{}',
  approved boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.bars ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can insert own bars" ON public.bars FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view approved bars" ON public.bars FOR SELECT USING (approved = true OR auth.uid() = user_id);
CREATE POLICY "Users can delete own bars" ON public.bars FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all bars" ON public.bars FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- User-submitted fan content
CREATE TABLE public.fan_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  caption text NOT NULL,
  hashtags text NOT NULL,
  category text NOT NULL DEFAULT 'General',
  approved boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.fan_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can insert own content" ON public.fan_content FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view approved content" ON public.fan_content FOR SELECT USING (approved = true OR auth.uid() = user_id);
CREATE POLICY "Users can delete own content" ON public.fan_content FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all content" ON public.fan_content FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Albums
CREATE TABLE public.albums (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  cover_url text,
  release_year integer,
  spotify_url text,
  audiomack_url text,
  boomplay_url text,
  youtube_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.albums ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view albums" ON public.albums FOR SELECT USING (true);
CREATE POLICY "Admins can manage albums" ON public.albums FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Events (upcoming / past shows)
CREATE TABLE public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  location text,
  event_date timestamptz NOT NULL,
  image_url text,
  ticket_url text,
  is_upcoming boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Admins can manage events" ON public.events FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Announcements
CREATE TABLE public.announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  body text NOT NULL,
  pinned boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view announcements" ON public.announcements FOR SELECT USING (true);
CREATE POLICY "Admins can manage announcements" ON public.announcements FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Gallery / Pictures
CREATE TABLE public.gallery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL,
  caption text,
  uploaded_by uuid,
  approved boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view approved gallery" ON public.gallery FOR SELECT USING (approved = true);
CREATE POLICY "Users can upload gallery" ON public.gallery FOR INSERT WITH CHECK (auth.uid() = uploaded_by);
CREATE POLICY "Admins can manage gallery" ON public.gallery FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Storage bucket for gallery images
INSERT INTO storage.buckets (id, name, public) VALUES ('gallery', 'gallery', true);

CREATE POLICY "Anyone can view gallery images" ON storage.objects FOR SELECT USING (bucket_id = 'gallery');
CREATE POLICY "Authenticated users can upload gallery images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'gallery' AND auth.role() = 'authenticated');
CREATE POLICY "Users can delete own gallery images" ON storage.objects FOR DELETE USING (bucket_id = 'gallery' AND auth.uid()::text = (storage.foldername(name))[1]);
