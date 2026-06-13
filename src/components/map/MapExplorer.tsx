'use client'
import { useState, useCallback, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { Map, List, Compass, SlidersHorizontal } from 'lucide-react'
import type { Location, FilterState } from '@/types'
import { SearchBar } from '@/components/search/SearchBar'
import { LocationPanel } from '@/components/location/LocationPanel'
import { BottomBar } from '@/components/ui/BottomBar'
import { SavedListDrawer } from '@/components/ui/SavedListDrawer'
import { NavBar } from '@/components/ui/NavBar'
import { FilterDrawer, FilterButton } from '@/components/ui/FilterDrawer'
import { ListView } from '@/components/ui/ListView'
import { ExploreTab } from '@/components/ui/ExploreTab'
import { OnboardingModal } from '@/components/ui/OnboardingModal'
import { useSavedList } from '@/lib/hooks/useSavedList'
import { useOnboarding, INTEREST_CATEGORIES } from '@/lib/hooks/useOnboarding'
import { useTimeTheme } from '@/lib/hooks/useTimeTheme'
import { cn } from '@/lib/utils'

const MapView = dynamic(() => import('./MapView'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-stone-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-stone-400 text-sm tracking-wide">Loading map…</p>
      </div>
    </div>
  ),
})

interface Props {
  initialLocations: Location[]
}

const DEFAULT_FILTER: FilterState = {
  categories: [],
  distance: [0, 300],
  visited: 'all',
  search: '',
}

type ViewMode = 'map' | 'list'

