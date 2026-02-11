import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("hosts")
      .select("*")
      .eq("id", id)
      .single()

    if (error) {
      return NextResponse.json(
        { error: "Host not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("[API] Error fetching host:", error)
    return NextResponse.json(
      { error: "Failed to fetch host" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id
    const supabase = await createClient()
    const body = await request.json()

    const { data, error } = await supabase
      .from("hosts")
      .update(body)
      .eq("id", id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("[API] Error updating host:", error)
    return NextResponse.json(
      { error: "Failed to update host" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id
    const supabase = await createClient()

    const { error } = await supabase
      .from("hosts")
      .delete()
      .eq("id", id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[API] Error deleting host:", error)
    return NextResponse.json(
      { error: "Failed to delete host" },
      { status: 500 }
    )
  }
}
