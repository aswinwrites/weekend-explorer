'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Navigation, Clock, Fuel, Star } from 'lucide-react'
import type { Location } from '@/types'
import { CategoryBadge } from '@/components/location/CategoryBadge'
import { travelTimeLabel, fuelEstimate } from '@/lib/trip-meta'
import { useTimeTheme } from '@/lib/hooks/useTimeTheme'

const PLACEHOLDER = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=70'

interface Props {
  locations: Location[]
  onSelect: (loc: Location) => void
  isSaved: (id: string) => boolean
}

export function ListView({ locations, onSelect, isSaved }: Props) {
  const theme = useTimeTheme()

  if (locations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-6">
        <span className="text-4xl mb-3">🗺️</span>
        <p className="text-stone-400 text-sm">No places match your filters.</p>
        <p className="text-stone-600 text-xs mt-1">Try adjusting your filters or distance range.</p>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {locations.map((loc, i) => {
          const fuel = fuelEstimate(loc.distance_km)
          const saved = isSaved(loc.id)
          return (
            <motion.button
              key={loc.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.03, 0.4) }}
              onClick={() => onSelect(loc)}
              className="flex flex-col rounded-2xl overflow-hidden text-left transition-all duration-200 group border border-white/6 hover:border-white/12"
              style={{ background: 'rgba(255,255,255,0.04)' }}
            >
              {/* Image */}
              <div className="relative h-36 flex-shrink-0 overflow-hidden">
                <Image
                  src={loc.image_url ?? PLACEHOLDER}
                  alt={loc.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Featured badge */}
                {loc.is_featured && (
                  <div
                    className="absolute top-2 left-2 flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold"
                    style={{ backgroundColor: theme.accent + 'dd', color: '#000' }}
                  >
                    <Star className="w-2.5 h-2.5" />
                    Featured
                  </div>
                )}

                {/* Saved indicator */}
                {saved && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                    <span className="text-[9px]">✓</span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-3 flex flex-col gap-1.5">
                <div className="flex items-start justify-between gap-1">
                  <p className="text-sm font-semibold text-stone-100 leading-snug group-hover:text-white transition-colors line-clamp-2">
                    {loc.name}
                  </p>
                </div>

                <CategoryBadge category={loc.primary_category} small />

                {/* Stats row */}
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="flex items-center gap-1 text-[11px] text-stone-500">
                    <Navigation className="w-3 h-3" />
                    {loc.distance_km} km
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-stone-500">
                    <Clock className="w-3 h-3" />
                    {travelTimeLabel(loc.distance_km)}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-stone-500">
                    <Fuel className="w-3 h-3" />
                    ₹{fuel.roundTrip}
                  </span>
                </div>
              </div>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
