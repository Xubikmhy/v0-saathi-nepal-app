import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const folder = request.nextUrl.searchParams.get("folder") || "general"
    const supabase = await createClient()

    // List files in the folder
    const { data, error } = await supabase.storage
      .from("escortnepal-images")
      .list(folder)

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    // Map files to include public URLs
    const images = (data || []).map((file) => {
      const { data: urlData } = supabase.storage
        .from("escortnepal-images")
        .getPublicUrl(`${folder}/${file.name}`)

      return {
        name: file.name,
        url: urlData.publicUrl,
        path: `${folder}/${file.name}`,
        created: file.created_at,
        updated: file.updated_at,
      }
    })

    return NextResponse.json({
      success: true,
      folder,
      images,
      count: images.length,
    })
  } catch (error) {
    console.error("Error listing images:", error)
    return NextResponse.json(
      { error: "Failed to list images" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { from, to } = await request.json()

    if (!from || !to) {
      return NextResponse.json(
        { error: "Source and destination paths required" },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Copy file
    const { data, error } = await supabase.storage
      .from("escortnepal-images")
      .copy(from, to)

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    const { data: urlData } = supabase.storage
      .from("escortnepal-images")
      .getPublicUrl(to)

    return NextResponse.json({
      success: true,
      url: urlData.publicUrl,
      path: to,
    })
  } catch (error) {
    console.error("Error copying image:", error)
    return NextResponse.json(
      { error: "Failed to copy image" },
      { status: 500 }
    )
  }
}
