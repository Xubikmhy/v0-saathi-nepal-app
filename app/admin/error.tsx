'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AlertCircle, Home, RotateCcw } from 'lucide-react'

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[v0] Admin error:', error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="space-y-2">
          <div className="flex justify-center">
            <AlertCircle className="h-16 w-16 text-destructive animate-pulse" />
          </div>
          <h1 className="font-serif text-4xl font-bold tracking-wide text-foreground">Admin Error</h1>
          <p className="text-lg text-foreground/60">
            An error occurred in the admin dashboard. Please try again.
          </p>
        </div>

        {error.message && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-left">
            <p className="text-sm text-destructive/80 font-mono break-words">
              {error.message}
            </p>
          </div>
        )}

        <div className="flex flex-col items-center gap-3 sm:flex-row justify-center">
          <Button onClick={reset} size="lg" variant="default" className="gap-2">
            <RotateCcw className="h-5 w-5" />
            Retry
          </Button>
          <Link href="/">
            <Button size="lg" variant="outline" className="gap-2">
              <Home className="h-5 w-5" />
              Exit Admin
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
