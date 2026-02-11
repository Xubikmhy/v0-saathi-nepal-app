# Supabase Storage Bucket Setup Guide

## Overview
This guide explains how to set up the Supabase Storage bucket for managing escort profile images.

## Creating the Bucket in Supabase Console

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **Create a new bucket**
4. Name it: `escort-images`
5. Make it **Public** (uncheck "Make it private")
6. Click **Create bucket**

## Bucket Configuration

### RLS Policies
Add the following policies to the `escort-images` bucket:

#### Public Read Policy (Authenticated and Public)
```sql
CREATE POLICY "Public Read Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'escort-images');
```

#### Admin Upload Policy
```sql
CREATE POLICY "Admin Upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'escort-images' AND 
  auth.role() = 'authenticated'
);
```

#### Admin Update Policy
```sql
CREATE POLICY "Admin Update"
ON storage.objects FOR UPDATE
USING (bucket_id = 'escort-images')
WITH CHECK (bucket_id = 'escort-images');
```

#### Admin Delete Policy
```sql
CREATE POLICY "Admin Delete"
ON storage.objects FOR DELETE
USING (bucket_id = 'escort-images');
```

## Image Upload Workflow

### Upload Endpoint
```
POST /api/upload/image
Content-Type: multipart/form-data

Parameters:
- file: File (image file)
- folder: string (optional, e.g., "hosts", "ads", "blogs")
- name: string (optional, custom name)
```

### Example Usage (Frontend)
```typescript
import { uploadImage } from '@/lib/services/images'

const formData = new FormData()
formData.append('file', imageFile)
formData.append('folder', 'hosts')
formData.append('name', 'jane-doe-profile')

const response = await uploadImage(formData)
// Returns: { url: 'https://...', path: 'hosts/jane-doe-profile.jpg' }
```

### Example Usage (Node.js/Backend)
```typescript
const fs = require('fs')
const path = require('path')

const filePath = path.join(process.cwd(), 'public', 'sample.jpg')
const fileBuffer = fs.readFileSync(filePath)

const formData = new FormData()
formData.append('file', new Blob([fileBuffer], { type: 'image/jpeg' }))
formData.append('folder', 'hosts')
formData.append('name', 'sample-profile')

const response = await fetch('/api/upload/image', {
  method: 'POST',
  body: formData,
})
```

## Image Management APIs

### List Images
```
GET /api/images?folder=hosts&limit=50&offset=0
```

### Delete Image
```
DELETE /api/images
Body: { path: "hosts/image-name.jpg" }
```

### Update Host with Images
```
PATCH /api/admin/hosts/{id}
Body: {
  profile_image_url: "https://...",
  gallery_urls: ["https://...", "https://..."]
}
```

## Storage Structure

```
escort-images/
├── hosts/
│   ├── jane-doe-profile.jpg
│   ├── jane-doe-gallery-1.jpg
│   └── jane-doe-gallery-2.jpg
├── ads/
│   ├── banner-1.jpg
│   └── banner-2.jpg
├── blogs/
│   ├── post-1-cover.jpg
│   └── post-2-cover.jpg
└── site/
    └── logo.png
```

## Admin Data Management

### Access Admin Dashboard
1. Go to `/admin/login`
2. Login with admin credentials
3. Access the admin panel at `/admin/dashboard`

### Edit Host Profiles
1. Navigate to **Manage Hosts**
2. Click on a host to edit
3. Upload/change images
4. Update profile information
5. Save changes

### Upload Images
1. Click on any host/ad/blog
2. Click **Upload Image**
3. Select image file
4. Image is automatically saved to bucket
5. URL is added to profile

## Best Practices

1. **Image Formats**: Use JPEG or WebP for photos
2. **Image Size**: Compress images before upload (max 5MB)
3. **File Naming**: Use descriptive names (jane-doe-profile, not image1)
4. **Folders**: Organize by content type (hosts, ads, blogs)
5. **Cleanup**: Delete unused images to save storage
6. **Backups**: Regularly backup important images

## Troubleshooting

### Images Not Uploading
- Check bucket exists and is public
- Verify RLS policies are correct
- Check file size (max 5MB)
- Ensure proper Content-Type header

### Images Not Displaying
- Verify image URL is correct
- Check bucket name in URL
- Ensure RLS allows public read
- Clear browser cache

### Storage Quota Issues
- Check Supabase plan limits
- Delete unused images
- Compress images before upload
- Consider upgrading plan

## Environment Variables

Add to `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key
```

## API Reference

See `BACKEND_IMPLEMENTATION.md` for complete API documentation.
