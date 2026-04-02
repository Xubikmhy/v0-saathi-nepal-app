import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { Profile } from '@/lib/types';

/**
 * Ensures the current user is the admin.
 * Redirects to login if not authenticated.
 * Returns a mock admin profile for the dashboard.
 */
export async function requireGodMode(): Promise<Profile> {
    // Check if admin session exists in cookies or localStorage marker
    const cookieStore = await cookies();
    const adminSession = cookieStore.get('admin_session');

    if (!adminSession || adminSession.value !== 'verified') {
        redirect('/admin/login');
    }

    // Return admin profile with full permissions
    return {
        id: 'admin',
        full_name: 'Admin User',
        avatar_url: null,
        email: 'admin@escortnepal.com',
        role: 'agency_admin',
        bio: 'System Administrator',
        created_at: new Date().toISOString(),
    } as unknown as Profile;
}
