"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { LayoutDashboard, Users, FileText, Settings, UserCog, LogOut, Menu, Megaphone } from "lucide-react"
import { AdminOverview } from "./admin-overview"
import { AdminHosts } from "./admin-hosts"
import { AdminBlogs } from "./admin-blogs"
import { AdminAds } from "./admin-ads"
import { AdminSettings } from "./admin-settings"
import { AdminUsers } from "./admin-users"
import type { Host, Blog, Profile, SiteSettings, Ad } from "@/lib/types"
import Link from "next/link"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

interface AdminDashboardProps {
  currentUser: Profile
  hosts: Host[]
  blogs: Blog[]
  ads?: Ad[]
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
  ads: initialAds = [],
  stats,
}: AdminDashboardProps) {
  const router = useRouter()
  const [hosts, setHosts] = useState(initialHosts)
  const [blogs, setBlogs] = useState(initialBlogs)
  const [ads, setAds] = useState<Ad[]>(initialAds)
  const [users, setUsers] = useState(initialUsers)
  const [settings, setSettings] = useState(initialSettings)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' })
      toast.success("Logged out successfully")
      router.push("/admin/login")
      router.refresh()
    } catch (error) {
      toast.error("Failed to logout")
    }
  }

  const refreshData = async () => {
    const supabase = createClient()
    const [hostsRes, blogsRes, usersRes, settingsRes, adsRes] = await Promise.all([
      supabase.from("hosts").select("*").order("created_at", { ascending: false }),
      supabase.from("blogs").select("*").order("created_at", { ascending: false }),
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("site_settings").select("*").eq("id", 1).single(),
      supabase.from("ads").select("*").order("created_at", { ascending: false }),
    ])

    if (hostsRes.data) setHosts(hostsRes.data)
    if (blogsRes.data) setBlogs(blogsRes.data)
    if (usersRes.data) setUsers(usersRes.data)
    if (settingsRes.data) setSettings(settingsRes.data)
    if (adsRes.data) setAds(adsRes.data as Ad[])
  }

  const navItems = [
    { value: "overview", label: "Overview", icon: LayoutDashboard },
    { value: "hosts", label: "Host Management", icon: Users },
    { value: "blogs", label: "Content Management", icon: FileText },
    { value: "ads", label: "Ads", icon: Megaphone },
    { value: "settings", label: "Global Settings", icon: Settings },
    { value: "users", label: "User Control", icon: UserCog },
  ]

  const [activeTab, setActiveTab] = useState("overview");

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
          <div className="flex w-full flex-col gap-1">
            {navItems.map((item) => (
              <Button
                key={item.value}
                variant={activeTab === item.value ? "secondary" : "ghost"}
                className={`justify-start gap-3 px-4 py-6 ${activeTab === item.value
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "text-muted-foreground hover:text-foreground"
                  }`}
                onClick={() => setActiveTab(item.value)}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Button>
            ))}
          </div>
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
                    variant={activeTab === item.value ? "secondary" : "ghost"}
                    className="w-full justify-start gap-3 mb-1"
                    onClick={() => {
                      setActiveTab(item.value)
                      setMobileMenuOpen(false)
                    }}
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
          {activeTab === "overview" && <AdminOverview stats={stats} hosts={hosts} blogs={blogs} />}
          {activeTab === "hosts" && <AdminHosts hosts={hosts} onRefresh={refreshData} />}
          {activeTab === "blogs" && <AdminBlogs blogs={blogs} onRefresh={refreshData} />}
          {activeTab === "ads" && <AdminAds ads={ads} onRefresh={refreshData} />}
          {activeTab === "settings" && <AdminSettings settings={settings} onRefresh={refreshData} />}
          {activeTab === "users" && <AdminUsers users={users} currentUserId={currentUser.id} onRefresh={refreshData} />}
        </main>
      </div>
    </div>
  )
}
