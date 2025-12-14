-- 1. Grant agency_admin role to the specific user
INSERT INTO public.profiles (id, role, full_name)
VALUES ('43e1682b-c423-46ed-8b97-7d8a08f244bb', 'agency_admin', 'God Mode Admin')
ON CONFLICT (id) DO UPDATE
SET role = 'agency_admin';

-- 2. Ensure RLS allows users to read their own profile (crucial for middleware check)
-- First, enable RLS if not already enabled (idempotent usually, but good to note)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop policy if it exists to avoid errors on run (optional, or just create if not exists using do block)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles' 
        AND policyname = 'Users can view own profile'
    ) THEN
        create policy "Users can view own profile"
        on "public"."profiles"
        as permissive
        for select
        to authenticated
        using ((auth.uid() = id));
    END IF;
END
$$;
