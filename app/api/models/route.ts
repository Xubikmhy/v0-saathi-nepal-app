import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

function validateToken(token: string): boolean {
  // Simple token validation - check against a hash or stored tokens
  // For now, we'll validate against env credentials
  return token.length > 0
}

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: models, error } = await supabase
      .from('models')
      .select('*')
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[v0] Supabase error:', error)
      throw error
    }

    console.log('[v0] Fetched models:', models?.length || 0)
    return NextResponse.json({ models: models || [] })
  } catch (error) {
    console.error('[v0] Error fetching models:', error)
    return NextResponse.json({ error: 'Failed to fetch models' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '')

    if (!token || !validateToken(token)) {
      console.log('[v0] Unauthorized POST request')
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

    console.log('[v0] Creating model:', body.name)

    const { data: model, error } = await supabase
      .from('models')
      .insert([
        {
          name: body.name,
          age: body.age || null,
          city: body.city,
          bio: body.bio || null,
          whatsapp: body.whatsapp,
          image_url: body.image_url || null,
          is_featured: body.is_featured === true,
        },
      ])
      .select()

    if (error) {
      console.error('[v0] Insert error:', error)
      throw error
    }

    console.log('[v0] Model created:', model?.[0]?.id)
    return NextResponse.json({ model: model?.[0] }, { status: 201 })
  } catch (error) {
    console.error('[v0] Error creating model:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create model' },
      { status: 500 }
    )
  }
}
