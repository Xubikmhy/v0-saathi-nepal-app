import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    console.log('[v0] Uploading file:', file.name, 'Type:', file.type, 'Size:', file.size)

    // Validate file
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only JPG, PNG, WebP allowed.' }, { status: 400 })
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File too large. Max 5MB.' }, { status: 400 })
    }

    const supabase = await createClient()

    // Create unique filename
    const ext = file.name.split('.').pop() || 'jpg'
    const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`

    const bytes = await file.arrayBuffer()

    console.log('[v0] Uploading to bucket:', filename)

    const { data, error } = await supabase.storage
      .from('model-images')
      .upload(filename, bytes, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false,
      })

    if (error) {
      console.error('[v0] Supabase upload error:', error)
      return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 })
    }

    if (!data) {
      console.error('[v0] No data returned from upload')
      return NextResponse.json({ error: 'Upload returned no data' }, { status: 500 })
    }

    console.log('[v0] Upload successful:', data.path)

    const { data: publicUrl } = supabase.storage
      .from('model-images')
      .getPublicUrl(filename)

    console.log('[v0] Public URL:', publicUrl.publicUrl)

    return NextResponse.json({ url: publicUrl.publicUrl }, { status: 200 })
  } catch (error) {
    console.error('[v0] Upload error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 500 }
    )
  }
}
