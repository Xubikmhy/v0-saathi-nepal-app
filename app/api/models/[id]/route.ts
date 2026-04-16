import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const token = request.headers.get('Authorization')?.replace('Bearer ', '')

    if (!token) {
      console.log('[v0] Unauthorized PUT request')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // Validation
    if (!body.name || !body.city || !body.whatsapp) {
      return NextResponse.json(
        { error: 'Name, city, and whatsapp are required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    console.log('[v0] Updating model:', id)

    const { data: model, error } = await supabase
      .from('models')
      .update({
        name: body.name,
        age: body.age || null,
        city: body.city,
        bio: body.bio || null,
        whatsapp: body.whatsapp,
        image_url: body.image_url || null,
        is_featured: body.is_featured === true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()

    if (error) {
      console.error('[v0] Update error:', error)
      throw error
    }

    console.log('[v0] Model updated:', id)
    return NextResponse.json({ model: model?.[0] })
  } catch (error) {
    console.error('[v0] Error updating model:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update model' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const token = request.headers.get('Authorization')?.replace('Bearer ', '')

    if (!token) {
      console.log('[v0] Unauthorized DELETE request')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()

    console.log('[v0] Deleting model:', id)

    const { error } = await supabase.from('models').delete().eq('id', id)

    if (error) {
      console.error('[v0] Delete error:', error)
      throw error
    }

    console.log('[v0] Model deleted:', id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] Error deleting model:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete model' },
      { status: 500 }
    )
  }
}
