"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Heart, X, MapPin, Info, MessageCircle, Star } from "lucide-react"
import type { Host } from "@/lib/types"

interface DiscoverSwiperProps {
  models: Host[]
}

const WHATSAPP_NUMBER = "9779701083684"
const WHATSAPP_MESSAGE = encodeURIComponent(
  "Hello, I found your portfolio on EscortNepal and would like to make a booking inquiry.",
)

export function DiscoverSwiper({ models }: DiscoverSwiperProps) {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState<"left" | "right" | null>(null)
  const [liked, setLiked] = useState<Set<string>>(new Set())

  const currentModel = models[currentIndex]
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`

  const handleSwipe = useCallback(
    (isLike: boolean) => {
      if (!currentModel) return

      setDirection(isLike ? "right" : "left")

      if (isLike) {
        setLiked(new Set([...liked, currentModel.id]))
      }

      setTimeout(() => {
        setDirection(null)
        if (currentIndex < models.length - 1) {
          setCurrentIndex(currentIndex + 1)
        } else {
          setCurrentIndex(0)
        }
      }, 300)
    },
    [currentModel, currentIndex, models.length, liked],
  )

  const goToProfile = () => {
    if (currentModel) {
      router.push(`/host/${currentModel.slug}`)
    }
  }

  if (!currentModel) {
    return (
      <div className="flex h-[calc(100vh-80px)] items-center justify-center">
        <p className="text-lg font-medium text-foreground">No models available.</p>
      </div>
    )
  }

  return (
    <div className="relative flex h-[calc(100vh-80px)] flex-col items-center justify-center overflow-hidden px-4">
      {/* Progress indicator */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 flex gap-1.5">
        {models.slice(0, 10).map((_, idx) => (
          <div
            key={idx}
            className={`h-1.5 w-8 rounded-full transition-colors ${idx === currentIndex % 10 ? "bg-primary" : idx < currentIndex % 10 ? "bg-primary/50" : "bg-muted"
              }`}
          />
        ))}
      </div>

      {/* Card - Enhanced with better visibility */}
      <div
        className={`relative w-full max-w-sm overflow-hidden rounded-3xl bg-card border border-border/30 shadow-2xl shadow-black/50 transition-all duration-300 ${direction === "left"
            ? "-translate-x-full rotate-[-15deg] opacity-0"
            : direction === "right"
              ? "translate-x-full rotate-[15deg] opacity-0"
              : ""
          }`}
      >
        <div className="aspect-[3/4] relative">
          <img
            src={
              currentModel.profile_image_url ||
              `/placeholder.svg?height=700&width=500&query=beautiful young Nepali woman model portrait elegant ${currentModel.name || "/placeholder.svg"}`
            }
            alt={currentModel.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

          {/* Premium badge */}
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1.5 text-xs font-semibold tracking-wider uppercase bg-primary text-primary-foreground rounded-full shadow-lg">
              Model
            </span>
          </div>

          {/* Model info overlay - Brighter more visible text */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="font-serif text-3xl font-semibold tracking-wide text-white drop-shadow-lg">
                  {currentModel.name}
                </h2>
                <p className="mt-2 text-xl font-medium text-white/95 drop-shadow">{currentModel.age} years</p>
                {currentModel.location && (
                  <p className="mt-2 flex items-center gap-2 text-base font-medium text-white/90 drop-shadow">
                    <MapPin className="h-4 w-4" />
                    {currentModel.location}
                  </p>
                )}
                {/* Rating */}
                <div className="mt-3 flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-primary hover:bg-white/20 h-12 w-12 rounded-full"
                onClick={goToProfile}
              >
                <Info className="h-6 w-6" />
              </Button>
            </div>

            {currentModel.bio && (
              <p className="mt-4 line-clamp-2 text-sm font-medium text-white/85 leading-relaxed drop-shadow">
                {currentModel.bio}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Action buttons - Larger and more prominent */}
      <div className="mt-10 flex items-center gap-8">
        <Button
          variant="outline"
          size="lg"
          className="h-16 w-16 rounded-full border-2 border-foreground/30 text-foreground hover:border-destructive hover:bg-destructive/20 hover:text-destructive bg-transparent"
          onClick={() => handleSwipe(false)}
        >
          <X className="h-7 w-7" />
          <span className="sr-only">Pass</span>
        </Button>

        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
          <Button
            size="lg"
            className="h-20 w-20 rounded-full bg-[#25D366] hover:bg-[#128C7E] text-white shadow-xl shadow-[#25D366]/30"
          >
            <MessageCircle className="h-9 w-9" />
            <span className="sr-only">Contact via WhatsApp</span>
          </Button>
        </a>

        <Button
          variant="outline"
          size="lg"
          className="h-16 w-16 rounded-full border-2 border-foreground/30 text-foreground hover:border-primary hover:bg-primary/20 hover:text-primary bg-transparent"
          onClick={() => handleSwipe(true)}
        >
          <Heart className={`h-7 w-7 ${liked.has(currentModel.id) ? "fill-primary text-primary" : ""}`} />
          <span className="sr-only">Like</span>
        </Button>
      </div>

      {/* Counter - More visible */}
      <p className="mt-6 text-base font-medium text-foreground/80">
        {currentIndex + 1} of {models.length}
      </p>
    </div>
  )
}
