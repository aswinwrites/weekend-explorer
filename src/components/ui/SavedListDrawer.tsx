'use client'
import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MapPin, Navigation, Trash2, ExternalLink, Fuel, Clock, Route } from 'lucide-react'
import type { Location } from '@/types'
import { getCategoryMeta } from '@/lib/categories'
import { CategoryBadge } from '@/components/location/CategoryBadge'
import { travelTimeLabel, fuelEstimate, buildMapsRouteUrl } from '@/lib/trip-meta'
import { useTimeTheme } from '@/lib/hooks/useTimeTheme'

interface Props {
  open: boolean
  locations: Location[]
  onClose: () => void
  onSelect: (loc: Location) => void
  onRemove: (id: string) => void
}

export function SavedListDrawer({ open, locations, onClose, onSelect, onRemove }: Props) {
  const theme = useTimeTheme()

  const totals = useMemo(() => {
    const totalKm = locations.reduce((s, l) => s + l.distance_km * 2, 0) // round trips
    const totalFuel = locations.reduce((s, l) => s + fuelEstimate(l.distance_km).roundTrip, 0)
    return { km: Math.round(totalKm), fuel: totalFuel }
  }, [locations])

  const mapsUrl = useMemo(() => buildMapsRouteUrl(locations), [locations])

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
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="surface-overlay fixed left-0 top-0 bottom-0 z-50 w-80 flex flex-col border-r border-black/8 dark:border-white/8"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 h-14 border-b border-white/8 flex-shrink-0">
              <div className="flex items-center gap-2">
                <Route className="w-4 h-4" style={{ color: theme.accent }} />
                <h2 className="font-semibold t-primary text-sm">My Weekend Plans</h2>
                {locations.length > 0 && (
                  <span
                    className="px-1.5 py-0.5 rounded-full text-[11px] font-bold text-white"
                    style={{ backgroundColor: theme.accent }}
                  >
                    {locations.length}
                  </span>
                )}
              </div>
              <button onClick={onClose} className="text-stone-500 hover:text-stone-300 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Trip summary */}
            {locations.length > 0 && (
              <div className="px-4 py-3 border-b border-white/6 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-xl border border-white/6 bg-white/3">
                    <p className="text-[10px] text-stone-500 uppercase tracking-wider">Total Drive</p>
                    <p className="text-sm font-bold text-stone-100 mt-0.5">{totals.km} km</p>
                    <p className="text-[11px] text-stone-500">round trips</p>
                  </div>
                  <div className="p-2.5 rounded-xl border border-white/6 bg-white/3">
                    <p className="text-[10px] text-stone-500 uppercase tracking-wider">Est. Fuel</p>
                    <p className="text-sm font-bold text-stone-100 mt-0.5">₹{totals.fuel.toLocaleString()}</p>
                    <p className="text-[11px] text-stone-500">all trips</p>
                  </div>
                </div>

                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-white text-sm font-medium transition-all"
                  style={{ backgroundColor: theme.accent }}
                >
                  <Navigation className="w-4 h-4" />
                  Plan Route in Google Maps
                </a>
              </div>
            )}

            {/* Location list */}
            <div className="flex-1 overflow-y-auto py-2">
              {locations.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center px-6 gap-3">
                  <span className="text-4xl">🗺️</span>
                  <p className="text-stone-400 text-sm">No saved places yet.</p>
                  <p className="text-stone-600 text-xs">Tap the bookmark on any location to add it to your weekend plan.</p>
                </div>
              ) : (
                locations.map(loc => {
                  const meta = getCategoryMeta(loc.primary_category)
                  const fuel = fuelEstimate(loc.distance_km)
                  return (
                    <div key={loc.id} className="group flex items-center gap-3 px-4 py-3 hover:bg-white/4 transition-colors">
                      <button
                        onClick={() => onSelect(loc)}
                        className="flex-1 flex items-center gap-3 text-left min-w-0"
                      >
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-xl"
                          style={{ backgroundColor: meta.markerColor + '20' }}
                        >
                          <span>{meta.markerColor ? '📍' : '📍'}</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-stone-100 truncate font-medium">{loc.name}</p>
                          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                            <CategoryBadge category={loc.primary_category} small />
                            <span className="text-[11px] text-stone-600 flex items-center gap-0.5">
                              <Navigation className="w-2.5 h-2.5" /> {loc.distance_km} km
                            </span>
                            <span className="text-[11px] text-stone-600 flex items-center gap-0.5">
                              <Fuel className="w-2.5 h-2.5" /> ₹{fuel.roundTrip}
                            </span>
                          </div>
                        </div>
                      </button>
                      <button
                        onClick={() => onRemove(loc.id)}
                        className="opacity-0 group-hover:opacity-100 text-stone-600 hover:text-rose-400 transition-all flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )
                })
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
