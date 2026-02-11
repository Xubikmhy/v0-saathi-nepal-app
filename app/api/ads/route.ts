import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const position = searchParams.get("position")

    let query = supabase
      .from("ads")
      .select("*")
      .eq("is_active", true)

    if (position) {
      query = query.eq("position", position)
    }

    const { data, error } = await query.order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Error fetching ads:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error("[v0] Error in GET /api/ads:", error)
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
    const { title, image_url, link_url, html, position, is_active, start_at, end_at } = body

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("ads")
      .insert({
        title,
        image_url,
        link_url,
        html,
        position: position || "header",
        is_active: is_active ?? true,
        start_at,
        end_at,
      })
      .select()

    if (error) {
      console.error("[v0] Error creating ad:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data[0], { status: 201 })
  } catch (error) {
    console.error("[v0] Error in POST /api/ads:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
