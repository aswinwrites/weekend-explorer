'use client'
import { memo } from 'react'
import { getCategoryMeta } from '@/lib/categories'
import type { Category } from '@/types'

const CATEGORY_EMOJI: Record<string, string> = {
  trek:      '⛰️',
  waterfall: '💦',
  fort:      '🏰',
  lake:      '🏞️',
  temple:    '🛕',
  museum:    '🏛️',
  nature:    '🌿',
  park:      '🌳',
  palace:    '👑',
  campus:    '🎓',
  cafe:      '☕',
  boating:   '⛵',
}

interface Props {
  category: Category
  isSelected: boolean
  isFeatured?: boolean
  name?: string
  onClick: () => void
}

export const MapMarker = memo(function MapMarker({ category, isSelected, isFeatured, name, onClick }: Props) {
  const meta = getCategoryMeta(category)
  const emoji = CATEGORY_EMOJI[category] ?? '📍'

  // Size tiers: selected > featured > normal
  const size = isSelected ? 44 : isFeatured ? 38 : 30
  const opacity = isSelected || isFeatured ? 1 : 0.82

  // Truncate long names
  const label = name && name.length > 16 ? name.slice(0, 15) + '…' : name

  return (
    <button
      onClick={e => { e.stopPropagation(); onClick() }}
      style={{ width: 'max-content', minWidth: size, transform: isSelected ? 'scale(1.15)' : 'scale(1)', opacity }}
      className="relative flex flex-col items-center transition-all duration-200 hover:scale-110 hover:opacity-100 origin-bottom"
    >
      {/* Pin head */}
      <div
        className="flex items-center justify-center rounded-full shadow-lg transition-all duration-200"
        style={{
          width: size,
          height: size,
          backgroundColor: meta.markerColor,
          boxShadow: isSelected
            ? `0 0 0 3px white, 0 0 0 5px ${meta.markerColor}, 0 8px 24px ${meta.markerColor}80`
            : isFeatured
            ? `0 0 0 2px ${meta.markerColor}60, 0 4px 16px ${meta.markerColor}50, 0 1px 4px rgba(0,0,0,0.5)`
            : `0 2px 8px ${meta.markerColor}50, 0 1px 3px rgba(0,0,0,0.4)`,
          fontSize: isSelected ? 20 : isFeatured ? 18 : 14,
        }}
      >
        {emoji}
      </div>

      {/* Pin tail */}
      <div
        style={{
          width: 0, height: 0,
          borderLeft: `${Math.round(size * 0.12)}px solid transparent`,
          borderRight: `${Math.round(size * 0.12)}px solid transparent`,
          borderTop: `${Math.round(size * 0.18)}px solid ${meta.markerColor}`,
          marginTop: -1,
          filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.3))',
        }}
      />

      {/* Name label */}
      {label && (
        <div
          style={{
            marginTop: 3,
            paddingInline: isSelected ? 7 : 5,
            paddingBlock: isSelected ? 2 : 1.5,
            backgroundColor: isSelected ? meta.markerColor : 'rgba(0,0,0,0.72)',
            border: isSelected ? 'none' : `1px solid ${meta.markerColor}60`,
            borderRadius: 99,
            fontSize: isSelected ? 11 : isFeatured ? 10 : 9,
            fontWeight: isSelected ? 600 : 500,
            color: 'white',
            whiteSpace: 'nowrap',
            letterSpacing: '0.01em',
            backdropFilter: 'blur(4px)',
            boxShadow: '0 1px 4px rgba(0,0,0,0.5)',
            lineHeight: 1.4,
          }}
        >
          {label}
        </div>
      )}

      {/* Pulse ring on selected */}
      {isSelected && (
        <span
          className="absolute rounded-full animate-ping opacity-40"
          style={{ top: 0, left: '50%', transform: 'translateX(-50%)', width: size, height: size, backgroundColor: meta.markerColor, borderRadius: '50%' }}
        />
      )}
    </button>
  )
})
