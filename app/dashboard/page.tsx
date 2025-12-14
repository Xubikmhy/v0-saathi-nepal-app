import { createClient } from "@/lib/supabase/server"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, User, Shield, Search } from "lucide-react"

export const metadata = {
    title: "Dashboard | EscortNepal",
    description: "Your personal dashboard.",
}

export default async function DashboardPage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect("/auth/login")
    }

    const { data: settings } = await supabase.from("site_settings").select("*").eq("id", 1).single()
    const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

    // Fetch stats
    const { count: favoritesCount } = await supabase
        .from("favorites")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)

    const isAdmin = profile?.role === "agency_admin"

    return (
        <div className="flex min-h-screen flex-col">
            <SiteHeader settings={settings} isAuthenticated={true} isAdmin={isAdmin} />

            <main className="flex-1 bg-muted/20">
                <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-foreground">
                            Welcome back, {profile?.full_name || user.email?.split("@")[0]}
                        </h1>
                        <p className="mt-2 text-muted-foreground">Manage your account and preferences.</p>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

                        {/* Admin Card - Only for Admins */}
                        {isAdmin && (
                            <Card className="border-primary/20 bg-primary/5">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-primary">
                                        <Shield className="h-5 w-5" />
                                        Admin Panel
                                    </CardTitle>
                                    <CardDescription>Manage hosts, blogs, and settings.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Link href="/admin">
                                        <Button className="w-full">Go to Admin Dashboard</Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        )}

                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Search className="h-5 w-5" />
                                    Discover
                                </CardTitle>
                                <CardDescription>Browse our latest models and hosts.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Link href="/discover">
                                    <Button variant="outline" className="w-full">Browse Now</Button>
                                </Link>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Heart className="h-5 w-5" />
                                    Favorites
                                </CardTitle>
                                <CardDescription>
                                    You have <strong>{favoritesCount || 0}</strong> saved Favorites.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Link href="/favorites">
                                    <Button variant="outline" className="w-full">View Favorites</Button>
                                </Link>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Profile
                                </CardTitle>
                                <CardDescription>Update your personal information.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Link href="/profile">
                                    <Button variant="outline" className="w-full">Edit Profile</Button>
                                </Link>
                            </CardContent>
                        </Card>

                    </div>
                </div>
            </main>

            <SiteFooter settings={settings} />
        </div>
    )
}
