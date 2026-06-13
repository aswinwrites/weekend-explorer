'use client'
import { useState } from 'react'
import { SlidersHorizontal, X, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { FilterState, Category } from '@/types'
import { ALL_CATEGORIES, getCategoryMeta } from '@/lib/categories'
import { cn } from '@/lib/utils'

const DISTANCE_OPTIONS = [
  { label: '< 50 km',  value: [0, 50] as [number, number] },
  { label: '50–100 km', value: [50, 100] as [number, number] },
  { label: '100–150 km', value: [100, 150] as [number, number] },
  { label: '150–250 km', value: [150, 250] as [number, number] },
  { label: '250+ km',   value: [250, 999] as [number, number] },
]

interface Props {
  filter: FilterState
  onChange: (next: Partial<FilterState>) => void
}

export function FilterPanel({ filter, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const activeCount =
    filter.categories.length +
    (filter.distance[0] > 0 || filter.distance[1] < 300 ? 1 : 0)

  const toggleCategory = (slug: Category) => {
    const next = filter.categories.includes(slug)
      ? filter.categories.filter(c => c !== slug)
      : [...filter.categories, slug]
    onChange({ categories: next })
  }

  const reset = () => onChange({ categories: [], distance: [0, 300] })

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className={cn(
          'glass rounded-xl flex items-center gap-2 px-3 py-2.5 transition-all duration-200',
          'text-sm text-stone-300 hover:text-white',
          open && 'ring-1 ring-emerald-500/50',
        )}
      >
        <SlidersHorizontal className="w-4 h-4" />
        <span className="hidden sm:inline">Filters</span>
        {activeCount > 0 && (
          <span className="w-5 h-5 rounded-full bg-emerald-500 text-white text-xs flex items-center justify-center font-medium">
            {activeCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="absolute top-full mt-2 right-0 w-72 glass rounded-2xl p-4 z-50 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-stone-100">Filters</h3>
              <div className="flex items-center gap-2">
                {activeCount > 0 && (
                  <button onClick={reset} className="text-xs text-emerald-400 hover:text-emerald-300">
                    Reset
                  </button>
                )}
                <button onClick={() => setOpen(false)} className="text-stone-500 hover:text-stone-300">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Category pills */}
            <div className="mb-4">
              <p className="text-xs text-stone-500 uppercase tracking-wider mb-2">Category</p>
              <div className="flex flex-wrap gap-1.5">
                {ALL_CATEGORIES.map(cat => {
                  const active = filter.categories.includes(cat.slug)
                  return (
                    <button
                      key={cat.slug}
                      onClick={() => toggleCategory(cat.slug)}
                      className={cn(
                        'px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-150',
                        active
                          ? 'text-white ring-1'
                          : 'bg-white/5 text-stone-400 hover:bg-white/10 hover:text-stone-200',
                      )}
                      style={active ? {
                        backgroundColor: getCategoryMeta(cat.slug).markerColor + '30',
                        color: getCategoryMeta(cat.slug).markerColor,
                        border: `1px solid ${getCategoryMeta(cat.slug).markerColor}80`,
                      } : {}}
                    >
                      {cat.name}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Distance */}
            <div className="mb-4">
              <p className="text-xs text-stone-500 uppercase tracking-wider mb-2">Distance from Bengaluru</p>
              <div className="flex flex-wrap gap-1.5">
                {DISTANCE_OPTIONS.map(opt => {
                  const active = filter.distance[0] === opt.value[0] && filter.distance[1] === opt.value[1]
                  return (
                    <button
                      key={opt.label}
                      onClick={() => onChange({ distance: active ? [0, 300] : opt.value })}
                      className={cn(
                        'px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-150',
                        active
                          ? 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/50'
                          : 'bg-white/5 text-stone-400 hover:bg-white/10 hover:text-stone-200',
                      )}
                    >
                      {opt.label}
                    </button>
                  )
                })}
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
