import { createClient } from '@/lib/supabase/server'
import { MapExplorer } from '@/components/map/MapExplorer'
import type { Location } from '@/types'

export const revalidate = 3600 // ISR every hour

export default async function HomePage() {
  const supabase = await createClient()
  const { data: locations } = await supabase
    .from('locations')
    .select('*')
    .order('distance_km', { ascending: true })

  return (
    <main className="w-screen h-screen overflow-hidden">
      <MapExplorer initialLocations={(locations as Location[]) ?? []} />
    </main>
  )
}
