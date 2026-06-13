'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Bookmark, Sun, Moon, Map, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTimeTheme } from '@/lib/hooks/useTimeTheme'

// ── Weather helpers ────────────────────────────────────────────────────────
const WMO: Record<number, { emoji: string; label: string }> = {
  0:  { emoji: '☀️',  label: 'Clear' },
  1:  { emoji: '🌤️', label: 'Mostly clear' },
  2:  { emoji: '⛅',  label: 'Partly cloudy' },
  3:  { emoji: '🌥️', label: 'Overcast' },
  45: { emoji: '🌫️', label: 'Foggy' },
  48: { emoji: '🌫️', label: 'Foggy' },
  51: { emoji: '🌦️', label: 'Drizzle' },
  53: { emoji: '🌦️', label: 'Drizzle' },
  55: { emoji: '🌧️', label: 'Heavy drizzle' },
  61: { emoji: '🌧️', label: 'Rain' },
  63: { emoji: '🌧️', label: 'Rain' },
  65: { emoji: '🌧️', label: 'Heavy rain' },
  71: { emoji: '❄️',  label: 'Snow' },
  80: { emoji: '🌦️', label: 'Showers' },
  81: { emoji: '🌧️', label: 'Showers' },
  82: { emoji: '⛈️',  label: 'Heavy showers' },
  95: { emoji: '⛈️',  label: 'Thunderstorm' },
  96: { emoji: '⛈️',  label: 'Thunderstorm' },
  99: { emoji: '⛈️',  label: 'Thunderstorm' },
}

function wmo(code: number) {
  return WMO[code] ?? WMO[Math.floor(code / 10) * 10] ?? { emoji: '🌤️', label: 'Cloudy' }
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

interface WeatherDay { day: string; code: number; max: number; min: number }
interface WeatherState { temp: number; code: number; daily: WeatherDay[] }

// ── Component ──────────────────────────────────────────────────────────────
interface Props {
  savedCount: number
  onOpenSaved: () => void
}

export function NavBar({ savedCount, onOpenSaved }: Props) {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const timeTheme = useTimeTheme()
  const [now, setNow] = useState(new Date())
  const [weather, setWeather] = useState<WeatherState | null>(null)
  const [showForecast, setShowForecast] = useState(false)

  // Update clock every 30s
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30_000)
    return () => clearInterval(t)
  }, [])

  // Fetch Bengaluru weather once (Open-Meteo, free, no key)
  useEffect(() => {
    fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=12.9716&longitude=77.5946' +
      '&current=temperature_2m,weathercode' +
      '&daily=weathercode,temperature_2m_max,temperature_2m_min' +
      '&timezone=Asia/Kolkata&forecast_days=7'
    )
      .then(r => r.json())
      .then(d => {
        setWeather({
          temp: Math.round(d.current.temperature_2m),
          code: d.current.weathercode,
          daily: d.daily.time.map((t: string, i: number) => ({
            day: DAYS[new Date(t).getDay()],
            code: d.daily.weathercode[i],
            max: Math.round(d.daily.temperature_2m_max[i]),
            min: Math.round(d.daily.temperature_2m_min[i]),
          })),
        })
      })
      .catch(() => {})
  }, [])

  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
  const dateStr = now.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })

  return (
    <header className="absolute top-0 left-0 right-0 z-30">
      <div
        className="surface-bar flex items-center justify-between px-4 sm:px-6 h-14 gap-3 border-b border-black/8 dark:border-white/6"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-semibold text-sm tracking-tight flex-shrink-0 t-primary">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center shadow-lg"
            style={{ backgroundColor: timeTheme.accent, boxShadow: `0 4px 12px ${timeTheme.accent}50` }}
          >
            <Map className="w-4 h-4 text-white" />
          </div>
          <span className="hidden sm:inline">Weekend Explorer</span>
          <span className="text-stone-500 hidden sm:inline text-xs">· BLR</span>
        </Link>

        {/* Centre: time + weather */}
        <div className="flex items-center gap-3 flex-1 justify-center min-w-0">
          {/* Time period badge */}
          <span className="hidden md:flex items-center gap-1 text-xs text-stone-500">
            <span>{timeTheme.emoji}</span>
            <span>{timeTheme.label}</span>
          </span>

          {/* Clock + Date */}
          <div className="hidden md:flex items-center gap-1.5 text-xs t-secondary">
            <span className="t-primary font-medium tabular-nums">{timeStr}</span>
            <span className="t-muted">·</span>
            <span>{dateStr}</span>
          </div>

          {/* Current weather */}
          {weather && (
            <button
              onClick={() => setShowForecast(v => !v)}
              className={cn(
                'flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs transition-all',
                showForecast
                  ? 'bg-black/8 dark:bg-white/10 t-primary'
                  : 't-secondary hover:bg-black/5 dark:hover:bg-white/5',
              )}
            >
              <span className="text-base leading-none">{wmo(weather.code).emoji}</span>
              <span className="font-semibold t-primary">{weather.temp}°C</span>
              <span className="t-muted hidden sm:inline">{wmo(weather.code).label}</span>
              <span className="t-muted hidden sm:inline">·</span>
              <span className="t-muted hidden sm:inline text-[11px]">7-day ▾</span>
            </button>
          )}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* Suggest Places */}
          <a
            href="https://tally.so/r/RGrDOj"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all border"
            style={{
              backgroundColor: timeTheme.accent + '18',
              color: timeTheme.accent,
              borderColor: timeTheme.accent + '40',
            }}
          >
            <Plus className="w-3.5 h-3.5" />
            Suggest Places
          </a>

          {/* Mobile: just icon */}
          <a
            href="https://tally.so/r/RGrDOj"
            target="_blank"
            rel="noopener noreferrer"
            className="sm:hidden glass rounded-xl p-2 transition-colors"
            style={{ color: timeTheme.accent }}
            title="Suggest a place"
          >
            <Plus className="w-4 h-4" />
          </a>

          <button
            onClick={onOpenSaved}
            className="glass rounded-xl p-2 text-stone-400 hover:text-white transition-colors relative"
          >
            <Bookmark className="w-4 h-4" />
            {savedCount > 0 && (
              <span
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-white text-[10px] flex items-center justify-center font-bold shadow-sm"
                style={{ backgroundColor: timeTheme.accent }}
              >
                {savedCount > 9 ? '9+' : savedCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="glass rounded-xl p-2 text-stone-400 hover:text-white transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 7-day forecast dropdown */}
      {showForecast && weather && (
        <div className="surface-bar border-b border-black/8 dark:border-white/6 px-4 sm:px-6 py-3 flex gap-2 overflow-x-auto scrollbar-none">
          {weather.daily.map((d, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl flex-shrink-0 text-center"
              style={i === 0 ? {
                backgroundColor: timeTheme.accent + '18',
                border: `1px solid ${timeTheme.accent}40`,
              } : { backgroundColor: 'rgba(255,255,255,0.05)' }}
            >
              <span className="text-[11px] font-medium text-stone-400">{i === 0 ? 'Today' : d.day}</span>
              <span className="text-lg leading-none">{wmo(d.code).emoji}</span>
              <span className="text-[11px] font-semibold text-stone-200">{d.max}°</span>
              <span className="text-[11px] text-stone-500">{d.min}°</span>
            </div>
          ))}
        </div>
      )}
    </header>
  )
}
