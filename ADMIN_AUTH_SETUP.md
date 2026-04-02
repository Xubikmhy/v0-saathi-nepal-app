# Admin Authentication Setup

## Overview
This document describes the permanent admin account system implemented for EscortNepal.

## Admin Credentials
- **Email:** admin@escortnepal.com
- **Password:** admin@1498

## How It Works

### Authentication Flow
1. User navigates to `/admin/login`
2. Enters email and password
3. Login form calls `/api/admin/auth` endpoint
4. API validates credentials and sets `admin_session` cookie (7 days expiry)
5. Client-side session is set in localStorage
6. User is redirected to `/admin` dashboard

### Session Management
- **Server-side:** Cookie `admin_session` with value `verified`
- **Client-side:** localStorage keys for session tracking
- **Session Duration:** 7 days

### Protected Routes
The `/admin` page and all admin routes use the `requireGodMode()` function from `lib/authGuard.ts` which:
- Checks for valid `admin_session` cookie
- Redirects to `/admin/login` if not authenticated
- Returns admin profile with full permissions

### Logout
- User clicks "Sign Out" in the admin sidebar
- Navigates to `/auth/logout`
- Logout page clears localStorage and calls `/api/admin/logout`
- API clears the session cookie
- User is redirected to `/admin/login`

## Files Modified/Created

### New Files
- `lib/simpleAuth.ts` - Password validation utilities
- `lib/sessionUtils.ts` - Client-side session management
- `app/api/admin/auth/route.ts` - Login API endpoint
- `app/api/admin/logout/route.ts` - Logout API endpoint
- `app/auth/logout/page.tsx` - Logout page

### Modified Files
- `app/admin/login/page.tsx` - Updated to use simple credentials
- `lib/authGuard.ts` - Updated to check session cookie instead of Supabase

## Key Features
✓ Simple email/password authentication (no OAuth, no complex setup)
✓ Persistent session (survives page refresh)
✓ Full admin access to all routes and features
✓ Logout functionality
✓ No impact on existing CRUD logic or image upload
✓ No changes to UI or homepage

## Testing Credentials
Email: `admin@escortnepal.com`
Password: `admin@1498`

To test:
1. Go to http://localhost:3000/admin/login
2. Enter the credentials above
3. Click "Enter God Mode"
4. You should be redirected to `/admin` with full dashboard access
5. Click "Sign Out" to logout
