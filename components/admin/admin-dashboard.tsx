"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { LayoutDashboard, Users, FileText, Settings, UserCog, LogOut, Menu } from "lucide-react"
import { AdminOverview } from "./admin-overview"
import { AdminHosts } from "./admin-hosts"
import { AdminBlogs } from "./admin-blogs"
import { AdminSettings } from "./admin-settings"
import { AdminUsers } from "./admin-users"
import type { Host, Blog, Profile, SiteSettings } from "@/lib/types"
import Link from "next/link"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

interface AdminDashboardProps {
  currentUser: Profile
  hosts: Host[]
  blogs: Blog[]
  users: Profile[]
  settings: SiteSettings | null
  stats: {
    hostsCount: number
    blogsCount: number
    usersCount: number
  }
}

export function AdminDashboard({
  currentUser,
  hosts: initialHosts,
  blogs: initialBlogs,
  users: initialUsers,
  settings: initialSettings,
  stats,
}: AdminDashboardProps) {
  const router = useRouter()
  const [hosts, setHosts] = useState(initialHosts)
  const [blogs, setBlogs] = useState(initialBlogs)
  const [users, setUsers] = useState(initialUsers)
  const [settings, setSettings] = useState(initialSettings)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
    toast.success("Logged out successfully")
  }

  const refreshData = async () => {
    const supabase = createClient()
    const [hostsRes, blogsRes, usersRes, settingsRes] = await Promise.all([
      supabase.from("hosts").select("*").order("created_at", { ascending: false }),
      supabase.from("blogs").select("*").order("created_at", { ascending: false }),
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("site_settings").select("*").eq("id", 1).single(),
    ])

    if (hostsRes.data) setHosts(hostsRes.data)
    if (blogsRes.data) setBlogs(blogsRes.data)
    if (usersRes.data) setUsers(usersRes.data)
    if (settingsRes.data) setSettings(settingsRes.data)
  }

  const navItems = [
    { value: "overview", label: "Overview", icon: LayoutDashboard },
    { value: "hosts", label: "Host Management", icon: Users },
    { value: "blogs", label: "Content Management", icon: FileText },
    { value: "settings", label: "Global Settings", icon: Settings },
    { value: "users", label: "User Control", icon: UserCog },
  ]

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-col border-r bg-card lg:flex">
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/" className="text-xl font-bold text-primary">
            {settings?.site_name || "EscortNepal"}
          </Link>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          <Tabs defaultValue="overview" orientation="vertical" className="w-full">
            <TabsList className="flex h-auto w-full flex-col items-stretch bg-transparent">
              {navItems.map((item) => (
                <TabsTrigger
                  key={item.value}
                  value={item.value}
                  className="justify-start gap-3 px-4 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </nav>
        <div className="border-t p-4">
          <div className="mb-4 text-sm text-muted-foreground">
            Signed in as <span className="font-medium text-foreground">{currentUser.full_name}</span>
          </div>
          <Button variant="outline" className="w-full bg-transparent" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b bg-card px-4 lg:hidden">
          <Link href="/" className="text-xl font-bold text-primary">
            {settings?.site_name || "EscortNepal"}
          </Link>
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="flex h-16 items-center border-b px-6">
                <span className="text-xl font-bold text-primary">Admin</span>
              </div>
              <nav className="p-4">
                {navItems.map((item) => (
                  <Button
                    key={item.value}
                    variant="ghost"
                    className="w-full justify-start gap-3 mb-1"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Button>
                ))}
              </nav>
              <div className="border-t p-4">
                <Button variant="outline" className="w-full bg-transparent" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <Tabs defaultValue="overview" className="h-full">
            {/* Hidden TabsList for mobile - controlled by sidebar */}
            <div className="hidden">
              <TabsList>
                {navItems.map((item) => (
                  <TabsTrigger key={item.value} value={item.value}>
                    {item.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <TabsContent value="overview" className="m-0 h-full">
              <AdminOverview stats={stats} hosts={hosts} blogs={blogs} />
            </TabsContent>

            <TabsContent value="hosts" className="m-0 h-full">
              <AdminHosts hosts={hosts} onRefresh={refreshData} />
            </TabsContent>

            <TabsContent value="blogs" className="m-0 h-full">
              <AdminBlogs blogs={blogs} onRefresh={refreshData} />
            </TabsContent>

            <TabsContent value="settings" className="m-0 h-full">
              <AdminSettings settings={settings} onRefresh={refreshData} />
            </TabsContent>

            <TabsContent value="users" className="m-0 h-full">
              <AdminUsers users={users} currentUserId={currentUser.id} onRefresh={refreshData} />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
