import Link from 'next/link'
import { Map } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center text-center p-4">
      <div>
        <div className="w-16 h-16 rounded-2xl bg-stone-900 flex items-center justify-center mx-auto mb-6">
          <Map className="w-8 h-8 text-stone-600" />
        </div>
        <h1 className="text-2xl font-bold text-stone-100 mb-2">Place not found</h1>
        <p className="text-stone-500 mb-6">This destination doesn't exist on our map yet.</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-medium transition-colors"
        >
          Back to Explorer
        </Link>
      </div>
    </div>
  )
}
