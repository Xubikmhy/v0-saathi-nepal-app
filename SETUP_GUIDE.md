# Models Nepal - Setup Guide

This guide walks you through the complete setup of your Models Nepal application.

## What's Been Set Up

✅ **Database**: Supabase `models` table with the following fields:
- `id` (UUID, primary key)
- `name` (text)
- `age` (integer)
- `city` (text)
- `bio` (text)
- `whatsapp` (text)
- `image_url` (text)
- `is_featured` (boolean)
- `created_at` (timestamp)
- `updated_at` (timestamp)

✅ **Storage**: `model-images` bucket for image uploads

✅ **Authentication**: Simple password-based admin login using environment variables

✅ **Frontend**: 
- Homepage with featured models from the database
- Browse page with all models
- Discover page with featured models only
- Model cards displaying profile information with WhatsApp contact button

✅ **Admin Dashboard** (`/admin`):
- Add new models with profile details
- Upload profile images
- Edit model information
- Delete models
- Mark models as featured

## Environment Variables Required

Make sure these are set in your project:

```
ADMIN_EMAIL=your-admin@email.com
ADMIN_PASSWORD=your-secure-password
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

The Supabase environment variables should already be configured if you've connected a Supabase project.

## Getting Started

### 1. Add Your First Model

1. Go to `https://your-domain.com/admin/login`
2. Enter your `ADMIN_EMAIL` and `ADMIN_PASSWORD`
3. Click "Add Model" tab
4. Fill in the model details:
   - Name (required)
   - Age (optional)
   - City (optional)
   - Bio (optional)
   - WhatsApp number (optional, with country code)
   - Upload profile image
   - Check "Featured Model" if you want it on the homepage
5. Click "Create Model"

### 2. View Models

- **Homepage**: Featured models appear automatically
- **Browse Page** (`/browse`): All models in the system
- **Discover Page** (`/discover`): Only featured models
- **Model Details**: Click WhatsApp button on any card to contact directly

### 3. Manage Models

From the admin dashboard:
- **Edit**: Click the edit icon and modify any field
- **Delete**: Click the delete icon (with confirmation)
- **Upload Photos**: Replace profile images anytime
- **Toggle Featured**: Mark models as featured to show on homepage

## File Structure

```
app/
├── page.tsx                 # Homepage with featured models
├── browse/page.tsx         # Browse all models
├── discover/page.tsx       # Discover featured models
├── admin/
│   ├── page.tsx           # Admin dashboard
│   └── login/page.tsx     # Admin login page
└── api/
    ├── admin/
    │   ├── login/route.ts # Admin authentication
    │   └── upload/route.ts # Image upload
    └── models/
        ├── route.ts        # GET all models, POST new model
        └── [id]/route.ts   # PUT/DELETE individual models

components/
├── model-card.tsx          # Model card display
├── site-header.tsx        # Navigation header
└── site-footer.tsx        # Footer

lib/
├── types.ts               # TypeScript interfaces
└── supabase/
    ├── client.ts          # Client-side Supabase
    └── server.ts          # Server-side Supabase
```

## Features

### For Users
- 🎴 Browse beautiful model profiles
- 💬 Contact models directly via WhatsApp
- ⭐ View featured models on homepage
- 📱 Fully responsive design

### For Admins
- ➕ Add new model profiles
- 📝 Edit model information
- 🖼️ Upload profile images to Supabase Storage
- 🗑️ Delete profiles
- ⭐ Mark models as featured

## Troubleshooting

**Admin login not working?**
- Check that `ADMIN_EMAIL` and `ADMIN_PASSWORD` environment variables are set
- Verify the email and password match exactly

**Images not uploading?**
- Ensure Supabase Storage bucket `model-images` exists
- Check that storage bucket has public read access configured

**Models not appearing?**
- Make sure models are marked as `is_featured = true` to appear on homepage
- Check the database directly in Supabase dashboard

**WhatsApp contact not working?**
- Verify WhatsApp number is stored with country code (e.g., +977...)
- Test the WhatsApp link manually to ensure format is correct

## Next Steps

1. **Customize branding**: Update logo, colors, and text as needed
2. **Configure admin credentials**: Set strong credentials for production
3. **Add storage policies**: Configure RLS (Row Level Security) if needed
4. **Deploy to Vercel**: Use the "Publish" button in v0 or deploy via Git
5. **Set up domain**: Configure your custom domain on Vercel

## Support

For issues with:
- **Supabase**: Check the Supabase dashboard or docs
- **Next.js**: Visit nextjs.org for framework-specific help
- **Vercel**: Contact Vercel support or check vercel.com/help
