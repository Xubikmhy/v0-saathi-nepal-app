import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ModelCard } from "@/components/model-card"
import { createClient } from "@/lib/supabase/server"
import { ArrowRight, Sparkles, Crown, Diamond, Star } from "lucide-react"

export default async function HomePage() {
  const supabase = await createClient()

  const { data: settings } = await supabase.from("site_settings").select("*").eq("id", 1).single()

  const { data: featuredModels } = await supabase.from("hosts").select("*").eq("status", "active").limit(6)

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader settings={settings} />

      <main className="flex-1">
        {/* Hero Section - Premium Dark */}
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
          {/* Background with overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-background via-card to-background" />
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
          </div>

          <div className="relative z-10 mx-auto max-w-5xl px-4 text-center lg:px-8">
            {/* Decorative element */}
            <div className="mb-8 flex justify-center">
              <Diamond className="h-10 w-10 text-primary animate-pulse" />
            </div>

            <h1 className="font-serif text-5xl font-bold tracking-wide text-foreground sm:text-6xl lg:text-7xl">
              {settings?.hero_headline || "Discover Exquisite Nepali Beauty"}
            </h1>

            <div className="mx-auto mt-6 h-1 w-40 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full" />

            <p className="mx-auto mt-8 max-w-2xl text-xl font-medium tracking-wide text-foreground/80">
              {settings?.hero_subheadline || "Premium models for your exclusive events and experiences"}
            </p>

            {/* Trust indicators */}
            <div className="mt-8 flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="h-6 w-6 fill-primary text-primary" />
              ))}
              <span className="ml-3 text-lg font-medium text-foreground/80">Trusted by 500+ clients</span>
            </div>

            <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/browse">
                <Button
                  size="lg"
                  className="group min-w-[220px] h-14 bg-primary text-primary-foreground hover:bg-primary/90 shadow-xl shadow-primary/25"
                >
                  <span className="font-semibold tracking-widest uppercase text-sm">View Gallery</span>
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/discover">
                <Button
                  size="lg"
                  variant="outline"
                  className="min-w-[220px] h-14 border-2 border-primary/60 bg-transparent text-foreground hover:bg-primary/15 hover:border-primary"
                >
                  <Sparkles className="mr-2 h-5 w-5 text-primary" />
                  <span className="font-semibold tracking-widest uppercase text-sm">Discover</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="h-14 w-7 rounded-full border-2 border-primary/50 p-1.5">
              <div className="h-3 w-2 mx-auto rounded-full bg-primary animate-pulse" />
            </div>
          </div>
        </section>

        {/* Features Section - Brighter text */}
        <section className="py-24 border-t border-border/50">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-primary/40 bg-primary/10">
                  <Crown className="h-9 w-9 text-primary" />
                </div>
                <h3 className="mt-6 font-serif text-2xl font-semibold tracking-wide text-foreground">
                  Premium Selection
                </h3>
                <p className="mt-4 text-base font-normal text-foreground/75 leading-relaxed">
                  Carefully curated collection of Nepal&apos;s most beautiful and professional models.
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-primary/40 bg-primary/10">
                  <Diamond className="h-9 w-9 text-primary" />
                </div>
                <h3 className="mt-6 font-serif text-2xl font-semibold tracking-wide text-foreground">
                  Verified Profiles
                </h3>
                <p className="mt-4 text-base font-normal text-foreground/75 leading-relaxed">
                  Every profile is thoroughly verified for authenticity and professionalism.
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-primary/40 bg-primary/10">
                  <Sparkles className="h-9 w-9 text-primary" />
                </div>
                <h3 className="mt-6 font-serif text-2xl font-semibold tracking-wide text-foreground">Direct Contact</h3>
                <p className="mt-4 text-base font-normal text-foreground/75 leading-relaxed">
                  Connect instantly via WhatsApp for inquiries and bookings.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Models Section */}
        {featuredModels && featuredModels.length > 0 && (
          <section className="py-24 border-t border-border/50">
            <div className="mx-auto max-w-7xl px-4 lg:px-8">
              <div className="mb-16 text-center">
                <p className="text-sm font-semibold tracking-[0.3em] uppercase text-primary">Our Collection</p>
                <h2 className="mt-4 font-serif text-4xl lg:text-5xl font-bold tracking-wide text-foreground">
                  Featured Models
                </h2>
                <div className="mx-auto mt-6 h-1 w-32 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full" />
              </div>
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {featuredModels.map((model) => (
                  <ModelCard key={model.id} model={model} />
                ))}
              </div>
              <div className="mt-16 text-center">
                <Link href="/browse">
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-14 border-2 border-primary/60 bg-transparent hover:bg-primary/15 hover:border-primary"
                  >
                    <span className="font-semibold tracking-widest uppercase text-sm">View All Models</span>
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        )}
      </main>

      <SiteFooter settings={settings} />
    </div>
  )
}
