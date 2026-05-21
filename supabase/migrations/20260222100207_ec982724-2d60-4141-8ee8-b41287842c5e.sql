
-- Auto-approve: change defaults from false to true
ALTER TABLE public.bars ALTER COLUMN approved SET DEFAULT true;
ALTER TABLE public.fan_content ALTER COLUMN approved SET DEFAULT true;
ALTER TABLE public.gallery ALTER COLUMN approved SET DEFAULT true;

-- Make profiles publicly viewable
CREATE POLICY "Anyone can view profiles"
ON public.profiles
FOR SELECT
USING (true);
