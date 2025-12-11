-- Promote specific user to God Mode Admin
-- User ID: 10b30913-4c34-41ab-b1dd-97cbdf875a2f

DO $$
DECLARE
  target_user_id UUID := '10b30913-4c34-41ab-b1dd-97cbdf875a2f';
BEGIN
  -- 1. Ensure profile exists and is admin
  -- We use INSERT ... ON CONFLICT to handle cases where the profile might be missing
  INSERT INTO public.profiles (id, role, full_name)
  VALUES (target_user_id, 'agency_admin', 'Admin User')
  ON CONFLICT (id) DO UPDATE
  SET role = 'agency_admin';

  -- 2. Confirm email (requires superuser privileges, usually available in SQL Editor)
  -- This ensures the user can login even if they didn't click the confirmation link
  BEGIN
    UPDATE auth.users
    SET email_confirmed_at = COALESCE(email_confirmed_at, NOW())
    WHERE id = target_user_id;
  EXCEPTION WHEN OTHERS THEN
    -- Ignore permission errors if running as non-superuser
    NULL;
  END;
END $$;

-- Verify
SELECT * FROM public.profiles WHERE id = '10b30913-4c34-41ab-b1dd-97cbdf875a2f';
