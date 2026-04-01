'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Plus, Trash2, Edit2, LogOut } from 'lucide-react'
import type { Model } from '@/lib/types'

export default function AdminPage() {
  const router = useRouter()
  const [models, setModels] = useState<Model[]>([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    city: '',
    bio: '',
    whatsapp: '',
    image_url: '',
    is_featured: false,
  })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/admin/login')
      return
    }
    fetchModels()
  }, [router])

  const fetchModels = async () => {
    try {
      const response = await fetch('/api/models')
      const data = await response.json()
      setModels(data.models || [])
    } catch (error) {
      console.error('Failed to fetch models:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    router.push('/admin/login')
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await response.json()
      if (data.url) {
        setFormData((prev) => ({ ...prev, image_url: data.url }))
      }
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem('admin_token')
    if (!token) return

    try {
      const payload = {
        ...formData,
        age: formData.age ? parseInt(formData.age) : null,
      }

      if (editingId) {
        const response = await fetch(`/api/models/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(payload),
        })
        if (response.ok) {
          setEditingId(null)
          resetForm()
          fetchModels()
        }
      } else {
        const response = await fetch('/api/models', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(payload),
        })
        if (response.ok) {
          resetForm()
          fetchModels()
        }
      }
    } catch (error) {
      console.error('Submit failed:', error)
    }
  }

  const handleEdit = (model: Model) => {
    setFormData({
      name: model.name,
      age: model.age?.toString() || '',
      city: model.city || '',
      bio: model.bio || '',
      whatsapp: model.whatsapp || '',
      image_url: model.image_url || '',
      is_featured: model.is_featured,
    })
    setEditingId(model.id)
  }

  const handleDelete = async () => {
    if (!deleteId) return
    const token = localStorage.getItem('admin_token')
    if (!token) return

    try {
      await fetch(`/api/models/${deleteId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      })
      setDeleteId(null)
      fetchModels()
    } catch (error) {
      console.error('Delete failed:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      age: '',
      city: '',
      bio: '',
      whatsapp: '',
      image_url: '',
      is_featured: false,
    })
    setEditingId(null)
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Models Dashboard</h1>
          <Button variant="outline" onClick={handleLogout} size="sm">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-xs">
            <TabsTrigger value="list">Models ({models.length})</TabsTrigger>
            <TabsTrigger value="form">{editingId ? 'Edit' : 'Add'} Model</TabsTrigger>
          </TabsList>

          <TabsContent value="form" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>{editingId ? 'Edit Model' : 'Add New Model'}</CardTitle>
                <CardDescription>Fill in the model details below</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Name *</label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Age</label>
                      <Input
                        type="number"
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">City</label>
                      <Input
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">WhatsApp</label>
                      <Input
                        value={formData.whatsapp}
                        onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                        placeholder="+977..."
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Bio</label>
                    <Textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      className="mt-1"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Profile Image</label>
                    <div className="mt-2 flex gap-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploading}
                        className="mt-1"
                      />
                    </div>
                    {formData.image_url && (
                      <div className="mt-2">
                        <img src={formData.image_url} alt="Preview" className="h-32 w-32 object-cover rounded" />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={formData.is_featured}
                      onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                      className="rounded"
                    />
                    <label htmlFor="featured" className="text-sm font-medium">
                      Featured Model
                    </label>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button type="submit" className="bg-primary hover:bg-primary/90">
                      {editingId ? 'Update' : 'Create'} Model
                    </Button>
                    {editingId && (
                      <Button type="button" variant="outline" onClick={resetForm}>
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="list" className="mt-6">
            <div className="grid gap-4">
              {models.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center text-foreground/60">
                    No models yet. Create one to get started!
                  </CardContent>
                </Card>
              ) : (
                models.map((model) => (
                  <Card key={model.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        {model.image_url && (
                          <img
                            src={model.image_url}
                            alt={model.name}
                            className="h-24 w-24 object-cover rounded"
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{model.name}</h3>
                          {model.age && <p className="text-sm text-foreground/60">Age: {model.age}</p>}
                          {model.city && <p className="text-sm text-foreground/60">City: {model.city}</p>}
                          {model.whatsapp && <p className="text-sm text-foreground/60">WhatsApp: {model.whatsapp}</p>}
                          {model.bio && <p className="text-sm text-foreground/60 mt-2">{model.bio}</p>}
                          {model.is_featured && (
                            <span className="inline-block mt-2 px-2 py-1 text-xs font-medium bg-primary/20 text-primary rounded">
                              Featured
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(model)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => setDeleteId(model.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Model</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this model? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
            Delete
          </AlertDialogAction>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
