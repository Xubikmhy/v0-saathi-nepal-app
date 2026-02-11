"use client"

import Link from "next/link"
import { MapPin, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Host } from "@/lib/types"

interface ModelCardProps {
  model: Host
}

const WHATSAPP_NUMBER = "9779701083684"
const WHATSAPP_MESSAGE = encodeURIComponent(
  "Hello, I found your portfolio on EscortNepal and would like to make a booking inquiry.",
)

export function ModelCard({ model }: ModelCardProps) {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`

  return (
    <div className="group relative overflow-hidden rounded-xl bg-card border border-border/30 shadow-xl shadow-black/20">
      <Link href={`/host/${model.slug}`}>
        <div className="aspect-[3/4] overflow-hidden">
          <img
            src={
              model.profile_image_url ||
              `/placeholder.svg?height=700&width=500&query=beautiful young Nepali woman model portrait elegant ${model.name || "/placeholder.svg"}`
            }
            alt={`${model.name}${model.age ? `, ${model.age} years old` : ""}${model.location ? ` from ${model.location}` : ""} - Premium Nepali escort model on EscortNepal`}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-all duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />
        </div>
      </Link>

      <div className="absolute bottom-0 left-0 right-0 p-5">
        <div className="flex items-end justify-between">
          <div>
            <h3 className="font-serif text-xl font-semibold tracking-wide text-white drop-shadow-lg">{model.name}</h3>
            <div className="mt-2 flex items-center gap-3">
              {model.location && (
                <p className="flex items-center gap-1.5 text-sm font-medium text-white/90 drop-shadow">
                  <MapPin className="h-3.5 w-3.5" />
                  {model.location}
                </p>
              )}
              {model.age && <span className="text-sm font-medium text-white/90 drop-shadow">{model.age} yrs</span>}
            </div>
          </div>

          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
            <Button
              size="sm"
              className="bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full h-11 w-11 p-0 shadow-lg"
            >
              <MessageCircle className="h-5 w-5" />
              <span className="sr-only">Contact via WhatsApp</span>
            </Button>
          </a>
        </div>
      </div>

      <div className="absolute top-3 left-3">
        <span className="px-3 py-1 text-xs font-medium tracking-wider uppercase bg-primary/90 text-primary-foreground rounded-full shadow">
          Model
        </span>
      </div>
    </div>
  )
}
