"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
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
import type { Blog } from "@/lib/types"

interface AdminBlogsProps {
  blogs: Blog[]
  onRefresh: () => Promise<void>
}

const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export function AdminBlogs({ blogs, onRefresh }: AdminBlogsProps) {
  const [search, setSearch] = useState("")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    cover_image_url: "",
    is_published: false,
  })

  const filteredBlogs = blogs.filter((b) => b.title.toLowerCase().includes(search.toLowerCase()))

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      excerpt: "",
      cover_image_url: "",
      is_published: false,
    })
    setEditingBlog(null)
  }

  const openEdit = (blog: Blog) => {
    setEditingBlog(blog)
    setFormData({
      title: blog.title,
      content: blog.content || "",
      excerpt: blog.excerpt || "",
      cover_image_url: blog.cover_image_url || "",
      is_published: blog.is_published,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const supabase = createClient()
    const blogData = {
      title: formData.title,
      slug: editingBlog?.slug || generateSlug(formData.title),
      content: formData.content || null,
      excerpt: formData.excerpt || null,
      cover_image_url: formData.cover_image_url || null,
      is_published: formData.is_published,
      updated_at: new Date().toISOString(),
    }

    try {
      if (editingBlog) {
        const { error } = await supabase.from("blogs").update(blogData).eq("id", editingBlog.id)

        if (error) throw error
        toast.success("Blog post updated successfully")
      } else {
        const { error } = await supabase.from("blogs").insert(blogData)

        if (error) throw error
        toast.success("Blog post created successfully")
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

  const handleDelete = async (blogId: string) => {
    const supabase = createClient()

    try {
      const { error } = await supabase.from("blogs").delete().eq("id", blogId)

      if (error) throw error
      toast.success("Blog post deleted successfully")
      await onRefresh()
    } catch (error: any) {
      toast.error(error.message || "Failed to delete blog post")
    }
  }

  const BlogForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea
          id="excerpt"
          value={formData.excerpt}
          onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
          rows={2}
          placeholder="Brief summary of the post..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          rows={10}
          placeholder="Write your blog post content here..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="cover_image_url">Cover Image URL</Label>
        <Input
          id="cover_image_url"
          value={formData.cover_image_url}
          onChange={(e) => setFormData({ ...formData, cover_image_url: e.target.value })}
          placeholder="https://..."
        />
      </div>

      <div className="flex items-center gap-2">
        <Switch
          id="is_published"
          checked={formData.is_published}
          onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
        />
        <Label htmlFor="is_published">Publish immediately</Label>
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
          {isLoading ? "Saving..." : editingBlog ? "Update Post" : "Create Post"}
        </Button>
      </div>
    </form>
  )

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Content Management</h1>
          <p className="text-muted-foreground">Manage blog posts and SEO content</p>
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
              New Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Blog Post</DialogTitle>
            </DialogHeader>
            <BlogForm />
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search posts..."
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
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBlogs.map((blog) => (
              <TableRow key={blog.id}>
                <TableCell>
                  <span className="font-medium">{blog.title}</span>
                </TableCell>
                <TableCell>
                  <span
                    className={`rounded-full px-2 py-1 text-xs ${
                      blog.is_published ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {blog.is_published ? "Published" : "Draft"}
                  </span>
                </TableCell>
                <TableCell>{new Date(blog.created_at).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => openEdit(blog)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Edit Post: {blog.title}</DialogTitle>
                        </DialogHeader>
                        <BlogForm />
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
                          <AlertDialogTitle>Delete Blog Post</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete &quot;{blog.title}&quot;? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(blog.id)}
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
            {filteredBlogs.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                  No blog posts found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
