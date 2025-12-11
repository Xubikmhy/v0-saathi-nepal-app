-- Grant God Mode (agency_admin) to specific user ID
-- Run this in the Supabase SQL Editor

DO $$
DECLARE
  target_id uuid := '10b30913-4c34-41ab-b1dd-97cbdf875a2f';
BEGIN
  -- 1. Update or Insert profile with agency_admin role
  INSERT INTO public.profiles (id, role, full_name)
  VALUES (target_id, 'agency_admin', 'God Mode Admin')
  ON CONFLICT (id) DO UPDATE
  SET role = 'agency_admin';

  RAISE NOTICE 'User % has been granted God Mode access.', target_id;
END $$;
     