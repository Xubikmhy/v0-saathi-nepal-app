import { createClient } from "@/lib/supabase/server"
import { SiteHeader } from "@/components/site-header"
import { DiscoverSwiper } from "@/components/discover-swiper"

export const metadata = {
  title: "Discover | SAATHI NEPAL",
  description: "Swipe through and discover stunning Nepali models.",
}

export default async function DiscoverPage() {
  const supabase = await createClient()

  const { data: settings } = await supabase.from("site_settings").select("*").eq("id", 1).single()

  const { data: models } = await supabase
    .from("hosts")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false })

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader settings={settings} />

      <main className="flex-1">
        <DiscoverSwiper models={models || []} />
      </main>
    </div>
  )
}
