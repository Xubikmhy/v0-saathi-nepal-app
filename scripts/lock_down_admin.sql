-- LOCK DOWN: Restore Strict RLS Policies
-- Only Super Admin (agency_admin) can write. Public can read specific data.

-- 1. RE-ENABLE RLS
ALTER TABLE public.hosts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. DROP PERMISSIVE POLICIES
DROP POLICY IF EXISTS "allow_all_hosts" ON public.hosts;
DROP POLICY IF EXISTS "hosts_public_action" ON public.hosts;
DROP POLICY IF EXISTS "allow_all_blogs" ON public.blogs;
DROP POLICY IF EXISTS "blogs_public_action" ON public.blogs;
DROP POLICY IF EXISTS "allow_all_settings" ON public.site_settings;
DROP POLICY IF EXISTS "site_settings_public_action" ON public.site_settings;
DROP POLICY IF EXISTS "allow_all_profiles" ON public.profiles;
DROP POLICY IF EXISTS "profiles_public_action" ON public.profiles;

-- Drop permissive storage policies
DROP POLICY IF EXISTS "allow_all_storage" ON storage.objects;
DROP POLICY IF EXISTS "storage_public_action" ON storage.objects;

-- 3. CREATE STRICT POLICIES

-- HOSTS
-- Public: View Active Only
CREATE POLICY "hosts_public_select" ON public.hosts
  FOR SELECT USING (status = 'active');
-- Admin: Full Access
CREATE POLICY "hosts_admin_all" ON public.hosts
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'agency_admin')
  );

-- BLOGS
-- Public: View Published Only
CREATE POLICY "blogs_public_select" ON public.blogs
  FOR SELECT USING (is_published = true);
-- Admin: Full Access
CREATE POLICY "blogs_admin_all" ON public.blogs
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'agency_admin')
  );

-- SITE SETTINGS
-- Public: View All
CREATE POLICY "site_settings_public_select" ON public.site_settings
  FOR SELECT USING (true);
-- Admin: Full Access
CREATE POLICY "site_settings_admin_all" ON public.site_settings
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'agency_admin')
  );

-- PROFILES
-- Public: None (or specific needs)
-- Admin: Full Access
CREATE POLICY "profiles_admin_all" ON public.profiles
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'agency_admin')
  );
-- Self: View/Edit Own
CREATE POLICY "profiles_self_manage" ON public.profiles
  FOR ALL USING (auth.uid() = id);


-- 4. STORAGE POLICIES
-- Public: View (Read) Only
CREATE POLICY "storage_public_select" ON storage.objects
  FOR SELECT USING (bucket_id = 'uploads');
-- Admin: Upload/Delete
CREATE POLICY "storage_admin_all" ON storage.objects
  FOR ALL USING (
    bucket_id = 'uploads' AND 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'agency_admin')
  );

-- 5. ENSURE SUPER ADMIN ACCESS
-- Make sure the specific user is an agency_admin
UPDATE public.profiles 
SET role = 'agency_admin' 
WHERE id IN (SELECT id FROM auth.users WHERE email = 'xuxilhax@gmail.com');

-- Ensure updated_at changes to reflect action
UPDATE public.site_settings 
SET updated_at = NOW() 
WHERE id = 1;
