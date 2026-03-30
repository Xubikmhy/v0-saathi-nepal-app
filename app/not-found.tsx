'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Home, ArrowRight } from 'lucide-react'

export default function NotFound() {
  const router = useRouter()

  useEffect(() => {
    // Auto-redirect to home after 2 seconds
    const timer = setTimeout(() => {
      router.push('/')
    }, 2000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <div className="flex justify-center">
            <Home className="h-16 w-16 text-primary animate-bounce" />
          </div>
          <h1 className="font-serif text-4xl font-bold tracking-wide text-foreground">Page Not Found</h1>
          <p className="text-lg text-foreground/60">
            The page you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
        </div>

        <div className="space-y-4 pt-4">
          <p className="text-base text-foreground/50">Redirecting to home in 2 seconds...</p>
          <div className="flex flex-col items-center gap-3 sm:flex-row justify-center">
            <Link href="/">
              <Button size="lg" className="gap-2">
                <Home className="h-5 w-5" />
                Go Home Now
              </Button>
            </Link>
            <Link href="/browse">
              <Button size="lg" variant="outline" className="gap-2">
                Browse Models
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="pt-8 border-t border-border/20">
          <p className="text-sm text-foreground/40">
            Or explore: <Link href="/discover" className="text-primary hover:underline">Discover</Link> • <Link href="/dashboard" className="text-primary hover:underline">Dashboard</Link> • <Link href="/blog" className="text-primary hover:underline">Blog</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
