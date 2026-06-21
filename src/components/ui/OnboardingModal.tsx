'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Compass } from 'lucide-react'
import type { OnboardingInterest } from '@/lib/hooks/useOnboarding'
import { useTimeTheme } from '@/lib/hooks/useTimeTheme'
import { track } from '@/lib/analytics'

const INTERESTS: { id: OnboardingInterest; emoji: string; label: string; sub: string }[] = [
  { id: 'trek',        emoji: '⛰️', label: 'Trek',          sub: 'Trails & summits' },
  { id: 'waterfall',   emoji: '💦', label: 'Waterfall',     sub: 'Cascades & streams' },
  { id: 'scenic-ride', emoji: '🛣️', label: 'Scenic Ride',   sub: 'Roads & viewpoints' },
  { id: 'sunrise',     emoji: '🌅', label: 'Sunrise Spot',  sub: 'Early morning magic' },
  { id: 'camping',     emoji: '🏕️', label: 'Camping',       sub: 'Lakes & forests' },
  { id: 'photography', emoji: '📷', label: 'Photography',   sub: 'Forts, palaces & falls' },
  { id: 'surprise',    emoji: '🎲', label: 'Surprise Me',   sub: 'Let the map decide' },
]

const DISTANCES: { label: string; sub: string; value: number }[] = [
  { label: 'Under 50 km',   sub: '~1 hr drive',    value: 50  },
  { label: '50 – 100 km',   sub: '1–2 hr drive',   value: 100 },
  { label: '100 – 150 km',  sub: '2–2.5 hr drive', value: 150 },
  { label: '150 – 250 km',  sub: '2.5–4 hr drive', value: 250 },
  { label: 'No Preference', sub: 'Show everything', value: 0  },
]

interface Props {
  onComplete: (interest: OnboardingInterest, maxDistance: number) => void
}

export function OnboardingModal({ onComplete, trigger = 'first_visit' }: Props & { trigger?: 'first_visit' | 'refine' }) {
  const theme = useTimeTheme()
  const [step, setStep] = useState<1 | 2>(1)
  const [interest, setInterest] = useState<OnboardingInterest | null>(null)

  // Track modal shown once on mount
  useState(() => {
    track('onboarding_shown', { trigger })
  })

  const handleInterest = (id: OnboardingInterest) => {
    track('onboarding_interest_selected', { interest: id })
    setInterest(id)
    setTimeout(() => setStep(2), 160)
  }

  const handleDistance = (value: number) => {
    if (!interest) return
    track('onboarding_completed', { interest, max_distance_km: value })
    onComplete(interest, value)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 24, stiffness: 260 }}
        className="surface-overlay relative z-10 w-full max-w-lg"
        style={{
          border: `1px solid ${theme.accent}30`,
          borderRadius: 20,
          boxShadow: `0 0 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(0,0,0,0.06)`,
        }}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-center gap-2 mb-1">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: theme.accent + '20', color: theme.accent }}
            >
              <Compass className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: theme.accent }}>
              Weekend Explorer
            </span>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div key="q1" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }} transition={{ duration: 0.2 }}>
                <h2 className="text-xl font-bold text-white mt-2">What's calling you this weekend?</h2>
                <p className="text-sm text-stone-500 mt-0.5">Pick one — we'll find the best spots.</p>
              </motion.div>
            ) : (
              <motion.div key="q2" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.2 }}>
                <h2 className="text-xl font-bold text-white mt-2">How far are you willing to ride?</h2>
                <p className="text-sm text-stone-500 mt-0.5">Distance from Bengaluru.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Step indicator */}
        <div className="flex gap-1.5 px-6 mb-4">
          {[1, 2].map(s => (
            <div
              key={s}
              className="h-1 rounded-full transition-all duration-300"
              style={{
                flex: s === step ? 2 : 1,
                backgroundColor: s <= step ? theme.accent : 'rgba(255,255,255,0.1)',
              }}
            />
          ))}
        </div>

        {/* Options */}
        <div className="px-6 pb-6">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="interests"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="grid grid-cols-2 gap-2"
              >
                {INTERESTS.map((item, i) => (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => handleInterest(item.id)}
                    className="flex items-center gap-3 p-3 rounded-2xl text-left transition-all duration-150 group border"
                    style={{
                      backgroundColor: interest === item.id ? theme.accent + '20' : 'rgba(255,255,255,0.04)',
                      borderColor: interest === item.id ? theme.accent + '60' : 'rgba(255,255,255,0.06)',
                    }}
                    onMouseEnter={e => {
                      const el = e.currentTarget
                      el.style.backgroundColor = theme.accent + '14'
                      el.style.borderColor = theme.accent + '40'
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget
                      el.style.backgroundColor = interest === item.id ? theme.accent + '20' : 'rgba(255,255,255,0.04)'
                      el.style.borderColor = interest === item.id ? theme.accent + '60' : 'rgba(255,255,255,0.06)'
                    }}
                  >
                    <span className="text-2xl flex-shrink-0">{item.emoji}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-stone-100">{item.label}</p>
                      <p className="text-xs text-stone-500 truncate">{item.sub}</p>
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="distances"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex flex-col gap-2"
              >
                {DISTANCES.map((item, i) => (
                  <motion.button
                    key={item.value}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => handleDistance(item.value)}
                    className="flex items-center justify-between px-4 py-3 rounded-2xl text-left transition-all duration-150 border"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.04)',
                      borderColor: 'rgba(255,255,255,0.06)',
                    }}
                    onMouseEnter={e => {
                      const el = e.currentTarget
                      el.style.backgroundColor = theme.accent + '14'
                      el.style.borderColor = theme.accent + '40'
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget
                      el.style.backgroundColor = 'rgba(255,255,255,0.04)'
                      el.style.borderColor = 'rgba(255,255,255,0.06)'
                    }}
                  >
                    <div>
                      <p className="text-sm font-semibold text-stone-100">{item.label}</p>
                      <p className="text-xs text-stone-500">{item.sub}</p>
                    </div>
                    <span className="text-stone-600 text-lg">→</span>
                  </motion.button>
                ))}

                <button
                  onClick={() => setStep(1)}
                  className="mt-1 text-xs text-stone-600 hover:text-stone-400 transition-colors text-center"
                >
                  ← Change interest
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}
