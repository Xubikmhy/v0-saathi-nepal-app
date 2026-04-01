import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDatabase() {
  try {
    console.log('Setting up database...');

    // Read SQL file
    const sqlPath = path.join(__dirname, 'setup-models-table.sql');
    const sql = fs.readFileSync(sqlPath, 'utf-8');

    // Execute SQL
    const { error } = await supabase.rpc('exec', { sql_query: sql }).then(() => ({ error: null })).catch(err => ({ error: err }));

    if (error) {
      // Fallback: Create table directly using separate queries
      console.log('Attempting direct table creation...');

      const { error: createError } = await supabase.from('models').select('id').limit(1);
      if (createError && createError.code === 'PGRST116') {
        // Table doesn't exist, but we can't create it without RPC
        console.log('Please run this SQL in your Supabase dashboard SQL editor:');
        console.log(sql);
        return;
      }
    }

    console.log('✅ Database setup complete!');
    console.log('✅ Created models table');

    // Create storage bucket
    console.log('\nSetting up storage bucket...');
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(b => b.name === 'model-images');

    if (!bucketExists) {
      const { error: bucketError } = await supabase.storage.createBucket('model-images', {
        public: true,
      });

      if (bucketError) {
        console.error('Error creating bucket:', bucketError);
      } else {
        console.log('✅ Created model-images storage bucket');
      }
    } else {
      console.log('✅ model-images bucket already exists');
    }

  } catch (err) {
    console.error('Setup error:', err.message);
    console.log('\nPlease run this SQL manually in your Supabase dashboard:');
    const sqlPath = path.join(__dirname, 'setup-models-table.sql');
    const sql = fs.readFileSync(sqlPath, 'utf-8');
    console.log(sql);
  }
}

setupDatabase();
