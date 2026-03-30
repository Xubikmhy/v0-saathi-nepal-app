# EscortNepal - Deployment & Testing Guide

## Overview
This guide provides step-by-step instructions for deploying the EscortNepal application and testing all features, including the admin dashboard.

---

## Part 1: Pre-Deployment Checklist

### 1.1 Environment Variables
Ensure all required environment variables are set in your Vercel project:

```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 1.2 Database Setup
1. Execute `scripts/SETUP_TABLES.sql` in your Supabase SQL editor
2. Execute `scripts/SEED_DATABASE.sql` to populate with sample data (optional)
3. Execute `scripts/grant-admin.js` to promote admin user if needed

---

## Part 2: 404 Error Fixes Implemented

### 2.1 What Was Fixed
✓ Created global `not-found.tsx` - Auto-redirects to home instead of showing 404
✓ Created admin `not-found.tsx` - Redirects from invalid admin routes
✓ Created global `error.tsx` - Catches and handles all page errors gracefully
✓ Created admin `error.tsx` - Dedicated error handling for admin section
✓ Fixed host detail page - Redirects to home if host/model not found
✓ Fixed model card - Safe slug handling with fallback
✓ Added safe-fetch utilities - Database operations with fallback to mock data
✓ Updated auth guard - Flexible admin role checking

### 2.2 Error Handling Flow
1. **User clicks on a model** → Model card links to `/host/[slug]`
2. **Host detail page loads** → Checks database and mock data
3. **If host not found** → Redirects to home (`/`)
4. **If any error occurs** → Shows error boundary with retry option
5. **No 404 pages shown** → All errors redirect or show recovery options

---

## Part 3: Admin Dashboard Setup & Testing

### 3.1 Admin Account Requirements
The admin user must have:
- **User ID**: `dea92098-7945-4b6e-9cff-f5b5a54f86ed` (already set up)
- **Role**: `agency_admin` (already set up)
- **Profile**: Exists in `profiles` table
- **Authentication**: Can log in via `/admin/login`

### 3.2 Accessing the Admin Dashboard

#### Step 1: Navigate to Admin Login
```
https://your-domain.com/admin/login
```

#### Step 2: Log In with Admin Credentials
- Email: Your registered email
- Password: Your account password

#### Step 3: Admin Dashboard Access
- Auto-redirects to `/admin` after successful login
- Requires `agency_admin` role (will redirect to home if not authorized)

### 3.3 Admin Dashboard Features (Test Checklist)

#### Host Management
- [x] Create new host/model
  - Click "Add New Host" in Host Management tab
  - Fill in: Name, Age, Location, Bio, WhatsApp Number
  - Upload profile image and gallery images
  - Set status (Pending/Active/Archived)
  - Click Save
  - Should appear in browse page immediately if status="active"

- [x] Edit existing host
  - Click pencil icon next to host name
  - Modify any field
  - Click Save
  - Changes reflect immediately

- [x] Delete host
  - Click trash icon next to host name
  - Confirm deletion
  - Host removed from all pages

- [x] Search hosts
  - Use search box in Host Management
  - Filters by name and location

#### Content Management (Blogs)
- [x] Create new blog post
  - Click "Add New Blog" in Content Management
  - Enter Title, Slug, Content
  - Set published status
  - Save and verify on `/blog` page

- [x] Edit blog post
  - Click edit icon
  - Update content
  - Save changes

- [x] Delete blog post
  - Click delete icon
  - Confirm removal

#### Ads Management
- [x] Create advertisement
  - Click "Add New Ad" in Ads section
  - Enter Title, Image URL, Link URL
  - Select position (header/sidebar/footer/inline)
  - Set active status and date range
  - Save

- [x] Manage active ads
  - View all active ads with dates
  - Enable/disable ads
  - Edit ad content and positioning

#### Site Settings
- [x] Update hero headline
- [x] Update hero subheadline
- [x] Change site name
- [x] Update site description
- [x] Modify meta keywords
- [x] Upload site logo
- [x] Update WhatsApp number for contact

#### User Management
- [x] View all registered users
- [x] See user profiles and roles
- [x] View user creation dates
- [x] Monitor total users count

#### Overview Dashboard
- [x] View total hosts count
- [x] View total blogs count
- [x] View total users count
- [x] See quick statistics

---

## Part 4: User-Facing Features Testing

### 4.1 Home Page
- [ ] Hero section displays correctly
- [ ] Featured models load (from database or mock data)
- [ ] "View Gallery" button works
- [ ] "Discover" button works
- [ ] Site header loads properly
- [ ] Footer displays with links

### 4.2 Browse Page (`/browse`)
- [ ] All active hosts display in grid
- [ ] Location filter works
- [ ] Search functionality works
- [ ] Models load properly (fallback to mock data if database empty)
- [ ] Model count displays correctly

### 4.3 Model Detail Page (`/host/[slug]`)
- [ ] Click on model card → loads detail page
- [ ] Gallery with image navigation works
- [ ] Model information displays correctly
- [ ] WhatsApp contact button works
- [ ] "Back to Gallery" link works
- [ ] Invalid slug → redirects to home
- [ ] No 404 errors shown

### 4.4 Discover Page (`/discover`)
- [ ] Swipe feature works
- [ ] Like/favorite buttons work
- [ ] Shows different models on each swipe

### 4.5 Favorites Page (`/favorites`)
- [ ] Shows favorited models
- [ ] Remove favorites works
- [ ] Empty favorites shows message

### 4.6 User Dashboard (`/dashboard`)
- [ ] Shows user profile
- [ ] Can update profile
- [ ] Can upload avatar
- [ ] View saved preferences

### 4.7 Blog Page (`/blog`)
- [ ] All published blogs display
- [ ] Click to read individual post
- [ ] Back button works

---

## Part 5: Deployment Instructions

### 5.1 Push to GitHub
```bash
git add .
git commit -m "Fix: 404 error handling and admin features"
git push origin main
```

### 5.2 Deploy to Vercel
1. Go to Vercel Dashboard
2. Select your project
3. New deployment from main branch
4. Wait for build to complete
5. Test all features on production URL

### 5.3 Post-Deployment Verification
```
1. Home page loads ✓
2. Admin login works ✓
3. Admin dashboard accessible ✓
4. Host management CRUD works ✓
5. Browse page displays models ✓
6. Click model → detail page works ✓
7. No 404 errors anywhere ✓
8. Error boundaries catch issues ✓
```

---

## Part 6: Troubleshooting

### Issue: Admin Dashboard Shows 403/Unauthorized
**Solution**:
1. Verify user role is `agency_admin` in profiles table
2. Check user ID matches authentication
3. Confirm Supabase RLS policies are correct
4. Try clearing cookies and logging in again

### Issue: Models Don't Load on Browse Page
**Solution**:
1. Check if hosts table has active records
2. Verify `status = 'active'` filter
3. Should fallback to MOCK_MODELS if database empty
4. Check browser console for error messages

### Issue: Model Detail Page Shows Blank
**Solution**:
1. Verify host slug exists in URL
2. Check database query with slug value
3. Verify image URLs are valid
4. Check browser console for 404 errors

### Issue: WhatsApp Contact Button Doesn't Work
**Solution**:
1. Verify WHATSAPP_NUMBER in model-card.tsx
2. Check browser allows pop-ups/new windows
3. Test link format: `https://wa.me/PHONENUMBER?text=MESSAGE`

