import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileText, UserCheck, TrendingUp } from "lucide-react"
import type { Host, Blog } from "@/lib/types"

interface AdminOverviewProps {
  stats: {
    hostsCount: number
    blogsCount: number
    usersCount: number
  }
  hosts: Host[]
  blogs: Blog[]
}

export function AdminOverview({ stats, hosts, blogs }: AdminOverviewProps) {
  const activeHosts = hosts.filter((h) => h.status === "active").length
  const pendingHosts = hosts.filter((h) => h.status === "pending").length
  const publishedBlogs = blogs.filter((b) => b.is_published).length

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
        <p className="mt-2 text-muted-foreground">Welcome to the EscortNepal Agency Management System</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Hosts</CardTitle>
            <Users className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.hostsCount}</div>
            <p className="text-xs text-muted-foreground">
              {activeHosts} active, {pendingHosts} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Blog Posts</CardTitle>
            <FileText className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.blogsCount}</div>
            <p className="text-xs text-muted-foreground">{publishedBlogs} published</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Registered Users</CardTitle>
            <UserCheck className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.usersCount}</div>
            <p className="text-xs text-muted-foreground">Total accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Rate</CardTitle>
            <TrendingUp className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {stats.hostsCount > 0 ? Math.round((activeHosts / stats.hostsCount) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">Host activation rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Hosts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {hosts.slice(0, 5).map((host) => (
                <div key={host.id} className="flex items-center gap-4">
                  <img
                    src={host.profile_image_url || "/placeholder.svg?height=40&width=40&query=avatar"}
                    alt={host.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{host.name}</p>
                    <p className="text-sm text-muted-foreground">{host.location}</p>
                  </div>
                  <span
                    className={`rounded-full px-2 py-1 text-xs ${host.status === "active"
                        ? "bg-green-100 text-green-700"
                        : host.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                  >
                    {host.status}
                  </span>
                </div>
              ))}
              {hosts.length === 0 && <p className="text-sm text-muted-foreground">No hosts yet</p>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Blog Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {blogs.slice(0, 5).map((blog) => (
                <div key={blog.id} className="flex items-center gap-4">
                  <div className="flex-1">
                    <p className="font-medium text-foreground line-clamp-1">{blog.title}</p>
                    <p className="text-sm text-muted-foreground">{new Date(blog.created_at).toLocaleDateString()}</p>
                  </div>
                  <span
                    className={`rounded-full px-2 py-1 text-xs ${blog.is_published ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                      }`}
                  >
                    {blog.is_published ? "Published" : "Draft"}
                  </span>
                </div>
              ))}
              {blogs.length === 0 && <p className="text-sm text-muted-foreground">No blog posts yet</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
