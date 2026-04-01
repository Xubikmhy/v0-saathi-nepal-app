import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '')
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const supabase = await createClient()
    
    const filename = `${Date.now()}-${file.name}`
    const bytes = await file.arrayBuffer()

    const { data, error } = await supabase.storage
      .from('model-images')
      .upload(filename, bytes, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false,
      })

    if (error) {
      console.error('Upload error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const { data: publicUrl } = supabase.storage
      .from('model-images')
      .getPublicUrl(filename)

    return NextResponse.json({ url: publicUrl.publicUrl })
  } catch (error) {
    console.error('Upload failed:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
