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
    .select("name, bio, location, profile_image_url, age")
    .eq("slug", slug)
    .eq("status", "active")
    .single()

  if (!host) {
    return {
      title: "Host Not Found | EscortNepal",
      description: "The escort profile you are looking for is not available.",
    }
  }

  const locationText = host.location ? ` in ${host.location}` : " in Nepal"
  const ageText = host.age ? `, ${host.age} years old` : ""

  return {
    title: `${host.name}${ageText} | Premium Escort Model${locationText} | EscortNepal`,
    description:
      host.bio ||
      `Meet ${host.name}${ageText}, a beautiful and verified escort professional${locationText}. Contact directly via WhatsApp for exclusive companionship and events.`,
    keywords: [
      host.name,
      "escort",
      host.location || "Nepal",
      "verified escort",
      "premium companion",
      "exclusive",
    ],
    openGraph: {
      title: `${host.name} | Premium Escort Model`,
      description:
        host.bio ||
        `Meet ${host.name}, a beautiful and verified escort professional. Available for exclusive companionship.`,
      url: `https://escortnepal.com/host/${slug}`,
      type: "profile",
      images: host.profile_image_url
        ? [
            {
              url: host.profile_image_url,
              width: 500,
              height: 700,
              alt: `${host.name} - Premium Escort Model`,
            },
          ]
        : [],
    },
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
