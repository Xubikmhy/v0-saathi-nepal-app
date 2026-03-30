-- Grant admin access to user
-- This script updates the user's profile to give them agency_admin role

UPDATE public.profiles
SET role = 'agency_admin',
    updated_at = NOW()
WHERE id = 'dea92098-7945-4b6e-9cff-f5b5a54f86ed';

-- Verify the update
SELECT id, full_name, role, updated_at
FROM public.profiles
WHERE id = 'dea92098-7945-4b6e-9cff-f5b5a54f86ed';
