
CREATE TABLE public.channel_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id text NOT NULL,
  channel_url text NOT NULL,
  display_count integer NOT NULL DEFAULT 4,
  last_fetched_at timestamp with time zone,
  rotation_offset integer NOT NULL DEFAULT 0,
  last_rotated_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.channel_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage channel config" ON public.channel_config
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view channel config" ON public.channel_config
  FOR SELECT TO anon, authenticated
  USING (true);

ALTER TABLE public.music_videos ADD COLUMN IF NOT EXISTS auto_fetched boolean DEFAULT false;
ALTER TABLE public.music_videos ADD COLUMN IF NOT EXISTS display_order integer;
ALTER TABLE public.music_videos ADD COLUMN IF NOT EXISTS active boolean DEFAULT true;
