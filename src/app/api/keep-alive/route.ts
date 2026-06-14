import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  // Verify this is called by Vercel Cron (or an authorized request)
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )

    // Lightweight ping — just count rows
    const { count, error } = await supabase
      .from('locations')
      .select('id', { count: 'exact', head: true })

    if (error) throw error

    return NextResponse.json({
      ok: true,
      pinged_at: new Date().toISOString(),
      locations_count: count,
    })
  } catch (err) {
    console.error('[keep-alive] Supabase ping failed:', err)
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
