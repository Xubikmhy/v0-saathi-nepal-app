-- COMPLETE SETUP: Run this FIRST if tables don't exist
-- This creates all tables, RLS policies, and initial settings

-- Create custom ENUM types
DO $$ BEGIN
    CREATE TYPE app_role AS ENUM ('client', 'agency_admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE host_status AS ENUM ('pending', 'active', 'archived');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

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

-- Ads table (for ad banners)
CREATE TABLE IF NOT EXISTS public.ads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  image_url TEXT,
  link_url TEXT,
  html TEXT,
  position TEXT DEFAULT 'header' CHECK (position IN ('header', 'sidebar', 'footer', 'inline')),
  is_active BOOLEAN DEFAULT TRUE,
  start_at TIMESTAMPTZ,
  end_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_hosts_status ON public.hosts(status);
CREATE INDEX IF NOT EXISTS idx_hosts_slug ON public.hosts(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_published ON public.blogs(is_published);
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON public.blogs(slug);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_ads_position ON public.ads(position);
CREATE INDEX IF NOT EXISTS idx_ads_active ON public.ads(is_active);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hosts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ads ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "hosts_public_select" ON public.hosts;
DROP POLICY IF EXISTS "hosts_admin_select" ON public.hosts;
DROP POLICY IF EXISTS "hosts_admin_insert" ON public.hosts;
DROP POLICY IF EXISTS "hosts_admin_update" ON public.hosts;
DROP POLICY IF EXISTS "hosts_admin_delete" ON public.hosts;
DROP POLICY IF EXISTS "site_settings_public_select" ON public.site_settings;
DROP POLICY IF EXISTS "site_settings_admin_update" ON public.site_settings;
DROP POLICY IF EXISTS "site_settings_admin_insert" ON public.site_settings;
DROP POLICY IF EXISTS "ads_public_select" ON public.ads;
DROP POLICY IF EXISTS "ads_admin_insert" ON public.ads;
DROP POLICY IF EXISTS "ads_admin_update" ON public.ads;
DROP POLICY IF EXISTS "ads_admin_delete" ON public.ads;

-- HOSTS RLS Policies - Public can view active hosts
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

-- SITE_SETTINGS RLS Policies - Public can view site settings
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

-- ADS RLS Policies - Public can view active ads
CREATE POLICY "ads_public_select" ON public.ads
  FOR SELECT USING (is_active = TRUE);

-- Admin can view all ads
CREATE POLICY "ads_admin_select" ON public.ads
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'agency_admin')
  );

-- Admin can insert ads
CREATE POLICY "ads_admin_insert" ON public.ads
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'agency_admin')
  );

-- Admin can update ads
CREATE POLICY "ads_admin_update" ON public.ads
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'agency_admin')
  );

-- Admin can delete ads
CREATE POLICY "ads_admin_delete" ON public.ads
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'agency_admin')
  );

-- Insert default site settings
INSERT INTO public.site_settings (id, site_name, hero_headline, hero_subheadline, contact_email, contact_phone)
VALUES (
  1, 
  'EscortNepal', 
  'Discover Exquisite Nepali Beauty', 
  'Premium models for your exclusive events and experiences', 
  'info@escortnepal.com', 
  '+977-9801234567'
)
ON CONFLICT (id) DO UPDATE SET
  hero_headline = EXCLUDED.hero_headline,
  hero_subheadline = EXCLUDED.hero_subheadline,
  site_name = EXCLUDED.site_name,
  contact_email = EXCLUDED.contact_email,
  contact_phone = EXCLUDED.contact_phone;

-- Success message
SELECT 'Tables created successfully! Now run SEED_DATABASE.sql to add models.' as status;
