import { createClient } from "@/lib/supabase/server"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export const metadata = {
  title: "Blog | EscortNepal",
  description: "Read the latest travel tips, guides, and stories from EscortNepal.",
}

export default async function BlogPage() {
  const supabase = await createClient()

  const { data: settings } = await supabase.from("site_settings").select("*").eq("id", 1).single()

  const { data: blogs } = await supabase
    .from("blogs")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let isAdmin = false
  if (user) {
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
    isAdmin = profile?.role === "agency_admin"
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader settings={settings} isAuthenticated={!!user} isAdmin={isAdmin} />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Blog</h1>
            <p className="mt-2 text-muted-foreground">Travel tips, stories, and guides from Nepal</p>
          </div>

          {blogs && blogs.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {blogs.map((blog) => (
                <Link key={blog.id} href={`/blog/${blog.slug}`}>
                  <Card className="h-full overflow-hidden transition-shadow hover:shadow-lg">
                    {blog.cover_image_url && (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={blog.cover_image_url || "/placeholder.svg"}
                          alt={blog.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="line-clamp-2">{blog.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {blog.excerpt && <p className="line-clamp-3 text-sm text-muted-foreground">{blog.excerpt}</p>}
                      <p className="mt-4 text-xs text-muted-foreground">
                        {new Date(blog.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center">
              <p className="text-lg text-muted-foreground">No blog posts yet. Check back soon!</p>
            </div>
          )}
        </div>
      </main>

      <SiteFooter settings={settings} />
    </div>
  )
}
