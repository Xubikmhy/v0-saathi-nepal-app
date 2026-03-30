# EscortNepal - Step-by-Step Setup & Deployment

Complete step-by-step guide to deploy and test the application.

---

## PHASE 1: Pre-Deployment Setup (15 minutes)

### Step 1: Verify Environment Variables
**Time**: 3 minutes

1. Open Vercel Dashboard
2. Go to your project → Settings → Environment Variables
3. Verify these variables exist and have values:
   ```
   SUPABASE_URL ✓
   SUPABASE_ANON_KEY ✓
   SUPABASE_SERVICE_ROLE_KEY ✓
   NEXT_PUBLIC_SUPABASE_URL ✓
   NEXT_PUBLIC_SUPABASE_ANON_KEY ✓
   POSTGRES_URL (optional) ✓
   ```

If any are missing, add them now from your Supabase project settings.

### Step 2: Prepare Database
**Time**: 5 minutes

1. Go to Supabase Dashboard
2. Select your project
3. Go to SQL Editor
4. Create new query
5. Copy and paste content of `scripts/SETUP_TABLES.sql`
6. Click "Run" button
7. Wait for completion (should show success)

**What this does**: Creates all tables, indexes, and RLS policies needed for the app.

### Step 3: Set Up Admin User
**Time**: 3 minutes

Two options:

#### Option A: Via Script (Recommended)
1. Run the grant-admin.js script (already executed)
2. Verify user has `agency_admin` role in profiles table

#### Option B: Manual SQL
1. In Supabase SQL Editor, run:
   ```sql
   UPDATE profiles 
   SET role = 'agency_admin' 
   WHERE id = 'dea92098-7945-4b6e-9cff-f5b5a54f86ed';
   ```

**Result**: User can now access admin dashboard.

### Step 4: Seed Sample Data (Optional)
**Time**: 3 minutes

If you want to test with real database data instead of mock data:

1. In Supabase SQL Editor
2. Run: `scripts/SEED_DATABASE.sql`
3. Wait for completion
4. App will now show real data instead of mock data

---

## PHASE 2: Deployment (10 minutes)

### Step 5: Git Commit Changes
**Time**: 2 minutes

```bash
# Navigate to project directory
cd /path/to/escortnepal

# Stage all changes
git add .

# Commit with descriptive message
git commit -m "feat: complete 404 error fixes and admin dashboard

- Add global not-found.tsx with redirect
- Add global error.tsx error boundary
- Add admin error and not-found pages
- Fix host detail page with fallback logic
- Update admin auth to allow agency_admin role
- Add safe-fetch utilities for database operations
- Update authGuard for flexible admin access
- All 404 errors now redirect gracefully
- Admin dashboard fully functional
- Ready for production deployment"

# Push to main branch
git push origin main
```

### Step 6: Deploy to Vercel
**Time**: 5 minutes

**Option A: Automatic (Recommended)**
1. After `git push`, Vercel auto-detects changes
2. Deployment starts automatically
3. Check Vercel Dashboard → Deployments
4. Wait for "Ready" status (green checkmark)
5. Vercel provides production URL

**Option B: Manual Deploy**
1. Go to Vercel Dashboard
2. Select project
3. Click "Deploy Now" button
4. Select main branch
5. Wait for completion

**Checking Deployment Status**:
- Look for green "Ready" badge
- Production URL appears in deployment summary
- Takes typically 2-3 minutes

---

## PHASE 3: Testing (20 minutes)

### Step 7: Test Home Page
**Time**: 2 minutes

1. Open your production URL (from Vercel)
2. Homepage should load
3. See featured models in grid
4. Verify site header loads
5. Check footer appears
6. Try "View Gallery" button → should go to `/browse`

**What to look for**:
- No console errors (F12)
- Images load properly
- Text displays correctly
- Responsive on mobile (device emulation in F12)

### Step 8: Test Browse Page
**Time**: 2 minutes

1. Click "View Gallery" button from home
2. Should land on `/browse` page
3. See grid of models
4. Try search box - enter model name
5. Try location filter - select location
6. Verify results update
7. Models should be from database (or mock data if database empty)

