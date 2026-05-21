ALTER TABLE public.albums ADD COLUMN IF NOT EXISTS apple_music_url text;
ALTER TABLE public.albums ADD COLUMN IF NOT EXISTS amazon_music_url text;
ALTER TABLE public.albums ADD COLUMN IF NOT EXISTS deezer_url text;
ALTER TABLE public.albums ADD COLUMN IF NOT EXISTS tidal_url text;
ALTER TABLE public.albums ADD COLUMN IF NOT EXISTS soundcloud_url text;
ALTER TABLE public.albums ADD COLUMN IF NOT EXISTS itunes_url text;
ALTER TABLE public.albums ADD COLUMN IF NOT EXISTS youtube_music_url text;