# Frontend Integration Guide

This guide shows how to integrate the Supabase backend into your frontend components.

## Quick Start

### 1. Replace Mock Data with API Calls

#### Before (Using Mock Data)
```tsx
import { MOCK_MODELS } from "@/lib/mock-data"

export async function HomePage() {
  const models = MOCK_MODELS
  // ...
}
```

#### After (Using API)
```tsx
import { getHosts } from "@/lib/services/hosts"

export async function HomePage() {
  const models = await getHosts()
  // ...
}
```

### 2. Common Integration Patterns

#### Fetching Hosts
```tsx
import { getHosts, getHostBySlug } from "@/lib/services/hosts"

// Get all active hosts
const allHosts = await getHosts()

// Search hosts by location
const localHosts = await getHosts("Kathmandu")

// Search hosts by name or bio
const searchResults = await getHosts(undefined, "beautiful")

// Get single host by slug
const host = await getHostBySlug("my-host-slug")
```

#### Fetching Ads
```tsx
import { getAds } from "@/lib/services/ads"

// Get all active ads
const allAds = await getAds()

// Get ads for specific position
const headerAds = await getAds("header")
```

#### Fetching Blogs
```tsx
import { getBlogs } from "@/lib/services/blogs"

// Get published blogs (default 10)
const blogs = await getBlogs()

// Get specific number of blogs
const latestPosts = await getBlogs(5)
```

#### Fetching Site Settings
```tsx
// Fetch from API route
const response = await fetch("/api/site-settings")
const settings = await response.json()

console.log(settings.site_name) // "EscortNepal"
console.log(settings.contact_email) // "info@escortnepal.com"
```

### 3. Admin Operations

#### Create Host
```tsx
import { createHost } from "@/lib/services/hosts"

const newHost = await createHost({
  name: "Jane Doe",
  slug: "jane-doe",
  age: 24,
  contact_whatsapp: "+977-9700000000",
  bio: "Professional escort in Kathmandu",
  location: "Kathmandu",
  profile_image_url: "https://...",
  gallery_urls: ["https://...", "https://..."],
  categories: ["escort", "companion"],
})
```

#### Update Host
```tsx
import { updateHost } from "@/lib/services/hosts"

const updated = await updateHost("jane-doe", {
  age: 25,
  bio: "Updated bio...",
  status: "active",
})
```

#### Delete Host
```tsx
import { deleteHost } from "@/lib/services/hosts"

await deleteHost("jane-doe")
```

### 4. User Favorites (Authenticated Users)

#### Get User's Favorites
```tsx
const response = await fetch("/api/favorites")
const favorites = await response.json()
// Returns: [{ host_id: "uuid-1" }, { host_id: "uuid-2" }]
```

#### Add to Favorites
```tsx
const response = await fetch("/api/favorites", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ host_id: "host-uuid" }),
})
const favorite = await response.json()
```

#### Remove from Favorites
```tsx
const response = await fetch("/api/favorites", {
  method: "DELETE",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ host_id: "host-uuid" }),
})
```

## Step-by-Step Integration Examples

### Example 1: Update HomePage to Use Real Hosts

**File: `app/page.tsx`**

```tsx
import { getHosts, getBlogs } from "@/lib/services" // Import services
import { getAds } from "@/lib/services/ads"

export default async function HomePage() {
  // Fetch real data from Supabase
  const [featuredHosts, headerAds] = await Promise.all([
    getHosts().catch(() => []), // Fallback to empty array on error
    getAds("header").catch(() => []),
  ])

  return (
    <main>
      {/* Hero section */}
      {headerAds && headerAds.length > 0 && (
        <AdBanner ad={headerAds[0]} />
      )}

      {/* Featured Models Section */}
      <section>
        <h2>Featured Models</h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {featuredHosts.map((host) => (
            <ModelCard key={host.id} model={host} />
          ))}
        </div>
      </section>
    </main>
  )
}
```

### Example 2: Update Browse Page

**File: `app/browse/page.tsx`**

```tsx
import { getHosts } from "@/lib/services/hosts"

interface BrowsePageProps {
  searchParams: Promise<{
    location?: string
    search?: string
  }>
}

export default async function BrowsePage({ searchParams }: BrowsePageProps) {
  const params = await searchParams
  
  // Fetch hosts with filters
  const hosts = await getHosts(
    params.location,
    params.search
  )

  return (
    <main>
      <h1>Browse Models</h1>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
        {hosts.map((host) => (
          <ModelCard key={host.id} model={host} />
        ))}
      </div>
    </main>
  )
}
```

### Example 3: Update Host Detail Page

