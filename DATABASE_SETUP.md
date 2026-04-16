# 🚀 Database Setup Instructions

Your Supabase project needs the `models` table created. Follow these steps:

## Step 1: Open Supabase Dashboard

1. Go to https://supabase.com/dashboard
2. Select your project
3. Click **SQL Editor** in the left sidebar
4. Click **New query**

## Step 2: Run This SQL

Copy and paste this entire SQL block into the SQL Editor and click **Run**:

```sql
-- Create models table
CREATE TABLE IF NOT EXISTS public.models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  age INT,
  city VARCHAR(255),
  bio TEXT,
  whatsapp VARCHAR(20),
  image_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS models_is_featured_idx ON public.models(is_featured);
CREATE INDEX IF NOT EXISTS models_created_at_idx ON public.models(created_at DESC);

-- Enable RLS
ALTER TABLE public.models ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read
CREATE POLICY "allow_read_all" ON public.models
  FOR SELECT
  USING (true);

-- Allow all operations (we handle auth via API)
CREATE POLICY "allow_all_authenticated" ON public.models
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

## Step 3: Verify Storage Bucket

The `model-images` storage bucket should already exist. If not:

1. In Supabase Dashboard, click **Storage** 
2. Click **Create a new bucket**
3. Name it: `model-images`
4. Toggle **Public bucket** ON
5. Click **Create bucket**

## Step 4: Restart Dev Server

After running the SQL, restart your Next.js dev server:

```bash
npm run dev
```

## Step 5: Test Admin Dashboard

1. Go to http://localhost:3000/admin/login
2. Login with your credentials
3. Try creating a model - it should now work!

---

## Troubleshooting

### Still getting "Could not find the table" error?

- Make sure you ran the SQL above
- Check that the table appears in **Tables** section of Supabase
- Restart your dev server after creating the table

### Still getting "row violates row-level security policy" error?

- Verify the storage bucket `model-images` exists
- Verify it's set as **Public bucket**
- Check that RLS policies are created for the models table

### Need help?

Check the **Storage** → **Policies** section in Supabase to see:
- Storage bucket permissions
- Table RLS policies