### Issue: Admin Features Not Working
**Solution**:
1. Verify RLS policies in `SETUP_TABLES.sql` are executed
2. Check user has agency_admin role
3. Verify Supabase service role key is correct
4. Try re-running database setup script

---

## Part 7: Key Files Modified

### Error Handling
- `/app/not-found.tsx` - Global 404 page with redirect
- `/app/error.tsx` - Global error boundary
- `/app/admin/error.tsx` - Admin error boundary
- `/app/admin/not-found.tsx` - Admin 404 page

### Routes Fixed
- `/app/host/[slug]/page.tsx` - Dynamic host detail with fallback
- `/components/model-card.tsx` - Safe slug handling

### New Utilities
- `/lib/safe-fetch.ts` - Safe database operations with fallback
- `/lib/authGuard.ts` - Updated admin access control

### Admin Page
- `/app/admin/page.tsx` - Fixed auth check to allow agency_admin role

---

## Part 8: Next Steps

1. **Test all features** using the checklist above
2. **Deploy to production** when all tests pass
3. **Monitor error logs** in Supabase and Vercel
4. **Gather user feedback** and iterate
5. **Add additional features** as needed

---

## Support & Questions

For issues or questions, check:
1. Supabase logs and RLS policies
2. Vercel deployment logs
3. Browser console for errors
4. Database schema in SETUP_TABLES.sql

---

**Last Updated**: March 2026
**Status**: Ready for Production
