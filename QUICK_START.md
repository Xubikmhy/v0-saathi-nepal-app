# EscortNepal - Quick Start Guide

## 1. Immediate Actions (Do This First!)

### Step 1: Database Setup
```bash
# Run in Supabase SQL Editor:
# 1. Execute: scripts/SETUP_TABLES.sql
# 2. Execute: scripts/grant-admin.js (or via SystemAction)
```

### Step 2: Verify Environment Variables
Check Vercel project settings → Vars:
- ✓ SUPABASE_URL
- ✓ SUPABASE_ANON_KEY
- ✓ NEXT_PUBLIC_SUPABASE_URL
- ✓ NEXT_PUBLIC_SUPABASE_ANON_KEY
- ✓ SUPABASE_SERVICE_ROLE_KEY

### Step 3: Deploy to Vercel
```bash
git push origin main
# Vercel auto-deploys
```

---

## 2. Testing Without Database (Quick Demo)

The app includes **mock data** that loads automatically if:
- Database is empty, OR
- Database connection fails, OR
- No active hosts exist

**Mock data includes 6 sample models**. All features work perfectly with mock data!

### Test Features Without Database:
- ✓ Home page with featured models
- ✓ Browse page with filtering
- ✓ Click on models → detail page loads
- ✓ WhatsApp contact button works
- ✓ Favorites and discovery features
- ✓ All navigation works

---

## 3. Admin Access (Quickest Path)

### Current Admin User:
- **User ID**: `dea92098-7945-4b6e-9cff-f5b5a54f86ed`
- **Role**: Already set to `agency_admin`
- **Status**: Ready to use

### How to Log In:
1. Go to: `https://your-domain.com/admin/login`
2. Enter your email and password
3. Click "Sign In"
4. You'll be auto-redirected to `/admin` dashboard

### First Time Admin Setup:
If you're setting up a new admin:
```sql
-- Run in Supabase SQL:
UPDATE profiles 
SET role = 'agency_admin' 
WHERE id = 'USER_ID_HERE';
```

---

## 4. What's Fixed - Feature Summary

### No More 404 Errors!
- ✓ Invalid routes redirect to home
- ✓ Missing models redirect to home
- ✓ All errors show recovery options
- ✓ No broken pages anywhere

### Model Clicking
- ✓ Click model card → loads detail page
- ✓ Missing model → redirects home
- ✓ Invalid slug → redirects home
- ✓ All images load with fallback

### Admin Dashboard
- ✓ Can create new models/hosts
- ✓ Can edit existing models
- ✓ Can delete models
- ✓ Can manage blogs, ads, settings
- ✓ Can view user management
- ✓ All operations save to database

---

## 5. Testing Checklist (5 minutes)

### Step 1: Home Page (30 seconds)
- [ ] Go to main page
- [ ] See featured models
- [ ] Click "View Gallery" button
- [ ] Should go to `/browse`

### Step 2: Browse Page (1 minute)
- [ ] See grid of models
- [ ] Use location filter
- [ ] Type in search
- [ ] Results update

### Step 3: Click a Model (2 minutes)
- [ ] Click any model card
- [ ] See detail page with images
- [ ] Click next/prev image arrows
- [ ] WhatsApp button appears
- [ ] "Back to Gallery" link works

### Step 4: Admin Dashboard (2 minutes)
- [ ] Go to `/admin/login`
- [ ] Log in with admin account
- [ ] Should land on dashboard
- [ ] Can see "Host Management" tab
- [ ] Can see "Content Management" tab

### Step 5: Try Admin Features (Optional)
- [ ] Click "Add New Host"
- [ ] Fill in model name, age, location
- [ ] Click Save
- [ ] Go to browse page
- [ ] New model should appear!

---

## 6. Common Issues & Quick Fixes

### "I see mock data on browse page"
✓ **This is normal!** Database might be empty. The app automatically shows mock data. When you add real models via admin, they'll appear instead.

### "Admin login doesn't work"
1. Verify Supabase credentials in environment variables
2. Check user exists in Supabase auth
3. Verify profile exists in database with role='agency_admin'
4. Try logging out and logging back in

### "Models don't show when clicked"
1. Check browser console for errors (F12)
2. Verify model slug is valid
3. Try a different model
4. If all fail, database might be down - should fallback to mock data

### "Admin can't create models"
1. Verify database tables exist (SETUP_TABLES.sql executed?)
2. Check user role is 'agency_admin'
3. Try browser refresh
4. Check Supabase logs for RLS policy violations

### "WhatsApp button not working"
1. This button opens WhatsApp in a new window/tab
2. Check browser allows pop-ups
3. Click should open https://wa.me/PHONENUMBER
4. Test on mobile - works better there

---

## 7. Key URLs

### Public Pages:
- **Home**: `/`
- **Browse**: `/browse`
- **Model Detail**: `/host/SLUG` (e.g., `/host/nepali-model-1`)
- **Discover**: `/discover`
- **Favorites**: `/favorites`
- **Blog**: `/blog`
- **Auth**: `/auth/login`, `/auth/sign-up`

### Admin Pages:
- **Admin Login**: `/admin/login`
- **Admin Dashboard**: `/admin`
- **Not Found**: Falls back to home page

---

## 8. What to Tell Users

### For Customers:
> "Welcome to EscortNepal! Browse our exclusive collection of models. Click any model card to see their full profile, photos, and contact them via WhatsApp."

### For Admins:
> "Log in to the admin dashboard at `/admin` to manage models, content, ads, and site settings. All changes appear live immediately on the website."

---

## 9. Database Seeding (Optional)

To add sample models via database:

```sql
-- Sample INSERT (run in Supabase SQL Editor)
INSERT INTO public.hosts (
  name, slug, age, location, bio, 
  profile_image_url, status, created_at
) VALUES (
  'Priya', 'priya', 23, 'Kathmandu',
  'Professional model for events and photoshoots',
  'https://example.com/image.jpg',
  'active', NOW()
);
```

Or use the admin dashboard UI (easier!)

---

## 10. Next Steps After Deployment

1. **Test all features** ✓
2. **Add your first model** via admin dashboard
3. **Take screenshots** for marketing
4. **Share link** with customers
5. **Monitor Supabase logs** for errors
6. **Gather feedback** and iterate

---

## Useful Links

- **Supabase Dashboard**: https://supabase.com/
- **Vercel Dashboard**: https://vercel.com/
- **GitHub Repo**: Check settings
- **Error Logs**: Vercel Deployments tab
- **Database Logs**: Supabase → Logs

---

**You're all set! The app is ready to deploy and fully functional.**
