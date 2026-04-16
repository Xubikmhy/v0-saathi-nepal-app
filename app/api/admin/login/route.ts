import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { supabase } from "@/lib/supabase"

const ADMIN_EMAIL = "admin@saathi.com"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    const { data, error } = await supabase
      .from("admin_settings")
      .select("password")
      .eq("id", 1)
      .single()

    if (error || !data) {
      return NextResponse.json(
        { error: "Password not configured" },
        { status: 500 }
      )
    }

    const validPassword = await bcrypt.compare(
      password,
      data.password
    )

    if (email === ADMIN_EMAIL && validPassword) {
      const response = NextResponse.json({ success: true })

      response.cookies.set("admin_session", "true", {
        httpOnly: true,
        secure: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      })

      return response
    }

    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401 }
    )
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
