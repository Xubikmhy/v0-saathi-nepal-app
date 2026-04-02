/**
 * Admin Storage Client for image uploads
 * Uses service role key to bypass RLS policies
 * Fixes: "new row violates row-level security" error
 * 
 * This client is used for admin dashboard image uploads
 * It doesn't require Supabase auth session since it uses SERVICE_ROLE_KEY
 */

import { createClient } from '@supabase/supabase-js';

let adminStorageClient: ReturnType<typeof createClient> | null = null;

/**
 * Get admin storage client with service role key
 * Bypasses RLS for storage operations
 */
export function getAdminStorageClient() {
  if (adminStorageClient) return adminStorageClient;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('[upload fix] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    throw new Error('Admin storage client not configured');
  }

  // Use service role key to bypass RLS
  adminStorageClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });

  return adminStorageClient;
}
