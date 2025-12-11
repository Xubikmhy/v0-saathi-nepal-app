import { createClient } from "@/lib/supabase/server"
import { SiteHeader } from "@/components/site-header"
import { DiscoverSwiper } from "@/components/discover-swiper"

export const metadata = {
  title: "Discover | EscortNepal",
  description: "Swipe through and discover stunning Nepali escorts.",
}

import { MOCK_MODELS } from "@/lib/mock-data"

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
