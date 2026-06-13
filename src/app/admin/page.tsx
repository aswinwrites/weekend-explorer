import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { MapPin, LayoutGrid, Plus, Upload } from 'lucide-react'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const [{ count: total }, { count: visited }, { count: collections }] = await Promise.all([
    supabase.from('locations').select('*', { count: 'exact', head: true }),
    supabase.from('locations').select('*', { count: 'exact', head: true }).eq('is_visited', true),
    supabase.from('collections').select('*', { count: 'exact', head: true }),
  ])

  const stats = [
    { label: 'Total Locations', value: total ?? 0, icon: MapPin, color: 'text-emerald-400' },
    { label: 'Visited',         value: visited ?? 0, icon: MapPin, color: 'text-blue-400' },
    { label: 'To Visit',        value: (total ?? 0) - (visited ?? 0), icon: MapPin, color: 'text-amber-400' },
    { label: 'Collections',     value: collections ?? 0, icon: LayoutGrid, color: 'text-purple-400' },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-stone-500 text-sm mt-1">Manage Weekend Explorer Bengaluru</p>
        </div>
        <Link
          href="/admin/locations/new"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Location
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {stats.map(s => (
          <div key={s.label} className="bg-stone-900 border border-white/8 rounded-2xl p-4">
            <p className="text-stone-500 text-xs mb-2">{s.label}</p>
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/admin/locations"
          className="flex items-center gap-3 p-4 rounded-2xl bg-stone-900 border border-white/8 hover:border-white/16 transition-colors"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <p className="font-medium text-stone-100">Manage Locations</p>
            <p className="text-xs text-stone-500">Edit, delete, upload images</p>
          </div>
        </Link>
        <Link
          href="/admin/collections"
          className="flex items-center gap-3 p-4 rounded-2xl bg-stone-900 border border-white/8 hover:border-white/16 transition-colors"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
            <LayoutGrid className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <p className="font-medium text-stone-100">Collections</p>
            <p className="text-xs text-stone-500">Curate destination sets</p>
          </div>
        </Link>
        <Link
          href="/admin/import"
          className="flex items-center gap-3 p-4 rounded-2xl bg-stone-900 border border-white/8 hover:border-white/16 transition-colors"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <Upload className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <p className="font-medium text-stone-100">Import CSV</p>
            <p className="text-xs text-stone-500">Bulk import destinations</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
