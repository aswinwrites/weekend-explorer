'use client'
import { useRef } from 'react'
import { X } from 'lucide-react'
import type { FilterState, Category } from '@/types'
import { ALL_CATEGORIES, getCategoryMeta } from '@/lib/categories'
import { useTimeTheme } from '@/lib/hooks/useTimeTheme'
import { cn } from '@/lib/utils'

const CATEGORY_EMOJI: Record<string, string> = {
  trek: '⛰️', waterfall: '💦', fort: '🏰', lake: '🏞️',
  temple: '🛕', museum: '🏛️', nature: '🌿', park: '🌳',
  palace: '👑', campus: '🎓', cafe: '☕', boating: '⛵',
}

const DISTANCE_OPTIONS = [
  { label: '< 50 km',    value: [0, 50]    as [number, number] },
  { label: '50–100 km',  value: [50, 100]  as [number, number] },
  { label: '100–150 km', value: [100, 150] as [number, number] },
  { label: '150–250 km', value: [150, 250] as [number, number] },
  { label: '250+ km',    value: [250, 999] as [number, number] },
]

interface Props {
  filter: FilterState
  onChange: (next: Partial<FilterState>) => void
}

export function FilterStrip({ filter, onChange }: Props) {
  const theme = useTimeTheme()
  const scrollRef = useRef<HTMLDivElement>(null)

  const hasActive = filter.categories.length > 0 ||
    filter.distance[0] > 0 || filter.distance[1] < 300

  const toggleCategory = (slug: Category) => {
    const next = filter.categories.includes(slug)
      ? filter.categories.filter(c => c !== slug)
      : [...filter.categories, slug]
    onChange({ categories: next })
  }

  const activeDistance = DISTANCE_OPTIONS.find(
    o => filter.distance[0] === o.value[0] && filter.distance[1] === o.value[1]
  )

  const reset = () => onChange({ categories: [], distance: [0, 300] })

  return (
    <div
      className="absolute left-0 right-0 z-20 border-b border-white/6"
      style={{
        top: 56,
        background: theme.navBg,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      <div
        ref={scrollRef}
        className="flex items-center gap-1.5 px-4 sm:px-6 h-11 overflow-x-auto scrollbar-none"
      >
        {/* Category pills */}
        {ALL_CATEGORIES.map(cat => {
          const active = filter.categories.includes(cat.slug)
          const emoji = CATEGORY_EMOJI[cat.slug] ?? '📍'
          const meta = getCategoryMeta(cat.slug)
          return (
            <button
              key={cat.slug}
              onClick={() => toggleCategory(cat.slug)}
              className={cn(
                'flex-shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-150 whitespace-nowrap',
                active
                  ? 'text-white'
                  : 'bg-white/6 text-stone-400 hover:bg-white/10 hover:text-stone-200',
              )}
              style={active ? {
                backgroundColor: meta.markerColor + '30',
                color: meta.markerColor,
                border: `1px solid ${meta.markerColor}70`,
              } : {}}
            >
              <span>{emoji}</span>
              <span className="hidden sm:inline">{cat.name}</span>
            </button>
          )
        })}

        {/* Divider */}
        <div className="flex-shrink-0 w-px h-4 bg-white/10 mx-1" />

        {/* Distance pills */}
        {DISTANCE_OPTIONS.map(opt => {
          const active = filter.distance[0] === opt.value[0] && filter.distance[1] === opt.value[1]
          return (
            <button
              key={opt.label}
              onClick={() => onChange({ distance: active ? [0, 300] : opt.value })}
              className={cn(
                'flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-150 whitespace-nowrap',
                active
                  ? 'text-white'
                  : 'bg-white/6 text-stone-400 hover:bg-white/10 hover:text-stone-200',
              )}
              style={active ? {
                backgroundColor: theme.accent + '25',
                color: theme.accent,
                border: `1px solid ${theme.accent}60`,
              } : {}}
            >
              {opt.label}
            </button>
          )
        })}

        {/* Clear all */}
        {hasActive && (
          <>
            <div className="flex-shrink-0 w-px h-4 bg-white/10 mx-1" />
            <button
              onClick={reset}
              className="flex-shrink-0 flex items-center gap-1 px-2 py-1 rounded-full text-xs text-stone-500 hover:text-stone-300 transition-colors"
            >
              <X className="w-3 h-3" />
              <span>Clear</span>
            </button>
          </>
        )}
      </div>
    </div>
  )
}
