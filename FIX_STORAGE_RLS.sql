-- ============================================
-- FIX STORAGE RLS POLICIES FOR model-images
-- Run this in your Supabase SQL Editor
-- ============================================

-- 1. Drop existing RLS policies on model-images bucket if they exist
DROP POLICY IF EXISTS "Allow public uploads" ON "storage"."objects";
DROP POLICY IF EXISTS "Allow authenticated uploads" ON "storage"."objects";
DROP POLICY IF EXISTS "Allow public read" ON "storage"."objects";
DROP POLICY IF EXISTS "Allow authenticated delete" ON "storage"."objects";

-- 2. Disable RLS on storage.objects entirely (recommended for public uploads)
-- OR use the policies below if you prefer RLS enabled

-- Option A: DISABLE RLS (Easiest - allows public uploads without restrictions)
ALTER TABLE "storage"."objects" DISABLE ROW LEVEL SECURITY;

-- Option B: If you want RLS enabled, create these policies instead:
-- ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;

-- CREATE POLICY "Allow public read for model-images"
-- ON "storage"."objects" FOR SELECT
-- USING (bucket_id = 'model-images');

-- CREATE POLICY "Allow public upload to model-images"
-- ON "storage"."objects" FOR INSERT
-- WITH CHECK (bucket_id = 'model-images');

-- CREATE POLICY "Allow public delete from model-images"
-- ON "storage"."objects" FOR DELETE
-- USING (bucket_id = 'model-images');

-- 3. Make sure model-images bucket exists and is public
-- Note: If bucket doesn't exist, create it via Supabase UI:
-- Storage → Create new bucket → Name: model-images → Check "Public bucket"
