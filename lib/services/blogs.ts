import type { Blog } from "@/lib/types"

export async function getBlogs(limit: number = 10): Promise<Blog[]> {
  const response = await fetch(`/api/blogs?limit=${limit}`)
  if (!response.ok) {
    throw new Error("Failed to fetch blogs")
  }
  return response.json()
}

export async function createBlog(blogData: Partial<Blog>): Promise<Blog> {
  const response = await fetch("/api/blogs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(blogData),
  })
  if (!response.ok) {
    throw new Error("Failed to create blog")
  }
  return response.json()
}

export async function updateBlog(id: string, blogData: Partial<Blog>): Promise<Blog> {
  const response = await fetch(`/api/blogs/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(blogData),
  })
  if (!response.ok) {
    throw new Error("Failed to update blog")
  }
  return response.json()
}

export async function deleteBlog(id: string): Promise<void> {
  const response = await fetch(`/api/blogs/${id}`, {
    method: "DELETE",
  })
  if (!response.ok) {
    throw new Error("Failed to delete blog")
  }
}
