import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const searchParams = request.nextUrl.searchParams
    const location = searchParams.get("location")
    const search = searchParams.get("search")
    const status = searchParams.get("status") || "active"

    let query = supabase
      .from("hosts")
      .select("*")
      .order("created_at", { ascending: false })

    if (location) {
      query = query.eq("location", location)
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,bio.ilike.%${search}%`)
    }

    if (status) {
      query = query.eq("status", status)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("[API] Error fetching hosts:", error)
    return NextResponse.json(
      { error: "Failed to fetch hosts" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const {
      name,
      slug,
      age,
      contact_whatsapp,
      bio,
      location,
      gallery_urls,
      categories,
      profile_image_url,
      status,
    } = body

    if (!name || !slug) {
      return NextResponse.json(
        { error: "Name and slug are required" },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from("hosts")
      .insert({
        name,
        slug,
        age,
        contact_whatsapp,
        bio,
        location,
        gallery_urls: gallery_urls || [],
        categories: categories || [],
        profile_image_url,
        status: status || "pending",
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error("[API] Error creating host:", error)
    return NextResponse.json(
      { error: "Failed to create host" },
      { status: 500 }
    )
  }
}
