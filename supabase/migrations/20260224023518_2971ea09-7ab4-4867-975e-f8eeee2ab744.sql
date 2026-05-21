
-- Add location to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS location text;

-- Create music_videos table (admin-managed videos for MusicEmbed)
CREATE TABLE public.music_videos (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  video_id text NOT NULL,
  year text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.music_videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view music videos"
ON public.music_videos FOR SELECT USING (true);

CREATE POLICY "Admins can manage music videos"
ON public.music_videos FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Create fan_rewards table (admin can reward top fans)
CREATE TABLE public.fan_rewards (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  reward_type text NOT NULL DEFAULT 'shoutout',
  message text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.fan_rewards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view rewards"
ON public.fan_rewards FOR SELECT USING (true);

CREATE POLICY "Admins can manage rewards"
ON public.fan_rewards FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Create avatars storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

-- Storage policies for avatars
CREATE POLICY "Avatar images are publicly accessible"
ON storage.objects FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
