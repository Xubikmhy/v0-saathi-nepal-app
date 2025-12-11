-- Create or update admin user with known credentials
-- This script needs to be run in the Supabase SQL Editor

-- 1. Create user in auth.users if not exists (requires extension or direct insert)
-- Note: We can't easily insert into auth.users from client SQL due to hashing.
-- Instead, we'll assume the user signs up via the UI, or we update an existing user.
-- For this script, we'll update the profile for a specific email if it exists.

DO $$
DECLARE
  v_user_id uuid;
  v_email text := 'admin@escortnepal.com'; -- Change this to the email you want to use
BEGIN
  -- Get user ID from email
  SELECT id INTO v_user_id FROM auth.users WHERE email = v_email;

  IF v_user_id IS NOT NULL THEN
    -- Update profile to agency_admin
    INSERT INTO public.profiles (id, role, full_name)
    VALUES (v_user_id, 'agency_admin', 'Super Admin')
    ON CONFLICT (id) DO UPDATE
    SET role = 'agency_admin';
    
    RAISE NOTICE 'User % promoted to agency_admin', v_email;
  ELSE
    RAISE NOTICE 'User % not found. Please sign up first.', v_email;
  END IF;
END $$;
