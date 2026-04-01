-- Create models table
CREATE TABLE IF NOT EXISTS public.models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  age INT,
  city VARCHAR(255),
  bio TEXT,
  whatsapp VARCHAR(20),
  image_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS models_is_featured_idx ON public.models(is_featured);
CREATE INDEX IF NOT EXISTS models_created_at_idx ON public.models(created_at DESC);

-- Enable RLS
ALTER TABLE public.models ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read
CREATE POLICY "allow_read_all" ON public.models
  FOR SELECT
  USING (true);

-- Allow authenticated users to insert/update/delete (for admin API with Bearer token)
-- Since we're using Bearer tokens, we'll allow all for now and rely on API authentication
CREATE POLICY "allow_all_authenticated" ON public.models
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Disable RLS on storage to allow uploads without auth
-- The model-images bucket should have public access for uploads
