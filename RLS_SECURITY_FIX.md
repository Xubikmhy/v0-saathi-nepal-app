# Row Level Security (RLS) Fix Guide

## Problem
You're getting this error:
```
new row violates row-level security policy
```

This happens because:
1. The `models` table doesn't exist yet
2. The storage bucket `model-images` has RLS enabled that blocks uploads

## Solution: 3 Steps

### Step 1: Create the Models Table (5 minutes)

Go to your **Supabase Dashboard**:
- https://supabase.com/dashboard
- Select your project
- Click **SQL Editor** → **New Query**
- Paste this SQL and click **Run**:

```sql
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

CREATE INDEX IF NOT EXISTS models_is_featured_idx ON public.models(is_featured);
CREATE INDEX IF NOT EXISTS models_created_at_idx ON public.models(created_at DESC);

ALTER TABLE public.models ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_read_all" ON public.models
  FOR SELECT
  USING (true);

CREATE POLICY "allow_all_authenticated" ON public.models
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

✅ You should see: "Query executed successfully"

### Step 2: Fix Storage Bucket Permissions (3 minutes)

In Supabase Dashboard:
1. Go to **Storage** → **Buckets**
2. Find **model-images**
3. If it doesn't exist:
   - Click **Create a new bucket**
   - Name: `model-images`
   - Toggle **Public bucket** ON
   - Click **Create bucket**

4. If it exists, click on **model-images**
5. Go to **Policies** tab
6. You should see policies allowing uploads. If not:
   - Click **New policy** 
   - Click **For full customization**
   - Paste this policy:

```sql
CREATE POLICY "allow_public_upload" ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'model-images');

CREATE POLICY "allow_public_read" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'model-images');
```

### Step 3: Restart and Test (1 minute)

```bash
# Restart your dev server
npm run dev
```

Then:
1. Go to http://localhost:3000/admin/login
2. Login with your credentials
3. Try creating a model with an image
4. ✅ Should work now!

---

## If Still Getting Errors

### "Could not find the table" error
- Verify the SQL ran successfully in Supabase
- Check **Tables** in left sidebar - you should see `models`
- Restart dev server
- Reload the page

### "new row violates row-level security policy" on image upload
- Go to Supabase Dashboard → **Storage**
- Click **model-images** bucket
- Go to **Policies** tab
- Make sure policies exist that allow uploads
- If none, create them using the policy SQL above

### "No models appear on homepage"
- Models are fetched from the database
- Make sure you added some via admin dashboard
- Only models with `is_featured = true` show on homepage
- Check admin dashboard "All Models" tab to verify they exist

---

## Technical Details

**What we did:**
1. Created `models` table with proper RLS policies
2. Made storage bucket public for uploads
3. Allowed all read/write operations (auth handled by API token)

**Why this works:**
- Table RLS policies allow all read/write operations
- API validates admin token before allowing changes
- Storage bucket is public so uploads work without auth issues

**Security notes:**
- API endpoints check `Authorization: Bearer {token}`
- Only `/api/models` POST/PUT/DELETE require valid token
- GET is always public (for frontend)
- Storage doesn't require auth (but API uploads need token)

