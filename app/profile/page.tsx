import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ProfileForm } from "@/components/profile-form"

export const metadata = {
  title: "My Profile | SAATHI NEPAL",
  description: "Manage your SAATHI NEPAL profile.",
}

export default async function ProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: settings } = await supabase.from("site_settings").select("*").eq("id", 1).single()

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  const isAdmin = profile?.role === "agency_admin"

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader settings={settings} isAuthenticated={true} isAdmin={isAdmin} />

      <main className="flex-1">
        <div className="mx-auto max-w-2xl px-4 py-8 lg:px-8">
          <h1 className="mb-8 text-3xl font-bold text-foreground">My Profile</h1>
          <ProfileForm profile={profile} userEmail={user.email || ""} />
        </div>
      </main>

      <SiteFooter settings={settings} />
    </div>
  )
}