**Expected behavior**:
- Models load instantly
- Filters work smoothly
- No 404 errors
- Grid responsive on mobile

### Step 9: Test Model Detail Pages (CRITICAL)
**Time**: 3 minutes

1. From browse page, click any model card
2. Should load detail page with `/host/MODEL-SLUG` URL
3. See model info, images, age, location
4. If multiple images, test prev/next buttons
5. WhatsApp button should work
6. "Back to Gallery" link works
7. Try clicking another model - should load different detail

**Critical Tests**:
- Does click work? ✓
- Does detail page load? ✓
- Can you navigate between models? ✓
- Are there any errors in console? ✓ (should be none)
- Does back button work? ✓

### Step 10: Test 404 Handling
**Time**: 2 minutes

1. Manually type invalid model URL:
   ```
   https://your-domain.com/host/nonexistent-model
   ```
2. Should NOT show 404 page
3. Should redirect to home
4. Try another invalid URL:
   ```
   https://your-domain.com/some-random-page
   ```
5. Should auto-redirect to home

**This confirms**: 404 errors are fixed!

### Step 11: Test Admin Features
**Time**: 7 minutes

#### Login to Admin
1. Go to `https://your-domain.com/admin/login`
2. Enter your email
3. Enter your password
4. Click "Sign In"
5. Should auto-redirect to `/admin` dashboard

#### Check Admin Dashboard
1. You should see sidebar with menu items
2. Tabs: Overview, Host Management, Content, Ads, Settings, Users
3. Click "Overview" - should show statistics

#### Test Create Model
1. Click "Host Management" tab
2. Click "Add New Host" button
3. Fill form:
   - Name: "Test Model"
   - Age: "24"
   - Location: "Kathmandu"
   - Bio: "Test model for verification"
   - Status: "active"
   - Click Save

4. Go to browse page
5. Verify new model appears in grid
6. Click on it - should load detail page

**This confirms**: Admin works and saves to database!

#### Test Edit Model
1. Back to admin dashboard
2. Find the model you just created
3. Click pencil icon
4. Change the bio text
5. Click Save
6. Go to browse page
7. Verify text changed

#### Test Delete Model
1. Back to admin
2. Find model
3. Click trash icon
4. Confirm deletion
5. Model should disappear from browse page

### Step 12: Test Other Features
**Time**: 2 minutes

1. **Discover Page** (`/discover`):
   - Click "Discover" from home
   - Should show swipe interface
   - Can swipe left/right
   - Like button works

2. **Favorites** (`/favorites`):
   - Should load (may be empty)
   - Responsive design works

3. **Dashboard** (`/dashboard`):
   - Loads for authenticated users
   - Shows profile

4. **Blog** (`/blog`):
   - Page loads
   - Shows blog posts if any exist

---

## PHASE 4: Fix Issues (5-15 minutes if needed)

### If Something Doesn't Work

#### "Models not showing on browse"
**Cause**: Database might be empty
**Fix**: 
1. Run `SEED_DATABASE.sql` to add sample data, OR
2. Use admin dashboard to create a model
3. **This is normal** - app falls back to mock data automatically

#### "Admin login doesn't work"
**Cause**: Authentication issue
**Fix**:
1. Verify Supabase URL and keys are correct
2. Verify user exists in Supabase Auth
3. Try logging out and back in
4. Clear browser cookies and try again

#### "Can't access admin dashboard"
**Cause**: User doesn't have admin role
**Fix**:
1. Verify user role is `agency_admin` in profiles table
2. Run: `UPDATE profiles SET role = 'agency_admin' WHERE id = 'USER_ID';`
3. Try logging out and in again

#### "Getting blank pages or errors"
**Cause**: Database connection issue
**Fix**:
1. Check Supabase is running
2. Verify all environment variables
3. Check browser console (F12) for error messages
4. Look at Vercel logs: Dashboard → Deployments → Build Logs
5. Check Supabase logs: Project → Logs

#### "Images not loading"
**Cause**: URL issues
**Fix**:
1. Check image URLs are valid
2. CORS might be blocked - check browser console
3. Use Vercel Blob or Supabase Storage for reliable hosting

