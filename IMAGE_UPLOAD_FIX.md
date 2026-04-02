# Image Upload Fix - Model Images Storage

## Problem
Image uploads in the admin dashboard were failing with RLS/storage permission errors when trying to upload model images.

## Solution
This fix implements proper image upload configuration for the `model-images` storage bucket with correct RLS policies and improved error handling.

## What Changed

### 1. Created New Storage Bucket: `model-images`
- **File**: `scripts/009_create_model_images_bucket.sql`
- Creates a public storage bucket specifically for model/host profile images
- Bucket is public so images can be viewed without authentication

### 2. Added RLS Policies for model-images Bucket
- **File**: `scripts/010_storage_policies_model_images.sql`
- Defines Row Level Security policies:
  - **Public Read**: Anyone can view images in the bucket
  - **Authenticated Insert**: Authenticated users (admin) can upload images
  - **Authenticated Update**: Authenticated users can update/replace images
  - **Authenticated Delete**: Authenticated users can delete images

### 3. Updated ImageUpload Component
- **File**: `components/ui/image-upload.tsx`
- Changed default bucket from `uploads` to `model-images`
- Added file type validation (only image/* MIME types allowed)
- Improved timestamp-based filename generation (prevents collisions)
- Added detailed error logging with `console.log('[v0 upload]')`
- Enhanced error messages for better debugging
- Added cacheControl for better CDN performance
- Immediate preview update after successful upload

### 4. Setup Scripts
- **File**: `scripts/setup_model_images.js` - Creates the bucket
- **File**: `scripts/apply_model_images_policies.js` - Checks and documents policies

## Implementation Details

### Upload Flow
1. Admin selects an image file
2. File type validation checks it's an image
3. Filename generated with timestamp and random suffix: `{timestamp}-{random}.{ext}`
4. File uploaded to `model-images` bucket with cache control
5. Public URL generated from bucket
6. URL saved to host's `profile_image_url` or `gallery_urls`
7. Form data submitted with image URLs
8. Database saves the `profile_image_url` or appends to `gallery_urls` array

### Error Handling
All errors are logged with `[v0 upload]` prefix for easy debugging:
```
console.error('[v0 upload]', error)
```

If upload fails, users see a toast error with the specific error message.

## Setup Instructions

### Option 1: Automatic (via Node.js)
```bash
cd /vercel/share/v0-project
node --env-file=.env.development.local scripts/setup_model_images.js
```

### Option 2: Manual via Supabase Dashboard
The `model-images` bucket should already exist. If you need to apply RLS policies manually:

1. Go to Supabase Dashboard → Storage
2. Click on `model-images` bucket
3. Click "Policies" tab
4. Create these policies:

**Policy 1: model_images_public_read**
- Operation: SELECT
- Using: `(bucket_id = 'model-images')`

**Policy 2: model_images_authenticated_insert**
- Operation: INSERT
- Role: authenticated
- Using: `(bucket_id = 'model-images')`

**Policy 3: model_images_authenticated_update**
- Operation: UPDATE
- Role: authenticated
- Using: `(bucket_id = 'model-images')`
- With check: `(bucket_id = 'model-images')`

**Policy 4: model_images_authenticated_delete**
- Operation: DELETE
- Role: authenticated
- Using: `(bucket_id = 'model-images')`

## Testing

### Admin Upload Flow
1. Login to admin dashboard
2. Go to Host Management
3. Click "Add Host" or "Edit Host"
4. In the "Profile Image" section, click "Upload Image"
5. Select a PNG/JPG image
6. Watch console for `[v0 upload]` logs
7. Image preview should appear immediately
8. Click "Create Host" or "Update Host"
9. Image URL should be saved to database

### Verify in Database
Check that `profile_image_url` contains a URL like:
```
https://{PROJECT_ID}.supabase.co/storage/v1/object/public/model-images/{timestamp}-{random}.{ext}
```

### Verify on Homepage
- Go to homepage/browse page
- Model cards should display the uploaded images
- Images should load without CORS errors

## Debugging

If uploads still fail:

1. **Check CloudConsole Logs**
   - Look for `[v0 upload]` messages
   - Check for specific error messages

2. **Verify Authentication**
   - Ensure admin user is logged in with `agency_admin` role
   - Check that `auth.users` session is active

3. **Check RLS Policies**
   - Verify policies exist in Supabase Storage → Policies
   - Check bucket is set to public

4. **Verify CORS**
   - Check Supabase project CORS settings
   - Usually CORS is automatically configured, but verify in Project Settings

5. **Check Storage Usage**
   - Verify bucket storage quota isn't exceeded
   - Check file size limits (default 10MB)

## Database Schema
The hosts table stores images as:
- `profile_image_url`: TEXT (single profile image)
- `gallery_urls`: TEXT[] (array of gallery images)

Example:
```sql
INSERT INTO hosts (name, slug, profile_image_url, gallery_urls)
VALUES (
  'John Guide',
  'john-guide',
  'https://{PROJECT_ID}.supabase.co/storage/v1/object/public/model-images/1234567890-abc123.jpg',
  ARRAY[
    'https://{PROJECT_ID}.supabase.co/storage/v1/object/public/model-images/1234567890-xyz789.jpg',
    'https://{PROJECT_ID}.supabase.co/storage/v1/object/public/model-images/1234567890-def456.jpg'
  ]
)
```

## File Structure
```
/scripts/
  - 009_create_model_images_bucket.sql (create bucket)
  - 010_storage_policies_model_images.sql (RLS policies)
  - setup_model_images.js (automated setup)
  - apply_model_images_policies.js (policy checker)

/components/ui/
  - image-upload.tsx (fixed component with error logging)
```

## Notes

- ✅ Admin login still works
- ✅ Add/edit/delete models still works
- ✅ Supabase models table still works
- ✅ Image upload now works with model-images bucket
- ✅ Existing dashboard UI unchanged
- ✅ Working CRUD logic untouched
- ✅ Image preview updates immediately after upload
- ✅ Proper error logging for debugging
- ✅ Public image URLs correctly generated

## Related Files
- Admin hosts component: `components/admin/admin-hosts.tsx`
- Model card display: `components/model-card.tsx`
- Model detail view: `components/model-detail.tsx`
- Database types: `lib/types.ts`
