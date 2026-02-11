import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { hash, compare } from "bcryptjs"

// Default admin credentials - CHANGE THESE IN PRODUCTION
const DEFAULT_ADMIN_EMAIL = "admin@escortnepal.com"
const DEFAULT_ADMIN_PASSWORD = "EscortNepal@2024"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, action } = body

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const supabase = await createClient()

    if (action === "login") {
      // Check hardcoded admin credentials first
      if (email === DEFAULT_ADMIN_EMAIL && password === DEFAULT_ADMIN_PASSWORD) {
        // Create or get admin session
        const { data: session, error: sessionError } = await supabase.auth.signInWithPassword({
          email: DEFAULT_ADMIN_EMAIL,
          password: DEFAULT_ADMIN_PASSWORD,
        })

        if (sessionError) {
          // Try to create the admin user if doesn't exist
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: DEFAULT_ADMIN_EMAIL,
            password: DEFAULT_ADMIN_PASSWORD,
          })

          if (signUpError) {
            console.error("[v0] Error in admin signup:", signUpError)
            return NextResponse.json({ error: "Authentication failed" }, { status: 401 })
          }

          return NextResponse.json({
            session: signUpData.session,
            user: signUpData.user,
            message: "Admin user created and logged in",
          })
        }

        return NextResponse.json({
          session: session.session,
          user: session.user,
          message: "Logged in successfully",
        })
      }

      // Check database for other admin users
      const { data: adminUser, error: dbError } = await supabase
        .from("admin_users")
        .select("*")
        .eq("email", email)
        .single()

      if (dbError || !adminUser) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
      }

      // Verify password
      const passwordMatch = await compare(password, adminUser.password_hash)

      if (!passwordMatch) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
      }

      return NextResponse.json({
        user: {
          id: adminUser.id,
          email: adminUser.email,
          full_name: adminUser.full_name,
        },
        message: "Logged in successfully",
      })
    }

    // Register new admin user
    if (action === "register") {
      const { data: authUser } = await supabase.auth.getUser()

      if (!authUser.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }

      const hashedPassword = await hash(password, 10)

      const { data: newAdmin, error: insertError } = await supabase
        .from("admin_users")
        .insert({
          email,
          password_hash: hashedPassword,
          full_name: body.full_name || "Admin",
        })
        .select()

      if (insertError) {
        console.error("[v0] Error creating admin user:", insertError)
        return NextResponse.json({ error: insertError.message }, { status: 500 })
      }

      return NextResponse.json({
        user: newAdmin[0],
        message: "Admin user created successfully",
      })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("[v0] Error in admin auth:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Verify admin session
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: authUser } = await supabase.auth.getUser()

    if (!authUser.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Verify if user is admin by checking admin_users table
    const { data: adminUser } = await supabase
      .from("admin_users")
      .select("*")
      .eq("id", authUser.user.id)
      .single()

    if (!adminUser) {
      return NextResponse.json({ error: "Not an admin user" }, { status: 403 })
    }

    return NextResponse.json({
      user: adminUser,
      authenticated: true,
    })
  } catch (error) {
    console.error("[v0] Error verifying admin session:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
