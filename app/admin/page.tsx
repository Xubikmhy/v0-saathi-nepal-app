'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { LogOut } from 'lucide-react'
import type { Model } from '@/lib/types'

interface FormState {
  name: string
  age: string
  city: string
  bio: string
  whatsapp: string
  image_url: string
  is_featured: boolean
}

export default function AdminPage() {
  const router = useRouter()
  const [models, setModels] = useState<Model[]>([])
  const [pageLoading, setPageLoading] = useState(true)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [imageLoading, setImageLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<string>('')

  const [formData, setFormData] = useState<FormState>({
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

  // Load auth and models on mount
  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/admin/login')
      return
    }
    loadModels()
  }, [router])

  const loadModels = async () => {
    try {
      console.log('[v0] Loading models...')
      const response = await fetch('/api/models')
      const data = await response.json()
      console.log('[v0] Models loaded:', data)
      setModels(data.models || [])
      setError('')
    } catch (err) {
      console.error('[v0] Failed to load models:', err)
      setError('Failed to load models')
    } finally {
      setPageLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImageLoading(true)
    setError('')

    try {
      const formDataObj = new FormData()
      formDataObj.append('file', file)

      console.log('[v0] Uploading image...')
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formDataObj,
      })

      const result = await response.json()
      console.log('[v0] Upload response:', result)

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed')
      }

      if (result.url) {
        setFormData((prev) => ({ ...prev, image_url: result.url }))
        setSuccess('Image uploaded successfully')
        setTimeout(() => setSuccess(''), 3000)
      }
    } catch (err) {
      console.error('[v0] Upload error:', err)
      setError(err instanceof Error ? err.message : 'Image upload failed')
    } finally {
      setImageLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSubmitLoading(true)

    try {
      // Validation
      if (!formData.name.trim()) {
        throw new Error('Name is required')
      }
      if (!formData.city.trim()) {
        throw new Error('City is required')
      }
      if (!formData.whatsapp.trim()) {
        throw new Error('WhatsApp number is required')
      }

      const token = localStorage.getItem('admin_token')
      if (!token) {
        throw new Error('Not authenticated')
      }

      const payload = {
        name: formData.name.trim(),
        age: formData.age ? parseInt(formData.age) : null,
        city: formData.city.trim(),
        bio: formData.bio.trim(),
        whatsapp: formData.whatsapp.trim(),
        image_url: formData.image_url,
        is_featured: formData.is_featured,
      }

      console.log('[v0] Submitting:', editingId ? `Update ${editingId}` : 'Create new')

      const method = editingId ? 'PUT' : 'POST'
      const url = editingId ? `/api/models/${editingId}` : '/api/models'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      const result = await response.json()
      console.log('[v0] Server response:', result)

      if (!response.ok) {
        throw new Error(result.error || 'Failed to save model')
      }

      setSuccess(editingId ? 'Model updated successfully!' : 'Model created successfully!')
      resetForm()
      await loadModels()

      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      console.error('[v0] Submit error:', err)
      setError(err instanceof Error ? err.message : 'Failed to save model')
    } finally {
      setSubmitLoading(false)
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
      console.log('[v0] Deleting model:', deleteId)
      const response = await fetch(`/api/models/${deleteId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      })

      if (!response.ok) {
        throw new Error('Failed to delete model')
      }

      setSuccess('Model deleted successfully!')
      setDeleteId(null)
      await loadModels()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      console.error('[v0] Delete error:', err)
      setError('Failed to delete model')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    router.push('/admin/login')
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

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <p className="text-lg font-medium">Loading models...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Models Dashboard</h1>
            <p className="text-foreground/60 mt-1">Manage all model profiles</p>
          </div>
          <Button variant="outline" onClick={handleLogout} size="sm">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Global Messages */}
        {error && (
          <div className="mb-6 rounded-md bg-red-500/10 border border-red-500/20 p-4">
            <p className="text-sm font-medium text-red-600">{error}</p>
          </div>
        )}
        {success && (
          <div className="mb-6 rounded-md bg-green-500/10 border border-green-500/20 p-4">
            <p className="text-sm font-medium text-green-600">{success}</p>
          </div>
        )}

        {/* Tabs */}
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-xs">
            <TabsTrigger value="list">All Models ({models.length})</TabsTrigger>
            <TabsTrigger value="form">{editingId ? 'Edit' : 'Add'} Model</TabsTrigger>
          </TabsList>

          {/* Add/Edit Form Tab */}
          <TabsContent value="form" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>{editingId ? 'Edit Model Profile' : 'Create New Model'}</CardTitle>
                <CardDescription>Fill in all required fields marked with *</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name & Age Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-foreground">Name *</label>
                      <Input
                        placeholder="Model name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        disabled={submitLoading}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-foreground">Age</label>
                      <Input
                        type="number"
                        placeholder="25"
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        disabled={submitLoading}
                        min="18"
                        max="100"
                        className="mt-2"
                      />
                    </div>
                  </div>

                  {/* City & WhatsApp Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-foreground">City *</label>
                      <Input
                        placeholder="e.g., Kathmandu"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        disabled={submitLoading}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-foreground">WhatsApp *</label>
                      <Input
                        placeholder="+977..."
                        value={formData.whatsapp}
                        onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                        disabled={submitLoading}
                        className="mt-2"
                      />
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="text-sm font-semibold text-foreground">Bio</label>
                    <Textarea
                      placeholder="Tell us about this model..."
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      disabled={submitLoading}
                      rows={4}
                      className="mt-2"
                    />
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="text-sm font-semibold text-foreground block mb-2">Profile Photo</label>
                    <div className="flex gap-3 items-end">
                      <div className="flex-1">
                        <Input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={handleImageUpload}
                          disabled={imageLoading || submitLoading}
                          className="cursor-pointer"
                        />
                        <p className="text-xs text-foreground/50 mt-1">JPG, PNG, or WebP. Max 5MB</p>
                      </div>
                    </div>

                    {/* Image Preview */}
                    {formData.image_url && (
                      <div className="mt-4">
                        <p className="text-sm font-medium mb-2">Preview:</p>
                        <img
                          src={formData.image_url}
                          alt="Profile preview"
                          className="h-32 w-32 object-cover rounded border border-border"
                        />
                      </div>
                    )}
                  </div>

                  {/* Featured Checkbox */}
                  <div className="flex items-center gap-3 rounded-md border border-border p-4 bg-foreground/5">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={formData.is_featured}
                      onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                      disabled={submitLoading}
                      className="w-4 h-4 cursor-pointer rounded"
                    />
                    <label htmlFor="featured" className="text-sm font-medium cursor-pointer">
                      Feature on homepage
                    </label>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      type="submit"
                      disabled={submitLoading || imageLoading}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      {submitLoading ? 'Saving...' : editingId ? 'Update Model' : 'Create Model'}
                    </Button>
                    {editingId && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={resetForm}
                        disabled={submitLoading}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Models List Tab */}
          <TabsContent value="list" className="mt-6">
            <div className="space-y-4">
              {models.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <p className="text-foreground/60">No models yet.</p>
                    <p className="text-sm text-foreground/50 mt-1">Click the "Add Model" tab to create your first profile.</p>
                  </CardContent>
                </Card>
              ) : (
                models.map((model) => (
                  <Card key={model.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex gap-6">
                        {/* Image */}
                        <div className="flex-shrink-0">
                          {model.image_url ? (
                            <img
                              src={model.image_url}
                              alt={model.name}
                              className="h-32 w-32 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="h-32 w-32 bg-foreground/10 rounded-lg flex items-center justify-center">
                              <p className="text-xs text-foreground/50">No image</p>
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-lg">{model.name}</h3>
                                {model.is_featured && (
                                  <span className="inline-block px-2 py-1 text-xs font-medium bg-primary/20 text-primary rounded">
                                    Featured
                                  </span>
                                )}
                              </div>

                              <div className="mt-2 space-y-1 text-sm text-foreground/60">
                                {model.age && <p>Age: {model.age} years</p>}
                                {model.city && <p>City: {model.city}</p>}
                                {model.whatsapp && <p>WhatsApp: {model.whatsapp}</p>}
                              </div>

                              {model.bio && (
                                <p className="mt-3 text-sm text-foreground/70 line-clamp-2">{model.bio}</p>
                              )}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 flex-shrink-0">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEdit(model)}
                              >
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => setDeleteId(model.id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Model</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this model? This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end gap-2">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
