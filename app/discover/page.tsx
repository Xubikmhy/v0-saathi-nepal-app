import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { ModelCard } from '@/components/model-card'
import { createClient } from '@/lib/supabase/server'
import type { Model } from '@/lib/types'

export const metadata = {
  title: 'Discover Featured Models',
  description: 'Discover our featured premium models',
}

export default async function DiscoverPage() {
  const supabase = await createClient()

  const { data: models } = await supabase
    .from('models')
    .select('*')
    .eq('is_featured', true)
    .order('created_at', { ascending: false })

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />

      <main className="flex-1">
        <section className="border-t border-border/50 py-16">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="mb-12 text-center">
              <h1 className="font-serif text-4xl lg:text-5xl font-bold tracking-wide text-foreground">
                Featured Models
              </h1>
              <p className="mt-4 text-foreground/60">
                Our hand-picked selection of premium models
              </p>
            </div>

            {models && models.length > 0 ? (
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {(models as Model[]).map((model) => (
                  <ModelCard key={model.id} model={model} />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center text-foreground/60">
                <p className="text-lg">No featured models yet.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
