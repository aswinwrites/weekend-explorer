import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Edit2, Trash2, Navigation, CheckCircle2, Clock } from 'lucide-react'
import { getCategoryMeta } from '@/lib/categories'
import { DeleteLocationButton } from '@/components/admin/DeleteLocationButton'

export default async function AdminLocationsPage() {
  const supabase = await createClient()
  const { data: locations } = await supabase
    .from('locations')
    .select('*')
    .order('distance_km', { ascending: true })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold">Locations</h1>
          <p className="text-stone-500 text-sm">{locations?.length ?? 0} total</p>
        </div>
        <Link
          href="/admin/locations/new"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Location
        </Link>
      </div>

      <div className="bg-stone-900 border border-white/8 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/8 text-stone-500 text-xs uppercase tracking-wider">
              <th className="text-left px-4 py-3">Name</th>
              <th className="text-left px-4 py-3 hidden sm:table-cell">Category</th>
              <th className="text-left px-4 py-3 hidden md:table-cell">Distance</th>
              <th className="text-left px-4 py-3 hidden sm:table-cell">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {(locations ?? []).map(loc => {
              const meta = getCategoryMeta(loc.primary_category)
              return (
                <tr key={loc.id} className="border-b border-white/4 hover:bg-white/2 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-stone-100">{loc.name}</p>
                    <p className="text-xs text-stone-600 sm:hidden">{meta.name} · {loc.distance_km} km</p>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-medium"
                      style={{ backgroundColor: meta.markerColor + '20', color: meta.markerColor }}
                    >
                      {meta.name}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="flex items-center gap-1 text-stone-400">
                      <Navigation className="w-3 h-3" /> {loc.distance_km} km
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    {loc.is_visited ? (
                      <span className="flex items-center gap-1 text-emerald-400 text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Visited
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-stone-500 text-xs">
                        <Clock className="w-3.5 h-3.5" /> To Visit
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <Link
                        href={`/admin/locations/${loc.id}`}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-white/8 transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Link>
                      <DeleteLocationButton id={loc.id} name={loc.name} />
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
