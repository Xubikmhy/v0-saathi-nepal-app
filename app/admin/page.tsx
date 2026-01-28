import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminDashboard } from "@/components/admin/admin-dashboard"

export const metadata = {
  title: "Admin Dashboard | SAATHI NEPAL",
  description: "Agency Management System for SAATHI NEPAL.",
}

export default async function AdminPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (profile?.role !== "agency_admin") {
    redirect("/")
  }

  // Fetch all data for admin
  const [
    { data: hosts },
    { data: blogs },
    { data: users },
    { data: settings },
    { count: hostsCount },
    { count: blogsCount },
    { count: usersCount },
  ] = await Promise.all([
    supabase.from("hosts").select("*").order("created_at", { ascending: false }),
    supabase.from("blogs").select("*").order("created_at", { ascending: false }),
    supabase.from("profiles").select("*").order("created_at", { ascending: false }),
    supabase.from("site_settings").select("*").eq("id", 1).single(),
    supabase.from("hosts").select("*", { count: "exact", head: true }),
    supabase.from("blogs").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
  ])

  return (
    <AdminDashboard
      currentUser={profile}
      hosts={hosts || []}
      blogs={blogs || []}
      users={users || []}
      settings={settings}
      stats={{
        hostsCount: hostsCount || 0,
        blogsCount: blogsCount || 0,
        usersCount: usersCount || 0,
      }}
    />
  )
}
