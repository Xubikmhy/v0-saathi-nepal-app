# EscortNepal Backend Implementation Guide

## Overview

This document outlines the complete backend implementation for EscortNepal, including database schema, API endpoints, services, and authentication.

## Database Architecture

### Tables Created

#### 1. **hosts** - Core escort/model profiles
- `id` (UUID): Primary key
- `name` (VARCHAR): Model's name
- `slug` (VARCHAR): URL-friendly identifier
- `age` (INTEGER): Age of the model
- `contact_whatsapp` (VARCHAR): WhatsApp contact number
- `bio` (TEXT): Biography/description
- `location` (VARCHAR): City/region
- `gallery_urls` (TEXT[]): Array of image URLs
- `categories` (TEXT[]): Array of service categories
- `profile_image_url` (VARCHAR): Main profile picture
- `status` (VARCHAR): pending | active | archived
- `created_at` (TIMESTAMP): Creation timestamp
- `updated_at` (TIMESTAMP): Last update timestamp

#### 2. **blogs** - Content management
- `id` (UUID): Primary key
- `title` (VARCHAR): Blog post title
- `slug` (VARCHAR): URL-friendly identifier
- `content` (TEXT): Full blog content
- `excerpt` (VARCHAR): Short description
- `cover_image_url` (VARCHAR): Featured image
- `is_published` (BOOLEAN): Publication status
- `author_id` (UUID): References auth.users
- `created_at` (TIMESTAMP): Creation timestamp
- `updated_at` (TIMESTAMP): Last update timestamp

#### 3. **ads** - Advertisement management
- `id` (UUID): Primary key
- `title` (VARCHAR): Ad title
- `image_url` (VARCHAR): Ad image
- `link_url` (VARCHAR): Destination URL
- `html` (TEXT): Custom HTML ad
- `position` (VARCHAR): header | sidebar | footer | inline
- `is_active` (BOOLEAN): Active status
- `start_at` (TIMESTAMP): Campaign start date
- `end_at` (TIMESTAMP): Campaign end date
- `created_at` (TIMESTAMP): Creation timestamp
- `updated_at` (TIMESTAMP): Last update timestamp

#### 4. **site_settings** - Global configuration
- `id` (SERIAL): Primary key
- `site_name` (VARCHAR): Website name
- `logo_url` (VARCHAR): Logo image URL
- `hero_headline` (VARCHAR): Homepage headline
- `hero_subheadline` (VARCHAR): Homepage subheadline
- `contact_email` (VARCHAR): Support email
- `contact_phone` (VARCHAR): Support phone
- `updated_at` (TIMESTAMP): Last update timestamp

#### 5. **profiles** - User profiles
- `id` (UUID): References auth.users, primary key
- `full_name` (VARCHAR): User's full name
- `role` (VARCHAR): client | agency_admin
- `created_at` (TIMESTAMP): Creation timestamp
- `updated_at` (TIMESTAMP): Last update timestamp

#### 6. **favorites** - User favorites
- `id` (UUID): Primary key
- `user_id` (UUID): References auth.users
- `host_id` (UUID): References hosts
- `created_at` (TIMESTAMP): Creation timestamp
- Unique constraint on (user_id, host_id)

#### 7. **admin_users** - Admin authentication
- `id` (UUID): Primary key
- `email` (VARCHAR): Unique email address
- `password_hash` (VARCHAR): Bcrypt hashed password
- `full_name` (VARCHAR): Admin's full name
- `created_at` (TIMESTAMP): Creation timestamp
- `updated_at` (TIMESTAMP): Last update timestamp

### Database Indexes

Indexes created for performance:
- `idx_hosts_slug` - For slug lookups
- `idx_hosts_status` - For filtering by status
- `idx_hosts_location` - For location-based queries
- `idx_blogs_slug` - For blog lookups
- `idx_blogs_published` - For published blog filtering
- `idx_ads_active` - For active ads filtering
- `idx_favorites_user` - For user favorites
- `idx_favorites_host` - For host favorites
- `idx_profiles_role` - For role-based filtering

## Row-Level Security (RLS) Policies

### Access Control Strategy

**Hosts Table:**
- PUBLIC READ: Users can view all hosts with status = 'active'
- AUTHENTICATED: Admins can see all hosts regardless of status
- AUTHENTICATED: Only admins can insert, update, or delete hosts

**Blogs Table:**
- PUBLIC READ: Anyone can view published blogs (is_published = true)
- AUTHENTICATED: Admins can view all blogs
- AUTHENTICATED: Only admins can create, update, or delete blogs

