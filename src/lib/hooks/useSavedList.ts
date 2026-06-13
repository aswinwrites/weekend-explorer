'use client'
import { useState, useEffect, useCallback } from 'react'
import type { Location } from '@/types'

const KEY = 'weekend-explorer-saved'

export function useSavedList() {
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    try {
      const stored = localStorage.getItem(KEY)
      if (stored) setSavedIds(new Set(JSON.parse(stored)))
    } catch {}
  }, [])

  const save = useCallback((id: string) => {
    setSavedIds(prev => {
      const next = new Set(prev)
      next.add(id)
      try { localStorage.setItem(KEY, JSON.stringify([...next])) } catch {}
      return next
    })
  }, [])

  const remove = useCallback((id: string) => {
    setSavedIds(prev => {
      const next = new Set(prev)
      next.delete(id)
      try { localStorage.setItem(KEY, JSON.stringify([...next])) } catch {}
      return next
    })
  }, [])

  const toggle = useCallback((id: string) => {
    setSavedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      try { localStorage.setItem(KEY, JSON.stringify([...next])) } catch {}
      return next
    })
  }, [])

  const isSaved = useCallback((id: string) => savedIds.has(id), [savedIds])

  return { savedIds, save, remove, toggle, isSaved, count: savedIds.size }
}
