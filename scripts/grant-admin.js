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
    
    // First, check if the profile exists
    const { data: existingProfile, error: checkError } = await supabase
      .from('profiles')
      .select('id, full_name, role')
      .eq('id', userId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('[v0] Error checking profile:', checkError);
      process.exit(1);
    }

    if (!existingProfile) {
      // Profile doesn't exist, create it with admin role
      console.log('[v0] Profile not found, creating new admin profile...');
      
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          full_name: 'Admin User',
          role: 'agency_admin',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select();

      if (createError) {
        console.error('[v0] Error creating profile:', createError);
        process.exit(1);
      }

      console.log('[v0] Admin profile created successfully');
    } else {
      // Profile exists, update the role to admin
      console.log('[v0] Existing profile found, updating to admin role...');
      
      const { data: updateData, error: updateError } = await supabase
        .from('profiles')
        .update({ 
          role: 'agency_admin',
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select();

      if (updateError) {
        console.error('[v0] Error updating profile:', updateError);
        process.exit(1);
      }

      console.log('[v0] Profile updated successfully');
    }

    // Verify the final state
    const { data: verifyData, error: verifyError } = await supabase
      .from('profiles')
      .select('id, full_name, role, created_at, updated_at')
      .eq('id', userId)
      .single();

    if (verifyError) {
      console.error('[v0] Error verifying update:', verifyError);
      process.exit(1);
    }

    console.log('[v0] ✓ SUCCESS: Admin access granted!');
    console.log('[v0] Admin Details:');
    console.log(`  - ID: ${verifyData.id}`);
    console.log(`  - Name: ${verifyData.full_name}`);
    console.log(`  - Role: ${verifyData.role}`);
    console.log(`  - Created: ${verifyData.created_at}`);
    console.log(`  - Updated: ${verifyData.updated_at}`);
    console.log('[v0] ');
    console.log('[v0] ✓ This user now has full admin access to:');
    console.log('[v0]   • Admin dashboard');
    console.log('[v0]   • Add/edit/delete hosts');
    console.log('[v0]   • Manage blog posts');
    console.log('[v0]   • Update site settings');
    console.log('[v0]   • View and manage ads');
    console.log('[v0]   • Monitor platform activity');
    
  } catch (error) {
    console.error('[v0] Unexpected error:', error);
    process.exit(1);
  }
}

grantAdminAccess();
