export type Category =
  | 'trek'
  | 'waterfall'
  | 'fort'
  | 'lake'
  | 'temple'
  | 'museum'
  | 'nature'
  | 'park'
  | 'palace'
  | 'campus'
  | 'cafe'
  | 'boating'

export interface CategoryMeta {
  name: string
  slug: Category
  icon: string
  color: string
  bgColor: string
  markerColor: string
}

export interface Location {
  id: string
  name: string
  slug: string
  primary_category: Category
  all_categories: Category[]
  distance_km: number
  latitude: number
  longitude: number
  google_maps_url: string | null
  description: string | null
  image_url: string | null
  is_visited: boolean
  is_featured: boolean
  created_at: string
  updated_at: string
}

export interface Collection {
  id: string
  name: string
  slug: string
  description: string | null
  cover_image: string | null
  is_public: boolean
  created_at: string
  locations?: Location[]
  location_count?: number
}

export interface FilterState {
  categories: Category[]
  distance: [number, number]
  visited: 'all' | 'visited' | 'to-visit'
  search: string
}

export interface FuelCalcResult {
  fuelLitres: number
  oneWayCost: number
  roundTripCost: number
}
