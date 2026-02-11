import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: authUser } = await supabase.auth.getUser()

    if (!authUser.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data, error } = await supabase
      .from("favorites")
      .select("host_id")
      .eq("user_id", authUser.user.id)

    if (error) {
      console.error("[v0] Error fetching favorites:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error("[v0] Error in GET /api/favorites:", error)
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
    const { host_id } = body

    if (!host_id) {
      return NextResponse.json({ error: "host_id is required" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("favorites")
      .insert({
        user_id: authUser.user.id,
        host_id,
      })
      .select()

    if (error) {
      console.error("[v0] Error creating favorite:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data[0], { status: 201 })
  } catch (error) {
    console.error("[v0] Error in POST /api/favorites:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: authUser } = await supabase.auth.getUser()

    if (!authUser.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { host_id } = await request.json()

    if (!host_id) {
      return NextResponse.json({ error: "host_id is required" }, { status: 400 })
    }

    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("user_id", authUser.user.id)
      .eq("host_id", host_id)

    if (error) {
      console.error("[v0] Error deleting favorite:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error in DELETE /api/favorites:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
