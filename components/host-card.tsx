import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin } from "lucide-react"
import type { Host } from "@/lib/types"

interface HostCardProps {
  host: Host
}

export function HostCard({ host }: HostCardProps) {
  return (
    <Link href={`/host/${host.slug}`}>
      <Card className="group overflow-hidden transition-all hover:shadow-lg">
        <div className="aspect-[3/4] overflow-hidden">
          <img
            src={host.profile_image_url || "/placeholder.svg?height=500&width=400&query=professional guide portrait"}
            alt={host.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-foreground">{host.name}</h3>
              {host.location && (
                <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {host.location}
                </p>
              )}
            </div>
            {host.age && <span className="text-sm text-muted-foreground">{host.age} yrs</span>}
          </div>
          {host.categories.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {host.categories.slice(0, 3).map((category) => (
                <Badge key={category} variant="secondary" className="text-xs">
                  {category}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
