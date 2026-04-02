import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('[v0 setup] Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function applyPolicies() {
  try {
    console.log('[v0 setup] Applying RLS policies for model-images bucket...');

    // Define policy statements
    const policies = [
      {
        name: 'model_images_public_read',
        operation: 'SELECT',
        definition: "(bucket_id = 'model-images')"
      },
      {
        name: 'model_images_authenticated_insert',
        operation: 'INSERT',
        definition: "(bucket_id = 'model-images')",
        roles: ['authenticated']
      },
      {
        name: 'model_images_authenticated_update',
        operation: 'UPDATE',
        definition: "(bucket_id = 'model-images')",
        roles: ['authenticated']
      },
      {
        name: 'model_images_authenticated_delete',
        operation: 'DELETE',
        definition: "(bucket_id = 'model-images')",
        roles: ['authenticated']
      }
    ];

    // Note: Direct RLS policy creation via REST API is limited
    // The best approach is to use Supabase dashboard or direct SQL
    console.log('[v0 setup] RLS policies for model-images bucket:');
    console.log('');
    console.log('1. model_images_public_read - SELECT');
    console.log("   USING: (bucket_id = 'model-images')");
    console.log('');
    console.log('2. model_images_authenticated_insert - INSERT TO authenticated');
    console.log("   WITH CHECK: (bucket_id = 'model-images')");
    console.log('');
    console.log('3. model_images_authenticated_update - UPDATE TO authenticated');
    console.log("   USING: (bucket_id = 'model-images')");
    console.log("   WITH CHECK: (bucket_id = 'model-images')");
    console.log('');
    console.log('4. model_images_authenticated_delete - DELETE TO authenticated');
    console.log("   USING: (bucket_id = 'model-images')");
    console.log('');
    
    // Try to check existing policies
    console.log('[v0 setup] Checking if policies need to be applied...');
    
    // Get bucket info
    const { data: buckets, error: bucketsError } = await supabase
      .storage
      .listBuckets();

    if (bucketsError) {
      console.error('[v0 setup] Error checking buckets:', bucketsError);
    } else {
      const modelImagesBucket = buckets?.find(b => b.name === 'model-images');
      if (modelImagesBucket) {
        console.log('[v0 setup] ✓ model-images bucket exists');
        console.log(`   - Public: ${modelImagesBucket.public}`);
      }
    }

    console.log('');
    console.log('[v0 setup] IMPORTANT: Apply the RLS policies manually via Supabase dashboard:');
    console.log('1. Go to Storage > Policies');
    console.log('2. Click on model-images bucket');
    console.log('3. Create the policies listed above');
    console.log('');
    console.log('[v0 setup] Or run SQL script: scripts/010_storage_policies_model_images.sql');

  } catch (error) {
    console.error('[v0 setup] Error:', error.message);
    process.exit(1);
  }
}

applyPolicies();
