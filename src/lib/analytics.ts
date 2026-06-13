/**
 * Typed PostHog event helpers.
 * Import `track` wherever you want to fire events.
 *
 * Usage:
 *   import { track } from '@/lib/analytics'
 *   track('location_viewed', { name: loc.name, category: loc.primary_category })
 */

import posthog from 'posthog-js'

type EventMap = {
  // Location interaction
  location_viewed:     { name: string; category: string; distance_km: number; is_featured: boolean }
  location_saved:      { name: string; category: string; distance_km: number }
  location_unsaved:    { name: string }
  location_maps_click: { name: string; distance_km: number }

  // Discovery
  search_performed:    { query: string; results_count: number }
  filter_applied:      { categories: string[]; distance_min: number; distance_max: number }
  filter_reset:        Record<string, never>
  explore_opened:      Record<string, never>
  explore_card_click:  { name: string; section: string }

  // Onboarding
  onboarding_started:    Record<string, never>
  onboarding_completed:  { interest: string; max_distance: number }
  onboarding_reopened:   Record<string, never>

  // Navigation
  list_view_opened:    Record<string, never>
  map_view_opened:     Record<string, never>
  saved_drawer_opened: Record<string, never>
  share_clicked:       { name: string; method: string }
}

export function track<K extends keyof EventMap>(
  event: K,
  properties?: EventMap[K],
): void {
  if (typeof window === 'undefined') return
  posthog.capture(event, properties as Record<string, unknown>)
}
