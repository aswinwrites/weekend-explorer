import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Navigation, ArrowLeft, ExternalLink, CheckCircle2, Clock } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getCategoryMeta } from '@/lib/categories'
import { buildShareUrl } from '@/lib/utils'
import { FuelCalculator } from '@/components/location/FuelCalculator'
import { ShareButtons } from '@/components/location/ShareButtons'
import { CategoryBadge } from '@/components/location/CategoryBadge'
import type { Location } from '@/types'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('locations').select('*').eq('slug', slug).single()
  if (!data) return {}

  const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://weekendexplorer.in'
  const img = data.image_url ?? `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80`

  return {
    title: data.name,
    description: data.description ?? `Discover ${data.name} — ${data.distance_km} km from Bengaluru.`,
    openGraph: {
      title: `${data.name} | Weekend Explorer Bengaluru`,
      description: data.description ?? `${data.name} is ${data.distance_km} km from Bengaluru.`,
      images: [{ url: img, width: 1200, height: 630, alt: data.name }],
      url: `${APP_URL}/place/${slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: data.name,
      description: data.description ?? `${data.name} — ${data.distance_km} km from Bengaluru.`,
      images: [img],
    },
  }
}

export async function generateStaticParams() {
  const supabase = await createClient()
  const { data } = await supabase.from('locations').select('slug')
  return (data ?? []).map(row => ({ slug: row.slug }))
}

export default async function PlacePage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('locations').select('*').eq('slug', slug).single()
  if (!data) notFound()

  const location = data as Location
  const meta = getCategoryMeta(location.primary_category)
  const shareUrl = buildShareUrl(slug)
  const heroImg = location.image_url ?? 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80'

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      {/* Hero */}
      <div className="relative h-72 sm:h-96">
        <Image src={heroImg} alt={location.name} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/30 to-transparent" />

        <div className="absolute top-4 left-4">
          <Link
            href="/"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-black/50 backdrop-blur-sm text-white text-sm hover:bg-black/70 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to map
          </Link>
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center gap-2 mb-2">
            <CategoryBadge category={location.primary_category} />
            {location.is_visited ? (
              <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs">
                <CheckCircle2 className="w-3 h-3" /> Visited
              </span>
            ) : (
              <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-stone-800/80 border border-stone-700 text-stone-400 text-xs">
                <Clock className="w-3 h-3" /> To Visit
              </span>
            )}
          </div>
          <h1 className="text-3xl font-bold text-white">{location.name}</h1>
          <p className="text-stone-400 flex items-center gap-1.5 mt-1 text-sm">
            <Navigation className="w-3.5 h-3.5" /> {location.distance_km} km from Bengaluru
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Description */}
        {location.description && (
          <p className="text-stone-300 leading-relaxed text-base mb-8">{location.description}</p>
        )}

        {/* All categories */}
        {location.all_categories.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <span className="text-xs text-stone-500 self-center">Also tagged:</span>
            {location.all_categories.map(c => <CategoryBadge key={c} category={c} small />)}
          </div>
        )}

        {/* CTA */}
        <a
          href={location.google_maps_url ?? `https://maps.google.com/?q=${encodeURIComponent(location.name)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-semibold transition-colors mb-8"
        >
          <MapPin className="w-5 h-5" /> Open in Google Maps
        </a>

        <div className="h-px bg-white/8 mb-8" />
        <FuelCalculator distanceKm={location.distance_km} />
        <div className="h-px bg-white/8 my-8" />
        <ShareButtons url={shareUrl} name={location.name} />

        <div className="mt-8 text-center">
          <Link href="/" className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors">
            ← Explore more on the map
          </Link>
        </div>
      </div>
    </div>
  )
}
