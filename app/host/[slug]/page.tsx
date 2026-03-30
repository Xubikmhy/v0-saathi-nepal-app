import { createClient } from "@/lib/supabase/server"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ModelDetail } from "@/components/model-detail"
import { redirect } from "next/navigation"
import type { Metadata } from "next"
import { MOCK_MODELS } from "@/lib/mock-data"

interface HostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: HostPageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  const { data: host } = await supabase
    .from("hosts")
    .select("name, bio, location")
    .eq("slug", slug)
    .eq("status", "active")
    .single()

  if (!host) {
    // Try to find in mock data as fallback
    const mockHost = MOCK_MODELS.find(m => m.slug === slug)
    if (mockHost) {
      return {
        title: `${mockHost.name} | EscortNepal`,
        description: mockHost.bio || `Connect with ${mockHost.name}, a professional model in ${mockHost.location || "Nepal"}.`,
      }
    }
    return { title: "Model | EscortNepal" }
  }

  return {
    title: `${host.name} | EscortNepal`,
    description: host.bio || `Connect with ${host.name}, a professional host/guide in ${host.location || "Nepal"}.`,
  }
}

export default async function HostPage({ params }: HostPageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: settings } = await supabase.from("site_settings").select("*").eq("id", 1).single()

  const { data: host } = await supabase.from("hosts").select("*").eq("slug", slug).eq("status", "active").single()

  // If host not found in database, check mock data
  let displayHost = host
  if (!host) {
    const mockHost = MOCK_MODELS.find(m => m.slug === slug)
    if (!mockHost) {
      // Redirect to home if not found anywhere
      redirect("/")
    }
    displayHost = mockHost
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader settings={settings} />

      <main className="flex-1">
        <ModelDetail model={displayHost} />
      </main>

      <SiteFooter settings={settings} />
    </div>
  )
}
