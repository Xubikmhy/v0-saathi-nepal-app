import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import type { Profile } from '@/lib/types';

/**
 * Requires agency_admin role for admin access.
 * Redirects to login if not authenticated, or to home if not an admin.
 */
export async function requireAdminAccess(): Promise<Profile> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/admin/login');
    }

    const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    if (error || !profile || profile.role !== 'agency_admin') {
        console.log('[v0] Access denied. Role:', profile?.role);
        redirect('/');
    }

    return profile as Profile;
}

/**
 * Ensures the current user is the god‑mode admin.
 * Redirects to login if not authenticated, or to home/login if not an admin.
 * Returns the full profile object for callers.
 * @deprecated Use requireAdminAccess instead
 */
export async function requireGodMode(): Promise<Profile> {
    return requireAdminAccess();
}
