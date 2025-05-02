-- ---- Artists Table ----
ALTER TABLE public.artists ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow read access for all authenticated users
CREATE
POLICY "Allow read access to authenticated users"
ON public.artists
FOR
SELECT
    USING (auth.role() = 'authenticated');

-- Policy 2: Allow insert based on 'artists.insert' permission (Admin only per your setup)
CREATE
POLICY "Allow admin insert access based on permissions"
ON public.artists
FOR INSERT
WITH CHECK (public.authorize('artists.insert'));

-- ---- Composers Table ----
ALTER TABLE public.composers ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow read access for all authenticated users
CREATE
POLICY "Allow read access to authenticated users"
ON public.composers
FOR
SELECT
    USING (auth.role() = 'authenticated');

-- Policy 2: Allow insert based on 'composers.insert' permission (Admin only per your setup)
CREATE
POLICY "Allow admin insert access based on permissions"
ON public.composers
FOR INSERT
WITH CHECK (public.authorize('composers.insert'));

-- ---- Pieces Table ----
ALTER TABLE public.pieces ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow read access for all authenticated users
CREATE
POLICY "Allow read access to authenticated users"
ON public.pieces
FOR
SELECT
    USING (auth.role() = 'authenticated');

-- Policy 2: Allow insert based on 'pieces.insert' permission (Admin only per your setup)
CREATE
POLICY "Allow admin insert access based on permissions"
ON public.pieces
FOR INSERT
WITH CHECK (public.authorize('pieces.insert'));

-- ---- Recordings Table ----
ALTER TABLE public.recordings ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow read access for all authenticated users
CREATE
POLICY "Allow read access to authenticated users"
ON public.recordings
FOR
SELECT
    USING (auth.role() = 'authenticated');

-- Policy 2: Allow insert based on 'recordings.insert' permission (Admin only per your setup)
CREATE
POLICY "Allow admin insert access based on permissions"
ON public.recordings
FOR INSERT
WITH CHECK (public.authorize('recordings.insert'));

-- ---- Sets Table ----
ALTER TABLE public.sets ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow read access for all authenticated users
CREATE
POLICY "Allow read access to authenticated users"
ON public.sets
FOR
SELECT
    USING (auth.role() = 'authenticated');

-- Policy 2: Allow insert if user has 'sets.insert' permission AND sets owner_id to self
CREATE
POLICY "Allow insert based on permission and ownership"
ON public.sets
FOR INSERT
WITH CHECK (public.authorize('sets.insert') AND owner_id = auth.uid());

-- Policy 3: Allow owner to update their own sets
CREATE
POLICY "Allow update by owner"
ON public.sets
FOR
UPDATE
    USING (owner_id = auth.uid()) -- Can only target rows they own
WITH CHECK (owner_id = auth.uid());
-- Cannot change ownership away from self

-- Policy 4: Allow owner to delete their own sets OR user with 'sets.delete' permission (admin)
CREATE
POLICY "Allow delete by owner or admin permission"
ON public.sets
FOR DELETE
USING (owner_id = auth.uid() OR public.authorize('sets.delete'));

-- ---- Set_Recordings Table ----
ALTER TABLE public.set_recordings ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow read access for all authenticated users
CREATE
POLICY "Allow read access to authenticated users"
ON public.set_recordings
FOR
SELECT
    USING (auth.role() = 'authenticated');

-- Policy 2: Allow insert if user owns the parent set OR has 'set_recordings.insert' permission (admin)
CREATE
POLICY "Allow insert by owner of parent set or admin permission"
ON public.set_recordings
FOR INSERT
WITH CHECK (
    -- Check if the user owns the target set
    EXISTS (SELECT 1 FROM public.sets WHERE id = set_recordings.set_id AND owner_id = auth.uid())
    OR
    -- OR check if the user has the specific admin permission
    public.authorize('set_recordings.insert')
);

-- Policy 3: Allow update if user owns the parent set
CREATE
POLICY "Allow update by owner of parent set"
ON public.set_recordings
FOR
UPDATE
    USING (
    EXISTS (SELECT 1 FROM public.sets WHERE id = set_recordings.set_id AND owner_id = auth.uid())
    )
WITH CHECK (
    EXISTS (SELECT 1 FROM public.sets WHERE id = set_recordings.set_id AND owner_id = auth.uid())
    );

-- Policy 4: Allow delete if user owns the parent set OR has 'set_recordings.delete' permission (admin)
CREATE
POLICY "Allow delete by owner of parent set or admin permission"
ON public.set_recordings
FOR DELETE
USING (
    -- Check if the user owns the target set
    EXISTS (SELECT 1 FROM public.sets WHERE id = set_recordings.set_id AND owner_id = auth.uid())
    OR
    -- OR check if the user has the specific admin permission
    public.authorize('set_recordings.delete')
);
