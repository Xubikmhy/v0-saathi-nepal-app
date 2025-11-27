-- Fix infinite recursion in RLS policies
-- The issue: admin policies on profiles table query the profiles table itself

-- First, create a security definer function to check admin status
-- This avoids the recursive RLS check
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'agency_admin'
  );
$$;

-- Drop existing problematic policies on profiles
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_admin_select" ON public.profiles;
DROP POLICY IF EXISTS "profiles_admin_insert" ON public.profiles;
DROP POLICY IF EXISTS "profiles_admin_update" ON public.profiles;
DROP POLICY IF EXISTS "profiles_admin_delete" ON public.profiles;

-- Recreate profiles policies using the security definer function
-- Users can view their own profile OR admins can view all
CREATE POLICY "profiles_select" ON public.profiles
  FOR SELECT USING (
    auth.uid() = id OR public.is_admin()
  );

-- Users can update their own profile
CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Admin can update any profile (separate policy)
CREATE POLICY "profiles_admin_update" ON public.profiles
  FOR UPDATE USING (public.is_admin());

-- Admin can insert profiles
CREATE POLICY "profiles_admin_insert" ON public.profiles
  FOR INSERT WITH CHECK (
    auth.uid() = id OR public.is_admin()
  );

-- Admin can delete profiles (except their own)
CREATE POLICY "profiles_admin_delete" ON public.profiles
  FOR DELETE USING (
    public.is_admin() AND id != auth.uid()
  );

-- Now fix the other tables to use the function as well for consistency
-- Drop and recreate hosts policies
DROP POLICY IF EXISTS "hosts_admin_select" ON public.hosts;
DROP POLICY IF EXISTS "hosts_admin_insert" ON public.hosts;
DROP POLICY IF EXISTS "hosts_admin_update" ON public.hosts;
DROP POLICY IF EXISTS "hosts_admin_delete" ON public.hosts;

CREATE POLICY "hosts_admin_select" ON public.hosts
  FOR SELECT USING (public.is_admin());

CREATE POLICY "hosts_admin_insert" ON public.hosts
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "hosts_admin_update" ON public.hosts
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "hosts_admin_delete" ON public.hosts
  FOR DELETE USING (public.is_admin());

-- Drop and recreate blogs policies
DROP POLICY IF EXISTS "blogs_admin_select" ON public.blogs;
DROP POLICY IF EXISTS "blogs_admin_insert" ON public.blogs;
DROP POLICY IF EXISTS "blogs_admin_update" ON public.blogs;
DROP POLICY IF EXISTS "blogs_admin_delete" ON public.blogs;

CREATE POLICY "blogs_admin_select" ON public.blogs
  FOR SELECT USING (public.is_admin());

CREATE POLICY "blogs_admin_insert" ON public.blogs
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "blogs_admin_update" ON public.blogs
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "blogs_admin_delete" ON public.blogs
  FOR DELETE USING (public.is_admin());

-- Drop and recreate site_settings policies
DROP POLICY IF EXISTS "site_settings_admin_update" ON public.site_settings;
DROP POLICY IF EXISTS "site_settings_admin_insert" ON public.site_settings;

CREATE POLICY "site_settings_admin_update" ON public.site_settings
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "site_settings_admin_insert" ON public.site_settings
  FOR INSERT WITH CHECK (public.is_admin());
