-- ==== Artists ====
ALTER TABLE public.artists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow ALL access for authenticated users on artists"
ON public.artists
FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- ==== Pieces ====
ALTER TABLE public.pieces ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow ALL access for authenticated users on pieces"
ON public.pieces
FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- ==== Recordings ====
ALTER TABLE public.recordings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow ALL access for authenticated users on recordings"
ON public.recordings
FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- ==== Sets ====
ALTER TABLE public.sets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow ALL access for authenticated users on sets"
ON public.sets
FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- ==== Set_Recordings (Junction Table) ====
ALTER TABLE public.set_recordings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow ALL access for authenticated users on set_recordings"
ON public.set_recordings
FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');