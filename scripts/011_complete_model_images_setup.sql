-- Complete Model Images Setup
-- This script ensures the model-images bucket exists with proper RLS policies

-- 1. Create model-images bucket (if it doesn't exist)
INSERT INTO storage.buckets (id, name, public)
VALUES ('model-images', 'model-images', true)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;

-- 2. Enable RLS on storage.objects (required for policies)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 3. Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "model_images_public_read" ON storage.objects;
DROP POLICY IF EXISTS "model_images_authenticated_insert" ON storage.objects;
DROP POLICY IF EXISTS "model_images_authenticated_update" ON storage.objects;
DROP POLICY IF EXISTS "model_images_authenticated_delete" ON storage.objects;

-- 4. Create RLS policies for model-images bucket

-- Public can read all files from model-images bucket
CREATE POLICY "model_images_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'model-images');

-- Authenticated users (admins) can upload to model-images bucket
CREATE POLICY "model_images_authenticated_insert" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'model-images');

-- Authenticated users (admins) can update files in model-images bucket
CREATE POLICY "model_images_authenticated_update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'model-images')
  WITH CHECK (bucket_id = 'model-images');

-- Authenticated users (admins) can delete files from model-images bucket
CREATE POLICY "model_images_authenticated_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'model-images');

-- Confirmation message
SELECT 'Model-images storage bucket and RLS policies configured successfully' as status;
