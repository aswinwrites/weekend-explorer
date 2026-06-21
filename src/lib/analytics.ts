/**
 * Unified analytics helper — fires to both PostHog and GA4.
 * Import `track` wherever you need to capture events.
 *
 * Usage:
 *   import { track } from '@/lib/analytics'
 *   track('place_selected', { place_name: loc.name, source: 'map_marker', ... })
 */

import posthog from 'posthog-js'

// ── GA4 type augmentation ──────────────────────────────────────────────────
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js' | 'set',
      targetIdOrEvent: string | Date,
      params?: Record<string, unknown>,
    ) => void
    dataLayer: unknown[]
  }
}

// ── Source discriminator ───────────────────────────────────────────────────
export type PlaceSource =
  | 'map_marker'
  | 'list_card'
  | 'search'
  | 'explore_tab'
  | 'nearby_suggestion'
  | 'saved_list'
  | 'surprise'

// ── Full event catalogue ───────────────────────────────────────────────────
// Every trackable interaction is typed here. TypeScript will catch typos and
// missing params at every call site.

type EventMap = {
  // ── Place discovery ────────────────────────────────────────────────────
  /** User opens a place's detail panel, from any source */
  place_selected: {
    place_name: string
    place_category: string
    distance_km: number
    is_featured: boolean
    source: PlaceSource
  }

  // ── Onboarding ──────────────────────────────────────────────────────────
  /** Modal appeared — first visit or "Refine Recommendations" */
  onboarding_shown: { trigger: 'first_visit' | 'refine' }
  /** User tapped an interest chip (step 1) */
  onboarding_interest_selected: { interest: string }
  /** User finished both steps */
  onboarding_completed: { interest: string; max_distance_km: number }

  // ── Filters ────────────────────────────────────────────────────────────
  /** Filter drawer slid open */
  filter_drawer_opened: { active_filter_count: number }
  /** Single category chip toggled */
  filter_category_toggled: {
    category: string
    action: 'added' | 'removed'
    active_category_count: number
  }
  /** Distance band selected */
  filter_distance_changed: {
    distance_label: string
    distance_min: number
    distance_max: number
  }
  /** "Reset" hit */
  filter_reset: Record<string, never>

  // ── Navigation / view ──────────────────────────────────────────────────
  /** Map ↔ List toggle */
  view_mode_changed: { from: 'map' | 'list'; to: 'map' | 'list' }
  /** Explore tab opened */
  explore_tab_opened: Record<string, never>
  /** Saved list drawer opened */
  saved_list_opened: { saved_count: number }
  /** "Refine Recommendations" pill clicked */
  refine_recommendations_clicked: Record<string, never>
  /** 🎲 Surprise Me */
  surprise_clicked: { place_name: string; place_category: string }

  // ── Search ─────────────────────────────────────────────────────────────
  /** Query entered and results shown */
  search_performed: { query: string; results_count: number }
  /** Result tapped in dropdown */
  search_result_selected: {
    query: string
    place_name: string
    place_category: string
  }

  // ── Place panel actions ────────────────────────────────────────────────
  /** "Open in Maps" */
  place_maps_opened: { place_name: string; place_category: string }
  /** ↗ Full detail page link */
  place_detail_page_opened: { place_name: string; place_category: string }
  /** Bookmark toggled */
  place_saved: {
    place_name: string
    place_category: string
    action: 'saved' | 'unsaved'
  }
  /** Share button */
  place_shared: {
    place_name: string
    platform: 'whatsapp' | 'telegram' | 'x' | 'copy_link'
  }
  /** Nearby place tapped inside the panel */
  nearby_place_clicked: {
    from_place: string
    to_place: string
    nearby_distance_km: number
  }
}

// ── Public helper ──────────────────────────────────────────────────────────
export function track<K extends keyof EventMap>(
  event: K,
  properties?: EventMap[K],
): void {
  if (typeof window === 'undefined') return

  // PostHog
  try {
    posthog.capture(event, properties as Record<string, unknown>)
  } catch {
    // PostHog not yet initialised — swallow silently
  }

  // GA4
  if (typeof window.gtag === 'function') {
    window.gtag('event', event, properties as Record<string, unknown>)
  }
}
