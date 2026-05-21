-- Allow anyone to read streams for leaderboard
CREATE POLICY "Anyone can view streams for leaderboard"
ON public.streams
FOR SELECT
USING (true);