export function MapExplorer({ initialLocations }: Props) {
  const theme = useTimeTheme()
  const [selected, setSelected] = useState<Location | null>(null)
  const [filter, setFilter] = useState<FilterState>(DEFAULT_FILTER)
  const [flyTo, setFlyTo] = useState<{ lng: number; lat: number; zoom?: number } | null>(null)
  const [showSaved, setShowSaved] = useState(false)
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false)
  const [exploreOpen, setExploreOpen] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('map')
  const { savedIds, toggle, isSaved, count: savedCount } = useSavedList()
  const { showModal, complete: completeOnboarding, reopen: reopenOnboarding } = useOnboarding()

  const filteredLocations = useMemo(() => {
    return initialLocations.filter(loc => {
      if (filter.categories.length > 0 &&
          !filter.categories.some(c => loc.all_categories.includes(c))) return false
      if (loc.distance_km < filter.distance[0] || loc.distance_km > filter.distance[1]) return false
      if (filter.visited === 'visited' && !loc.is_visited) return false
      if (filter.visited === 'to-visit' && loc.is_visited) return false
      if (filter.search) {
        const q = filter.search.toLowerCase()
        if (!loc.name.toLowerCase().includes(q) &&
            !loc.primary_category.toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [initialLocations, filter])

  const savedLocations = useMemo(
    () => initialLocations.filter(l => savedIds.has(l.id)),
    [initialLocations, savedIds],
  )

  const handleSelectLocation = useCallback((loc: Location) => {
    setSelected(loc)
    setViewMode('map')
    setFlyTo({ lng: loc.longitude, lat: loc.latitude, zoom: 12 })
  }, [])

  const handleSurprise = useCallback(() => {
    if (filteredLocations.length === 0) return
    const idx = Math.floor(Math.random() * filteredLocations.length)
    handleSelectLocation(filteredLocations[idx])
  }, [filteredLocations, handleSelectLocation])

  const handleFilterChange = useCallback((next: Partial<FilterState>) => {
    setFilter(prev => ({ ...prev, ...next }))
  }, [])

  const handleOnboardingComplete = useCallback((
    interest: Parameters<typeof completeOnboarding>[0],
    maxDistance: number,
  ) => {
    const cats = INTEREST_CATEGORIES[interest]
    const dist: [number, number] = maxDistance > 0 ? [0, maxDistance] : [0, 300]
    setFilter(prev => ({ ...prev, categories: cats, distance: dist }))
    completeOnboarding(interest, maxDistance)
  }, [completeOnboarding])

  const activeFilterCount = filter.categories.length +
    (filter.distance[0] > 0 || filter.distance[1] < 300 ? 1 : 0)

  return (
    <div className="relative w-full h-full">
      {/* Map always rendered in background */}
      <MapView
        locations={filteredLocations}
        selected={viewMode === 'map' ? selected : null}
        flyTo={flyTo}
        onSelectLocation={handleSelectLocation}
        onClosePanel={() => setSelected(null)}
      />

      {/* NavBar */}
      <NavBar savedCount={savedCount} onOpenSaved={() => setShowSaved(true)} />

      {/* ── Search + controls row ── */}
      <div
        className="surface-bar absolute left-0 right-0 z-20 flex items-center gap-2 px-3 sm:px-5 h-11 border-b border-black/8 dark:border-white/6"
        style={{ top: 56 }}
      >
        {/* Search — constrained width so it doesn't dominate the row */}
        <div className="w-40 sm:w-56 flex-shrink-0">
          <SearchBar
            locations={initialLocations}
            value={filter.search}
            onChange={q => handleFilterChange({ search: q })}
            onSelect={handleSelectLocation}
          />
        </div>

        {/* Filters button */}
        <FilterButton onClick={() => setFilterDrawerOpen(true)} activeCount={activeFilterCount} />

        {/* Spacer */}
        <div className="flex-1" />

        {/* Map / List toggle */}
        <div className="flex items-center rounded-xl p-0.5 flex-shrink-0 bg-black/6 dark:bg-white/6">
          {(['map', 'list'] as ViewMode[]).map(mode => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={viewMode === mode ? {
                backgroundColor: theme.accent + '25',
                color: theme.accent,
              } : { color: '#78716c' }}
            >
              {mode === 'map' ? <Map className="w-3.5 h-3.5" /> : <List className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline capitalize">{mode}</span>
            </button>
          ))}
        </div>

        {/* Explore button */}
        <button
          onClick={() => setExploreOpen(true)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium flex-shrink-0 border transition-all bg-black/4 dark:bg-white/4 border-black/8 dark:border-white/8 t-secondary"
        >
          <Compass className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Explore</span>
        </button>
      </div>

      {/* List view — solid background covers the map */}
      {viewMode === 'list' && (
        <div
          className="surface-overlay absolute left-0 right-0 bottom-11 z-20 flex flex-col overflow-hidden"
          style={{ top: 56 + 44 }}
        >
          <ListView
            locations={filteredLocations}
            onSelect={handleSelectLocation}
            isSaved={isSaved}
          />
        </div>
      )}

      {/* Refine Recommendations — prominent floating pill */}
      {viewMode === 'map' && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20">
          <button
            onClick={reopenOnboarding}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold shadow-lg transition-all hover:scale-105 active:scale-95"
            style={{
              background: theme.accent,
              color: '#000',
              boxShadow: `0 4px 20px ${theme.accent}60`,
            }}
          >
            <Compass className="w-4 h-4" />
            Refine Recommendations
          </button>
        </div>
      )}

      {/* Bottom bar */}
      <BottomBar
        onSurprise={handleSurprise}
        totalCount={initialLocations.length}
        filteredCount={filteredLocations.length}
      />

      {/* Drawers & overlays */}
      <FilterDrawer
        open={filterDrawerOpen}
        filter={filter}
        onChange={handleFilterChange}
        onClose={() => setFilterDrawerOpen(false)}
      />

      <ExploreTab
        open={exploreOpen}
        allLocations={initialLocations}
        onClose={() => setExploreOpen(false)}
        onSelect={handleSelectLocation}
      />

      {selected && viewMode === 'map' && (
        <LocationPanel
          location={selected}
          allLocations={initialLocations}
          isSaved={isSaved(selected.id)}
          onToggleSave={() => toggle(selected.id)}
          onClose={() => setSelected(null)}
          onSelectNearby={handleSelectLocation}
        />
      )}

      <SavedListDrawer
        open={showSaved}
        locations={savedLocations}
        onClose={() => setShowSaved(false)}
        onSelect={loc => { handleSelectLocation(loc); setShowSaved(false) }}
        onRemove={id => toggle(id)}
      />

      {/* Onboarding modal — first visit only */}
      {showModal && (
        <OnboardingModal onComplete={handleOnboardingComplete} />
      )}
    </div>
  )
}
