import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase.from("site_settings").select("*").limit(1).single()

    if (error && error.code !== "PGRST116") {
      console.error("[v0] Error fetching site settings:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Return default settings if none exist
    return NextResponse.json(
      data || {
        site_name: "EscortNepal",
        contact_email: "info@escortnepal.com",
        contact_phone: "+977-9701083684",
      }
    )
  } catch (error) {
    console.error("[v0] Error in GET /api/site-settings:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: authUser } = await supabase.auth.getUser()

    if (!authUser.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { site_name, logo_url, hero_headline, hero_subheadline, contact_email, contact_phone } = body

    // Try to update first, if no rows, insert
    const { data: existing } = await supabase.from("site_settings").select("id").limit(1).single()

    let response

    if (existing) {
      response = await supabase
        .from("site_settings")
        .update({
          site_name,
          logo_url,
          hero_headline,
          hero_subheadline,
          contact_email,
          contact_phone,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id)
        .select()
    } else {
      response = await supabase
        .from("site_settings")
        .insert({
          site_name,
          logo_url,
          hero_headline,
          hero_subheadline,
          contact_email,
          contact_phone,
        })
        .select()
    }

    const { data, error } = response

    if (error) {
      console.error("[v0] Error updating site settings:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data[0])
  } catch (error) {
    console.error("[v0] Error in PUT /api/site-settings:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
