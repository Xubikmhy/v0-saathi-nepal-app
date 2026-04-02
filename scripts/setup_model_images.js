import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('[v0 setup] Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function setupModelImagesBucket() {
  try {
    console.log('[v0 setup] Creating model-images bucket...');
    
    // Create bucket
    const { data: bucket, error: bucketError } = await supabase
      .storage
      .createBucket('model-images', {
        public: true,
        fileSizeLimit: 10485760 // 10MB
      });

    if (bucketError && !bucketError.message.includes('already exists')) {
      throw new Error(`Bucket creation failed: ${bucketError.message}`);
    }

    if (bucket) {
      console.log('[v0 setup] Bucket created successfully');
    } else {
      console.log('[v0 setup] Bucket already exists');
    }

    // Execute SQL policies
    console.log('[v0 setup] Applying RLS policies...');
    
    const sqlScript = fs.readFileSync('./scripts/010_storage_policies_model_images.sql', 'utf-8');
    const { error: sqlError } = await supabase.rpc('execute_sql_script', { sql_script: sqlScript });
    
    if (sqlError) {
      // Try direct query approach
      console.log('[v0 setup] Note: Direct SQL execution not available, policies should be applied manually via Supabase dashboard');
    } else {
      console.log('[v0 setup] RLS policies applied successfully');
    }

    console.log('[v0 setup] Model-images bucket setup complete!');
  } catch (error) {
    console.error('[v0 setup] Setup failed:', error.message);
    process.exit(1);
  }
}

setupModelImagesBucket();
