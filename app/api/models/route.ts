import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    const { data: models, error } = await supabase
      .from('models')
      .select('*')
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ models: models || [] })
  } catch (error) {
    console.error('Error fetching models:', error)
    return NextResponse.json({ error: 'Failed to fetch models' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()
    const body = await request.json()

    const { data: model, error } = await supabase
      .from('models')
      .insert([
        {
          name: body.name,
          age: body.age,
          city: body.city,
          bio: body.bio,
          whatsapp: body.whatsapp,
          image_url: body.image_url,
          is_featured: body.is_featured || false,
        },
      ])
      .select()

    if (error) throw error

    return NextResponse.json({ model: model?.[0] }, { status: 201 })
  } catch (error) {
    console.error('Error creating model:', error)
    return NextResponse.json({ error: 'Failed to create model' }, { status: 500 })
  }
}
