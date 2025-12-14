import { createClient } from "@/lib/supabase/server";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { requireGodMode } from "@/lib/authGuard";
import { AdminSidebar } from "@/components/AdminSidebar";

export const metadata = {
  title: "Admin Dashboard | EscortNepal",
  description: "Agency Management System for EscortNepal.",
}

export default async function AdminPage() {
  // Ensure only god‑mode admin can access
  const profile = await requireGodMode();

  const supabase = await createClient();

  // Fetch all data for admin
  const [
    { data: hosts },
    { data: blogs },
    { data: users },
    { data: settings },
    { count: hostsCount },
    { count: blogsCount },
    { count: usersCount },
    { data: ads },
  ] = await Promise.all([
    supabase.from("hosts").select("*").order("created_at", { ascending: false }),
    supabase.from("blogs").select("*").order("created_at", { ascending: false }),
    supabase.from("profiles").select("*").order("created_at", { ascending: false }),
    supabase.from("site_settings").select("*").eq("id", 1).single(),
    supabase.from("hosts").select("*", { count: "exact", head: true }),
    supabase.from("blogs").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("ads").select("*").order("created_at", { ascending: false }),
  ]);

  return (
    <div className="flex min-h-screen bg-muted/30">
      <AdminSidebar />
      <main className="flex-1 overflow-auto p-6">
        <AdminDashboard
          currentUser={profile}
          hosts={hosts || []}
          blogs={blogs || []}
          users={users || []}
          settings={settings}
          ads={ads || []}
          stats={{
            hostsCount: hostsCount || 0,
            blogsCount: blogsCount || 0,
            usersCount: usersCount || 0,
          }}
        />
      </main>
    </div>
  );
}
