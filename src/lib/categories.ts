import type { Category, CategoryMeta } from '@/types'

export const CATEGORIES: Record<Category, CategoryMeta> = {
  trek: {
    name: 'Trek',
    slug: 'trek',
    icon: 'Mountain',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/20',
    markerColor: '#10b981',
  },
  waterfall: {
    name: 'Waterfall',
    slug: 'waterfall',
    icon: 'Waves',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20',
    markerColor: '#3b82f6',
  },
  fort: {
    name: 'Fort',
    slug: 'fort',
    icon: 'Castle',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/20',
    markerColor: '#f59e0b',
  },
  lake: {
    name: 'Lake',
    slug: 'lake',
    icon: 'Droplets',
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/20',
    markerColor: '#06b6d4',
  },
  temple: {
    name: 'Temple',
    slug: 'temple',
    icon: 'Landmark',
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/20',
    markerColor: '#f97316',
  },
  museum: {
    name: 'Museum',
    slug: 'museum',
    icon: 'Building2',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/20',
    markerColor: '#a855f7',
  },
  nature: {
    name: 'Nature',
    slug: 'nature',
    icon: 'Leaf',
    color: 'text-green-400',
    bgColor: 'bg-green-500/20',
    markerColor: '#22c55e',
  },
  park: {
    name: 'Park',
    slug: 'park',
    icon: 'Trees',
    color: 'text-lime-400',
    bgColor: 'bg-lime-500/20',
    markerColor: '#84cc16',
  },
  palace: {
    name: 'Palace',
    slug: 'palace',
    icon: 'Crown',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/20',
    markerColor: '#eab308',
  },
  campus: {
    name: 'Campus',
    slug: 'campus',
    icon: 'GraduationCap',
    color: 'text-indigo-400',
    bgColor: 'bg-indigo-500/20',
    markerColor: '#6366f1',
  },
  cafe: {
    name: 'Cafe',
    slug: 'cafe',
    icon: 'Coffee',
    color: 'text-rose-400',
    bgColor: 'bg-rose-500/20',
    markerColor: '#f43f5e',
  },
  boating: {
    name: 'Boating',
    slug: 'boating',
    icon: 'Sailboat',
    color: 'text-sky-400',
    bgColor: 'bg-sky-500/20',
    markerColor: '#0ea5e9',
  },
}

export function getCategoryMeta(slug: string): CategoryMeta {
  return CATEGORIES[slug as Category] ?? CATEGORIES.trek
}

export const ALL_CATEGORIES = Object.values(CATEGORIES)
