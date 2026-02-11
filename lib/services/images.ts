/**
 * Image Management Service
 * Handles image uploads, deletions, and retrieval from Supabase storage
 */

export interface ImageUploadResponse {
  success: boolean
  url: string
  path: string
  filename: string
}

export interface ImageListResponse {
  success: boolean
  folder: string
  images: Array<{
    name: string
    url: string
    path: string
    created: string
    updated: string
  }>
  count: number
}

export interface ImageDeleteResponse {
  success: boolean
  message: string
}

/**
 * Upload an image to Supabase storage
 * @param file - File to upload
 * @param folder - Folder to upload to (default: "general")
 * @returns Upload response with URL
 */
export async function uploadImage(
  file: File,
  folder: string = "general"
): Promise<ImageUploadResponse> {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("folder", folder)

  const response = await fetch("/api/upload/image", {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to upload image")
  }

  return response.json()
}

/**
 * Delete an image from Supabase storage
 * @param path - Path to image (e.g., "hosts/123.jpg")
 * @returns Delete response
 */
export async function deleteImage(path: string): Promise<ImageDeleteResponse> {
  const response = await fetch("/api/upload/image", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ path }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to delete image")
  }

  return response.json()
}

/**
 * List all images in a folder
 * @param folder - Folder name (default: "general")
 * @returns List of images with URLs
 */
export async function listImages(folder: string = "general"): Promise<ImageListResponse> {
  const response = await fetch(`/api/images?folder=${encodeURIComponent(folder)}`)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to list images")
  }

  return response.json()
}

/**
 * Copy an image within storage
 * @param from - Source path
 * @param to - Destination path
 * @returns Copy response with new URL
 */
export async function copyImage(from: string, to: string) {
  const response = await fetch("/api/images", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to copy image")
  }

  return response.json()
}

/**
 * Upload multiple images
 * @param files - Files to upload
 * @param folder - Folder to upload to
 * @returns Array of upload responses
 */
export async function uploadMultipleImages(
  files: File[],
  folder: string = "general"
): Promise<ImageUploadResponse[]> {
  const uploads = files.map((file) => uploadImage(file, folder))
  return Promise.all(uploads)
}
