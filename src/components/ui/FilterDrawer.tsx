'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { X, SlidersHorizontal } from 'lucide-react'
import type { FilterState, Category } from '@/types'
import { ALL_CATEGORIES, getCategoryMeta } from '@/lib/categories'
import { useTimeTheme } from '@/lib/hooks/useTimeTheme'
import { cn } from '@/lib/utils'
import { track } from '@/lib/analytics'

const CATEGORY_EMOJI: Record<string, string> = {
  trek: '⛰️', waterfall: '💦', fort: '🏰', lake: '🏞️',
  temple: '🛕', museum: '🏛️', nature: '🌿', park: '🌳',
  palace: '👑', campus: '🎓', cafe: '☕', boating: '⛵',
}

const DISTANCE_OPTIONS = [
  { label: 'Under 50 km',  value: [0, 50]    as [number, number] },
  { label: '50 – 100 km',  value: [50, 100]  as [number, number] },
  { label: '100 – 150 km', value: [100, 150] as [number, number] },
  { label: '150 – 250 km', value: [150, 250] as [number, number] },
  { label: '250+ km',      value: [250, 999] as [number, number] },
]

interface Props {
  open: boolean
  filter: FilterState
  onChange: (next: Partial<FilterState>) => void
  onClose: () => void
}

export function FilterDrawer({ open, filter, onChange, onClose }: Props) {
  const theme = useTimeTheme()

  const toggleCategory = (slug: Category) => {
    const removing = filter.categories.includes(slug)
    const next = removing
      ? filter.categories.filter(c => c !== slug)
      : [...filter.categories, slug]
    track('filter_category_toggled', {
      category: slug,
      action: removing ? 'removed' : 'added',
      active_category_count: next.length,
    })
    onChange({ categories: next })
  }

  const activeCount = filter.categories.length +
    (filter.distance[0] > 0 || filter.distance[1] < 300 ? 1 : 0)

  const reset = () => {
    track('filter_reset', {})
    onChange({ categories: [], distance: [0, 300] })
  }

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
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="surface-overlay fixed right-0 top-0 bottom-0 z-50 w-72 flex flex-col border-l border-black/8 dark:border-white/8"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 h-14 border-b border-white/8 flex-shrink-0">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" style={{ color: theme.accent }} />
                <span className="font-semibold t-primary text-sm">Filters</span>
                {activeCount > 0 && (
                  <span
                    className="px-1.5 py-0.5 rounded-full text-[11px] font-bold text-white"
                    style={{ backgroundColor: theme.accent }}
                  >
                    {activeCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                {activeCount > 0 && (
                  <button onClick={reset} className="text-xs hover:text-stone-300 transition-colors"
                    style={{ color: theme.accent }}>
                    Reset
                  </button>
                )}
                <button onClick={onClose} className="text-stone-500 hover:text-stone-300 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">

              {/* Categories */}
              <div>
                <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-widest mb-3">
                  Category
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  {ALL_CATEGORIES.map(cat => {
                    const active = filter.categories.includes(cat.slug)
                    const meta = getCategoryMeta(cat.slug)
                    const emoji = CATEGORY_EMOJI[cat.slug] ?? '📍'
                    return (
                      <button
                        key={cat.slug}
                        onClick={() => toggleCategory(cat.slug)}
                        className={cn(
                          'flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 text-left border',
                        )}
                        style={active ? {
                          backgroundColor: meta.markerColor + '22',
                          color: meta.markerColor,
                          borderColor: meta.markerColor + '55',
                        } : {
                          backgroundColor: 'rgba(255,255,255,0.04)',
                          color: '#a8a29e',
                          borderColor: 'rgba(255,255,255,0.06)',
                        }}
                      >
                        <span className="text-base">{emoji}</span>
                        <span className="truncate">{cat.name}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Distance */}
              <div>
                <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-widest mb-3">
                  Distance from Bengaluru
                </p>
                <div className="flex flex-col gap-1.5">
                  {DISTANCE_OPTIONS.map(opt => {
                    const active = filter.distance[0] === opt.value[0] && filter.distance[1] === opt.value[1]
                    return (
                      <button
                        key={opt.label}
                        onClick={() => {
                        if (!active) {
                          track('filter_distance_changed', {
                            distance_label: opt.label,
                            distance_min: opt.value[0],
                            distance_max: opt.value[1],
                          })
                        }
                        onChange({ distance: active ? [0, 300] : opt.value })
                      }}
                        className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 border"
                        style={active ? {
                          backgroundColor: theme.accent + '20',
                          color: theme.accent,
                          borderColor: theme.accent + '50',
                        } : {
                          backgroundColor: 'rgba(255,255,255,0.04)',
                          color: '#a8a29e',
                          borderColor: 'rgba(255,255,255,0.06)',
                        }}
                      >
                        {opt.label}
                        {active && <span className="text-xs">✓</span>}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// ── Trigger button (used in SearchRow) ────────────────────────────────────
export function FilterButton({
  onClick,
  activeCount,
}: { onClick: () => void; activeCount: number }) {
  const theme = useTimeTheme()
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm transition-all flex-shrink-0 border"
      style={{
        background: activeCount > 0 ? theme.accent + '18' : 'rgba(255,255,255,0.06)',
        borderColor: activeCount > 0 ? theme.accent + '50' : 'rgba(255,255,255,0.08)',
        color: activeCount > 0 ? theme.accent : '#a8a29e',
      }}
    >
      <SlidersHorizontal className="w-3.5 h-3.5" />
      <span className="hidden sm:inline">Filters</span>
      {activeCount > 0 && (
        <span
          className="w-4 h-4 rounded-full text-white text-[10px] flex items-center justify-center font-bold"
          style={{ backgroundColor: theme.accent }}
        >
          {activeCount}
        </span>
      )}
    </button>
  )
}
