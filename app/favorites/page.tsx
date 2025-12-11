import { createClient } from "@/lib/supabase/server"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { HostCard } from "@/components/host-card"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"

export const metadata = {
  title: "My Favorites | EscortNepal",
  description: "View your saved favorite escorts.",
}

export default async function FavoritesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: settings } = await supabase.from("site_settings").select("*").eq("id", 1).single()

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  const isAdmin = profile?.role === "agency_admin"

  const { data: favorites } = await supabase
    .from("favorites")
    .select("host_id, hosts(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  const favoriteHosts = favorites?.map((f) => f.hosts).filter(Boolean) || []

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader settings={settings} isAuthenticated={true} isAdmin={isAdmin} />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">My Favorites</h1>
            <p className="mt-2 text-muted-foreground">Escorts you&apos;ve saved</p>
          </div>

          {favoriteHosts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {favoriteHosts.map((host: any) => (
                <HostCard key={host.id} host={host} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center">
              <Heart className="mx-auto h-16 w-16 text-muted-foreground/50" />
              <p className="mt-4 text-lg text-muted-foreground">No favorites yet</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Start browsing and save escorts you&apos;re interested in
              </p>
              <Link href="/discover" className="mt-6 inline-block">
                <Button>Start Discovering</Button>
              </Link>
            </div>
          )}
        </div>
      </main>

      <SiteFooter settings={settings} />
    </div>
  )
}
