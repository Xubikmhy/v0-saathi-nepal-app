-- ============================================
-- COMPLETE SUPABASE SETUP FOR MODELS APP
-- ============================================
-- Run this in: https://supabase.com/dashboard/project/YOUR_PROJECT/sql/new
-- Replace YOUR_PROJECT with your actual project ID

-- ============================================
-- 1. CREATE MODELS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  age INT,
  city VARCHAR(255) NOT NULL,
  bio TEXT,
  whatsapp VARCHAR(20) NOT NULL,
  image_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 2. CREATE INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS models_is_featured_idx ON public.models(is_featured);
CREATE INDEX IF NOT EXISTS models_created_at_idx ON public.models(created_at DESC);
CREATE INDEX IF NOT EXISTS models_city_idx ON public.models(city);

-- ============================================
-- 3. ENABLE ROW LEVEL SECURITY
-- ============================================
ALTER TABLE public.models ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 4. CREATE RLS POLICIES
-- ============================================
-- Drop existing policies if any
DROP POLICY IF EXISTS "allow_read_all" ON public.models;
DROP POLICY IF EXISTS "allow_all" ON public.models;

-- Allow anyone to read
CREATE POLICY "allow_read_all" ON public.models
  FOR SELECT
  USING (true);

-- Allow anyone to insert, update, delete (API validates with Bearer token)
CREATE POLICY "allow_all" ON public.models
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================
-- 5. GRANT PERMISSIONS
-- ============================================
GRANT SELECT ON public.models TO anon;
GRANT SELECT ON public.models TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.models TO authenticated;

-- ============================================
-- NEXT STEPS - Storage Bucket Setup
-- ============================================
-- You also need to create a 'model-images' storage bucket:
--
-- 1. Go to: https://supabase.com/dashboard/project/YOUR_PROJECT/storage/buckets
-- 2. Click "New bucket"
-- 3. Name: model-images
-- 4. Check "Public bucket" ✓
-- 5. Click "Create bucket"
-- 6. Go to the bucket policies (click on bucket name)
-- 7. Make sure uploads are allowed (RLS disabled for public uploads)
--
-- OR run these storage policies:
-- (These require Supabase CLI or direct SQL access to functions)
--
-- To disable RLS on storage bucket:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('model-images', 'model-images', true) ON CONFLICT DO NOTHING;
