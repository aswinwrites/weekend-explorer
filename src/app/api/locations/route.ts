import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const minDist  = searchParams.get('min_dist')
  const maxDist  = searchParams.get('max_dist')
  const search   = searchParams.get('q')

  const supabase = await createClient()
  let query = supabase.from('locations').select('*')

  if (category) query = query.contains('all_categories', [category])
  if (minDist)  query = query.gte('distance_km', Number(minDist))
  if (maxDist)  query = query.lte('distance_km', Number(maxDist))
  if (search) {
    query = query.ilike('name', `%${search}%`)
  }

  query = query.order('distance_km', { ascending: true })

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { data, error } = await supabase.from('locations').insert(body).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
