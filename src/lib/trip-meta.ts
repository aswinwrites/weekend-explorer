import type { Category } from '@/types'

// ── Travel time ────────────────────────────────────────────────────────────
export function travelTimeLabel(distKm: number): string {
  if (distKm <= 35)  return '< 45 min'
  if (distKm <= 55)  return '~1 hr'
  if (distKm <= 80)  return '~1.5 hrs'
  if (distKm <= 110) return '~2 hrs'
  if (distKm <= 150) return '~2.5 hrs'
  if (distKm <= 200) return '~3 hrs'
  return '3.5–4+ hrs'
}

export function travelTimeMinutes(distKm: number): number {
  // ~55 km/h avg incl. city egress + state highway mix
  return Math.round((distKm / 55) * 60)
}

// ── Fuel estimate ──────────────────────────────────────────────────────────
export function fuelEstimate(
  distKm: number,
  fuelPricePerL = 103,
  kmPerL = 18,
): { litres: number; oneWay: number; roundTrip: number } {
  const onewayL = distKm / kmPerL
  return {
    litres: Math.round(onewayL * 10) / 10,
    oneWay: Math.round(onewayL * fuelPricePerL),
    roundTrip: Math.round(onewayL * 2 * fuelPricePerL),
  }
}

// ── Best for ───────────────────────────────────────────────────────────────
const BEST_FOR: Record<Category, string[]> = {
  trek:      ['Adventure', 'Fitness', 'Nature lovers'],
  waterfall: ['Monsoon visits', 'Photography', 'Couples'],
  fort:      ['History buffs', 'Sunrise views', 'Photography'],
  lake:      ['Picnics', 'Birdwatching', 'Quiet escapes'],
  temple:    ['Spiritual seekers', 'Architecture', 'Early risers'],
  museum:    ['History lovers', 'Families', 'Culture'],
  nature:    ['Nature walks', 'Birdwatching', 'Relaxation'],
  park:      ['Families', 'Picnics', 'Morning walks'],
  palace:    ['Photography', 'History', 'Couples'],
  campus:    ['Architecture', 'Quiet walks', 'Students'],
  cafe:      ['Foodies', 'Remote work', 'Couples'],
  boating:   ['Families', 'Couples', 'Water lovers'],
}

export function bestFor(category: Category): string[] {
  return BEST_FOR[category] ?? ['Everyone']
}

// ── Best time to visit ─────────────────────────────────────────────────────
const BEST_TIME: Record<Category, string> = {
  trek:      'Oct – Feb (cool & clear)',
  waterfall: 'Jul – Oct (peak monsoon)',
  fort:      'Oct – Feb, sunrise hours',
  lake:      'Oct – Mar',
  temple:    'Year-round, early morning',
  museum:    'Year-round, weekdays',
  nature:    'Jun – Nov (lush green)',
  park:      'Nov – Feb (cool weather)',
  palace:    'Oct – Feb',
  campus:    'Year-round',
  cafe:      'Evenings & weekends',
  boating:   'Oct – Feb',
}

export function bestTime(category: Category): string {
  return BEST_TIME[category] ?? 'Year-round'
}

// ── Trip type label ────────────────────────────────────────────────────────
const TRIP_TYPE: Record<Category, string> = {
  trek:      'Day Trek',
  waterfall: 'Day Trip',
  fort:      'Heritage Trip',
  lake:      'Leisure Outing',
  temple:    'Spiritual Visit',
  museum:    'Culture Day',
  nature:    'Nature Escape',
  park:      'Family Outing',
  palace:    'Heritage Trip',
  campus:    'Scenic Walk',
  cafe:      'Chill Outing',
  boating:   'Water Activity',
}

export function tripType(category: Category): string {
  return TRIP_TYPE[category] ?? 'Day Trip'
}

// ── Google Maps multi-stop URL ────────────────────────────────────────────
export function buildMapsRouteUrl(locations: { name: string; latitude: number; longitude: number }[]): string {
  if (locations.length === 0) return 'https://maps.google.com'
  const origin = 'Bengaluru, Karnataka, India'
  const dest = `${locations[locations.length - 1].latitude},${locations[locations.length - 1].longitude}`
  const waypoints = locations.slice(0, -1).map(l => `${l.latitude},${l.longitude}`).join('|')
  const base = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${dest}`
  return waypoints ? `${base}&waypoints=${encodeURIComponent(waypoints)}` : base
}
