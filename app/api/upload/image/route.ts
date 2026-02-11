import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const folder = formData.get("folder") as string || "general"

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate unique filename
    const timestamp = Date.now()
    const filename = `${timestamp}-${file.name.replace(/\s+/g, '-')}`
    const filepath = `${folder}/${filename}`

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from("escortnepal-images")
      .upload(filepath, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (error) {
      console.error("Upload error:", error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("escortnepal-images")
      .getPublicUrl(filepath)

    return NextResponse.json({
      success: true,
      url: urlData.publicUrl,
      path: filepath,
      filename: filename,
    })
  } catch (error) {
    console.error("Error uploading image:", error)
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { path } = await request.json()

    if (!path) {
      return NextResponse.json(
        { error: "No path provided" },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const { error } = await supabase.storage
      .from("escortnepal-images")
      .remove([path])

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Image deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting image:", error)
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 }
    )
  }
}
