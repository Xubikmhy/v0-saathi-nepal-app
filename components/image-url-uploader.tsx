"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import Image from "next/image"
import { Loader2, X, Check } from "lucide-react"

interface ImageData {
  id: string
  image_url: string
  created_at: string
}

export function ImageUrlUploader() {
  const [imageUrl, setImageUrl] = useState("")
  const [images, setImages] = useState<ImageData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingImages, setIsLoadingImages] = useState(false)
  const [error, setError] = useState("")

  const supabase = createClient()

  // Validate URL
  const isValidUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url)
      return urlObj.protocol === "http:" || urlObj.protocol === "https:"
    } catch {
      return false
    }
  }

  // Load images from Supabase
  const loadImages = async () => {
    setIsLoadingImages(true)
    try {
      const { data, error: fetchError } = await supabase
        .from("images")
        .select("*")
        .order("created_at", { ascending: false })

      if (fetchError) {
        console.error("[v0] Fetch error:", fetchError)
        toast.error("Failed to load images")
        return
      }

      setImages(data || [])
    } catch (err: any) {
      console.error("[v0] Error loading images:", err)
      toast.error("Error loading images")
    } finally {
      setIsLoadingImages(false)
    }
  }

  // Load images on mount
  useEffect(() => {
    loadImages()
  }, [])

  // Save image URL to Supabase
  const handleSaveImage = async () => {
    // Clear previous error
    setError("")

    // Validate input
    if (!imageUrl.trim()) {
      setError("Please enter an image URL")
      return
    }

    if (!isValidUrl(imageUrl)) {
      setError("Please enter a valid URL (must start with http:// or https://)")
      return
    }

    setIsLoading(true)
    try {
      const { data, error: insertError } = await supabase
        .from("images")
        .insert({
          image_url: imageUrl,
        })
        .select()

      if (insertError) {
        console.error("[v0] Insert error:", insertError)
        toast.error("Failed to save image")
        setError("Failed to save image. Please try again.")
        return
      }

      // Add new image to the top of the list
      if (data && data.length > 0) {
        setImages([data[0], ...images])
        setImageUrl("")
        toast.success("Image saved successfully!")
      }
    } catch (err: any) {
      console.error("[v0] Error saving image:", err)
      toast.error("Error saving image")
      setError("Error saving image. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Delete image
  const handleDeleteImage = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from("images")
        .delete()
        .eq("id", id)

      if (deleteError) {
        console.error("[v0] Delete error:", deleteError)
        toast.error("Failed to delete image")
        return
      }

      setImages(images.filter((img) => img.id !== id))
      toast.success("Image deleted")
    } catch (err: any) {
      console.error("[v0] Error deleting image:", err)
      toast.error("Error deleting image")
    }
  }

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && imageUrl.trim()) {
      handleSaveImage()
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Input Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Add Image by URL</h2>
        <p className="text-sm text-muted-foreground">
          Paste an image URL below and click Save to add it to your gallery
        </p>

        <div className="space-y-2">
          <Input
            type="url"
            placeholder="https://example.com/image.jpg"
            value={imageUrl}
            onChange={(e) => {
              setImageUrl(e.target.value)
              setError("") // Clear error when user starts typing
            }}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            className="h-11"
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleSaveImage}
            disabled={isLoading || !imageUrl.trim()}
            className="gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                Save Image
              </>
            )}
          </Button>

          <Button
            variant="outline"
            onClick={loadImages}
            disabled={isLoadingImages}
            className="gap-2"
          >
            {isLoadingImages ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Refresh Gallery"
            )}
          </Button>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Image Gallery</h2>
          <p className="text-sm text-muted-foreground">{images.length} images</p>
        </div>

        {images.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-8 text-center">
            <p className="text-muted-foreground">No images yet. Add one by pasting a URL above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((image) => (
              <div key={image.id} className="group relative rounded-lg overflow-hidden border border-border h-64">
                <Image
                  src={image.image_url}
                  alt="Gallery image"
                  fill
                  className="object-cover"
                  onError={(e) => {
                    console.error("[v0] Image load error for:", image.image_url)
                  }}
                />

                {/* Delete button */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteImage(image.id)}
                    className="gap-2"
                  >
                    <X className="h-4 w-4" />
                    Delete
                  </Button>
                </div>

                {/* Timestamp */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-3 py-2 text-xs text-white">
                  {new Date(image.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
