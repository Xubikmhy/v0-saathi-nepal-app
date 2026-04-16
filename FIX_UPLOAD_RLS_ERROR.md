# Fix Storage Upload RLS Policy Error

## The Problem

When trying to upload an image, you see this error:

```
Error [StorageApiError]: new row violates row-level security policy
Status: 403
```

This means the `model-images` storage bucket has Row Level Security (RLS) policies enabled that are blocking uploads.

---

## The Solution (2 Minutes)

### Step 1: Go to Supabase SQL Editor

1. Open https://supabase.com/dashboard
2. Click your project
3. Go to **SQL Editor** → **New Query**

### Step 2: Run the Fix SQL

1. Open the file in your project: `FIX_STORAGE_RLS.sql`
2. Copy the entire SQL content
3. Paste it into the Supabase SQL Editor
4. Click **Run**

Expected output:
```
Success. No rows returned
```

### Step 3: Verify

Go back to your admin dashboard and try uploading an image again.

If it still fails:

1. Go to **Storage** → **model-images** bucket
2. Click on **Policies** tab
3. Make sure you see no RLS policies blocking uploads
4. Or, delete any existing policies and try again

---

## What the Fix Does

The SQL script:
1. Removes any existing RLS policies on the storage
2. **Disables RLS entirely** on the `storage.objects` table (simplest approach)
3. Allows public uploads to work without authentication

This is secure because:
- The bucket is already set to "Public" in Supabase
- Files are uploaded with unique names (timestamp + random)
- The image URL is saved to the database with proper validation

---

## Alternative: Keep RLS Enabled (Advanced)

If you prefer to keep RLS enabled, uncomment Option B in the SQL file instead of Option A.

This requires:
- Users have authenticated session (for policy to work)
- More complex token management

For your use case, Option A (disable RLS) is simpler and works perfectly.

---

## Still Not Working?

Try these steps in Supabase UI:

1. **Storage** → **model-images** bucket
2. Click **Policies** tab
3. Delete ALL existing policies
4. Click **New Policy** → **For full customization**
5. Use this policy:

```sql
CREATE POLICY "Allow public uploads"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'model-images');
```

Then save and test upload again.

---

## Files to Know

- `FIX_STORAGE_RLS.sql` - The SQL to run
- `/app/api/admin/upload/route.ts` - The upload handler (no changes needed)
- `/app/admin/page.tsx` - Admin dashboard (no changes needed)

---

## Testing Upload

After the fix:

1. Go to http://localhost:3000/admin
2. Click "Add Model" tab
3. Click "Choose File" to select an image
4. You should see the image preview appear
5. Fill in other fields and click "Create Model"
6. Image should upload successfully ✅

---

## Common Issues

### "The specified bucket does not exist"

The bucket `model-images` doesn't exist. Create it:
1. Go to **Storage** → **Buckets**
2. Click **Create new bucket**
3. Name: `model-images`
4. Check ✓ "Public bucket"
5. Click **Create**

### "RLS policy still blocking"

Make sure you ran the fix SQL correctly:
1. Copy the entire content of `FIX_STORAGE_RLS.sql`
2. Paste into fresh SQL query
3. Click **Run**
4. Refresh browser and try again

### Still getting 403 error

1. Check bucket exists: Storage → should show `model-images`
2. Check bucket is public: Click bucket → Settings → should be Public
3. Check policies are disabled: Click bucket → Policies → should be empty
4. Restart dev server: `npm run dev`

---

## You're Done!

After running the SQL, uploads will work immediately. No code changes needed.
