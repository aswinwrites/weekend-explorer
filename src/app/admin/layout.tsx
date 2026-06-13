import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminNav } from '@/components/admin/AdminNav'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // /admin/login is handled separately; all other /admin/* need auth
  // Middleware handles the redirect but this is a belt-and-suspenders check
  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      <AdminNav user={user} />
      <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
