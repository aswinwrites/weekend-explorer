import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Navigation, Map } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getCategoryMeta } from '@/lib/categories'
import { CategoryBadge } from '@/components/location/CategoryBadge'
import type { Location } from '@/types'

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('collections').select('*').eq('slug', slug).single()
  if (!data) return {}
  return { title: data.name, description: data.description ?? undefined }
}

export default async function CollectionDetailPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: collection } = await supabase
    .from('collections')
    .select(`*, collection_locations(location_id, sort_order, locations(*))`)
    .eq('slug', slug)
    .single()

  if (!collection) notFound()

  const locations = (
    (collection.collection_locations as unknown as { locations: Location; sort_order: number }[]) ?? []
  )
    .sort((a, b) => a.sort_order - b.sort_order)
    .map(cl => cl.locations)

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      <header className="sticky top-0 z-20 border-b border-white/8 bg-stone-950/90 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/collections" className="text-stone-500 hover:text-stone-300">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <span className="text-sm text-stone-500">Collections</span>
          </div>
          <Link href="/" className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300">
            <Map className="w-3.5 h-3.5" /> Map
          </Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">{collection.name}</h1>
          {collection.description && (
            <p className="text-stone-400">{collection.description}</p>
          )}
          {locations.length > 0 && (
            <p className="text-xs text-emerald-400 mt-2">{locations.length} places</p>
          )}
        </div>

        {locations.length === 0 ? (
          <div className="text-center py-16 text-stone-500">
            <p>No locations in this collection yet.</p>
            <Link href="/collections" className="text-emerald-400 text-sm mt-2 block">
              ← Browse all collections
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {locations.map((loc, i) => {
              const meta = getCategoryMeta(loc.primary_category)
              return (
                <Link
                  key={loc.id}
                  href={`/place/${loc.slug}`}
                  className="group flex items-center gap-4 p-4 rounded-2xl bg-white/4 border border-white/8 hover:bg-white/6 hover:border-white/12 transition-all"
                >
                  <span
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 text-stone-500"
                    style={{ backgroundColor: meta.markerColor + '15' }}
                  >
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-stone-100 group-hover:text-white transition-colors">
                      {loc.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <CategoryBadge category={loc.primary_category} small />
                      <span className="text-xs text-stone-600 flex items-center gap-1">
                        <Navigation className="w-3 h-3" /> {loc.distance_km} km
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
