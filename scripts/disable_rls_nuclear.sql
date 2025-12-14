-- NUCLEAR OPTION: DISABLE RLS COMPLETELY
-- This turns off all security checks for these tables. 
-- Valid for "Test Mode" only.

ALTER TABLE public.hosts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites DISABLE ROW LEVEL SECURITY;

-- RE-ENSURE STORAGE PERMISSIONS (Just in case)
DROP POLICY IF EXISTS "allow_all_storage" ON storage.objects;
CREATE POLICY "allow_all_storage" ON storage.objects
FOR ALL
USING (bucket_id = 'uploads')
WITH CHECK (bucket_id = 'uploads');
