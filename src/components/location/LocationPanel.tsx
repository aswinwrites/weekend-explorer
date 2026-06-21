'use client'
import { useEffect, useRef, useMemo } from 'react'
import { motion } from 'framer-motion'
import { X, MapPin, Navigation, Bookmark, BookmarkCheck, ExternalLink, Star, Tag } from 'lucide-react'
import Image from 'next/image'
import type { Location } from '@/types'
import { getCategoryMeta } from '@/lib/categories'
import { cn, buildShareUrl } from '@/lib/utils'
import { FuelCalculator } from './FuelCalculator'
import { ShareButtons } from './ShareButtons'
import { CategoryBadge } from './CategoryBadge'
import { travelTimeLabel, bestFor, bestTime, tripType, fuelEstimate } from '@/lib/trip-meta'
import { useTimeTheme } from '@/lib/hooks/useTimeTheme'
import { track } from '@/lib/analytics'

// Haversine distance in km
function haversine(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

const CATEGORY_EMOJI: Record<string, string> = {
  trek: '⛰️', waterfall: '💦', fort: '🏰', lake: '🏞️',
  temple: '🛕', museum: '🏛️', nature: '🌿', park: '🌳',
  palace: '👑', campus: '🎓', cafe: '☕', boating: '⛵',
}

interface Props {
  location: Location
  allLocations: Location[]
  isSaved: boolean
  onToggleSave: () => void
  onClose: () => void
  onSelectNearby: (loc: Location) => void
}

export function LocationPanel({ location, allLocations, isSaved, onToggleSave, onClose, onSelectNearby }: Props) {
  const meta = getCategoryMeta(location.primary_category)
  const theme = useTimeTheme()
  const panelRef = useRef<HTMLDivElement>(null)
  const shareUrl = buildShareUrl(location.slug)
  const fuel = fuelEstimate(location.distance_km)

  const nearby = useMemo(() => allLocations
    .filter(l => l.id !== location.id)
    .map(l => ({ ...l, dist: haversine(location.latitude, location.longitude, l.latitude, l.longitude) }))
    .sort((a, b) => a.dist - b.dist)
    .slice(0, 4), [location, allLocations])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const placeholderImg = `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80`

  const content = (
    <PanelContent
      location={location} meta={meta} nearby={nearby}
      isSaved={isSaved} onToggleSave={onToggleSave} onClose={onClose}
      onSelectNearby={onSelectNearby} shareUrl={shareUrl}
      placeholderImg={placeholderImg} fuel={fuel} theme={theme}
    />
  )

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-30 bg-black/40 sm:hidden"
      />
      <motion.div
        ref={panelRef}
        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        className="surface-overlay fixed z-40 border-l border-black/8 dark:border-white/8 overflow-y-auto hidden sm:flex sm:flex-col sm:top-0 sm:right-0 sm:bottom-0 sm:w-[380px]"
      >
        {content}
      </motion.div>
      <motion.div
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        className="surface-overlay fixed z-40 rounded-t-3xl overflow-y-auto sm:hidden left-0 right-0 bottom-0 max-h-[90vh]"
      >
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-stone-700" />
        </div>
        {content}
      </motion.div>
    </>
  )
}

