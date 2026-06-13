import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { LocationForm } from '@/components/admin/LocationForm'

interface Props { params: Promise<{ id: string }> }

export default async function EditLocationPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('locations').select('*').eq('id', id).single()
  if (!data) notFound()

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-bold mb-6">Edit Location</h1>
      <LocationForm initialData={data} />
    </div>
  )
}
