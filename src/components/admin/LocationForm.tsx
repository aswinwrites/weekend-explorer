'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Upload } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { slugify } from '@/lib/utils'
import { ALL_CATEGORIES } from '@/lib/categories'
import type { Location } from '@/types'

interface Props { initialData?: Partial<Location> }

export function LocationForm({ initialData }: Props) {
  const router  = useRouter()
  const isEdit  = !!initialData?.id
  const supabase = createClient()

  const [form, setForm] = useState({
    name:             initialData?.name             ?? '',
    slug:             initialData?.slug             ?? '',
    primary_category: initialData?.primary_category ?? 'trek',
    all_categories:   initialData?.all_categories   ?? ['trek'],
    distance_km:      initialData?.distance_km      ?? 50,
    latitude:         initialData?.latitude         ?? 12.9716,
    longitude:        initialData?.longitude        ?? 77.5946,
    google_maps_url:  initialData?.google_maps_url  ?? '',
    description:      initialData?.description      ?? '',
    is_visited:       initialData?.is_visited       ?? false,
    is_featured:      initialData?.is_featured      ?? false,
    image_url:        initialData?.image_url        ?? '',
  })

  const [loading,     setLoading]     = useState(false)
  const [uploading,   setUploading]   = useState(false)
  const [error,       setError]       = useState('')

  const set = (key: string, value: unknown) => setForm(prev => ({ ...prev, [key]: value }))

  const handleNameChange = (name: string) => {
    set('name', name)
    if (!isEdit) set('slug', slugify(name))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const ext  = file.name.split('.').pop()
    const path = `${form.slug || slugify(form.name)}-${Date.now()}.${ext}`
    const { data, error } = await supabase.storage.from('location-images').upload(path, file, { upsert: true })
    if (error) { setError(error.message); setUploading(false); return }
    const { data: { publicUrl } } = supabase.storage.from('location-images').getPublicUrl(data.path)
    set('image_url', publicUrl)
    setUploading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const payload = { ...form, distance_km: Number(form.distance_km), latitude: Number(form.latitude), longitude: Number(form.longitude) }

    if (isEdit) {
      const { error } = await supabase.from('locations').update(payload).eq('id', initialData!.id!)
      if (error) { setError(error.message); setLoading(false); return }
    } else {
      const { error } = await supabase.from('locations').insert(payload)
      if (error) { setError(error.message); setLoading(false); return }
    }

    router.push('/admin/locations')
    router.refresh()
  }

  const inputCls = 'w-full bg-stone-800 border border-white/8 rounded-xl px-3 py-2.5 text-sm text-stone-100 placeholder:text-stone-600 outline-none focus:ring-1 focus:ring-emerald-500/50'
  const labelCls = 'block text-xs text-stone-400 mb-1.5'

  return (
    <form onSubmit={handleSubmit} className="space-y-5 bg-stone-900 border border-white/8 rounded-2xl p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className={labelCls}>Name *</label>
          <input className={inputCls} value={form.name} onChange={e => handleNameChange(e.target.value)} required placeholder="Nandi Hills" />
        </div>
        <div>
          <label className={labelCls}>Slug *</label>
          <input className={inputCls} value={form.slug} onChange={e => set('slug', e.target.value)} required placeholder="nandi-hills" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className={labelCls}>Primary Category *</label>
          <select className={inputCls} value={form.primary_category} onChange={e => set('primary_category', e.target.value)}>
            {ALL_CATEGORIES.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>Distance from Bengaluru (km) *</label>
          <input type="number" className={inputCls} value={form.distance_km} onChange={e => set('distance_km', e.target.value)} required min={0} />
        </div>
      </div>

      <div>
        <label className={labelCls}>All Categories (multi-select)</label>
        <div className="flex flex-wrap gap-1.5">
          {ALL_CATEGORIES.map(c => {
            const active = form.all_categories.includes(c.slug)
            return (
              <button
                key={c.slug} type="button"
                onClick={() => {
                  const next = active
                    ? form.all_categories.filter(x => x !== c.slug)
                    : [...form.all_categories, c.slug]
                  set('all_categories', next)
                }}
                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${active ? 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/40' : 'bg-white/5 text-stone-400 hover:bg-white/10'}`}
              >
                {c.name}
              </button>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className={labelCls}>Latitude *</label>
          <input type="number" step="0.0001" className={inputCls} value={form.latitude} onChange={e => set('latitude', e.target.value)} required />
        </div>
        <div>
          <label className={labelCls}>Longitude *</label>
          <input type="number" step="0.0001" className={inputCls} value={form.longitude} onChange={e => set('longitude', e.target.value)} required />
        </div>
      </div>

      <div>
        <label className={labelCls}>Google Maps URL</label>
        <input className={inputCls} value={form.google_maps_url} onChange={e => set('google_maps_url', e.target.value)} placeholder="https://maps.google.com/?q=..." />
      </div>

      <div>
        <label className={labelCls}>Description</label>
        <textarea className={`${inputCls} min-h-[100px] resize-none`} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Describe this place…" />
      </div>

      {/* Image upload */}
      <div>
        <label className={labelCls}>Image</label>
        <div className="space-y-2">
          <input className={inputCls} value={form.image_url} onChange={e => set('image_url', e.target.value)} placeholder="Or paste image URL…" />
          <label className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/8 text-stone-400 text-sm cursor-pointer hover:bg-white/8 transition-colors w-fit">
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {uploading ? 'Uploading…' : 'Upload image'}
            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
          </label>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.is_visited} onChange={e => set('is_visited', e.target.checked)} className="accent-emerald-500 w-4 h-4 rounded" />
          <span className="text-sm text-stone-300">Visited</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.is_featured} onChange={e => set('is_featured', e.target.checked)} className="accent-emerald-500 w-4 h-4 rounded" />
          <span className="text-sm text-stone-300">Featured</span>
        </label>
      </div>

      {error && (
        <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2">{error}</p>
      )}

      <div className="flex items-center gap-3 pt-2">
        <button type="submit" disabled={loading} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-medium transition-colors disabled:opacity-60">
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {isEdit ? 'Save Changes' : 'Add Location'}
        </button>
        <button type="button" onClick={() => router.back()} className="px-5 py-2.5 rounded-xl bg-white/5 text-stone-400 text-sm hover:bg-white/8 transition-colors">
          Cancel
        </button>
      </div>
    </form>
  )
}
