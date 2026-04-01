"use client"

import { MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Model } from "@/lib/types"

interface ModelCardProps {
  model: Model
}

export function ModelCard({ model }: ModelCardProps) {
  const whatsappUrl = model.whatsapp
    ? `https://wa.me/${model.whatsapp.replace(/[^\d]/g, '')}?text=${encodeURIComponent("Hello! I found your profile and would like to inquire about booking.")}`
    : null

  return (
    <div className="group relative overflow-hidden rounded-xl bg-card border border-border/30 shadow-xl shadow-black/20">
      <div className="aspect-[3/4] overflow-hidden bg-foreground/10">
        {model.image_url ? (
          <img
            src={model.image_url}
            alt={model.name}
            className="h-full w-full object-cover transition-all duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-foreground/40">
            No image
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-5">
        <div className="flex items-end justify-between">
          <div>
            <h3 className="font-serif text-xl font-semibold tracking-wide text-white drop-shadow-lg">{model.name}</h3>
            <div className="mt-2 flex items-center gap-3">
              {model.city && (
                <p className="text-sm font-medium text-white/90 drop-shadow">
                  {model.city}
                </p>
              )}
              {model.age && <span className="text-sm font-medium text-white/90 drop-shadow">{model.age} yrs</span>}
            </div>
          </div>

          {whatsappUrl && (
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
              <Button
                size="sm"
                className="bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full h-11 w-11 p-0 shadow-lg"
              >
                <MessageCircle className="h-5 w-5" />
                <span className="sr-only">Contact via WhatsApp</span>
              </Button>
            </a>
          )}
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