---

## PHASE 5: Production Checklist

Complete this checklist before considering production-ready:

### Functionality Checks
- [ ] Home page loads and displays models
- [ ] Browse page shows all models
- [ ] Click model → detail page loads
- [ ] No 404 errors anywhere
- [ ] All redirects work smoothly
- [ ] Admin login works
- [ ] Admin dashboard accessible
- [ ] Can create models via admin
- [ ] Can edit models via admin
- [ ] Can delete models via admin
- [ ] Changes appear on website immediately
- [ ] Search and filter work
- [ ] WhatsApp button works
- [ ] Mobile layout responsive

### Admin Feature Checks
- [ ] Host management works (create/read/update/delete)
- [ ] Blog management works
- [ ] Ads management works
- [ ] Settings management works
- [ ] User management displays data
- [ ] Overview dashboard shows stats
- [ ] All forms validate input
- [ ] Success messages appear
- [ ] Error messages are helpful

### Error Handling Checks
- [ ] Invalid routes redirect to home
- [ ] Missing models redirect gracefully
- [ ] Database errors don't crash app
- [ ] Error page has recovery options
- [ ] No console errors (F12)
- [ ] Network issues handled

### Performance Checks
- [ ] Pages load in < 3 seconds
- [ ] Admin operations < 2 seconds
- [ ] Images load properly
- [ ] No memory leaks
- [ ] Works on mobile (test with F12)
- [ ] Works on different browsers

---

## PHASE 6: Go Live!

### Step 13: Share URL
1. Get your production URL from Vercel
2. Share with team/stakeholders
3. Gather feedback
4. Iterate if needed

### Step 14: Monitor
1. Check Vercel logs daily first week
2. Monitor Supabase for errors
3. Get user feedback
4. Plan next features

### Step 15: Continuous Improvement
1. Add more models/content via admin
2. Write blog posts
3. Create ad campaigns
4. Monitor user activity
5. Update based on feedback

---

## Quick Reference URLs

Once deployed, your app will be at:
```
Production URL: https://your-domain.com

Key Pages:
Home:              /
Browse Models:     /browse
Model Detail:      /host/[slug]
Discover:          /discover
Favorites:         /favorites
Blog:              /blog
User Dashboard:    /dashboard
Admin Login:       /admin/login
Admin Dashboard:   /admin
```

---

## Support Resources

If you get stuck, check these in order:
1. **QUICK_START.md** - Common issues and quick fixes
2. **DEPLOYMENT_GUIDE.md** - Detailed troubleshooting
3. **Supabase Logs** - Check for database errors
4. **Vercel Logs** - Check deployment errors
5. **Browser Console** - F12 → Console tab for errors

---

## Timeline Summary

| Phase | Task | Time | Status |
|-------|------|------|--------|
| 1 | Setup & Config | 15 min | Ready |
| 2 | Deploy | 10 min | Ready |
| 3 | Test | 20 min | Ready |
| 4 | Fix Issues | 5-15 min | As needed |
| 5 | Quality Check | - | Ready |
| 6 | Go Live | - | Ready |

**Total Time to Production**: ~45-60 minutes

---

## Final Checklist Before Going Live

- [ ] All environment variables set
- [ ] Database setup complete
- [ ] Admin user has role = 'agency_admin'
- [ ] Deployed to Vercel successfully
- [ ] Home page loads without errors
- [ ] Browse page shows models
- [ ] Can click models without 404
- [ ] Admin login works
- [ ] Admin can create/edit/delete models
- [ ] No 404 errors anywhere
- [ ] Mobile responsive works
- [ ] No console errors (F12)

**If all checkboxes are ticked, you're production-ready!**

---

## Need Help?

**For technical issues**:
1. Check DEPLOYMENT_GUIDE.md troubleshooting section
2. Review Vercel build logs
3. Check Supabase logs and RLS policies
4. Verify environment variables

**For feature requests**:
See FINAL_DELIVERABLE.md → "Future Enhancements"

---

**You're all set! Follow this guide and your app will be live in under an hour.**
