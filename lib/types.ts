export type AppRole = "client" | "agency_admin"
export type HostStatus = "pending" | "active" | "archived"

export interface Profile {
  id: string
  full_name: string | null
  role: AppRole
  created_at: string
  updated_at: string
}

export interface Host {
  id: string
  name: string
  slug: string
  age: number | null
  contact_whatsapp: string | null
  bio: string | null
  location: string | null
  gallery_urls: string[]
  categories: string[]
  status: HostStatus
  profile_image_url: string | null
  created_at: string
  updated_at: string
}

export interface Blog {
  id: string
  title: string
  slug: string
  content: string | null
  excerpt: string | null
  cover_image_url: string | null
  is_published: boolean
  author_id: string | null
  created_at: string
  updated_at: string
}

export interface SiteSettings {
  id: number
  site_name: string
  logo_url: string | null
  hero_headline: string
  hero_subheadline: string | null
  contact_email: string | null
  contact_phone: string | null
  updated_at: string
}

export interface Favorite {
  id: string
  user_id: string
  host_id: string
  created_at: string
}
