"use client"

import type React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, X, MapPin } from "lucide-react"
import { useState } from "react"

interface LocationFilterProps {
  locations: string[]
  currentLocation?: string
  currentSearch?: string
}

export function LocationFilter({ locations, currentLocation, currentSearch }: LocationFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(currentSearch || "")

  const updateFilters = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== "all") {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/browse?${params.toString()}`)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateFilters("search", search || null)
  }

  const clearFilters = () => {
    setSearch("")
    router.push("/browse")
  }

  const hasFilters = currentLocation || currentSearch

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSearch} className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground/50" />
          <Input
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-12 bg-card border-border h-14 text-base font-normal text-foreground placeholder:text-foreground/50"
          />
        </div>
        <Button type="submit" className="h-14 px-8 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg">
          <span className="font-semibold tracking-wide">Search</span>
        </Button>
      </form>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-3">
          <MapPin className="h-5 w-5 text-primary" />
          <span className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">Location:</span>
          <Select value={currentLocation || "all"} onValueChange={(value) => updateFilters("location", value)}>
            <SelectTrigger className="w-[200px] bg-card border-border h-12 text-base font-medium text-foreground">
              <SelectValue placeholder="All Locations" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="all" className="font-medium text-foreground">
                All Locations
              </SelectItem>
              {locations.map((location) => (
                <SelectItem key={location} value={location} className="font-medium text-foreground">
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-foreground/70 hover:text-foreground hover:bg-card"
          >
            <X className="mr-2 h-4 w-4" />
            <span className="font-medium">Clear Filters</span>
          </Button>
        )}
      </div>
    </div>
  )
}
