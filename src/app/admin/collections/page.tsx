import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Edit2 } from 'lucide-react'

export default async function AdminCollectionsPage() {
  const supabase = await createClient()
  const { data: collections } = await supabase
    .from('collections')
    .select(`*, collection_locations(count)`)
    .order('created_at', { ascending: true })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">Collections</h1>
        <Link
          href="/admin/collections/new"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" /> New Collection
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {(collections ?? []).map(col => {
          const count = (col.collection_locations as unknown as { count: number }[])?.[0]?.count ?? 0
          return (
            <div key={col.id} className="bg-stone-900 border border-white/8 rounded-2xl p-4 flex items-start justify-between gap-3">
              <div>
                <p className="font-medium text-stone-100">{col.name}</p>
                <p className="text-xs text-stone-500 mt-0.5 line-clamp-2">{col.description}</p>
                <p className="text-xs text-emerald-400 mt-1">{count} places</p>
              </div>
              <Link
                href={`/admin/collections/${col.id}`}
                className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-white/8 transition-colors flex-shrink-0"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}
