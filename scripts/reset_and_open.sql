-- 1. DROP EXISTING TABLES TO RESET
DROP TABLE IF EXISTS public.favorites CASCADE;
DROP TABLE IF EXISTS public.hosts CASCADE;
DROP TABLE IF EXISTS public.blogs CASCADE;
DROP TABLE IF EXISTS public.site_settings CASCADE;
DROP TABLE IF EXISTS public.escort_profiles CASCADE; 

-- 2. RE-CREATE TABLES
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

-- 3. APPLY OPEN ACCESS POLICIES (ALL PERMISSIVE)
ALTER TABLE public.hosts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "allow_all_hosts" ON public.hosts;
CREATE POLICY "allow_all_hosts" ON public.hosts FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "allow_all_blogs" ON public.blogs;
CREATE POLICY "allow_all_blogs" ON public.blogs FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "allow_all_settings" ON public.site_settings;
CREATE POLICY "allow_all_settings" ON public.site_settings FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "allow_all_profiles" ON public.profiles;
CREATE POLICY "allow_all_profiles" ON public.profiles FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "allow_all_storage" ON storage.objects;
CREATE POLICY "allow_all_storage" ON storage.objects FOR ALL USING (bucket_id = 'uploads') WITH CHECK (bucket_id = 'uploads');

-- 4. INSERT DEFAULT SETTINGS
INSERT INTO public.site_settings (id, site_name, hero_headline, hero_subheadline, contact_email, contact_phone)
VALUES (1, 'EscortNepal', 'Discover Exquisite Nepali Beauty', 'Premium models for your exclusive events and experiences', 'info@escortnepal.com', '+977-9801234567')
ON CONFLICT (id) DO NOTHING;

-- 5. SEED HOST DATA
INSERT INTO public.hosts (name, slug, age, contact_whatsapp, bio, location, gallery_urls, categories, status, profile_image_url)
VALUES
  ('Aarav Sharma', 'aarav-sharma', 24, '+977-9801234567', 'Experienced trekking guide.', 'Pokhara', ARRAY['/placeholder.svg'], ARRAY['Trekking'], 'active', '/models/nepali_bikini_model_1.png'),
  ('Priya Thapa', 'priya-thapa', 22, '+977-9812345678', 'Cultural tour specialist.', 'Kathmandu', ARRAY['/placeholder.svg'], ARRAY['Cultural'], 'active', '/models/nepali_bikini_model_1.png'),
  ('Sita Rai', 'sita-rai', 21, '+977-9834567890', 'Yoga and wellness retreat host.', 'Pokhara', ARRAY['/placeholder.svg'], ARRAY['Yoga'], 'active', '/models/nepali_bikini_model_1.png');
