'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
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
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

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
      const response = await fetch('/api/models')
      const data = await response.json()
      setModels(data.models || [])
      setError('')
    } catch {
      setError('Failed to load models')
    } finally {
      setPageLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSubmitLoading(true)

    try {
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
        image_url: formData.image_url.trim(),
        is_featured: formData.is_featured,
      }

      const method = editingId ? 'PUT' : 'POST'
      const url = editingId ? `/api/models/${editingId}` : '/api/models'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to save model')
      }

      setSuccess(editingId ? 'Model updated successfully!' : 'Model created successfully!')
      resetForm()
      await loadModels()

      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
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
      const response = await fetch(`/api/models/${deleteId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to delete model')
      }

      setSuccess('Model deleted successfully!')
      setDeleteId(null)
      await loadModels()
      setTimeout(() => setSuccess(''), 3000)
    } catch {
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
        <p className="text-lg font-medium">Loading models...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
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

        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-xs">
            <TabsTrigger value="list">All Models ({models.length})</TabsTrigger>
            <TabsTrigger value="form">{editingId ? 'Edit' : 'Add'} Model</TabsTrigger>
          </TabsList>

          <TabsContent value="form" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>{editingId ? 'Edit Model Profile' : 'Create New Model'}</CardTitle>
                <CardDescription>Fill all required fields</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold">Name *</label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold">Age</label>
                      <Input
                        type="number"
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        className="mt-2"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold">City *</label>
                      <Input
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold">WhatsApp *</label>
                      <Input
                        value={formData.whatsapp}
                        onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                        className="mt-2"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold">Bio</label>
                    <Textarea
                      rows={4}
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold block mb-2">
                      Profile Image URL
                    </label>
                    <Input
                      type="text"
                      placeholder="Paste image URL"
                      value={formData.image_url}
                      onChange={(e) =>
                        setFormData({ ...formData, image_url: e.target.value })
                      }
                    />

                    {formData.image_url && (
                      <div className="mt-4">
                        <img
                          src={formData.image_url}
                          alt="Preview"
                          className="h-32 w-32 object-cover rounded border"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 rounded-md border p-4">
                    <input
                      type="checkbox"
                      checked={formData.is_featured}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          is_featured: e.target.checked,
                        })
                      }
                    />
                    <label>Feature on homepage</label>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button type="submit" disabled={submitLoading}>
                      {submitLoading
                        ? 'Saving...'
                        : editingId
                          ? 'Update Model'
                          : 'Create Model'}
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
            <div className="space-y-4">
              {models.map((model) => (
                <Card key={model.id}>
                  <CardContent className="pt-6">
                    <div className="flex gap-6">
                      <img
                        src={model.image_url || '/placeholder.svg'}
                        alt={model.name}
                        className="h-32 w-32 object-cover rounded-lg"
                      />

                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{model.name}</h3>
                        <p className="text-sm text-foreground/60">{model.city}</p>
                        {model.bio && (
                          <p className="mt-2 text-sm text-foreground/70">
                            {model.bio}
                          </p>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(model)}>
                          Edit
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => setDeleteId(model.id)}>
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Model</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure? This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="flex justify-end gap-2">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}