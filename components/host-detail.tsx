"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Heart, MapPin, Phone, MessageCircle, ChevronLeft, ChevronRight } from "lucide-react"
import type { Host } from "@/lib/types"
import Link from "next/link"

interface HostDetailProps {
  host: Host
  isAuthenticated: boolean
  isFavorited: boolean
}

const WHATSAPP_MESSAGE = encodeURIComponent(
  "Hello, I found your portfolio on SAATHI NEPAL and would like to submit a professional booking inquiry.",
)

export function HostDetail({ host, isAuthenticated, isFavorited: initialFavorited }: HostDetailProps) {
  const [isFavorited, setIsFavorited] = useState(initialFavorited)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const allImages = [host.profile_image_url, ...(host.gallery_urls || [])].filter(Boolean) as string[]

  const handleFavorite = async () => {
    if (!isAuthenticated) {
      toast.info("Please sign in to save favorites")
      return
    }

    setIsLoading(true)
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setIsLoading(false)
      return
    }

    if (isFavorited) {
      const { error } = await supabase.from("favorites").delete().eq("user_id", user.id).eq("host_id", host.id)

      if (!error) {
        setIsFavorited(false)
        toast.success("Removed from favorites")
      }
    } else {
      const { error } = await supabase.from("favorites").insert({ user_id: user.id, host_id: host.id })

      if (!error) {
        setIsFavorited(true)
        toast.success("Added to favorites!")
      }
    }

    setIsLoading(false)
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length)
  }

  const whatsappUrl = host.contact_whatsapp
    ? `https://wa.me/${host.contact_whatsapp.replace(/[^0-9]/g, "")}?text=${WHATSAPP_MESSAGE}`
    : null

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
      <Link href="/browse" className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-primary">
        <ChevronLeft className="mr-1 h-4 w-4" />
        Back to Browse
      </Link>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-[3/4] overflow-hidden rounded-xl">
            <img
              src={allImages[currentImageIndex] || "/placeholder.svg?height=600&width=450&query=professional guide"}
              alt={`${host.name} - Photo ${currentImageIndex + 1}`}
              className="h-full w-full object-cover"
            />

            {allImages.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>

                <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                  {allImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`h-2 w-2 rounded-full transition-colors ${
                        idx === currentImageIndex ? "bg-white" : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Thumbnail strip */}
          {allImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`flex-shrink-0 overflow-hidden rounded-lg ${
                    idx === currentImageIndex ? "ring-2 ring-primary" : ""
                  }`}
                >
                  <img
                    src={img || "/placeholder.svg"}
                    alt={`Thumbnail ${idx + 1}`}
                    className="h-16 w-16 object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Host Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">{host.name}</h1>
                {host.age && <p className="mt-1 text-lg text-muted-foreground">{host.age} years old</p>}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={handleFavorite}
                disabled={isLoading}
                className={isFavorited ? "text-red-500 hover:text-red-600" : ""}
              >
                <Heart className={`h-5 w-5 ${isFavorited ? "fill-current" : ""}`} />
              </Button>
            </div>

            {host.location && (
              <p className="mt-2 flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {host.location}
              </p>
            )}
          </div>

          {host.categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {host.categories.map((category) => (
                <Badge key={category} variant="secondary">
                  {category}
                </Badge>
              ))}
            </div>
          )}

          {host.bio && (
            <div>
              <h2 className="text-lg font-semibold text-foreground">About</h2>
              <p className="mt-2 text-muted-foreground leading-relaxed">{host.bio}</p>
            </div>
          )}

          {/* Contact Section - Only visible to authenticated users */}
          {isAuthenticated ? (
            <div className="rounded-lg border bg-card p-6">
              <h2 className="text-lg font-semibold text-foreground">Contact Information</h2>

              {host.contact_whatsapp && (
                <div className="mt-4 space-y-3">
                  <p className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    {host.contact_whatsapp}
                  </p>

                  <a href={whatsappUrl!} target="_blank" rel="noopener noreferrer">
                    <Button className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white">
                      <MessageCircle className="mr-2 h-5 w-5" />
                      Contact via WhatsApp
                    </Button>
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-lg border bg-muted/50 p-6 text-center">
              <p className="text-muted-foreground">Sign in to view contact information and connect with {host.name}</p>
              <Link href="/auth/login">
                <Button className="mt-4">Sign In to Contact</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
