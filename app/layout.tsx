import type React from "react"
import type { Metadata, Viewport } from "next"
import { Playfair_Display, Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Toaster } from "sonner"
import { ThemeProvider } from "@/components/theme-provider"

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-serif",
})

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "EscortNepal | Premium Nepali Escorts & Models in Kathmandu & Pokhara",
  description:
    "Discover stunning, verified Nepali escorts and premium models for exclusive companionship, events, and photoshoots. Direct WhatsApp contact with beautiful escorts in Kathmandu, Pokhara, and across Nepal.",
  keywords: [
    "Nepali escorts",
    "escorts in Nepal",
    "Kathmandu escorts",
    "Pokhara escorts",
    "premium models Nepal",
    "verified escorts",
    "escort services",
    "companion",
    "EscortNepal",
  ],
  generator: "v0.app",
  authors: [{ name: "EscortNepal" }],
  robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  canonical: "https://escortnepal.com",
  alternates: {
    canonical: "https://escortnepal.com",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://escortnepal.com",
    siteName: "EscortNepal",
    title: "EscortNepal | Premium Nepali Escorts & Models",
    description:
      "Discover verified Nepali escorts and premium models for exclusive companionship and events. Connect directly via WhatsApp.",
    images: [
      {
        url: "https://escortnepal.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "EscortNepal - Premium Nepali Escorts",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EscortNepal | Premium Nepali Escorts & Models",
    description:
      "Discover verified Nepali escorts and premium models for exclusive companionship and events. Connect directly via WhatsApp.",
    images: ["https://escortnepal.com/twitter-image.jpg"],
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
  verification: {
    google: "B3BX8VYGgrI_a2hlNTX0h9BkCZpL7S-SsmcNQ_198Gk",
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0a0a12" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a12" },
  ],
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "EscortNepal",
    description: "Premium Nepali escorts and models for exclusive companionship and events",
    url: "https://escortnepal.com",
    telephone: "+977-9701083684",
    image: "https://escortnepal.com/logo.svg",
    areaServed: {
      "@type": "Place",
      name: "Nepal",
      geo: {
        "@type": "GeoShape",
        description: "Nepal",
      },
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Support",
      telephone: "+977-9701083684",
    },
    sameAs: ["https://wa.me/9779701083684"],
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${playfair.variable} ${inter.variable} font-sans antialiased`} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          forcedTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <Toaster position="top-center" richColors theme="dark" />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