**Ads Table:**
- PUBLIC READ: Anyone can view active ads (is_active = true)
- AUTHENTICATED: Admins can see all ads
- AUTHENTICATED: Only admins can create, update, or delete ads

**Site Settings Table:**
- PUBLIC READ: Everyone can read site settings
- AUTHENTICATED: Only admins can update settings

**Profiles Table:**
- USERS: Can read own profile or admins can read all
- USERS: Can create and update own profile
- ADMINS: Can update any profile

**Favorites Table:**
- USERS: Can only see and manage their own favorites
- USERS: Can insert/delete own favorites

## API Endpoints

### Hosts Endpoints

#### GET /api/hosts
Fetch all active hosts with optional filtering.

**Query Parameters:**
- `location` (optional): Filter by location
- `search` (optional): Search by name or bio

**Response:** Array of Host objects

**Example:**
```bash
GET /api/hosts?location=Kathmandu&search=nepal
```

#### GET /api/hosts/[slug]
Fetch a single host by slug.

**Parameters:**
- `slug`: Host's URL slug

**Response:** Single Host object

#### POST /api/hosts
Create a new host profile (admin only).

**Request Body:**
```json
{
  "name": "string",
  "slug": "string",
  "age": "number",
  "contact_whatsapp": "string",
  "bio": "string",
  "location": "string",
  "gallery_urls": ["string"],
  "categories": ["string"],
  "profile_image_url": "string"
}
```

**Response:** Created Host object with status 201

#### PUT /api/hosts/[slug]
Update a host profile (admin only).

**Request Body:** Same as POST

**Response:** Updated Host object

#### DELETE /api/hosts/[slug]
Delete a host profile (admin only).

**Response:** `{ "success": true }`

### Ads Endpoints

#### GET /api/ads
Fetch active ads with optional position filter.

**Query Parameters:**
- `position` (optional): Filter by position (header, sidebar, footer, inline)

**Response:** Array of Ad objects

#### POST /api/ads
Create a new ad (admin only).

**Request Body:**
```json
{
  "title": "string",
  "image_url": "string",
  "link_url": "string",
  "html": "string",
  "position": "header|sidebar|footer|inline",
  "is_active": "boolean",
  "start_at": "ISO timestamp",
  "end_at": "ISO timestamp"
}
```

**Response:** Created Ad object with status 201

### Blogs Endpoints

#### GET /api/blogs
Fetch published blogs.

**Query Parameters:**
- `limit` (optional, default 10): Number of blogs to fetch

**Response:** Array of Blog objects

#### POST /api/blogs
Create a new blog post (admin only).

**Request Body:**
```json
{
  "title": "string",
  "slug": "string",
  "content": "string",
  "excerpt": "string",
  "cover_image_url": "string",
  "is_published": "boolean"
}
```

**Response:** Created Blog object with status 201

### Site Settings Endpoints

#### GET /api/site-settings
Fetch site configuration.

**Response:** Single Site Settings object

#### PUT /api/site-settings
Update site settings (admin only).

**Request Body:**
```json
{
  "site_name": "string",
  "logo_url": "string",
  "hero_headline": "string",
  "hero_subheadline": "string",
  "contact_email": "string",
  "contact_phone": "string"
}
```

**Response:** Updated Site Settings object

### Favorites Endpoints

#### GET /api/favorites
Get user's favorite hosts (authenticated users only).

**Response:** Array of favorite objects with host_id

#### POST /api/favorites
Add a host to favorites (authenticated users only).

**Request Body:**
```json
{
  "host_id": "UUID"
}
```

**Response:** Created Favorite object with status 201

#### DELETE /api/favorites
Remove a host from favorites (authenticated users only).

**Request Body:**
```json
{
  "host_id": "UUID"
}
```

**Response:** `{ "success": true }`

### Admin Authentication Endpoints

#### POST /api/admin/auth
Admin login or registration.

**Request Body - Login:**
```json
{
  "email": "admin@escortnepal.com",
  "password": "password",
  "action": "login"
}
```

**Request Body - Register (admin only):**
```json
{
  "email": "string",
  "password": "string",
  "full_name": "string",
  "action": "register"
}
```

**Response:** User object and session information

#### GET /api/admin/auth
Verify admin authentication status.

**Response:** Admin user object with `authenticated: true`

**Default Admin Credentials:**
```
Email: admin@escortnepal.com
Password: EscortNepal@2024
```

⚠️ **IMPORTANT:** Change these credentials in production!

## Service Functions

### Hosts Service (`lib/services/hosts.ts`)

