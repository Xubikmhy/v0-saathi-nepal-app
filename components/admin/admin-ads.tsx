"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Plus, Pencil, Trash2 } from "lucide-react"
import type { Ad, AdPosition } from "@/lib/types"

interface AdminAdsProps {
  ads: Ad[]
  onRefresh: () => Promise<void>
}

export function AdminAds({ ads, onRefresh }: AdminAdsProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingAd, setEditingAd] = useState<Ad | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    image_url: "",
    link_url: "",
    html: "",
    position: "header" as AdPosition,
    is_active: true,
    start_at: "",
    end_at: "",
  })

  const resetForm = () => {
    setFormData({
      title: "",
      image_url: "",
      link_url: "",
      html: "",
      position: "header",
      is_active: true,
      start_at: "",
      end_at: "",
    })
    setEditingAd(null)
  }

  const openEdit = (ad: Ad) => {
    setEditingAd(ad)
    setFormData({
      title: ad.title,
      image_url: ad.image_url || "",
      link_url: ad.link_url || "",
      html: ad.html || "",
      position: ad.position,
      is_active: ad.is_active,
      start_at: ad.start_at || "",
      end_at: ad.end_at || "",
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const supabase = createClient()
    const payload: any = {
      title: formData.title,
      image_url: formData.image_url || null,
      link_url: formData.link_url || null,
      html: formData.html || null,
      position: formData.position,
      is_active: formData.is_active,
      start_at: formData.start_at ? new Date(formData.start_at).toISOString() : null,
      end_at: formData.end_at ? new Date(formData.end_at).toISOString() : null,
      updated_at: new Date().toISOString(),
    }

    try {
      if (editingAd) {
        const { error } = await supabase.from("ads").update(payload).eq("id", editingAd.id)
        if (error) throw error
        toast.success("Ad updated")
      } else {
        const { error } = await supabase.from("ads").insert(payload)
        if (error) throw error
        toast.success("Ad created")
      }
      await onRefresh()
      resetForm()
      setIsCreateOpen(false)
    } catch (error: any) {
      toast.error(error.message || "Failed to save ad")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    const supabase = createClient()
    try {
      const { error } = await supabase.from("ads").delete().eq("id", id)
      if (error) throw error
      toast.success("Ad deleted")
      await onRefresh()
    } catch (error: any) {
      toast.error(error.message || "Failed to delete ad")
    }
  }

  const AdForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="image_url">Image URL</Label>
          <Input id="image_url" value={formData.image_url} onChange={(e) => setFormData({ ...formData, image_url: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="link_url">Link URL</Label>
          <Input id="link_url" value={formData.link_url} onChange={(e) => setFormData({ ...formData, link_url: e.target.value })} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="html">Custom HTML</Label>
        <Textarea id="html" rows={5} value={formData.html} onChange={(e) => setFormData({ ...formData, html: e.target.value })} placeholder="Optional raw HTML snippet" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="position">Position</Label>
          <select id="position" className="h-10 rounded-md border px-3 text-sm" value={formData.position} onChange={(e) => setFormData({ ...formData, position: e.target.value as AdPosition })}>
            <option value="header">Header</option>
            <option value="inline">Inline</option>
            <option value="sidebar">Sidebar</option>
            <option value="footer">Footer</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="start_at">Start</Label>
          <Input id="start_at" type="datetime-local" value={formData.start_at} onChange={(e) => setFormData({ ...formData, start_at: e.target.value })} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="end_at">End</Label>
          <Input id="end_at" type="datetime-local" value={formData.end_at} onChange={(e) => setFormData({ ...formData, end_at: e.target.value })} />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Switch id="is_active" checked={formData.is_active} onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })} />
        <Label htmlFor="is_active">Active</Label>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => { resetForm(); setIsCreateOpen(false) }}>Cancel</Button>
        <Button type="submit" disabled={isLoading}>{isLoading ? "Saving..." : editingAd ? "Update Ad" : "Create Ad"}</Button>
      </div>
    </form>
  )

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Ads Management</h1>
          <p className="text-muted-foreground">Create and manage promotional banners</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={(open) => { setIsCreateOpen(open); if (!open) resetForm() }}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" />New Ad</Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingAd ? `Edit Ad: ${editingAd.title}` : "Create New Ad"}</DialogTitle>
            </DialogHeader>
            <AdForm />
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Schedule</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ads.map((ad) => (
              <TableRow key={ad.id}>
                <TableCell className="font-medium">{ad.title}</TableCell>
                <TableCell>{ad.position}</TableCell>
                <TableCell>
                  <span className={`rounded-full px-2 py-1 text-xs ${ad.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>{ad.is_active ? "Active" : "Inactive"}</span>
                </TableCell>
                <TableCell>
                  <div className="text-xs text-muted-foreground">
                    {ad.start_at ? new Date(ad.start_at).toLocaleString() : ""} {ad.end_at ? `→ ${new Date(ad.end_at).toLocaleString()}` : ""}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => openEdit(ad)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Edit Ad: {ad.title}</DialogTitle>
                        </DialogHeader>
                        <AdForm />
                      </DialogContent>
                    </Dialog>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Ad</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{ad.title}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(ad.id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {ads.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-sm text-muted-foreground py-6">No ads yet</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

