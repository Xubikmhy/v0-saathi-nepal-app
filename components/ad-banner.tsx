'use client'

import * as React from 'react'
import type { Ad } from '@/lib/types'
import { cn } from '@/lib/utils'

interface AdBannerProps {
  ad: Ad
  className?: string
}

export function AdBanner({ ad, className }: AdBannerProps) {
  const content = ad.html ? (
    <div dangerouslySetInnerHTML={{ __html: ad.html }} />
  ) : ad.image_url ? (
    <img src={ad.image_url} alt={ad.title} className="max-h-24 w-full object-cover" />
  ) : (
    <div className="text-sm text-muted-foreground">{ad.title}</div>
  )

  const inner = ad.link_url ? (
    <a href={ad.link_url} target="_blank" rel="noopener noreferrer" className="block">{content}</a>
  ) : (
    content
  )

  return (
    <div
      data-slot="ad-banner"
      className={cn('border rounded-md bg-card p-3 shadow-sm', className)}
    >
      {inner}
    </div>
  )
}

