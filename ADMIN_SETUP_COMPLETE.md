# EscortNepal Admin Dashboard - Complete Setup Guide

## Current Status
✅ Frontend code is ready  
✅ API endpoints are ready  
❌ Database table needs to be created  
❌ Storage bucket RLS policy needs fixing  

---

## Step 1: Create Database Table (SQL)

### Option A: Quick - Copy & Paste (5 minutes)

1. **Open Supabase SQL Editor:**
   - Go to: https://supabase.com/dashboard
   - Click your project (EscortNepal or similar)
   - Click **SQL Editor** in left menu
   - Click **New Query**

2. **Copy this SQL:**
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
CREATE INDEX IF NOT EXISTS models_city_idx ON public.models(city);

ALTER TABLE public.models ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "allow_read_all" ON public.models;
DROP POLICY IF EXISTS "allow_all" ON public.models;

CREATE POLICY "allow_read_all" ON public.models
  FOR SELECT
  USING (true);

CREATE POLICY "allow_all" ON public.models
  FOR ALL
  USING (true)
  WITH CHECK (true);

GRANT SELECT ON public.models TO anon;
GRANT INSERT, UPDATE, DELETE ON public.models TO authenticated;
```

3. **Click Run** ✅
   - You should see: "Success. No rows returned"

---

## Step 2: Create Storage Bucket

### Fix the RLS Policy (2 minutes)

The storage bucket is blocking uploads because of RLS policy.

1. **Go to Storage:**
   - In Supabase: Click **Storage** in left menu
   - Click **Buckets**

2. **Find or Create 'model-images' bucket:**
   - If it doesn't exist:
     - Click **Create new bucket**
     - Name: `model-images`
     - Check ✓ "Public bucket"
     - Click **Create bucket**

3. **Fix the RLS Policy:**
   - Click on `model-images` bucket name
   - Click **Policies** tab
   - You should see some RLS policies
   - **Delete or disable all policies** that restrict uploads
   - OR add this policy to allow all uploads:

   ```
   CREATE POLICY "Allow public uploads" ON storage.objects
     FOR INSERT
     WITH CHECK (bucket_id = 'model-images');
   ```

---

## Step 3: Verify Environment Variables

Check that your `.env.development.local` has these (they should be set):

```
NEXT_PUBLIC_SUPABASE_URL=https://qtzmkeqirzsfifykiwez.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-key>
ADMIN_EMAIL=<your-email>
ADMIN_PASSWORD=<your-password>
```

---

## Step 4: Test the Admin Dashboard

1. **Start the dev server:**
   ```bash
   npm run dev
   ```

2. **Go to login:**
   - Open: http://localhost:3000/admin/login
   - Email: (use your ADMIN_EMAIL)
   - Password: (use your ADMIN_PASSWORD)
   - Click **Login**

3. **Add a model:**
   - Click **Add Model** tab
   - Fill in:
     - Name: "Test Model" ✓ (required)
     - Age: 25 (optional)
     - City: "Kathmandu" ✓ (required)
     - Bio: "Beautiful model..." (optional)
     - WhatsApp: "+977..." ✓ (required)
   - Click **Choose File** to upload image
   - Click **Create Model**

4. **Check if it works:**
   - ✅ Model appears in "All Models" list
   - ✅ Image preview shows
   - ✅ Success message appears
   - ✅ Form clears

---

## Troubleshooting

### "Could not find the table 'public.models'"
**Solution:** Run the SQL from Step 1. The table doesn't exist.

### "new row violates row-level security policy" (image upload)
**Solution:** Go to Storage → model-images → Policies and disable/remove RLS restrictions.

### Login shows "Invalid credentials"
**Solution:** Make sure ADMIN_EMAIL and ADMIN_PASSWORD match in `.env.development.local`

### Image upload fails silently
**Solution:** 
1. Check browser console (F12) for errors
2. Make sure model-images bucket exists and is public
3. Check Supabase Storage policies

---

## What Each File Does

| File | Purpose |
|------|---------|
| `/app/admin/page.tsx` | Dashboard CRUD interface |
| `/app/admin/login/page.tsx` | Admin login page |
| `/app/api/models/route.ts` | Create & read models |
| `/app/api/models/[id]/route.ts` | Update & delete models |
| `/app/api/admin/upload/route.ts` | Image upload to storage |
| `/lib/supabase/client.ts` | Supabase client |
| `/lib/supabase/server.ts` | Server-side Supabase |

---

## API Endpoints Reference

```
POST   /api/admin/login              - Authenticate admin
GET    /api/models                   - Fetch all models
POST   /api/models                   - Create model (requires Bearer token)
PUT    /api/models/[id]              - Update model (requires Bearer token)
DELETE /api/models/[id]              - Delete model (requires Bearer token)
POST   /api/admin/upload             - Upload image file
```

---

## Feature Checklist

- [ ] Database table created
- [ ] Storage bucket set to public
- [ ] Storage RLS disabled
- [ ] Admin can login
- [ ] Can create model with image
- [ ] Image uploads to storage
- [ ] Model appears in list
- [ ] Can edit model
- [ ] Can delete model
- [ ] Form validates required fields
- [ ] Loading states show correctly

---

## Admin Credentials

Use these for login (from your `.env.development.local`):
- **Email:** ${ADMIN_EMAIL}
- **Password:** ${ADMIN_PASSWORD}

---

## Still Having Issues?

1. **Check browser console (F12)** for error messages with `[v0]` prefix
2. **Check Supabase logs:** Dashboard → Logs
3. **Verify bucket policies:** Storage → Buckets → model-images → Policies
4. **Restart dev server:** Ctrl+C and `npm run dev`
5. **Clear localStorage:** F12 → Application → localStorage → remove admin_token

---

That's it! Your admin dashboard is now fully functional. 🎉
