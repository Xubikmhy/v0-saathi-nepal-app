-- DANGEROUS: Opens all tables to public access for testing
-- Run this to allow ANYONE to Create/Read/Update/Delete data

-- 1. HOSTS TABLE
DROP POLICY IF EXISTS "hosts_public_action" ON public.hosts;
CREATE POLICY "hosts_public_action" ON public.hosts
  FOR ALL USING (true) WITH CHECK (true);

-- 2. BLOGS TABLE
DROP POLICY IF EXISTS "blogs_public_action" ON public.blogs;
CREATE POLICY "blogs_public_action" ON public.blogs
  FOR ALL USING (true) WITH CHECK (true);

-- 3. SITE SETTINGS TABLE
DROP POLICY IF EXISTS "site_settings_public_action" ON public.site_settings;
CREATE POLICY "site_settings_public_action" ON public.site_settings
  FOR ALL USING (true) WITH CHECK (true);

-- 4. ESCORT PROFILES (If used separately)
DROP POLICY IF EXISTS "escort_profiles_public_action" ON public.escort_profiles;
CREATE POLICY "escort_profiles_public_action" ON public.escort_profiles
  FOR ALL USING (true) WITH CHECK (true);

-- 5. STORAGE OBJECTS (Allow public uploads)
DROP POLICY IF EXISTS "storage_public_action" ON storage.objects;
CREATE POLICY "storage_public_action" ON storage.objects
  FOR ALL USING (bucket_id = 'uploads') WITH CHECK (bucket_id = 'uploads');

-- 6. PROFILES (Allow public to view/create profile if needed)
DROP POLICY IF EXISTS "profiles_public_action" ON public.profiles;
CREATE POLICY "profiles_public_action" ON public.profiles
  FOR ALL USING (true) WITH CHECK (true);
