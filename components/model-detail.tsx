"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MapPin, MessageCircle, ChevronLeft, ChevronRight, Diamond, Star } from "lucide-react"
import type { Host } from "@/lib/types"
import Link from "next/link"

interface ModelDetailProps {
  model: Host
}

const WHATSAPP_NUMBER = "9779701083684"
const WHATSAPP_MESSAGE = encodeURIComponent(
  "Hello, I found your portfolio on EscortNepal and would like to make a booking inquiry.",
)

export function ModelDetail({ model }: ModelDetailProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const allImages = [model.profile_image_url, ...(model.gallery_urls || [])].filter(Boolean) as string[]
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length)
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 lg:px-8">
      <Link
        href="/browse"
        className="mb-8 inline-flex items-center text-sm font-medium tracking-wide text-foreground/80 hover:text-primary transition-colors"
      >
        <ChevronLeft className="mr-1 h-4 w-4" />
        Back to Gallery
      </Link>

      <div className="grid gap-12 lg:grid-cols-2">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-card border border-border/30 shadow-2xl">
            <img
              src={
                allImages[currentImageIndex] ||
                `/placeholder.svg?height=700&width=500&query=beautiful young Nepali woman model portrait elegant ${model.name || "/placeholder.svg"}`
              }
              alt={`${model.name} - Photo ${currentImageIndex + 1}`}
              className="h-full w-full object-cover"
            />

            {allImages.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/70 text-white hover:bg-black/90 rounded-full"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/70 text-white hover:bg-black/90 rounded-full"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>

                <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                  {allImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`h-2.5 rounded-full transition-all ${idx === currentImageIndex ? "bg-primary w-8" : "bg-white/60 w-2.5 hover:bg-white/90"
                        }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Thumbnail strip */}
          {allImages.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`flex-shrink-0 overflow-hidden rounded-xl transition-all border-2 ${idx === currentImageIndex
                      ? "border-primary shadow-lg"
                      : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                >
                  <img
                    src={img || "/placeholder.svg"}
                    alt={`Thumbnail ${idx + 1}`}
                    className="h-20 w-20 object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Model Info - Brighter text and better contrast */}
        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-2 text-primary">
              <Diamond className="h-4 w-4" />
              <span className="text-xs font-semibold tracking-[0.2em] uppercase">Premium Model</span>
            </div>

            <h1 className="mt-4 font-serif text-4xl lg:text-5xl font-semibold tracking-wide text-foreground">
              {model.name}
            </h1>

            <div className="mt-5 flex items-center gap-5">
              {model.age && <span className="text-lg font-medium text-foreground">{model.age} years</span>}
              {model.location && (
                <span className="flex items-center gap-2 text-lg font-medium text-foreground">
                  <MapPin className="h-5 w-5 text-primary" />
                  {model.location}
                </span>
              )}
            </div>

            {/* Rating stars */}
            <div className="mt-4 flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="h-5 w-5 fill-primary text-primary" />
              ))}
              <span className="ml-2 text-sm font-medium text-foreground/80">5.0 Rating</span>
            </div>
          </div>

          <div className="h-px w-full bg-gradient-to-r from-primary via-primary/30 to-transparent" />

          {model.bio && (
            <div>
              <h2 className="text-sm font-semibold tracking-[0.2em] uppercase text-primary">About</h2>
              <p className="mt-4 text-base font-normal leading-relaxed text-foreground/90">{model.bio}</p>
            </div>
          )}

          <div className="rounded-2xl border border-primary/30 bg-card/80 p-8 shadow-xl">
            <h2 className="text-sm font-semibold tracking-[0.2em] uppercase text-primary">Book Now</h2>
            <p className="mt-4 text-base font-normal text-foreground/80">
              Interested in booking {model.name}? Get in touch via WhatsApp for inquiries and appointments.
            </p>

            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="block mt-6">
              <Button className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white h-14 text-lg font-medium shadow-lg">
                <MessageCircle className="mr-3 h-6 w-6" />
                Contact via WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
