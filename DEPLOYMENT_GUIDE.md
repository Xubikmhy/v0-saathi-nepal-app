# EscortNepal Deployment Guide

Complete guide for deploying the EscortNepal application to production.

## Pre-Deployment Checklist

### Security
- [ ] Change default admin credentials (admin@escortnepal.com / EscortNepal@2024)
- [ ] Review and test all RLS policies
- [ ] Enable HTTPS for your domain
- [ ] Set up CORS headers for your domain
- [ ] Validate all input sanitization
- [ ] Review database backup strategy

### Environment Setup
- [ ] Set up Supabase project (if not already done)
- [ ] Configure environment variables
- [ ] Test all API endpoints
- [ ] Verify database schema is created
- [ ] Ensure RLS policies are enabled

### Frontend
- [ ] Update all mock data imports to use services
- [ ] Test all pages in production build
- [ ] Verify images load correctly
- [ ] Check accessibility compliance
- [ ] Test on mobile devices

### Testing
- [ ] Test all CRUD operations
- [ ] Test authentication flows
- [ ] Test error handling
- [ ] Test with real data
- [ ] Performance testing

## Environment Variables

### Required Environment Variables

Create a `.env.local` file with:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Optional: For additional services
NEXT_PUBLIC_API_URL=https://yourdomain.com
```

### Getting Supabase Credentials

1. Go to [supabase.com](https://supabase.com)
2. Create or select your project
3. Go to **Settings → API**
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Vercel Environment Variables

If deploying to Vercel:

1. Go to your Vercel project
2. Click **Settings → Environment Variables**
3. Add the same variables above
4. Redeploy for changes to take effect

## Database Setup

### Option 1: Supabase Hosted (Recommended)

1. Create Supabase account at [supabase.com](https://supabase.com)
2. Create a new project
3. The database is automatically provisioned
4. Run the schema migration scripts from the repository
5. Verify tables and policies are created correctly

### Option 2: Self-Hosted PostgreSQL

If using your own PostgreSQL database:

1. Update Supabase client to connect to your database
2. Run `scripts/supabase-setup.sql` against your database
3. Run `scripts/rls-policies.sql` for security policies
4. Update environment variables to point to your database

### Schema Verification

After setup, verify tables exist:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

Should list:
- admin_users
- hosts
- blogs
- ads
- site_settings
- profiles
- favorites

## Deployment Steps

### Step 1: Prepare Repository

```bash
# Update to latest code
git pull origin main

# Install dependencies
npm install

# Build the project
npm run build
```

### Step 2: Update Configuration

```bash
# Update .env.local with production values
NEXT_PUBLIC_SUPABASE_URL=https://your-prod-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-prod-anon-key

# Save and commit (don't commit sensitive keys!)
```

### Step 3: Run Tests

```bash
# Test build
npm run build

# Start local server to test
npm run dev

# Test key endpoints:
# - Visit http://localhost:3000
# - Check /api/hosts endpoint
# - Check /api/site-settings endpoint
# - Test admin login
```

### Step 4: Deploy to Vercel

#### Option A: Git-based Deployment (Recommended)

1. Push your code to GitHub/GitLab/Bitbucket
2. Connect your Vercel account to your Git provider
3. Vercel automatically deploys on push
4. Set environment variables in Vercel dashboard
5. Verify deployment is successful

#### Option B: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

#### Option C: Manual Deployment

```bash
# Build the app
npm run build

# Deploy the .next folder to your server
# or use: vercel --prod
```

### Step 5: Post-Deployment Verification

1. Visit your production URL
2. Verify homepage loads correctly
3. Test API endpoints:
   ```bash
   curl https://yourdomain.com/api/hosts
   curl https://yourdomain.com/api/ads
   curl https://yourdomain.com/api/site-settings
   ```
4. Test admin login functionality
5. Test database operations
6. Check browser console for errors
7. Monitor server logs

## Database Backups

### Automated Backups (Supabase)

Supabase automatically backs up your database:

1. Daily automatic backups (retained for 7 days)
2. Weekly backups (retained for 4 weeks)
3. Monthly backups (retained indefinitely)

Access backups in Supabase dashboard:
- **Settings → Backups**

### Manual Backup

```bash
# Using pg_dump with Supabase
pg_dump -h your-project.supabase.co \
  -U postgres \
  -d postgres \
  -F c \
  > backup.dump
```

### Restore from Backup

```bash
# Restore the backup
pg_restore -h your-project.supabase.co \
  -U postgres \
  -d postgres \
  backup.dump
```

## Monitoring & Logging

### Application Logs

View logs in Vercel dashboard:
- **Deployments → View Logs**

Look for any error messages in:
- Server logs
- Function logs
- Browser console (client errors)

### Database Monitoring

Monitor database health in Supabase:

1. Go to **Settings → Usage**
2. Check:
   - Storage usage
   - Connection count
   - Query performance
   - RLS policy effectiveness

### Set Up Alerts

1. Enable email notifications in Supabase
2. Set alerts for:
   - High connection count
   - High storage usage
   - Slow queries
   - Failed RLS checks

## Performance Optimization

### Image Optimization

1. Use Next.js Image component:
```tsx
import Image from 'next/image'

