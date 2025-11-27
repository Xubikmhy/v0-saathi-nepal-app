"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import type { SiteSettings } from "@/lib/types"

interface AdminSettingsProps {
  settings: SiteSettings | null
  onRefresh: () => Promise<void>
}

export function AdminSettings({ settings, onRefresh }: AdminSettingsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    site_name: settings?.site_name || "SAATHI NEPAL",
    logo_url: settings?.logo_url || "",
    hero_headline: settings?.hero_headline || "",
    hero_subheadline: settings?.hero_subheadline || "",
    contact_email: settings?.contact_email || "",
    contact_phone: settings?.contact_phone || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const supabase = createClient()

    try {
      const { error } = await supabase.from("site_settings").upsert({
        id: 1,
        ...formData,
        updated_at: new Date().toISOString(),
      })

      if (error) throw error
      toast.success("Settings updated successfully")
      await onRefresh()
    } catch (error: any) {
      toast.error(error.message || "Failed to update settings")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Global Settings</h1>
        <p className="text-muted-foreground">Configure site-wide settings and branding</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Site Identity</CardTitle>
              <CardDescription>Basic information about your site</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="site_name">Site Name</Label>
                <Input
                  id="site_name"
                  value={formData.site_name}
                  onChange={(e) => setFormData({ ...formData, site_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="logo_url">Logo URL</Label>
                <Input
                  id="logo_url"
                  value={formData.logo_url}
                  onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                  placeholder="https://..."
                />
                {formData.logo_url && (
                  <div className="mt-2">
                    <img src={formData.logo_url || "/placeholder.svg"} alt="Logo preview" className="h-12 w-auto" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
              <CardDescription>Customize the homepage hero content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hero_headline">Headline</Label>
                <Input
                  id="hero_headline"
                  value={formData.hero_headline}
                  onChange={(e) => setFormData({ ...formData, hero_headline: e.target.value })}
                  placeholder="Discover Professional Hosts & Guides in Nepal"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hero_subheadline">Subheadline</Label>
                <Input
                  id="hero_subheadline"
                  value={formData.hero_subheadline}
                  onChange={(e) => setFormData({ ...formData, hero_subheadline: e.target.value })}
                  placeholder="Connect with verified local experts..."
                />
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Public contact details displayed on the site</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="contact_email">Contact Email</Label>
                  <Input
                    id="contact_email"
                    type="email"
                    value={formData.contact_email}
                    onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                    placeholder="info@saathinepal.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_phone">Contact Phone</Label>
                  <Input
                    id="contact_phone"
                    value={formData.contact_phone}
                    onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                    placeholder="+977-1-1234567"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </form>
    </div>
  )
}
