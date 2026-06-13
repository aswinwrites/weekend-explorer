'use client'
import { useState, useMemo } from 'react'
import { Fuel, Gauge } from 'lucide-react'
import { calcFuel } from '@/lib/utils'

interface Props {
  distanceKm: number
}

export function FuelCalculator({ distanceKm }: Props) {
  const [mileage, setMileage] = useState(35)   // km/l
  const [price, setPrice]     = useState(103)  // ₹/l (typical India price)

  const result = useMemo(() => calcFuel(distanceKm, mileage, price), [distanceKm, mileage, price])

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Fuel className="w-4 h-4 text-emerald-400" />
        <h3 className="text-sm font-semibold text-stone-200">Fuel Cost Calculator</h3>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="text-xs text-stone-500 mb-1 block">Mileage (km/l)</label>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={10} max={80} step={1}
              value={mileage}
              onChange={e => setMileage(Number(e.target.value))}
              className="flex-1 accent-emerald-500 h-1.5"
            />
            <span className="text-xs text-stone-300 w-8 text-right">{mileage}</span>
          </div>
        </div>
        <div>
          <label className="text-xs text-stone-500 mb-1 block">Fuel price (₹/l)</label>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={80} max={130} step={1}
              value={price}
              onChange={e => setPrice(Number(e.target.value))}
              className="flex-1 accent-emerald-500 h-1.5"
            />
            <span className="text-xs text-stone-300 w-8 text-right">₹{price}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-white/4 rounded-xl py-2.5 px-2">
          <p className="text-xs text-stone-500 mb-0.5">Fuel</p>
          <p className="text-sm font-semibold text-stone-200">{result.fuelLitres}L</p>
        </div>
        <div className="bg-white/4 rounded-xl py-2.5 px-2">
          <p className="text-xs text-stone-500 mb-0.5">One-way</p>
          <p className="text-sm font-semibold text-emerald-400">₹{result.oneWayCost}</p>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl py-2.5 px-2">
          <p className="text-xs text-stone-500 mb-0.5">Round trip</p>
          <p className="text-sm font-semibold text-emerald-300">₹{result.roundTripCost}</p>
        </div>
      </div>
      <p className="text-xs text-stone-600 mt-2 text-center">Fuel cost only. Excludes tolls & food.</p>
    </div>
  )
}
