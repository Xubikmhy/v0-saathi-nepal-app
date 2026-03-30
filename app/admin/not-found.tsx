'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home, LayoutDashboard } from 'lucide-react'

export default function AdminNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="font-serif text-4xl font-bold tracking-wide text-foreground">Admin Page Not Found</h1>
          <p className="text-lg text-foreground/60">
            The admin page you&apos;re looking for doesn&apos;t exist.
          </p>
        </div>

        <div className="flex flex-col items-center gap-3 sm:flex-row justify-center">
          <Link href="/admin">
            <Button size="lg" className="gap-2">
              <LayoutDashboard className="h-5 w-5" />
              Back to Dashboard
            </Button>
          </Link>
          <Link href="/">
            <Button size="lg" variant="outline" className="gap-2">
              <Home className="h-5 w-5" />
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
