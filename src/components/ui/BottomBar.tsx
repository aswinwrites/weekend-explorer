'use client'
import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { SurpriseButton } from './SurpriseButton'
import { useTimeTheme } from '@/lib/hooks/useTimeTheme'

const QUOTES = [
  { text: 'Not all those who wander are lost.', by: 'Tolkien' },
  { text: 'Every journey begins with a single tank of petrol.', by: '' },
  { text: 'The road is better than the inn.', by: 'Cervantes' },
  { text: 'Travel is the only thing you buy that makes you richer.', by: '' },
  { text: 'A good traveller has no fixed plans.', by: 'Lao Tzu' },
  { text: 'Life is short and the world is wide.', by: '' },
  { text: 'To travel is to live.', by: 'H.C. Andersen' },
  { text: 'Adventure is worthwhile in itself.', by: 'Amelia Earhart' },
  { text: 'The world is a book — those who do not travel read only one page.', by: 'Augustine' },
  { text: 'Bengaluru has a weekend. Use it.', by: '' },
  { text: 'Roads were made for journeys, not destinations.', by: 'Confucius' },
  { text: 'Fill the tank, empty the mind.', by: '' },
]

interface Props {
  onSurprise: () => void
  totalCount: number
  filteredCount: number
}

export function BottomBar({ onSurprise, totalCount, filteredCount }: Props) {
  const theme = useTimeTheme()
  const [idx, setIdx] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const cycle = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setIdx(i => (i + 1) % QUOTES.length)
        setVisible(true)
      }, 500)
    }, 6000)
    return () => clearInterval(cycle)
  }, [])

  const q = QUOTES[idx]

  return (
    <div
      className="surface-bar absolute bottom-0 left-0 right-0 z-20 flex items-center justify-between px-4 sm:px-6 h-11 gap-3"
      style={{
        borderTop: `1px solid ${theme.accent}35`,
        boxShadow: `0 -1px 0 rgba(0,0,0,0.3), 0 -6px 24px rgba(0,0,0,0.25)`,
      }}
    >
      {/* Place count */}
      <span className="text-xs t-muted tabular-nums flex-shrink-0">
        {filteredCount}<span className="hidden sm:inline text-stone-700"> / {totalCount}</span>
      </span>

      {/* Rolling quote */}
      <div className="flex-1 overflow-hidden flex items-center justify-center min-w-0">
        <AnimatePresence mode="wait">
          {visible && (
            <motion.p
              key={idx}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.45, ease: 'easeInOut' }}
              className="text-[11px] truncate text-center select-none"
            style={{ color: '#b8972a' }}
            >
              <span className="italic">"{q.text}"</span>
              {q.by && (
                <span className="text-stone-600 not-italic"> — {q.by}</span>
              )}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Made by */}
      <MadeBy accent={theme.accent} />

      {/* Surprise me */}
      <div className="flex-shrink-0">
        <SurpriseButton onClick={onSurprise} compact />
      </div>
    </div>
  )
}

// ── Made by bar ──────────────────────────────────────────────────────────────
function MadeBy({ accent }: { accent: string }) {
  const [sparked, setSparked] = useState(false)

  return (
    <button
      onClick={() => { setSparked(true); setTimeout(() => setSparked(false), 800) }}
      className="flex items-center gap-1 text-[11px] text-stone-600 hover:text-stone-400 transition-colors select-none group flex-shrink-0"
    >
      <span>by</span>
      <span className="text-stone-400 group-hover:text-white font-medium transition-colors">Aswin</span>
      <span
        className={`transition-transform duration-300 ${sparked ? 'scale-150' : 'scale-100'}`}
        style={{ display: 'inline-block' }}
      >
        ☕
      </span>
      <span className="text-stone-700">×</span>
      <span
        className="font-medium transition-colors hidden sm:inline"
        style={{ color: sparked ? accent : undefined }}
      >
        Claude
      </span>
    </button>
  )
}
