import { useMemo } from 'react'

export type TimePeriod = 'dawn' | 'morning' | 'afternoon' | 'golden' | 'night'

export interface TimeTheme {
  period: TimePeriod
  accent: string      // hex
  accentRgb: string   // r, g, b (for rgba)
  navBg: string       // CSS background value for bars
  greeting: string
  emoji: string
  label: string
}

function getTheme(hour: number): TimeTheme {
  if (hour >= 5 && hour < 7) return {
    period: 'dawn',
    accent: '#c084fc',
    accentRgb: '192, 132, 252',
    navBg: 'rgba(18, 8, 28, 0.92)',
    greeting: 'Good Dawn',
    emoji: '🌅',
    label: 'Dawn',
  }
  if (hour >= 7 && hour < 12) return {
    period: 'morning',
    accent: '#fbbf24',
    accentRgb: '251, 191, 36',
    navBg: 'rgba(20, 14, 4, 0.92)',
    greeting: 'Good Morning',
    emoji: '☀️',
    label: 'Morning',
  }
  if (hour >= 12 && hour < 17) return {
    period: 'afternoon',
    accent: '#38bdf8',
    accentRgb: '56, 189, 248',
    navBg: 'rgba(4, 12, 20, 0.92)',
    greeting: 'Good Afternoon',
    emoji: '🌤️',
    label: 'Afternoon',
  }
  if (hour >= 17 && hour < 20) return {
    period: 'golden',
    accent: '#fb923c',
    accentRgb: '251, 146, 60',
    navBg: 'rgba(20, 9, 3, 0.92)',
    greeting: 'Golden Hour',
    emoji: '🌇',
    label: 'Golden Hour',
  }
  return {
    period: 'night',
    accent: '#34d399',
    accentRgb: '52, 211, 153',
    navBg: 'rgba(6, 8, 14, 0.92)',
    greeting: 'Good Night',
    emoji: '🌙',
    label: 'Night',
  }
}

export function useTimeTheme(): TimeTheme {
  const hour = new Date().getHours()
  return useMemo(() => getTheme(hour), [hour])
}
