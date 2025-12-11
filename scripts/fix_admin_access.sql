-- Run this script in Supabase SQL Editor to ensure admin access
-- 1. Ensure profiles table has role column
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role text DEFAULT 'client';

-- 2. Ensure the specific user is an admin in profiles
UPDATE public.profiles 
SET role = 'agency_admin' 
WHERE id IN (SELECT id FROM auth.users WHERE email = 'xuxilhax@gmail.com');

-- 3. Ensure the user has admin role in user_roles (Source of Truth)
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users 
WHERE email = 'xuxilhax@gmail.com'
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';

-- 4. Mark as super admin in auth.users (System flag)
UPDATE auth.users 
SET is_super_admin = true, email_confirmed_at = now()
WHERE email = 'xuxilhax@gmail.com';
