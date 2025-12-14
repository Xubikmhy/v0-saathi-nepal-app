-- FORCE PUBLIC ACCESS FOR EVERYTHING
-- This script explicitly enables anonymous access for storage and tables

-- 1. STORAGE BUCKET PERMISSIONS (Fixes "Bucket not found")
-- Ensure bucket exists and is public
INSERT INTO storage.buckets (id, name, public) 
VALUES ('uploads', 'uploads', true) 
ON CONFLICT (id) DO UPDATE SET public = true;

-- Drop all existing storage policies to start fresh
DROP POLICY IF EXISTS "public_select_storage" ON storage.objects;
DROP POLICY IF EXISTS "public_insert_storage" ON storage.objects;
DROP POLICY IF EXISTS "public_update_storage" ON storage.objects;
DROP POLICY IF EXISTS "public_delete_storage" ON storage.objects;
DROP POLICY IF EXISTS "allow_all_storage" ON storage.objects;

-- Create permissive policies for "anon" and "authenticated" roles
CREATE POLICY "allow_all_storage" ON storage.objects
FOR ALL
USING (bucket_id = 'uploads')
WITH CHECK (bucket_id = 'uploads');


-- 2. TABLE PERMISSIONS (Fixes "violates row-level security policy")
-- Site Settings
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "allow_all_settings" ON public.site_settings;
DROP POLICY IF EXISTS "site_settings_public_select" ON public.site_settings;
DROP POLICY IF EXISTS "site_settings_admin_update" ON public.site_settings;
DROP POLICY IF EXISTS "site_settings_admin_insert" ON public.site_settings;

CREATE POLICY "allow_all_settings" ON public.site_settings
FOR ALL
USING (true)
WITH CHECK (true);

-- Hosts
ALTER TABLE public.hosts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "allow_all_hosts" ON public.hosts;
DROP POLICY IF EXISTS "hosts_public_select" ON public.hosts;
DROP POLICY IF EXISTS "hosts_admin_select" ON public.hosts;
DROP POLICY IF EXISTS "hosts_admin_insert" ON public.hosts;
DROP POLICY IF EXISTS "hosts_admin_update" ON public.hosts;
DROP POLICY IF EXISTS "hosts_admin_delete" ON public.hosts;

CREATE POLICY "allow_all_hosts" ON public.hosts
FOR ALL
USING (true)
WITH CHECK (true);

-- Blogs
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "allow_all_blogs" ON public.blogs;

CREATE POLICY "allow_all_blogs" ON public.blogs
FOR ALL
USING (true)
WITH CHECK (true);

-- Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "allow_all_profiles" ON public.profiles;

CREATE POLICY "allow_all_profiles" ON public.profiles
FOR ALL
USING (true)
WITH CHECK (true);
