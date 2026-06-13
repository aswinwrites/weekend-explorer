'use client'
import { useState } from 'react'
import { Upload, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { slugify } from '@/lib/utils'
import type { Category } from '@/types'

function normalizeCategory(raw: string): Category {
  const lower = raw.toLowerCase().trim()
  if (lower.includes('trek') || lower.includes('view point')) return 'trek'
  if (lower.includes('waterfall') || lower.includes('falls')) return 'waterfall'
  if (lower.includes('fort')) return 'fort'
  if (lower.includes('lake') || lower.includes('dam') || lower.includes('reservoir') || lower.includes('waterbody')) return 'lake'
  if (lower.includes('temple') || lower.includes('church')) return 'temple'
  if (lower.includes('museum')) return 'museum'
  if (lower.includes('forest') || lower.includes('nature') || lower.includes('sanctuary') || lower.includes('zoo')) return 'nature'
  if (lower.includes('park') || lower.includes('chill')) return 'park'
  if (lower.includes('palace')) return 'palace'
  if (lower.includes('campus') || lower.includes('iim') || lower.includes('iisc')) return 'campus'
  if (lower.includes('cafe')) return 'cafe'
  if (lower.includes('boating')) return 'boating'
  return 'trek'
}

function parseAllCategories(raw: string): Category[] {
  const parts = raw.split(',').map(s => s.trim()).filter(Boolean)
  const cats = parts.map(normalizeCategory)
  return [...new Set(cats)]
}

interface CSVRow {
  name: string
  primary_category: Category
  all_categories: Category[]
  distance_km: number
  slug: string
}

function parseCSV(text: string): CSVRow[] {
  const lines = text.trim().split('\n')
  const rows: CSVRow[] = []

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    // CSV parsing: handle quoted fields
    const cols: string[] = []
    let cur = '', inQuote = false
    for (let c = 0; c < line.length; c++) {
      if (line[c] === '"') { inQuote = !inQuote }
      else if (line[c] === ',' && !inQuote) { cols.push(cur); cur = '' }
      else cur += line[c]
    }
    cols.push(cur)

    if (cols.length < 7) continue
    const name = cols[1]?.trim().replace(/\r?\n/g, ' ')
    const typeRaw = cols[2]?.trim()
    const distance = parseInt(cols[6], 10)

    if (!name || !typeRaw || isNaN(distance)) continue

    const allCats = parseAllCategories(typeRaw)
    rows.push({
      name,
      slug: slugify(name),
      primary_category: allCats[0],
      all_categories: allCats,
      distance_km: distance,
    })
  }
  return rows
}

export default function ImportPage() {
  const [file,     setFile]     = useState<File | null>(null)
  const [preview,  setPreview]  = useState<CSVRow[]>([])
  const [loading,  setLoading]  = useState(false)
  const [result,   setResult]   = useState<{ imported: number; skipped: number } | null>(null)
  const [error,    setError]    = useState('')
  const supabase = createClient()

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setResult(null)
    setError('')
    const text = await f.text()
    setPreview(parseCSV(text).slice(0, 10))
  }

  const handleImport = async () => {
    if (!file) return
    setLoading(true)
    setError('')

    const text = await file.text()
    const rows = parseCSV(text)

    let imported = 0, skipped = 0
    for (const row of rows) {
      // Check for duplicate slug
      const { data: existing } = await supabase.from('locations').select('id').eq('slug', row.slug).single()
      if (existing) { skipped++; continue }

      const { error } = await supabase.from('locations').insert({
        ...row,
        latitude: 12.9716,   // default – edit after import
        longitude: 77.5946,
        is_visited: false,
      })
      if (error) { skipped++; continue }
      imported++
    }

    setResult({ imported, skipped })
    setLoading(false)
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold">Import CSV</h1>
        <p className="text-stone-500 text-sm mt-1">
          Upload your Trip Tracker CSV. Categories and slugs are auto-detected.
          Coordinates default to Bengaluru — update them afterwards.
        </p>
      </div>

      <div className="bg-stone-900 border border-white/8 rounded-2xl p-6 space-y-5">
        <label className="flex flex-col items-center justify-center gap-3 p-8 rounded-xl border-2 border-dashed border-white/12 hover:border-white/24 transition-colors cursor-pointer">
          <Upload className="w-8 h-8 text-stone-500" />
          <span className="text-sm text-stone-400">
            {file ? file.name : 'Click to upload CSV'}
          </span>
          <span className="text-xs text-stone-600">Supports the Trip Tracker CSV format</span>
          <input type="file" accept=".csv" className="hidden" onChange={handleFile} />
        </label>

        {preview.length > 0 && (
          <div>
            <p className="text-xs text-stone-500 mb-2">Preview (first 10 rows)</p>
            <div className="rounded-xl overflow-hidden border border-white/8">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-white/4 text-stone-500 uppercase tracking-wider">
                    <th className="text-left px-3 py-2">Name</th>
                    <th className="text-left px-3 py-2">Category</th>
                    <th className="text-left px-3 py-2">Km</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.map((row, i) => (
                    <tr key={i} className="border-t border-white/4">
                      <td className="px-3 py-2 text-stone-300">{row.name}</td>
                      <td className="px-3 py-2 text-stone-500 capitalize">{row.primary_category}</td>
                      <td className="px-3 py-2 text-stone-500">{row.distance_km}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 text-rose-400 text-sm bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
          </div>
        )}

        {result && (
          <div className="flex items-center gap-2 text-emerald-400 text-sm bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            Imported {result.imported} locations. {result.skipped} skipped (duplicates).
          </div>
        )}

        <button
          onClick={handleImport}
          disabled={!file || loading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-medium transition-colors disabled:opacity-50"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {loading ? 'Importing…' : 'Import Locations'}
        </button>
      </div>
    </div>
  )
}
