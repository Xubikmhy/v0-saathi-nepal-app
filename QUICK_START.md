# EscortNepal Backend - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### 1. Environment Setup (1 min)

Create `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 2. Start Server (1 min)

```bash
npm run dev
# Server runs on http://localhost:3000
```

### 3. Test Endpoints (1 min)

```bash
# Get all hosts
curl http://localhost:3000/api/hosts

# Get ads
curl http://localhost:3000/api/ads

# Get site settings
curl http://localhost:3000/api/site-settings
```

### 4. Test Admin Login (1 min)

```bash
curl -X POST http://localhost:3000/api/admin/auth \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@escortnepal.com",
    "password": "EscortNepal@2024",
    "action": "login"
  }'
```

### 5. Use in Components (1 min)

```tsx
import { getHosts } from "@/lib/services/hosts"

export async function HomePage() {
  const hosts = await getHosts()
  // Use hosts in your component
}
```

---

## 📚 API Quick Reference

### Hosts
```bash
GET /api/hosts                           # List hosts
GET /api/hosts/[slug]                    # Get host
POST /api/hosts                          # Create (admin)
PUT /api/hosts/[slug]                    # Update (admin)
DELETE /api/hosts/[slug]                 # Delete (admin)
```

### Ads
```bash
GET /api/ads                             # List ads
POST /api/ads                            # Create (admin)
PUT /api/ads/[id]                        # Update (admin)
DELETE /api/ads/[id]                     # Delete (admin)
```

### Blogs
```bash
GET /api/blogs                           # List published
POST /api/blogs                          # Create (admin)
PUT /api/blogs/[id]                      # Update (admin)
DELETE /api/blogs/[id]                   # Delete (admin)
```

### Site Settings
```bash
GET /api/site-settings                   # Get settings
PUT /api/site-settings                   # Update (admin)
```

### Favorites
```bash
GET /api/favorites                       # Get user favorites (auth)
POST /api/favorites                      # Add favorite (auth)
DELETE /api/favorites                    # Remove favorite (auth)
```

### Admin Auth
```bash
POST /api/admin/auth                     # Login/Register
GET /api/admin/auth                      # Verify session
```

---

## 🛠️ Common Tasks

### Fetch Hosts in Components

```tsx
// Server Component
import { getHosts } from "@/lib/services/hosts"

export async function MyComponent() {
  const hosts = await getHosts()
  return hosts.map(host => <div key={host.id}>{host.name}</div>)
}
```

### Search Hosts

```tsx
const filteredHosts = await getHosts(
  "Kathmandu",  // location filter
  "beauty"      // search term
)
```

### Create Host (Admin)

```tsx
import { createHost } from "@/lib/services/hosts"

const newHost = await createHost({
  name: "Jane Doe",
  slug: "jane-doe",
  age: 24,
  location: "Kathmandu",
  bio: "Professional escort",
  profile_image_url: "https://...",
  contact_whatsapp: "+977-9700000000"
})
```

### Update Host (Admin)

```tsx
import { updateHost } from "@/lib/services/hosts"

const updated = await updateHost("jane-doe", {
  age: 25,
  status: "active"
})
```

### Get User Favorites (Authenticated)

```tsx
const response = await fetch("/api/favorites")
const favorites = await response.json()
// Returns: [{ host_id: "uuid-1" }, ...]
```

### Add to Favorites (Authenticated)

```tsx
const response = await fetch("/api/favorites", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ host_id: "uuid" })
})
```

---

## 🔐 Default Credentials

```
Email: admin@escortnepal.com
Password: EscortNepal@2024
```

⚠️ **CHANGE BEFORE PRODUCTION!**

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| 404 on API endpoints | Check routes are in `/app/api` folder |
| 401 Unauthorized | Make sure you're logged in as admin |
| 500 Server error | Check console logs for details |
| Empty results | Verify database has data with status='active' |
| CORS errors | Check domain is allowed in CORS config |

---

## 📁 Key Files

```
app/api/               → All API endpoints
lib/services/          → Service functions for frontend
lib/supabase/          → Supabase client
BACKEND_IMPLEMENTATION.md     → Full API docs
FRONTEND_INTEGRATION.md       → How to use services
DEPLOYMENT_GUIDE.md          → Deploy to production
```

---

## 🧪 Test with curl

```bash
# List all hosts
curl -H "Accept: application/json" \
  http://localhost:3000/api/hosts

# Create host (requires auth token)
curl -X POST http://localhost:3000/api/hosts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name":"Test Host",
    "slug":"test-host",
    "age":25,
    "location":"Kathmandu"
  }'

# Get ads
curl http://localhost:3000/api/ads

# Get site settings
curl http://localhost:3000/api/site-settings

# Get blogs
curl http://localhost:3000/api/blogs
```

---

## 📈 Migration Checklist

- [ ] Add environment variables to `.env.local`
- [ ] Test all API endpoints
- [ ] Update homepage to use real hosts
- [ ] Update browse page to use getHosts()
- [ ] Update host detail page to use getHostBySlug()
- [ ] Update admin dashboard to use services
- [ ] Remove all mock data imports
- [ ] Test complete user flow
- [ ] Deploy to production

---

## 🔗 Useful Links

- **Supabase:** https://supabase.com
- **Supabase Docs:** https://supabase.com/docs
- **Next.js API Routes:** https://nextjs.org/docs/api-routes/introduction
- **Vercel Deployment:** https://vercel.com/docs

---

## 📞 Support

For detailed information, see:
1. **BACKEND_IMPLEMENTATION.md** - Complete API reference
2. **FRONTEND_INTEGRATION.md** - Integration patterns
3. **DEPLOYMENT_GUIDE.md** - Deployment instructions

---

## ✅ Verification Checklist

After setup, verify:

- [ ] `GET /api/hosts` returns host data
- [ ] `GET /api/ads` returns ads
- [ ] `GET /api/blogs` returns published blogs
- [ ] `GET /api/site-settings` returns settings
- [ ] Admin login works with default credentials
- [ ] Components can import service functions
- [ ] Database schema is visible in Supabase dashboard
- [ ] RLS policies are active

---

## 🎉 You're Ready!

Your backend is fully set up and ready to use. Start by:

1. Testing the API endpoints above
2. Update one page to use real data
3. Deploy to production when ready

Happy coding! 🚀
