# Quick Start Guide

## 1. Environment Setup (One-Time)

The environment variables are already configured in your Vercel project:
- ✅ `ADMIN_EMAIL` 
- ✅ `ADMIN_PASSWORD`
- ✅ `NEXT_PUBLIC_SUPABASE_URL`
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 2. Database Setup (Already Done ✅)

Run once to create tables and storage:
```bash
cd /vercel/share/v0-project
node --env-file=.env.development.local scripts/setup-db.js
```

This creates:
- `models` table in Supabase
- `model-images` storage bucket

## 3. Add Your First Model

1. **Open Admin**: Visit `https://your-domain.com/admin/login`

2. **Login**:
   - Email: Your `ADMIN_EMAIL`
   - Password: Your `ADMIN_PASSWORD`

3. **Create Model**:
   - Click "Add Model" tab
   - Fill in name (required), age, city, bio, WhatsApp
   - Upload profile image
   - Check "Featured Model" to show on homepage
   - Click "Create Model"

4. **View Models**:
   - Homepage: Shows featured models
   - Browse: Shows all models
   - Discover: Shows featured models only

## 4. Manage Models

From admin dashboard:
- **Edit**: Click pencil icon, modify fields, click update
- **Delete**: Click trash icon, confirm deletion
- **Upload Photos**: Select image and upload anytime

## 5. WhatsApp Integration

Models' WhatsApp numbers are displayed as buttons on their cards. Visitors can:
1. Click the WhatsApp button on any model card
2. Get redirected to WhatsApp with a pre-filled message
3. Contact the model directly

**Important**: WhatsApp numbers must be stored with country code (e.g., `+977XXXXXXXXXX` for Nepal)

## Available Pages

| Page | URL | Description |
|------|-----|-------------|
| Homepage | `/` | Featured models only |
| Browse All | `/browse` | All models in database |
| Discover | `/discover` | Featured models (alternative view) |
| Admin Login | `/admin/login` | Admin authentication |
| Admin Dashboard | `/admin` | CRUD management (requires login) |

## Common Tasks

### Add a new model
1. Go to `/admin` → "Add Model" tab
2. Fill in details and upload image
3. Click "Create Model"

### Feature a model
1. Edit the model
2. Check "Featured Model"
3. Click "Update"
4. Model now appears on homepage

### Change WhatsApp number
1. Edit the model
2. Update WhatsApp field
3. Click "Update"

### Delete a model
1. Go to "Models" tab
2. Click trash icon on model card
3. Confirm deletion

## Troubleshooting

**Can't login?**
- Check email matches `ADMIN_EMAIL` exactly (case-sensitive)
- Check password matches `ADMIN_PASSWORD` exactly
- Verify env vars are set in Vercel project settings

**Images won't upload?**
- Ensure image is under 5MB
- Try JPG or PNG format
- Check browser console for errors

**WhatsApp links broken?**
- Verify WhatsApp number includes country code (+977...)
- Test link manually in browser
- Numbers must be in international format

**Models not showing on homepage?**
- Mark models as "Featured" when creating/editing
- Check homepage at `/` (not `/admin`)

## File Locations

- Admin login: `app/admin/login/page.tsx`
- Admin dashboard: `app/admin/page.tsx`
- Homepage: `app/page.tsx`
- Model card: `components/model-card.tsx`
- API endpoints: `app/api/models/` and `app/api/admin/`

## Next Steps

1. ✅ Deploy to Vercel using the "Publish" button
2. ✅ Set custom domain in Vercel project settings
3. ✅ Test all functionality on live site
4. ✅ Share admin login with team members
5. ✅ Monitor models and update profiles regularly

## Support

For detailed setup information, see `SETUP_GUIDE.md`
For what changed in this rebuild, see `CLEANUP_SUMMARY.md`
