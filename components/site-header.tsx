"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Menu, X } from "lucide-react"
import { useState } from "react"
import type { SiteSettings } from "@/lib/types"

interface SiteHeaderProps {
  settings?: SiteSettings | null
  isAuthenticated?: boolean
  isAdmin?: boolean
}

export function SiteHeader({ settings, isAuthenticated, isAdmin }: SiteHeaderProps) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navigation = [
    { name: "Gallery", href: "/browse" },
    { name: "Discover", href: "/discover" },
  ]

  if (isAuthenticated) {
    navigation.push({ name: "Favorites", href: "/favorites" })
    navigation.push({ name: "Profile", href: "/profile" })
  }

  if (isAdmin) {
    navigation.push({ name: "Admin", href: "/admin" })
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <img src="/logo.svg" alt="EscortNepal Logo" className="h-8 w-8" />
          <span className="font-serif text-xl font-semibold tracking-[0.15em] text-foreground uppercase">
            {settings?.site_name || "EscortNepal"}
          </span>
        </Link>

        <div className="hidden md:flex md:items-center md:gap-10">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "text-sm font-medium tracking-widest uppercase transition-colors hover:text-primary",
                pathname === item.href ? "text-primary" : "text-foreground/80",
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <button type="button" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="h-6 w-6 text-foreground" /> : <Menu className="h-6 w-6 text-foreground" />}
          <span className="sr-only">Toggle menu</span>
        </button>
      </nav>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/50">
          <div className="space-y-1 px-4 pb-6 pt-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "block py-3 text-sm font-medium tracking-widest uppercase",
                  pathname === item.href ? "text-primary" : "text-foreground/80",
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
