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
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()
    const body = await request.json()

    const { data: model, error } = await supabase
      .from('models')
      .update({
        name: body.name,
        age: body.age,
        city: body.city,
        bio: body.bio,
        whatsapp: body.whatsapp,
        image_url: body.image_url,
        is_featured: body.is_featured,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()

    if (error) throw error

    return NextResponse.json({ model: model?.[0] })
  } catch (error) {
    console.error('Error updating model:', error)
    return NextResponse.json({ error: 'Failed to update model' }, { status: 500 })
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
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()

    const { error } = await supabase
      .from('models')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting model:', error)
    return NextResponse.json({ error: 'Failed to delete model' }, { status: 500 })
  }
}