// ── Panel content ─────────────────────────────────────────────────────────
function PanelContent({
  location, meta, nearby, isSaved, onToggleSave, onClose, onSelectNearby,
  shareUrl, placeholderImg, fuel, theme,
}: {
  location: Location
  meta: ReturnType<typeof getCategoryMeta>
  nearby: (Location & { dist: number })[]
  isSaved: boolean
  onToggleSave: () => void
  onClose: () => void
  onSelectNearby: (loc: Location) => void
  shareUrl: string
  placeholderImg: string
  fuel: ReturnType<typeof fuelEstimate>
  theme: ReturnType<typeof useTimeTheme>
}) {
  const forList = bestFor(location.primary_category)
  const time = bestTime(location.primary_category)
  const type = tripType(location.primary_category)

  return (
    <div className="flex flex-col">
      {/* Hero image */}
      <div className="relative h-48 sm:h-52 flex-shrink-0 overflow-hidden">
        <Image
          src={location.image_url ?? placeholderImg}
          alt={location.name}
          fill className="object-cover"
          sizes="(max-width: 640px) 100vw, 380px"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent" />

        {location.is_featured && (
          <div
            className="absolute top-3 left-3 flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold"
            style={{ backgroundColor: theme.accent + 'ee', color: '#000' }}
          >
            <Star className="w-2.5 h-2.5" /> Featured
          </div>
        )}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white/80 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 px-5 pb-8">
        {/* Title */}
        <div className="mt-4 mb-4">
          <div className="flex items-start justify-between gap-2">
            <h2 className="text-xl font-bold t-primary leading-tight">{location.name}</h2>
            <button
              onClick={() => {
                track('place_saved', {
                  place_name: location.name,
                  place_category: location.primary_category,
                  action: isSaved ? 'unsaved' : 'saved',
                })
                onToggleSave()
              }}
              className={cn(
                'flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all',
                !isSaved && 'bg-white/5 text-stone-400 hover:bg-white/10 hover:text-white',
              )}
              style={isSaved ? { backgroundColor: theme.accent + '20', color: theme.accent } : {}}
            >
              {isSaved ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
            </button>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <CategoryBadge category={location.primary_category} />
            <span className="flex items-center gap-1 text-xs text-stone-500">
              <Tag className="w-3 h-3" /> {type}
            </span>
          </div>
          {location.all_categories.length > 1 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {location.all_categories.filter(c => c !== location.primary_category).map(c => (
                <CategoryBadge key={c} category={c} small />
              ))}
            </div>
          )}
        </div>

        {/* ── Planning snapshot ── */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {[
            { label: 'Distance',   value: `${location.distance_km} km`, sub: 'from Bengaluru' },
            { label: 'Drive Time', value: travelTimeLabel(location.distance_km), sub: 'one way' },
            { label: 'Fuel (RT)',  value: `₹${fuel.roundTrip}`, sub: `${(fuel.litres * 2).toFixed(1)}L est.` },
            { label: 'Best Time',  value: time.split(' (')[0], sub: time.match(/\(([^)]+)\)/)?.[1] ?? '' },
          ].map(card => (
            <div key={card.label} className="p-3 rounded-xl border border-white/6 bg-white/3">
              <p className="text-[10px] text-stone-500 uppercase tracking-wider mb-1">{card.label}</p>
              <p className="text-sm font-bold text-stone-100 leading-snug">{card.value}</p>
              {card.sub && <p className="text-[11px] text-stone-500 mt-0.5">{card.sub}</p>}
            </div>
          ))}
        </div>

        {/* Best for */}
        <div className="mb-4">
          <p className="text-[10px] text-stone-500 uppercase tracking-wider mb-2">Best For</p>
          <div className="flex flex-wrap gap-1.5">
            {forList.map(tag => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-full text-xs font-medium border"
                style={{ backgroundColor: theme.accent + '12', color: theme.accent, borderColor: theme.accent + '30' }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {location.description && (
          <p className="text-sm text-stone-400 leading-relaxed mb-5">{location.description}</p>
        )}

        {/* Actions */}
        <div className="flex gap-2 mb-5">
          <a
            href={location.google_maps_url ?? `https://maps.google.com/?q=${encodeURIComponent(location.name)}`}
            target="_blank" rel="noopener noreferrer"
            onClick={() => track('place_maps_opened', { place_name: location.name, place_category: location.primary_category })}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-white text-sm font-medium transition-all"
            style={{ backgroundColor: theme.accent }}
          >
            <MapPin className="w-4 h-4" /> Open in Maps
          </a>
          <a
            href={`/place/${location.slug}`}
            onClick={() => track('place_detail_page_opened', { place_name: location.name, place_category: location.primary_category })}
            className="flex items-center justify-center px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 text-sm transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        <div className="h-px bg-white/6 mb-5" />
        <ShareButtons url={shareUrl} name={location.name} />

        {/* Nearby */}
        {nearby.length > 0 && (
          <>
            <div className="h-px bg-white/6 my-5" />
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">Nearby Places</p>
            <div className="flex flex-col gap-2">
              {nearby.map(loc => {
                const m = getCategoryMeta(loc.primary_category)
                const emoji = CATEGORY_EMOJI[loc.primary_category] ?? '📍'
                return (
                  <button
                    key={loc.id}
                    onClick={() => {
                      track('nearby_place_clicked', {
                        from_place: location.name,
                        to_place: loc.name,
                        nearby_distance_km: Math.round(loc.dist),
                      })
                      onSelectNearby(loc)
                    }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/4 hover:bg-white/8 transition-colors text-left group"
                  >
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                      style={{ backgroundColor: m.markerColor + '25' }}
                    >
                      {emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-stone-200 truncate group-hover:text-white transition-colors">
                        {loc.name}
                      </p>
                      <p className="text-xs text-stone-500 mt-0.5">{Math.round(loc.dist)} km away · {m.name}</p>
                    </div>
                    <Navigation className="w-3.5 h-3.5 text-stone-600 group-hover:text-emerald-400 transition-colors flex-shrink-0" />
                  </button>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
