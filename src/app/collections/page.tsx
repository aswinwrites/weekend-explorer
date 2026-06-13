import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Map } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Collections',
  description: 'Curated collections of the best weekend destinations around Bengaluru.',
}

const COLLECTION_EMOJIS: Record<string, string> = {
  'best-sunrise-spots': '🌅',
  'epic-treks': '⛰️',
  'hidden-gems': '💎',
  'waterfall-chaser': '💧',
  'scenic-rides': '🏍️',
  'forts-and-history': '🏰',
  'nature-escapes': '🌿',
  'weekend-overnights': '🌙',
}

export default async function CollectionsPage() {
  const supabase = await createClient()
  const { data: collections } = await supabase
    .from('collections')
    .select(`*, collection_locations(count)`)
    .eq('is_public', true)
    .order('created_at', { ascending: true })

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      {/* Nav */}
      <header className="sticky top-0 z-20 border-b border-white/8 bg-stone-950/90 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-stone-500 hover:text-stone-300">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="font-semibold text-stone-100">Collections</h1>
          </div>
          <Link href="/" className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300">
            <Map className="w-3.5 h-3.5" /> Open Map
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Curated for Weekend Explorers</h2>
          <p className="text-stone-400">Handpicked destination sets — each one a perfect weekend itinerary.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(collections ?? []).map(col => {
            const emoji = COLLECTION_EMOJIS[col.slug] ?? '📍'
            const count = (col.collection_locations as unknown as { count: number }[])?.[0]?.count ?? 0

            return (
              <Link
                key={col.id}
                href={`/collections/${col.slug}`}
                className="group block rounded-2xl bg-white/4 border border-white/8 hover:bg-white/6 hover:border-white/12 transition-all p-5"
              >
                <div className="flex items-start gap-4">
                  <span className="text-4xl leading-none">{emoji}</span>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-stone-100 group-hover:text-white transition-colors">
                      {col.name}
                    </h3>
                    <p className="text-sm text-stone-500 mt-1 line-clamp-2">{col.description}</p>
                    {count > 0 && (
                      <p className="text-xs text-emerald-400 mt-2">{count} places</p>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
