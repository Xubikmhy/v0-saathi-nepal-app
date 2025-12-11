import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import type { Profile } from '@/lib/types';

/**
 * Ensures the current user is the god‑mode admin.
 * Redirects to login if not authenticated, or to home if not an agency_admin.
 * Returns the full profile object for callers.
 */
export async function requireGodMode(): Promise<Profile> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect('/auth/login');
    }

    const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    if (error || !profile) {
        redirect('/');
    }

    if (profile.role !== 'agency_admin') {
        redirect('/');
    }

    return profile as Profile;
}
