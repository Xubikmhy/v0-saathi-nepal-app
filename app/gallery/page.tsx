'use client'

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ImageUrlUploader } from "@/components/image-url-uploader"

export default function GalleryPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      
      <main className="flex-1">
        <section className="py-12 border-b border-border/50">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="text-center">
              <h1 className="font-serif text-4xl lg:text-5xl font-bold tracking-wide text-foreground">
                Image Gallery
              </h1>
              <p className="mt-4 text-lg text-foreground/75">
                Manage your image collection using URLs
              </p>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <ImageUrlUploader />
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
