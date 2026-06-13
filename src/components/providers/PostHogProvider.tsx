'use client'
import posthog from 'posthog-js'
import { PostHogProvider as PHProvider, usePostHog } from 'posthog-js/react'
import { useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

// ── Init ─────────────────────────────────────────────────────────────────────
if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://app.posthog.com',
    capture_pageview: false,          // we do this manually below
    capture_pageleave: true,
    persistence: 'localStorage+cookie',
    loaded: (ph) => {
      if (process.env.NODE_ENV === 'development') ph.debug()
    },
  })
}

// ── Pageview tracker (needs Suspense boundary for useSearchParams) ────────────
function PageviewTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const ph = usePostHog()
  const prevUrl = useRef<string | null>(null)

  useEffect(() => {
    const url = pathname + (searchParams.toString() ? `?${searchParams}` : '')
    if (url === prevUrl.current) return
    prevUrl.current = url
    ph.capture('$pageview', { $current_url: window.location.href })
  }, [pathname, searchParams, ph])

  return null
}

// ── Provider ─────────────────────────────────────────────────────────────────
export function PostHogProvider({ children }: { children: React.ReactNode }) {
  return (
    <PHProvider client={posthog}>
      <Suspense fallback={null}>
        <PageviewTracker />
      </Suspense>
      {children}
    </PHProvider>
  )
}
