import { createClient } from "@/lib/supabase/server"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ModelCard } from "@/components/model-card"
import { LocationFilter } from "@/components/location-filter"
import { MOCK_MODELS } from "@/lib/mock-data"

export const metadata = {
  title: "Gallery | EscortNepal",
  description: "Browse our exclusive collection of premium Nepali escorts.",
}

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<{ location?: string; search?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  const { data: settings } = await supabase.from("site_settings").select("*").eq("id", 1).single()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let isAdmin = false
  if (user) {
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
    isAdmin = profile?.role === "agency_admin"
  }

  let query = supabase.from("hosts").select("*").eq("status", "active").order("created_at", { ascending: false })

  if (params.location && params.location !== "all") {
    query = query.ilike("location", `%${params.location}%`)
  }

  if (params.search) {
    query = query.or(`name.ilike.%${params.search}%,bio.ilike.%${params.search}%`)
  }

  let { data: models } = await query

  // Get unique locations for filter
  const { data: allModels } = await supabase.from("hosts").select("location").eq("status", "active")

  let displayModels = models
  let locations = [...new Set(allModels?.map((h) => h.location).filter(Boolean))] as string[]

  // Fallback to mock data if database is empty
  if ((!allModels || allModels.length === 0) && (!models || models.length === 0)) {
    displayModels = MOCK_MODELS
    locations = [...new Set(MOCK_MODELS.map((h) => h.location).filter((l): l is string => !!l))]

    // Apply filters to mock data
    if (params.location && params.location !== "all") {
      displayModels = displayModels.filter((m) => m.location?.toLowerCase().includes(params.location!.toLowerCase()))
    }
    if (params.search) {
      const search = params.search.toLowerCase()
      displayModels = displayModels.filter(
        (m) => m.name.toLowerCase().includes(search) || m.bio?.toLowerCase().includes(search),
      )
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader settings={settings} isAuthenticated={!!user} isAdmin={isAdmin} />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
          <div className="mb-12 text-center">
            <p className="text-sm font-semibold tracking-[0.3em] uppercase text-primary">Our Collection</p>
            <h1 className="mt-4 font-serif text-4xl lg:text-5xl font-bold tracking-wide text-foreground">
              Model Gallery
            </h1>
            <div className="mx-auto mt-5 h-1 w-28 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full" />
            <p className="mt-6 text-lg font-medium text-foreground/80">
              Discover Nepal&apos;s most beautiful and professional models
            </p>
          </div>

          <LocationFilter locations={locations} currentLocation={params.location} currentSearch={params.search} />

          {/* Models Grid */}
          {displayModels && displayModels.length > 0 ? (
            <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {displayModels.map((model) => (
                <ModelCard key={model.id} model={model} />
              ))}
            </div>
          ) : (
            <div className="mt-20 text-center">
              <p className="text-xl font-medium text-foreground/80">No models found.</p>
              <p className="mt-3 text-base font-normal text-foreground/60">Try adjusting your filters.</p>
            </div>
          )}
        </div>
      </main>

      <SiteFooter settings={settings} />
    </div>
  )
}
