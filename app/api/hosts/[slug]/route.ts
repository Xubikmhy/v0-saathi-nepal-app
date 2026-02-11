import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("hosts")
      .select("*")
      .eq("slug", slug)
      .eq("status", "active")
      .single()

    if (error || !data) {
      return NextResponse.json({ error: "Host not found" }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Error fetching host:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const supabase = await createClient()
    const { data: authUser } = await supabase.auth.getUser()

    if (!authUser.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, age, contact_whatsapp, bio, location, gallery_urls, categories, profile_image_url, status } = body

    const { data, error } = await supabase
      .from("hosts")
      .update({
        name,
        age,
        contact_whatsapp,
        bio,
        location,
        gallery_urls,
        categories,
        profile_image_url,
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("slug", slug)
      .select()

    if (error) {
      console.error("[v0] Error updating host:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: "Host not found" }, { status: 404 })
    }

    return NextResponse.json(data[0])
  } catch (error) {
    console.error("[v0] Error in PUT /api/hosts/[slug]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const supabase = await createClient()
    const { data: authUser } = await supabase.auth.getUser()

    if (!authUser.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { error } = await supabase.from("hosts").delete().eq("slug", slug)

    if (error) {
      console.error("[v0] Error deleting host:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error in DELETE /api/hosts/[slug]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
