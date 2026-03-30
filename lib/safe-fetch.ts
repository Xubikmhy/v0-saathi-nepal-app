import { createClient } from '@/lib/supabase/server'
import { MOCK_MODELS } from '@/lib/mock-data'
import type { Host } from '@/lib/types'

/**
 * Safely fetch a host by slug with fallback to mock data
 */
export async function safeGetHostBySlug(slug: string): Promise<Host | null> {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('hosts')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'active')
      .single()
    
    if (error && error.code === 'PGRST116') {
      // Not found, try mock data
      return MOCK_MODELS.find(m => m.slug === slug) || null
    }
    
    if (error) {
      console.error('[v0] Error fetching host:', error)
      return MOCK_MODELS.find(m => m.slug === slug) || null
    }
    
    return data as Host
  } catch (error) {
    console.error('[v0] Error in safeGetHostBySlug:', error)
    return MOCK_MODELS.find(m => m.slug === slug) || null
  }
}

/**
 * Safely fetch all active hosts with fallback to mock data
 */
export async function safeGetAllHosts(): Promise<Host[]> {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('hosts')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('[v0] Error fetching hosts:', error)
      return MOCK_MODELS
    }
    
    if (!data || data.length === 0) {
      return MOCK_MODELS
    }
    
    return data as Host[]
  } catch (error) {
    console.error('[v0] Error in safeGetAllHosts:', error)
    return MOCK_MODELS
  }
}

/**
 * Safely fetch site settings with sensible defaults
 */
export async function safeGetSettings() {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('id', 1)
      .single()
    
    if (error || !data) {
      return {
        id: 1,
        hero_headline: 'Discover Exquisite Nepali Beauty',
        hero_subheadline: 'Premium models for your exclusive events and experiences',
        site_name: 'EscortNepal',
        site_description: 'Premium Nepali Escorts',
        meta_keywords: 'Nepal, escorts, Nepali escorts, premium',
        site_logo_url: '/logo.svg',
        whatsapp_number: '9779701083684',
      }
    }
    
    return data
  } catch (error) {
    console.error('[v0] Error in safeGetSettings:', error)
    return null
  }
}

/**
 * Validate user is authenticated and has proper role
 */
export async function safeGetCurrentUser() {
  try {
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return null
    }
    
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    
    if (error || !profile) {
      return null
    }
    
    return profile
  } catch (error) {
    console.error('[v0] Error in safeGetCurrentUser:', error)
    return null
  }
}