**File: `app/host/[slug]/page.tsx`**

```tsx
import { getHostBySlug } from "@/lib/services/hosts"
import { notFound } from "next/navigation"

interface HostPageProps {
  params: Promise<{ slug: string }>
}

export default async function HostPage({ params }: HostPageProps) {
  const { slug } = await params
  
  try {
    const host = await getHostBySlug(slug)
    
    return (
      <main>
        <ModelDetail model={host} />
      </main>
    )
  } catch (error) {
    notFound()
  }
}
```

### Example 4: Admin Host Management

**File: `components/admin/admin-hosts.tsx`**

```tsx
'use client'

import { useState } from 'react'
import { createHost, updateHost, deleteHost } from '@/lib/services/hosts'
import type { Host } from '@/lib/types'

export function AdminHosts() {
  const [hosts, setHosts] = useState<Host[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCreateHost = async (hostData: Partial<Host>) => {
    try {
      setIsLoading(true)
      const newHost = await createHost(hostData)
      setHosts([...hosts, newHost])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create host')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateHost = async (slug: string, hostData: Partial<Host>) => {
    try {
      setIsLoading(true)
      const updated = await updateHost(slug, hostData)
      setHosts(hosts.map(h => h.slug === slug ? updated : h))
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update host')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteHost = async (slug: string) => {
    try {
      setIsLoading(true)
      await deleteHost(slug)
      setHosts(hosts.filter(h => h.slug !== slug))
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete host')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      {error && <div className="error">{error}</div>}
      {/* Your admin UI here */}
    </div>
  )
}
```

## Error Handling Best Practices

### Pattern 1: Graceful Fallback
```tsx
const hosts = await getHosts().catch(() => [])
// Uses empty array if fetch fails
```

### Pattern 2: Error Boundary
```tsx
import { Suspense } from 'react'

export function ModelList({ location }: { location?: string }) {
  return (
    <Suspense fallback={<div>Loading models...</div>}>
      <ModelListContent location={location} />
    </Suspense>
  )
}

async function ModelListContent({ location }: { location?: string }) {
  try {
    const hosts = await getHosts(location)
    return hosts.map(host => <ModelCard key={host.id} model={host} />)
  } catch (error) {
    return <div>Failed to load models. Please try again.</div>
  }
}
```

### Pattern 3: Try-Catch with notFound()
```tsx
import { notFound } from 'next/navigation'

export async function HostPage({ params }: HostPageProps) {
  try {
    const host = await getHostBySlug(params.slug)
    return <ModelDetail model={host} />
  } catch (error) {
    notFound()
  }
}
```

## Performance Optimization

### 1. Parallel Data Fetching
```tsx
// Good: Fetches in parallel
const [hosts, ads, settings] = await Promise.all([
  getHosts(),
  getAds(),
  fetch("/api/site-settings").then(r => r.json()),
])
```

### 2. Client-Side Caching with SWR
```tsx
import useSWR from 'swr'

export function HostList() {
  const { data: hosts, isLoading } = useSWR('/api/hosts', fetcher)
  
  if (isLoading) return <div>Loading...</div>
  return hosts.map(host => <ModelCard key={host.id} model={host} />)
}
```

### 3. Pagination (Future Implementation)
```tsx
// For large host lists, consider adding pagination
const params = new URLSearchParams()
params.append("page", "1")
params.append("limit", "20")

const response = await fetch(`/api/hosts?${params}`)
```

## Migration from Mock Data

### Files That Need Updates

1. **app/page.tsx** - Update featured hosts
2. **app/browse/page.tsx** - Use getHosts() with filters
3. **app/discover/page.tsx** - Fetch models for swiper
4. **app/host/[slug]/page.tsx** - Use getHostBySlug()
5. **components/admin/admin-*.tsx** - Use service functions
6. Any component importing from `mock-data.ts`

### Testing the Integration

1. Start the dev server: `npm run dev`
2. Open browser console to check for errors
3. Test each page to verify data loads correctly
4. Check Network tab in DevTools to see API calls
5. Verify RLS policies allow proper data access

## Troubleshooting

### Issue: 404 when fetching hosts
**Solution:** Ensure hosts exist in database with status='active'

### Issue: 401 Unauthorized for admin operations
**Solution:** Make sure you're logged in as admin

### Issue: Empty results
**Solution:** Check database has data, verify RLS policies

### Issue: CORS errors
**Solution:** Ensure API routes are in `/api` folder

## Next Steps

1. Update all components to use service functions
2. Add error boundaries to prevent UI crashes
3. Implement SWR for client-side caching
4. Add form validation for admin operations
5. Create type-safe API client with better error handling
