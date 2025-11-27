-- SAATHI NEPAL Database Schema
-- Professional Host & Guide Directory

-- Create custom ENUM types
CREATE TYPE app_role AS ENUM ('client', 'agency_admin');
CREATE TYPE host_status AS ENUM ('pending', 'active', 'archived');

-- Profiles table (links to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  role app_role DEFAULT 'client' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Hosts table (Professional Host/Guide portfolios)
CREATE TABLE IF NOT EXISTS public.hosts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  age INTEGER CHECK (age >= 20 AND age <= 26),
  contact_whatsapp TEXT,
  bio TEXT,
  location TEXT,
  gallery_urls TEXT[] DEFAULT '{}',
  categories TEXT[] DEFAULT '{}',
  status host_status DEFAULT 'pending' NOT NULL,
  profile_image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blogs table (SEO Content)
CREATE TABLE IF NOT EXISTS public.blogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT,
  excerpt TEXT,
  cover_image_url TEXT,
  is_published BOOLEAN DEFAULT FALSE,
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Site Settings table (Global config - single row)
CREATE TABLE IF NOT EXISTS public.site_settings (
  id INTEGER PRIMARY KEY CHECK (id = 1) DEFAULT 1,
  site_name TEXT DEFAULT 'SAATHI NEPAL',
  logo_url TEXT,
  hero_headline TEXT DEFAULT 'Discover Professional Hosts & Guides in Nepal',
  hero_subheadline TEXT DEFAULT 'Connect with verified local experts for unforgettable experiences',
  contact_email TEXT,
  contact_phone TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Favorites table (for swipe discovery feature)
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  host_id UUID REFERENCES public.hosts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, host_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_hosts_status ON public.hosts(status);
CREATE INDEX IF NOT EXISTS idx_hosts_slug ON public.hosts(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_published ON public.blogs(is_published);
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON public.blogs(slug);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON public.favorites(user_id);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hosts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- PROFILES RLS Policies
-- Users can view their own profile
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Admin can view all profiles
CREATE POLICY "profiles_admin_select" ON public.profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'agency_admin')
  );

-- Admin can insert profiles
CREATE POLICY "profiles_admin_insert" ON public.profiles
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'agency_admin')
  );

-- Admin can update any profile
CREATE POLICY "profiles_admin_update" ON public.profiles
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'agency_admin')
  );

-- Admin can delete profiles
CREATE POLICY "profiles_admin_delete" ON public.profiles
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'agency_admin')
  );

-- HOSTS RLS Policies
-- Public can view active hosts
CREATE POLICY "hosts_public_select" ON public.hosts
  FOR SELECT USING (status = 'active');

-- Admin can view all hosts
CREATE POLICY "hosts_admin_select" ON public.hosts
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'agency_admin')
  );

-- Admin can insert hosts
CREATE POLICY "hosts_admin_insert" ON public.hosts
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'agency_admin')
  );

-- Admin can update hosts
CREATE POLICY "hosts_admin_update" ON public.hosts
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'agency_admin')
  );

-- Admin can delete hosts
CREATE POLICY "hosts_admin_delete" ON public.hosts
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'agency_admin')
  );

-- BLOGS RLS Policies
-- Public can view published blogs
CREATE POLICY "blogs_public_select" ON public.blogs
  FOR SELECT USING (is_published = TRUE);

-- Admin can view all blogs
CREATE POLICY "blogs_admin_select" ON public.blogs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'agency_admin')
  );

-- Admin can insert blogs
CREATE POLICY "blogs_admin_insert" ON public.blogs
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'agency_admin')
  );

-- Admin can update blogs
CREATE POLICY "blogs_admin_update" ON public.blogs
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'agency_admin')
  );

-- Admin can delete blogs
CREATE POLICY "blogs_admin_delete" ON public.blogs
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'agency_admin')
  );

-- SITE_SETTINGS RLS Policies
-- Public can view site settings
CREATE POLICY "site_settings_public_select" ON public.site_settings
  FOR SELECT USING (TRUE);

-- Admin can update site settings
CREATE POLICY "site_settings_admin_update" ON public.site_settings
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'agency_admin')
  );

-- Admin can insert site settings (for initial setup)
CREATE POLICY "site_settings_admin_insert" ON public.site_settings
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'agency_admin')
  );

-- FAVORITES RLS Policies
-- Users can view their own favorites
CREATE POLICY "favorites_select_own" ON public.favorites
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own favorites
CREATE POLICY "favorites_insert_own" ON public.favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can delete their own favorites
CREATE POLICY "favorites_delete_own" ON public.favorites
  FOR DELETE USING (auth.uid() = user_id);

-- Trigger function to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email),
    COALESCE((NEW.raw_user_meta_data ->> 'role')::app_role, 'client')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Insert default site settings
INSERT INTO public.site_settings (id, site_name, hero_headline, hero_subheadline)
VALUES (1, 'SAATHI NEPAL', 'Discover Professional Hosts & Guides in Nepal', 'Connect with verified local experts for unforgettable experiences')
ON CONFLICT (id) DO NOTHING;
