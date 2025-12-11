"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Plus, Pencil, Trash2, Search } from "lucide-react"
import type { Host, HostStatus } from "@/lib/types"
import { ImageUpload } from "@/components/ui/image-upload"

interface AdminHostsProps {
  hosts: Host[]
  onRefresh: () => Promise<void>
}

const generateSlug = (name: string) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export function AdminHosts({ hosts, onRefresh }: AdminHostsProps) {
  const [search, setSearch] = useState("")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingHost, setEditingHost] = useState<Host | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    contact_whatsapp: "",
    bio: "",
    location: "",
    categories: "",
    status: "pending" as HostStatus,
    profile_image_url: "",
    gallery_urls: "",
  })

  const filteredHosts = hosts.filter(
    (h) =>
      h.name.toLowerCase().includes(search.toLowerCase()) || h.location?.toLowerCase().includes(search.toLowerCase()),
  )

  const resetForm = () => {
    setFormData({
      name: "",
      age: "",
      contact_whatsapp: "",
      bio: "",
      location: "",
      categories: "",
      status: "pending",
      profile_image_url: "",
      gallery_urls: "",
    })
    setEditingHost(null)
  }

  const openEdit = (host: Host) => {
    setEditingHost(host)
    setFormData({
      name: host.name,
      age: host.age?.toString() || "",
      contact_whatsapp: host.contact_whatsapp || "",
      bio: host.bio || "",
      location: host.location || "",
      categories: host.categories?.join(", ") || "",
      status: host.status,
      profile_image_url: host.profile_image_url || "",
      gallery_urls: host.gallery_urls?.join("\n") || "",
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const supabase = createClient()
    const hostData = {
      name: formData.name,
      slug: editingHost?.slug || generateSlug(formData.name),
      age: formData.age ? Number.parseInt(formData.age) : null,
      contact_whatsapp: formData.contact_whatsapp || null,
      bio: formData.bio || null,
      location: formData.location || null,
      categories: formData.categories ? formData.categories.split(",").map((c) => c.trim()) : [],
      status: formData.status,
      profile_image_url: formData.profile_image_url || null,
      gallery_urls: formData.gallery_urls ? formData.gallery_urls.split("\n").filter(Boolean) : [],
      updated_at: new Date().toISOString(),
    }

    try {
      if (editingHost) {
        const { error } = await supabase.from("hosts").update(hostData).eq("id", editingHost.id)

        if (error) throw error
        toast.success("Host updated successfully")
      } else {
        const { error } = await supabase.from("hosts").insert(hostData)

        if (error) throw error
        toast.success("Host created successfully")
      }

      await onRefresh()
      resetForm()
      setIsCreateOpen(false)
    } catch (error: any) {
      toast.error(error.message || "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (hostId: string) => {
    const supabase = createClient()

    try {
      const { error } = await supabase.from("hosts").delete().eq("id", hostId)

      if (error) throw error
      toast.success("Host deleted successfully")
      await onRefresh()
    } catch (error: any) {
      toast.error(error.message || "Failed to delete host")
    }
  }

  const HostForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="age">Age (20-26)</Label>
          <Input
            id="age"
            type="number"
            min={20}
            max={26}
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="e.g., Kathmandu"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact_whatsapp">WhatsApp Number</Label>
          <Input
            id="contact_whatsapp"
            value={formData.contact_whatsapp}
            onChange={(e) => setFormData({ ...formData, contact_whatsapp: e.target.value })}
            placeholder="+977-9801234567"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="categories">Categories (comma-separated)</Label>
        <Input
          id="categories"
          value={formData.categories}
          onChange={(e) => setFormData({ ...formData, categories: e.target.value })}
          placeholder="Trekking, Adventure, Mountain Guide"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select
          value={formData.status}
          onValueChange={(value: HostStatus) => setFormData({ ...formData, status: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Profile Image</Label>
        <ImageUpload
          value={formData.profile_image_url ? [formData.profile_image_url] : []}
          onChange={(urls) => setFormData({ ...formData, profile_image_url: urls[0] || "" })}
          onRemove={() => setFormData({ ...formData, profile_image_url: "" })}
        />
      </div>

      <div className="space-y-2">
        <Label>Gallery Images</Label>
        <ImageUpload
          value={formData.gallery_urls ? formData.gallery_urls.split("\n").filter(Boolean) : []}
          onChange={(urls) => setFormData({ ...formData, gallery_urls: urls.join("\n") })}
          onRemove={(url) => {
            const currentUrls = formData.gallery_urls.split("\n").filter(Boolean)
            const newUrls = currentUrls.filter((u) => u !== url)
            setFormData({ ...formData, gallery_urls: newUrls.join("\n") })
          }}
          multiple
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            resetForm()
            setIsCreateOpen(false)
          }}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : editingHost ? "Update Host" : "Create Host"}
        </Button>
      </div>
    </form>
  )

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Host Management</h1>
          <p className="text-muted-foreground">Manage all host profiles and their information</p>
        </div>

        <Dialog
          open={isCreateOpen}
          onOpenChange={(open) => {
            setIsCreateOpen(open)
            if (!open) resetForm()
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Host
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Host</DialogTitle>
            </DialogHeader>
            <HostForm />
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search hosts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Host</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Categories</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredHosts.map((host) => (
              <TableRow key={host.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img
                      src={host.profile_image_url || "/placeholder.svg?height=40&width=40&query=avatar"}
                      alt={host.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <span className="font-medium">{host.name}</span>
                  </div>
                </TableCell>
                <TableCell>{host.location || "-"}</TableCell>
                <TableCell>{host.age || "-"}</TableCell>
                <TableCell>
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
                </TableCell>
                <TableCell>
                  <div className="max-w-[200px] truncate">{host.categories?.join(", ") || "-"}</div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => openEdit(host)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Edit Host: {host.name}</DialogTitle>
                        </DialogHeader>
                        <HostForm />
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
                          <AlertDialogTitle>Delete Host</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete {host.name}? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(host.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredHosts.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                  No hosts found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
