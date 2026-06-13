'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import maplibregl from 'maplibre-gl'
import type { Location } from '@/types'
import { getCategoryMeta } from '@/lib/categories'
import { createRoot } from 'react-dom/client'
import { MapMarker } from './MapMarker'

const BENGALURU = { lng: 77.5946, lat: 12.9716 }
const DEFAULT_ZOOM = 9
const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'

// At low zoom, show only featured + 1 representative per category for a curated feel.
function getDisplayedLocations(locations: Location[], zoom: number): Location[] {
  if (zoom >= 9) return locations  // full set

  // At overview zoom: featured + best-distance variety per category
  const featured = locations.filter(l => l.is_featured)
  const featuredIds = new Set(featured.map(l => l.id))
  const seenCategories = new Set(featured.map(l => l.primary_category))
  const representatives: Location[] = []

  // One closest location per category not already covered by featured
  const sorted = [...locations].sort((a, b) => a.distance_km - b.distance_km)
  for (const loc of sorted) {
    if (featuredIds.has(loc.id)) continue
    if (!seenCategories.has(loc.primary_category)) {
      seenCategories.add(loc.primary_category)
      representatives.push(loc)
    }
  }

  return [...featured, ...representatives]
}

interface Props {
  locations: Location[]
  selected: Location | null
  flyTo: { lng: number; lat: number; zoom?: number } | null
  onSelectLocation: (loc: Location) => void
  onClosePanel: () => void
}

export default function MapView({ locations, selected, flyTo, onSelectLocation, onClosePanel }: Props) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const markersRef = useRef<Map<string, { marker: maplibregl.Marker; root: ReturnType<typeof createRoot> }>>(new Map())
  const [zoom, setZoom] = useState(DEFAULT_ZOOM)

  // Init map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: MAP_STYLE,
      center: [BENGALURU.lng, BENGALURU.lat],
      zoom: DEFAULT_ZOOM,
      pitchWithRotate: false,
      attributionControl: false,
    })

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-left')
    map.on('click', () => onClosePanel())
    map.on('zoom', () => setZoom(map.getZoom()))

    mapRef.current = map

    return () => {
      markersRef.current.forEach(({ marker, root }) => { root.unmount(); marker.remove() })
      markersRef.current.clear()
      map.remove()
      mapRef.current = null
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Sync markers based on zoom-filtered display set
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    const displayed = getDisplayedLocations(locations, zoom)
    const displayedSet = new Set(displayed.map(l => l.id))

    // Remove markers not in display set
    markersRef.current.forEach(({ marker, root }, id) => {
      if (!displayedSet.has(id)) {
        root.unmount(); marker.remove()
        markersRef.current.delete(id)
      }
    })

    // Add / update markers
    displayed.forEach(loc => {
      const isSelected = selected?.id === loc.id

      if (markersRef.current.has(loc.id)) {
        // Re-render existing to update selected/featured state
        const { root } = markersRef.current.get(loc.id)!
        root.render(
          <MapMarker
            category={loc.primary_category}
            isSelected={isSelected}
            isFeatured={loc.is_featured}
            name={loc.name}
            onClick={() => onSelectLocation(loc)}
          />
        )
        return
      }

      const el = document.createElement('div')
      el.style.cursor = 'pointer'
      const root = createRoot(el)
      root.render(
        <MapMarker
          category={loc.primary_category}
          isSelected={isSelected}
          isFeatured={loc.is_featured}
          onClick={() => onSelectLocation(loc)}
        />
      )
      const marker = new maplibregl.Marker({ element: el, anchor: 'center' })
        .setLngLat([loc.longitude, loc.latitude])
        .addTo(map)
      markersRef.current.set(loc.id, { marker, root })
    })
  }, [locations, selected, onSelectLocation, zoom])

  // Fly to selected
  useEffect(() => {
    if (!mapRef.current || !flyTo) return
    mapRef.current.flyTo({
      center: [flyTo.lng, flyTo.lat],
      zoom: flyTo.zoom ?? 12,
      speed: 1.4,
      curve: 1.5,
      essential: true,
    })
  }, [flyTo])

  return (
    <div
      ref={mapContainerRef}
      className="w-full h-full"
      style={{ position: 'absolute', inset: 0 }}
    />
  )
}
