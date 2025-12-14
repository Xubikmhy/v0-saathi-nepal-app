-- Ads table and RLS policies

DO $$ BEGIN
    CREATE TYPE ad_position AS ENUM ('header','sidebar','footer','inline');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.ads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  image_url TEXT,
  link_url TEXT,
  html TEXT,
  position ad_position NOT NULL DEFAULT 'header',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  start_at TIMESTAMPTZ,
  end_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ads_position ON public.ads(position);
CREATE INDEX IF NOT EXISTS idx_ads_active ON public.ads(is_active);

ALTER TABLE public.ads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "ads_public_select" ON public.ads;
DROP POLICY IF EXISTS "ads_admin_all" ON public.ads;

CREATE POLICY "ads_public_select" ON public.ads
  FOR SELECT USING (
    is_active = TRUE
    AND (start_at IS NULL OR start_at <= NOW())
    AND (end_at IS NULL OR end_at >= NOW())
  );

CREATE POLICY "ads_admin_all" ON public.ads
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'agency_admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'agency_admin')
  );

-- Seed example header ad
INSERT INTO public.ads (title, image_url, link_url, position, is_active)
VALUES (
  'Welcome Banner',
  '/placeholder.jpg',
  'https://example.com',
  'header',
  TRUE
)
ON CONFLICT DO NOTHING;

SELECT 'Ads table created' as status;
