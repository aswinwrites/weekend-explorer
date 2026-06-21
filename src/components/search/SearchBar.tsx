'use client'
import { useState, useRef, useCallback, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Location } from '@/types'
import { getCategoryMeta } from '@/lib/categories'
import { cn } from '@/lib/utils'
import { track } from '@/lib/analytics'

interface Props {
  locations: Location[]
  value: string
  onChange: (q: string) => void
  onSelect: (loc: Location) => void
}

export function SearchBar({ locations, value, onChange, onSelect }: Props) {
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const results = value.trim().length > 0
    ? locations.filter(l =>
        l.name.toLowerCase().includes(value.toLowerCase()) ||
        l.primary_category.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 8)
    : []

  // Fire search_performed when results are shown (debounced via the results render)
  useEffect(() => {
    if (value.trim().length < 2 || results.length === 0) return
    const t = setTimeout(() => {
      track('search_performed', { query: value.trim(), results_count: results.length })
    }, 600)
    return () => clearTimeout(t)
  }, [value, results.length]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSelect = useCallback((loc: Location) => {
    track('search_result_selected', {
      query: value.trim(),
      place_name: loc.name,
      place_category: loc.primary_category,
    })
    onChange('')
    setFocused(false)
    onSelect(loc)
    inputRef.current?.blur()
  }, [value, onChange, onSelect])

  return (
    <div className="relative">
      <div className={cn(
        'glass rounded-xl flex items-center gap-2 px-3 py-2.5 transition-all duration-200',
        focused && 'ring-1 ring-emerald-500/50',
      )}>
        <Search className="w-4 h-4 text-stone-400 flex-shrink-0" />
        <input
          ref={inputRef}
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          placeholder="Search places, treks, forts…"
          className="flex-1 bg-transparent text-sm text-stone-100 placeholder:text-stone-500 outline-none min-w-0"
        />
        {value && (
          <button
            onClick={() => { onChange(''); inputRef.current?.focus() }}
            className="text-stone-500 hover:text-stone-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {focused && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full mt-2 left-0 right-0 glass rounded-xl overflow-hidden z-50 shadow-2xl"
          >
            {results.map(loc => {
              const meta = getCategoryMeta(loc.primary_category)
              return (
                <button
                  key={loc.id}
                  onMouseDown={() => handleSelect(loc)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 transition-colors text-left"
                >
                  <span
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold"
                    style={{ backgroundColor: meta.markerColor + '30', color: meta.markerColor }}
                  >
                    {loc.distance_km}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm text-stone-100 truncate">{loc.name}</p>
                    <p className="text-xs text-stone-500 capitalize">{meta.name}</p>
                  </div>
                  <span className="ml-auto text-xs text-stone-600">{loc.distance_km} km</span>
                </button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
