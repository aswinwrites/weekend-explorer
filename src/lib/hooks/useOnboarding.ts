'use client'
import { useState, useEffect } from 'react'
import type { Category } from '@/types'

export type OnboardingInterest =
  | 'trek' | 'waterfall' | 'scenic-ride'
  | 'sunrise' | 'camping' | 'photography' | 'surprise'

export interface OnboardingPrefs {
  completed: boolean
  interest: OnboardingInterest | null
  maxDistance: number  // upper bound in km; 0 = no preference
}

export const INTEREST_CATEGORIES: Record<OnboardingInterest, Category[]> = {
  'trek':        ['trek'],
  'waterfall':   ['waterfall'],
  'scenic-ride': ['fort', 'nature', 'park', 'palace', 'lake'],
  'sunrise':     ['trek', 'fort', 'nature', 'lake'],
  'camping':     ['nature', 'park', 'lake'],
  'photography': ['waterfall', 'fort', 'palace', 'temple', 'nature', 'museum'],
  'surprise':    [],
}

const KEY = 'weekend-explorer-onboarding-v1'
const DEFAULT: OnboardingPrefs = { completed: false, interest: null, maxDistance: 0 }

export function useOnboarding() {
  const [prefs, setPrefs] = useState<OnboardingPrefs>(DEFAULT)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY)
      if (raw) setPrefs(JSON.parse(raw))
    } catch {}
    setLoaded(true)
  }, [])

  const persist = (next: OnboardingPrefs) => {
    setPrefs(next)
    try { localStorage.setItem(KEY, JSON.stringify(next)) } catch {}
  }

  const complete = (interest: OnboardingInterest, maxDistance: number) => {
    persist({ completed: true, interest, maxDistance })
  }

  const reopen = () => persist({ ...prefs, completed: false })

  const showModal = loaded && !prefs.completed

  return { prefs, showModal, complete, reopen, loaded }
}
