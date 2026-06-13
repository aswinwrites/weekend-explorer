import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { FuelCalcResult } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function distanceLabel(km: number): string {
  if (km < 50)  return 'Under 50 km'
  if (km < 100) return '50–100 km'
  if (km < 150) return '100–150 km'
  if (km < 250) return '150–250 km'
  return '250+ km'
}

export function calcFuel(
  distanceKm: number,
  mileage: number,
  fuelPrice: number,
): FuelCalcResult {
  const fuelLitres = distanceKm / mileage
  const oneWayCost = fuelLitres * fuelPrice
  return {
    fuelLitres: Math.round(fuelLitres * 10) / 10,
    oneWayCost: Math.round(oneWayCost),
    roundTripCost: Math.round(oneWayCost * 2),
  }
}

export function buildShareUrl(slug: string): string {
  const base =
    process.env.NEXT_PUBLIC_APP_URL ?? 'https://weekendexplorer.in'
  return `${base}/place/${slug}`
}

export function buildGoogleMapsSearch(name: string): string {
  return `https://maps.google.com/?q=${encodeURIComponent(name + ' Karnataka India')}`
}
