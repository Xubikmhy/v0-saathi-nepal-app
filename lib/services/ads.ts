import type { Ad } from "@/lib/types"

export async function getAds(position?: string): Promise<Ad[]> {
  const params = new URLSearchParams()
  if (position) params.append("position", position)

  const response = await fetch(`/api/ads?${params.toString()}`)
  if (!response.ok) {
    throw new Error("Failed to fetch ads")
  }
  return response.json()
}

export async function createAd(adData: Partial<Ad>): Promise<Ad> {
  const response = await fetch("/api/ads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(adData),
  })
  if (!response.ok) {
    throw new Error("Failed to create ad")
  }
  return response.json()
}

export async function updateAd(id: string, adData: Partial<Ad>): Promise<Ad> {
  const response = await fetch(`/api/ads/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(adData),
  })
  if (!response.ok) {
    throw new Error("Failed to update ad")
  }
  return response.json()
}

export async function deleteAd(id: string): Promise<void> {
  const response = await fetch(`/api/ads/${id}`, {
    method: "DELETE",
  })
  if (!response.ok) {
    throw new Error("Failed to delete ad")
  }
}