```typescript
// Fetch all hosts with optional filters
getHosts(location?: string, search?: string): Promise<Host[]>

// Fetch single host by slug
getHostBySlug(slug: string): Promise<Host>

// Create new host
createHost(hostData: Partial<Host>): Promise<Host>

// Update host
updateHost(slug: string, hostData: Partial<Host>): Promise<Host>

// Delete host
deleteHost(slug: string): Promise<void>
```

### Ads Service (`lib/services/ads.ts`)

```typescript
// Fetch ads with optional position filter
getAds(position?: string): Promise<Ad[]>

// Create new ad
createAd(adData: Partial<Ad>): Promise<Ad>

// Update ad
updateAd(id: string, adData: Partial<Ad>): Promise<Ad>

// Delete ad
deleteAd(id: string): Promise<void>
```

### Blogs Service (`lib/services/blogs.ts`)

```typescript
// Fetch published blogs
getBlogs(limit?: number): Promise<Blog[]>

// Create new blog
createBlog(blogData: Partial<Blog>): Promise<Blog>

// Update blog
updateBlog(id: string, blogData: Partial<Blog>): Promise<Blog>

// Delete blog
deleteBlog(id: string): Promise<void>
```

## Authentication

### Admin Authentication

The system uses hardcoded admin credentials for the initial login, with an option to create additional admin users.

**Default Credentials:**
- Email: `admin@escortnepal.com`
- Password: `EscortNepal@2024`

### How Authentication Works

1. Admin logs in via `/api/admin/auth` with email and password
2. Credentials are verified against hardcoded values or admin_users table
3. Password is hashed using bcryptjs (10 salt rounds)
4. Session is maintained via HTTP cookies (set by Supabase)
5. Subsequent requests include the session token in headers

### Protecting Admin Routes

Admin routes check:
1. If user is authenticated via `supabase.auth.getUser()`
2. If user exists in `admin_users` table
3. Returns 401 if not authenticated, 403 if not admin

## Error Handling

All API routes follow consistent error handling:

**200 OK** - Success
**201 Created** - Resource created successfully
**400 Bad Request** - Missing or invalid parameters
**401 Unauthorized** - Not authenticated
**403 Forbidden** - Not authorized to perform action
**404 Not Found** - Resource not found
**500 Internal Server Error** - Server error

**Error Response Format:**
```json
{
  "error": "Error message description"
}
```

## Security Best Practices Implemented

1. **Row-Level Security (RLS)**: All tables have RLS policies enabled
2. **Password Hashing**: Admin passwords hashed with bcryptjs
3. **Authentication Checks**: Every admin route verifies authentication
4. **HTTPS**: In production, all endpoints should use HTTPS
5. **Input Validation**: Request bodies validated before processing
6. **SQL Injection Prevention**: Using parameterized queries via Supabase SDK
7. **CORS**: Configure CORS headers as needed for your domain

## Monitoring & Logging

All API routes include console logging for debugging:

```typescript
console.log("[v0] Error message:", error)
```

Monitor these logs in:
- Local development: Browser console
- Production: Vercel Logs or cloud monitoring service

## Deployment Checklist

- [ ] Change default admin credentials in production
- [ ] Set up environment variables (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)
- [ ] Configure CORS for your domain
- [ ] Enable HTTPS on production
- [ ] Set up database backups
- [ ] Monitor RLS policies for data access patterns
- [ ] Test all API endpoints thoroughly
- [ ] Implement rate limiting for public endpoints
- [ ] Set up monitoring and alerting
- [ ] Document any custom changes made

## Development Tips

### Testing Endpoints Locally

Use curl or Postman to test:

```bash
# Get hosts
curl http://localhost:3000/api/hosts

# Get single host
curl http://localhost:3000/api/hosts/my-host-slug

# Create host (requires auth)
curl -X POST http://localhost:3000/api/hosts \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Host","slug":"test-host","age":25}'

# Admin login
curl -X POST http://localhost:3000/api/admin/auth \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@escortnepal.com","password":"EscortNepal@2024","action":"login"}'
```

### Troubleshooting

**403 Forbidden errors:** Check RLS policies in Supabase dashboard
**401 Unauthorized errors:** Ensure authentication token is included
**500 Server errors:** Check logs for detailed error messages
**CORS errors:** Configure CORS headers in next.config.js

## Next Steps

1. Connect frontend components to use service functions
2. Implement real-time updates with Supabase subscriptions
3. Set up file upload service for images
4. Create admin dashboard for content management
5. Implement caching strategy with SWR or React Query
