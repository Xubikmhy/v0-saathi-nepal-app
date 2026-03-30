'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AlertCircle, Home, RotateCcw } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('[v0] Error caught by boundary:', error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="space-y-2">
          <div className="flex justify-center">
            <AlertCircle className="h-16 w-16 text-destructive animate-pulse" />
          </div>
          <h1 className="font-serif text-4xl font-bold tracking-wide text-foreground">Something Went Wrong</h1>
          <p className="text-lg text-foreground/60">
            An unexpected error occurred. Please try again or go back home.
          </p>
        </div>

        <div className="space-y-3 pt-4">
          {error.message && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
              <p className="text-sm text-destructive/80 font-mono break-words">
                {error.message}
              </p>
            </div>
          )}

          <div className="flex flex-col items-center gap-3 sm:flex-row justify-center">
            <Button onClick={reset} size="lg" variant="default" className="gap-2">
              <RotateCcw className="h-5 w-5" />
              Try Again
            </Button>
            <Link href="/">
              <Button size="lg" variant="outline" className="gap-2">
                <Home className="h-5 w-5" />
                Go Home
              </Button>
            </Link>
          </div>
        </div>

        {error.digest && (
          <div className="pt-4 border-t border-border/20">
            <p className="text-xs text-foreground/40">Error ID: {error.digest}</p>
          </div>
        )}
      </div>
    </div>
  )
}
