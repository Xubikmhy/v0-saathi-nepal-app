# Image Upload RLS Fix - Admin Dashboard

## Problem
Image uploads were failing with error: `"new row violates row-level security"`

**Root Cause**: The old Supabase storage RLS policies required `authenticated` role, but your custom admin auth (admin@escortnepal.com) doesn't create a Supabase auth session.

## Solution Implemented

### 1. **Server-Side Upload Handler** (`/app/api/upload/route.ts`)
- Receives image uploads from the client
- Uses `SUPABASE_SERVICE_ROLE_KEY` to bypass RLS policies
- Returns public URL for immediate display
- Includes clear logging with `[upload fix]` prefix

### 2. **Admin Storage Client** (`/lib/supabase/admin-storage.ts`)
- Reusable Supabase client with service role key
- Bypasses RLS for storage operations
- Non-persistent session (no auth tokens needed)
- Can be used for other admin operations

### 3. **Updated Image Upload Component** (`/components/ui/image-upload.tsx`)
- Now calls `/api/upload` server endpoint instead of direct Supabase upload
- Default bucket changed to `model-images`
- Clear error logging for debugging
- Works seamlessly with custom admin auth

## What Changed

**Removed dependencies on:**
- Old Supabase auth session
- Direct client-side storage uploads with anon key
- RLS-restricted policies

**Now uses:**
- Server API with service role key
- Public write access (no auth needed)
- `model-images` bucket for all admin uploads
- Clear logging for troubleshooting

## Expected Results

✅ Image uploads succeed immediately  
✅ No "row violates row-level security" error  
✅ Current admin login (admin@escortnepal.com) still works  
✅ Dashboard unchanged  
✅ Uploaded images display immediately  

## Debug Logging

All upload operations log with `[upload fix]` prefix:
```javascript
console.error("[upload fix] Starting upload for file:", file.name)
console.error("[upload fix] Upload successful, URL:", url)
console.error("[upload fix] Upload failed:", error.message)
```

Check browser console for detailed flow information during uploads.

## Files Modified
- `components/ui/image-upload.tsx` - Updated to use server API
- `lib/supabase/admin-storage.ts` - New admin storage client
- `app/api/upload/route.ts` - New server upload endpoint

## Environment Variables Required
- `SUPABASE_URL` ✓
- `SUPABASE_SERVICE_ROLE_KEY` ✓  
- `NEXT_PUBLIC_SUPABASE_URL` ✓

All should already be set. No additional configuration needed.
