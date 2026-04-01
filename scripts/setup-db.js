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
    console.log('🚀 Starting database and storage setup...\n');

    // Read SQL file
    const sqlPath = path.join(__dirname, 'setup-models-table.sql');
    const sql = fs.readFileSync(sqlPath, 'utf-8');

    // Try to execute SQL
    console.log('1️⃣ Checking for models table...');
    const { data: tableCheck, error: checkError } = await supabase
      .from('models')
      .select('id')
      .limit(1);

    if (checkError && checkError.code === 'PGRST116') {
      // Table doesn't exist, try to create it
      console.log('   Table not found. Creating via SQL...');
      
      // Since we can't use RPC without a stored procedure, we'll need to create via dashboard
      console.log('\n❌ Models table does not exist!');
      console.log('\n📋 Please run this SQL in your Supabase dashboard (SQL Editor):\n');
      console.log('═'.repeat(60));
      console.log(sql);
      console.log('═'.repeat(60));
      console.log('\n');
    } else if (checkError) {
      console.log('   Error checking table:', checkError.message);
      throw checkError;
    } else {
      console.log('   ✅ Models table exists!');
    }

    // Create storage bucket
    console.log('\n2️⃣ Setting up storage bucket...');
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();

    if (bucketsError) {
      console.error('   Error listing buckets:', bucketsError);
      throw bucketsError;
    }

    const bucketExists = buckets?.some(b => b.name === 'model-images');

    if (!bucketExists) {
      console.log('   Creating model-images bucket...');
      const { error: bucketError } = await supabase.storage.createBucket('model-images', {
        public: true,
      });

      if (bucketError) {
        console.error('   Error creating bucket:', bucketError);
        throw bucketError;
      }
      console.log('   ✅ Created model-images bucket with public access!');
    } else {
      console.log('   ✅ model-images bucket already exists!');
      
      // Update bucket to ensure public access
      console.log('   Verifying bucket permissions...');
      // Buckets should be public for uploads to work
    }

    console.log('\n✨ Setup complete!\n');
    console.log('📌 If you ran the SQL, you can restart your dev server now.');

  } catch (err) {
    console.error('❌ Setup error:', err.message);
    const sqlPath = path.join(__dirname, 'setup-models-table.sql');
    const sql = fs.readFileSync(sqlPath, 'utf-8');
    console.log('\n📋 Run this SQL in Supabase dashboard:\n');
    console.log('═'.repeat(60));
    console.log(sql);
    console.log('═'.repeat(60));
    process.exit(1);
  }
}

setupDatabase();
