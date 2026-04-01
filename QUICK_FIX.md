# 🚀 Quick Fix - 5 Minutes

## The Problem
- Database table doesn't exist
- Storage bucket has RLS blocking uploads

## The Solution

### Step 1: Create Table (2 min)

Go to: **https://supabase.com/dashboard** → Your Project → **SQL Editor** → **New Query**

Paste and Run:
```sql
CREATE TABLE IF NOT EXISTS public.models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  age INT,
  city VARCHAR(255) NOT NULL,
  bio TEXT,
  whatsapp VARCHAR(20) NOT NULL,
  image_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS models_is_featured_idx ON public.models(is_featured);
CREATE INDEX IF NOT EXISTS models_created_at_idx ON public.models(created_at DESC);

ALTER TABLE public.models ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "allow_read_all" ON public.models;
DROP POLICY IF EXISTS "allow_all" ON public.models;

CREATE POLICY "allow_read_all" ON public.models FOR SELECT USING (true);
CREATE POLICY "allow_all" ON public.models FOR ALL USING (true) WITH CHECK (true);
```

✅ Done! Should say "Success"

### Step 2: Fix Storage Bucket (2 min)

Go to: **Storage** → **Buckets**

**Create bucket if missing:**
- Name: `model-images`
- Check ✓ "Public bucket"

**Fix RLS:**
- Click `model-images`
- Click **Policies** tab
- Delete RLS policies OR
- Add policy: `Allow public uploads`

### Step 3: Restart (1 min)

```bash
npm run dev
```

Visit: **http://localhost:3000/admin/login**

Done! 🎉

---

**Login Credentials:**
- Email: Check your `ADMIN_EMAIL` in `.env.development.local`
- Password: Check your `ADMIN_PASSWORD`

---

**If image upload still fails:**
1. F12 → Console → Look for errors with `[v0]`
2. Make sure `model-images` bucket is **Public** and **RLS disabled**
3. Try uploading a small JPG (< 5MB)
