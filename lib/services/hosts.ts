import type { Host } from "@/lib/types"

export async function getHosts(location?: string, search?: string): Promise<Host[]> {
  const params = new URLSearchParams()
  if (location) params.append("location", location)
  if (search) params.append("search", search)

  const response = await fetch(`/api/hosts?${params.toString()}`)
  if (!response.ok) {
    throw new Error("Failed to fetch hosts")
  }
  return response.json()
}

export async function getHostBySlug(slug: string): Promise<Host> {
  const response = await fetch(`/api/hosts/${slug}`)
  if (!response.ok) {
    throw new Error("Failed to fetch host")
  }
  return response.json()
}

export async function createHost(hostData: Partial<Host>): Promise<Host> {
  const response = await fetch("/api/hosts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(hostData),
  })
  if (!response.ok) {
    throw new Error("Failed to create host")
  }
  return response.json()
}

export async function updateHost(slug: string, hostData: Partial<Host>): Promise<Host> {
  const response = await fetch(`/api/hosts/${slug}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(hostData),
  })
  if (!response.ok) {
    throw new Error("Failed to update host")
  }
  return response.json()
}

export async function deleteHost(slug: string): Promise<void> {
  const response = await fetch(`/api/hosts/${slug}`, {
    method: "DELETE",
  })
  if (!response.ok) {
    throw new Error("Failed to delete host")
  }
}
