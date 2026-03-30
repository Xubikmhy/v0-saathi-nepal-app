import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const userId = 'dea92098-7945-4b6e-9cff-f5b5a54f86ed';

async function grantAdminAccess() {
  try {
    console.log(`[v0] Granting admin access to user: ${userId}`);
    
    // Update user profile to agency_admin role
    const { data, error } = await supabase
      .from('profiles')
      .update({ 
        role: 'agency_admin',
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select();

    if (error) {
      console.error('[v0] Error updating profile:', error);
      process.exit(1);
    }

    console.log('[v0] Profile updated successfully:', data);

    // Verify the update
    const { data: verifyData, error: verifyError } = await supabase
      .from('profiles')
      .select('id, full_name, role, updated_at')
      .eq('id', userId)
      .single();

    if (verifyError) {
      console.error('[v0] Error verifying update:', verifyError);
      process.exit(1);
    }

    console.log('[v0] Verification successful:', verifyData);
    console.log(`[v0] User ${verifyData.full_name} (${verifyData.id}) now has role: ${verifyData.role}`);
    
  } catch (error) {
    console.error('[v0] Unexpected error:', error);
    process.exit(1);
  }
}

grantAdminAccess();
