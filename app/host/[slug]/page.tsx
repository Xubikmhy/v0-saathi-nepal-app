import { createClient } from "@/lib/supabase/server"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ModelDetail } from "@/components/model-detail"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

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
    return { title: "Host Not Found | SAATHI NEPAL" }
  }

  return {
    title: `${host.name} | SAATHI NEPAL`,
    description: host.bio || `Connect with ${host.name}, a professional host/guide in ${host.location || "Nepal"}.`,
  }
}

export default async function HostPage({ params }: HostPageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: settings } = await supabase.from("site_settings").select("*").eq("id", 1).single()

  const { data: host } = await supabase.from("hosts").select("*").eq("slug", slug).eq("status", "active").single()

  if (!host) {
    notFound()
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader settings={settings} />

      <main className="flex-1">
        <ModelDetail model={host} />
      </main>

      <SiteFooter settings={settings} />
    </div>
  )
}
