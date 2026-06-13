'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Map, MapPin, LayoutGrid, Upload, LogOut, Home } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import type { User } from '@supabase/supabase-js'

const NAV = [
  { href: '/admin',             label: 'Dashboard',  icon: Home },
  { href: '/admin/locations',   label: 'Locations',  icon: MapPin },
  { href: '/admin/collections', label: 'Collections',icon: LayoutGrid },
  { href: '/admin/import',      label: 'Import',     icon: Upload },
]

export function AdminNav({ user }: { user: User | null }) {
  const pathname  = usePathname()
  const router    = useRouter()
  const supabase  = createClient()

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-20 border-b border-white/8 bg-stone-950/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-emerald-500 flex items-center justify-center">
              <Map className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-xs text-stone-500 font-medium">Admin</span>
          </Link>

          <nav className="flex items-center gap-1">
            {NAV.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors',
                  pathname === item.href
                    ? 'bg-white/8 text-stone-100'
                    : 'text-stone-500 hover:text-stone-300 hover:bg-white/4',
                )}
              >
                <item.icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {user && <span className="text-xs text-stone-600 hidden sm:block">{user.email}</span>}
          <button
            onClick={signOut}
            className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-300 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </div>
    </header>
  )
}
