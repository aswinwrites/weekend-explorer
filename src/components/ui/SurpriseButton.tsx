'use client'
import { useState } from 'react'
import { Shuffle } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface Props {
  onClick: () => void
  compact?: boolean
}

export function SurpriseButton({ onClick, compact = false }: Props) {
  const [spinning, setSpinning] = useState(false)

  const handleClick = () => {
    setSpinning(true)
    setTimeout(() => setSpinning(false), 600)
    onClick()
  }

  if (compact) {
    return (
      <motion.button
        onClick={handleClick}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 text-xs font-medium transition-colors"
        title="Surprise Me"
      >
        <motion.div animate={spinning ? { rotate: 360 } : { rotate: 0 }} transition={{ duration: 0.5 }}>
          <Shuffle className="w-3 h-3" />
        </motion.div>
        <span className="hidden sm:inline">Surprise Me</span>
        <span className="sm:hidden">🎲</span>
      </motion.button>
    )
  }

  return (
    <motion.button
      onClick={handleClick}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      className={cn(
        'flex items-center gap-2 px-4 py-2.5 rounded-2xl',
        'bg-emerald-500 hover:bg-emerald-400 text-white font-semibold text-sm',
        'shadow-lg shadow-emerald-500/30 transition-colors',
      )}
    >
      <motion.div animate={spinning ? { rotate: 360 } : { rotate: 0 }} transition={{ duration: 0.5 }}>
        <Shuffle className="w-4 h-4" />
      </motion.div>
      <span className="hidden sm:inline">Surprise Me</span>
      <span className="sm:hidden">🎲</span>
    </motion.button>
  )
}
