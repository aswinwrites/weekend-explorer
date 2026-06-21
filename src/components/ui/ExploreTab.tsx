'use client'
import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Compass } from 'lucide-react'
import Image from 'next/image'
import type { Location } from '@/types'
import { travelTimeLabel } from '@/lib/trip-meta'
import { useTimeTheme } from '@/lib/hooks/useTimeTheme'
import { CategoryBadge } from '@/components/location/CategoryBadge'
import { track } from '@/lib/analytics'

const PLACEHOLDER = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=70'

interface Section {
  id: string
  title: string
  emoji: string
  locations: Location[]
}

function useSections(locations: Location[]): Section[] {
  return useMemo(() => [
    {
      id: 'trending',
      title: 'Trending This Weekend',
      emoji: '🔥',
      locations: locations.filter(l => l.is_featured).slice(0, 8),
    },
    {
      id: 'sunrise',
      title: 'Best Sunrise Spots',
      emoji: '🌅',
      locations: locations
        .filter(l => ['trek', 'fort', 'nature', 'lake'].includes(l.primary_category))
        .sort((a, b) => a.distance_km - b.distance_km)
        .slice(0, 8),
    },
    {
      id: 'scenic',
      title: 'Scenic Rides',
      emoji: '🛣️',
      locations: locations
        .filter(l => ['fort', 'palace', 'nature', 'park', 'lake'].includes(l.primary_category))
        .sort((a, b) => b.distance_km - a.distance_km)
        .slice(0, 8),
    },
    {
      id: 'hidden',
      title: 'Hidden Gems',
      emoji: '💎',
      locations: locations
        .filter(l => !l.is_featured && l.distance_km > 130)
        .sort((a, b) => b.distance_km - a.distance_km)
        .slice(0, 8),
    },
    {
      id: 'close',
      title: 'Under 100 km',
      emoji: '⚡',
      locations: locations
        .filter(l => l.distance_km < 100)
        .sort((a, b) => a.distance_km - b.distance_km)
        .slice(0, 8),
    },
  ], [locations])
}

interface Props {
  open: boolean
  allLocations: Location[]
  onClose: () => void
  onSelect: (loc: Location) => void
}

export function ExploreTab({ open, allLocations, onClose, onSelect }: Props) {
  const theme = useTimeTheme()
  const sections = useSections(allLocations)

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/50"
          />
          <motion.div
            initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="surface-overlay fixed left-0 top-0 bottom-0 z-50 flex flex-col border-r border-black/8 dark:border-white/8"
            style={{ width: 'min(88vw, 400px)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 h-14 border-b border-white/8 flex-shrink-0">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4" style={{ color: theme.accent }} />
                <span className="font-semibold text-stone-100 text-sm">Explore</span>
              </div>
              <button onClick={onClose} className="text-stone-500 hover:text-stone-300 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Sections */}
            <div className="flex-1 overflow-y-auto py-4 space-y-6">
              {sections.filter(s => s.locations.length > 0).map((section, si) => (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: si * 0.06 }}
                >
                  {/* Section header */}
                  <div className="flex items-center gap-2 px-5 mb-3">
                    <span className="text-base">{section.emoji}</span>
                    <span className="text-sm font-semibold t-primary">{section.title}</span>
                    <span className="text-xs text-stone-600">({section.locations.length})</span>
                  </div>

                  {/* Horizontal scroll cards */}
                  <div className="flex gap-3 overflow-x-auto px-5 pb-1 scrollbar-none">
                    {section.locations.map(loc => (
                      <button
                        key={loc.id}
                        onClick={() => {
                          track('place_selected', {
                            place_name: loc.name,
                            place_category: loc.primary_category,
                            distance_km: loc.distance_km,
                            is_featured: loc.is_featured,
                            source: 'explore_tab',
                          })
                          onSelect(loc)
                          onClose()
                        }}
                        className="flex-shrink-0 w-36 rounded-xl overflow-hidden text-left transition-all duration-200 hover:scale-[1.02] border border-white/6 hover:border-white/14"
                        style={{ background: 'rgba(255,255,255,0.05)' }}
                      >
                        <div className="relative h-24 overflow-hidden">
                          <Image
                            src={loc.image_url ?? PLACEHOLDER}
                            alt={loc.name}
                            fill
                            className="object-cover"
                            sizes="144px"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        </div>
                        <div className="p-2.5">
                          <p className="text-xs font-semibold text-stone-200 line-clamp-2 leading-snug">
                            {loc.name}
                          </p>
                          <p className="text-[11px] text-stone-500 mt-1">
                            {loc.distance_km} km · {travelTimeLabel(loc.distance_km)}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
