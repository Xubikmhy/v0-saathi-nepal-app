import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import type { Profile } from '@/lib/types';

/**
 * Ensures the current user is the god‑mode admin.
 * Redirects to login if not authenticated, or to home/login if not an admin.
 * Returns the full profile object for callers.
 */
export async function requireGodMode(): Promise<Profile> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/admin/login');
    }

    // Check user_roles table for 'admin' role
    const { data: userRole, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

    if (roleError || !userRole || userRole.role !== 'admin') {
        console.log('User is not admin, redirecting. Role:', userRole?.role);
        redirect('/admin/login');
    }

    const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    if (error || !profile) {
        // If profile doesn't exist but user is admin, we might want to let them in or create profile
        // For now, redirect, or return a mock profile?
        // Let's assume profile exists or return basic info
        return {
            id: user.id,
            full_name: 'Super Admin',
            avatar_url: null,
            // Add other fields if Profile type requires them
        } as unknown as Profile;
    }

    return profile as Profile;
}
