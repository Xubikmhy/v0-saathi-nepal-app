import { createClient } from "@/lib/supabase/server"
import { SiteHeader } from "@/components/site-header"
import { DiscoverSwiper } from "@/components/discover-swiper"
import type { Metadata } from "next"

import { MOCK_MODELS } from "@/lib/mock-data"

export const metadata: Metadata = {
  title: "Discover Escorts | Swipe Through Beautiful Models | EscortNepal",
  description:
    "Discover and swipe through our collection of stunning, verified Nepali escorts and premium models. Find your perfect companion with our interactive discovery feature.",
  keywords: [
    "discover escorts",
    "swipe escorts",
    "browse models",
    "Nepali escorts",
    "companion finder",
    "model discovery",
  ],
  openGraph: {
    title: "Discover Escorts | Premium Models Discovery",
    description: "Discover and swipe through our collection of stunning, verified Nepali escorts",
    url: "https://escortnepal.com/discover",
  },
}

export default async function DiscoverPage() {
  const supabase = await createClient()

  const { data: settings } = await supabase.from("site_settings").select("*").eq("id", 1).single()

  let { data: models } = await supabase
    .from("hosts")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false })

  if (!models || models.length === 0) {
    models = MOCK_MODELS
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader settings={settings} />

      <main className="flex-1">
        <DiscoverSwiper models={models || []} />
      </main>
    </div>
  )
}
