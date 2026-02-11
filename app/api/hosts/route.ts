import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const location = searchParams.get("location")
    const search = searchParams.get("search")

    let query = supabase.from("hosts").select("*").eq("status", "active")

    if (location) {
      query = query.eq("location", location)
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,bio.ilike.%${search}%`)
    }

    const { data, error } = await query.order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Error fetching hosts:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Unexpected error in GET /api/hosts:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: authUser } = await supabase.auth.getUser()

    if (!authUser.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, slug, age, contact_whatsapp, bio, location, gallery_urls, categories, profile_image_url } = body

    if (!name || !slug) {
      return NextResponse.json({ error: "Name and slug are required" }, { status: 400 })
    }

    const { data, error } = await supabase.from("hosts").insert({
      name,
      slug,
      age,
      contact_whatsapp,
      bio,
      location,
      gallery_urls: gallery_urls || [],
      categories: categories || [],
      profile_image_url,
      status: "pending",
    }).select()

    if (error) {
      console.error("[v0] Error creating host:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data[0], { status: 201 })
  } catch (error) {
    console.error("[v0] Unexpected error in POST /api/hosts:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
