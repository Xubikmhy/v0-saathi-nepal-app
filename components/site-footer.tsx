import Link from "next/link"
import { MessageCircle } from "lucide-react"
import type { SiteSettings } from "@/lib/types"

interface SiteFooterProps {
  settings?: SiteSettings | null
}

export function SiteFooter({ settings }: SiteFooterProps) {
  return (
    <footer className="border-t border-border/50 bg-card/50">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-3">
              <img src="/logo.svg" alt="EscortNepal - Premium Nepali Escorts" className="h-6 w-6" width="24" height="24" />
              <span className="font-serif text-lg font-semibold tracking-[0.15em] text-foreground uppercase">
                {settings?.site_name || "EscortNepal"}
              </span>
            </Link>
            <p className="mt-6 text-sm font-normal leading-relaxed text-foreground/75">
              Premium collection of Nepal&apos;s most beautiful and verified escorts. Exclusive profiles for distinguished clients seeking professional companionship and modeling services.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-[0.2em] uppercase text-primary">Explore</h3>
            <ul className="mt-6 space-y-4">
              <li>
                <Link
                  href="/browse"
                  className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
                >
                  Gallery
                </Link>
              </li>
              <li>
                <Link
                  href="/discover"
                  className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
                >
                  Discover
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-[0.2em] uppercase text-primary">Contact</h3>
            <ul className="mt-6 space-y-4">
              <li>
                <a
                  href="https://wa.me/9779701083684"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </a>
              </li>
              <li>
                <Link
                  href="/admin"
                  className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
                >
                  Admin Dashboard
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border/30">
          <div className="flex flex-col items-center gap-4">
            <div className="h-px w-20 bg-gradient-to-r from-transparent via-primary to-transparent" />
            <p className="text-center text-sm font-medium tracking-widest uppercase text-foreground/70">
              © {new Date().getFullYear()} {settings?.site_name || "EscortNepal"}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