<Image 
  src={url} 
  alt="Host profile" 
  width={500} 
  height={600} 
  priority={false}
/>
```

2. Compress images before upload
3. Use CDN for image delivery (Vercel provides one)

### Database Query Optimization

1. Use indexes (already created in schema)
2. Limit query results with pagination
3. Use select() to fetch only needed columns
4. Cache frequently accessed data

### Caching Strategy

Implement caching headers in `next.config.mjs`:

```javascript
async headers() {
  return [
    {
      source: '/api/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=300', // 5 minutes
        },
      ],
    },
  ]
}
```

## Security Hardening

### 1. Change Default Admin Credentials

Update in `app/api/admin/auth/route.ts`:

```typescript
const DEFAULT_ADMIN_EMAIL = "your-secure-email@domain.com"
const DEFAULT_ADMIN_PASSWORD = "your-very-secure-password"
```

### 2. Enable Row-Level Security

Verify RLS is enabled:
```sql
SELECT tablename, 
       (SELECT count(*) FROM pg_policies 
        WHERE pg_policies.tablename = information_schema.tables.tablename) as policy_count
FROM information_schema.tables
WHERE table_schema = 'public';
```

All tables should have policy_count > 0.

### 3. Configure CORS

If your frontend is on different domain:

```typescript
// In API routes, add CORS headers
const allowedOrigins = ['https://yourdomain.com']

if (allowedOrigins.includes(origin)) {
  headers['Access-Control-Allow-Origin'] = origin
}
```

### 4. Enable HTTPS

For Vercel: Automatic with free SSL certificate
For self-hosted: Use Let's Encrypt

### 5. Rate Limiting

Consider adding rate limiting to public endpoints:

```bash
npm install ratelimit
```

## Troubleshooting Deployment

### Issue: Build fails with "Cannot find module"

**Solution:**
```bash
npm install  # Ensure all dependencies installed
npm run build  # Test build locally
```

### Issue: 404 errors on API endpoints

**Solution:**
- Verify API routes are in `/app/api` folder
- Check function is exported as default
- Restart development server

### Issue: Database connection errors

**Solution:**
- Verify environment variables are set
- Check Supabase project is active
- Test connection with `supabase status`

### Issue: CORS errors

**Solution:**
- Check Origin header matches allowed domain
- Add CORS headers to API routes
- Verify frontend and backend domains

### Issue: Authentication not working

**Solution:**
- Check Supabase Auth is enabled
- Verify auth credentials in environment
- Check RLS policies allow access

## Maintenance

### Regular Tasks

- [ ] Monitor database usage daily
- [ ] Review error logs weekly
- [ ] Update dependencies monthly
- [ ] Test backup restoration quarterly
- [ ] Review RLS policies quarterly
- [ ] Update security credentials annually

### Security Updates

```bash
# Check for security vulnerabilities
npm audit

# Update packages
npm update

# Fix vulnerabilities
npm audit fix
```

### Database Maintenance

```sql
-- Analyze query performance
ANALYZE;

-- Vacuum database
VACUUM;

-- Check index usage
SELECT * FROM pg_stat_user_indexes;
```

## Support & Resources

- **Supabase Documentation:** https://supabase.com/docs
- **Next.js Documentation:** https://nextjs.org/docs
- **Vercel Documentation:** https://vercel.com/docs
- **PostgreSQL Documentation:** https://www.postgresql.org/docs/

## Rollback Procedure

If deployment causes issues:

### Vercel Rollback

1. Go to Vercel dashboard
2. Select your project
3. Go to **Deployments**
4. Find previous stable deployment
5. Click **Restore**

### Database Rollback

1. Go to Supabase dashboard
2. Go to **Settings → Backups**
3. Select backup before issue
4. Click **Restore**

## Post-Deployment Communication

Once deployed successfully:

1. Update website documentation
2. Notify team members of new features
3. Monitor error logs for first week
4. Gather user feedback
5. Plan next iteration

## Version Control

Tag releases:

```bash
git tag -a v1.0.0 -m "Production release"
git push origin v1.0.0
```

Document changes:

```markdown
# Version 1.0.0

## Features
- Initial release with Supabase backend
- Host management system
- Admin dashboard
- User authentication

## Bug Fixes
- Fixed image loading issues
- Fixed mobile responsiveness

## Known Issues
- None
```

## Conclusion

Your EscortNepal application is now production-ready with:
- ✅ Secure Supabase backend
- ✅ Complete API endpoints
- ✅ Row-level security
- ✅ Admin authentication
- ✅ Automated backups
- ✅ Scalable infrastructure

For support or questions, refer to the documentation files included in the repository.
