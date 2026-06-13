'use client'
import { useState, useEffect } from 'react'

export function BikeAnimation() {
  const [riding, setRiding] = useState(false)

  useEffect(() => {
    const first = setTimeout(() => triggerRide(), 8000)
    return () => clearTimeout(first)
  }, [])

  function triggerRide() {
    setRiding(true)
    // 13s ride + small buffer
    setTimeout(() => {
      setRiding(false)
      setTimeout(() => triggerRide(), 45000)
    }, 13500)
  }

  if (!riding) return null

  return (
    <div
      className="fixed z-30 pointer-events-none"
      style={{ bottom: 50, left: 0, right: 0, height: 80, overflow: 'hidden' }}
    >
      {/* Outer: horizontal ride */}
      <div className="bike-ride" style={{ position: 'absolute', bottom: 0 }}>
        {/* Inner: wheelie tilt — pivot at rear wheel ground contact */}
        <div className="bike-wheelie" style={{ display: 'inline-block' }}>
          {/* Dust trail */}
          <div
            style={{
              position: 'absolute',
              bottom: 2,
              left: -20,
              width: 55,
              height: 10,
              background: 'radial-gradient(ellipse at 30% 50%, rgba(180,160,130,0.4) 0%, transparent 70%)',
              animation: 'dustFade 0.35s ease-out infinite',
            }}
          />
          <Speed400SVG />
        </div>
      </div>
    </div>
  )
}

// ── Triumph Speed 400 inspired SVG ─────────────────────────────────────────
function Speed400SVG() {
  const WHEEL_SPIN = {
    style: { animation: 'wheelSpin 0.6s linear infinite' } as React.CSSProperties,
  }

  return (
    <svg
      viewBox="0 0 175 78"
      width="175"
      height="78"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', overflow: 'visible' }}
    >
      {/* Ground shadow */}
      <ellipse cx="88" cy="75" rx="60" ry="4.5" fill="rgba(0,0,0,0.28)" />

      {/* ── REAR WHEEL ─────────────────────────────────────── */}
      <g style={{ transformOrigin: '36px 57px', ...WHEEL_SPIN.style }}>
        {/* Tyre */}
        <circle cx="36" cy="57" r="18" fill="#111" />
        <circle cx="36" cy="57" r="15" fill="#1a1a1a" />
        {/* Many thin spokes — Speed 400 style */}
        {Array.from({ length: 16 }).map((_, i) => {
          const angle = (i * 360) / 16
          const rad = (angle * Math.PI) / 180
          return (
            <line
              key={i}
              x1={36 + Math.cos(rad) * 3}
              y1={57 + Math.sin(rad) * 3}
              x2={36 + Math.cos(rad) * 14}
              y2={57 + Math.sin(rad) * 14}
              stroke="#555"
              strokeWidth="1"
            />
          )
        })}
        {/* Hub */}
        <circle cx="36" cy="57" r="3.5" fill="#666" />
        <circle cx="36" cy="57" r="2" fill="#888" />
        {/* Tyre tread highlight */}
        <circle cx="36" cy="57" r="17.5" fill="none" stroke="#222" strokeWidth="1" />
      </g>

      {/* ── FRONT WHEEL ────────────────────────────────────── */}
      <g style={{ transformOrigin: '138px 57px', ...WHEEL_SPIN.style }}>
        <circle cx="138" cy="57" r="18" fill="#111" />
        <circle cx="138" cy="57" r="15" fill="#1a1a1a" />
        {Array.from({ length: 16 }).map((_, i) => {
          const angle = (i * 360) / 16
          const rad = (angle * Math.PI) / 180
          return (
            <line
              key={i}
              x1={138 + Math.cos(rad) * 3}
              y1={57 + Math.sin(rad) * 3}
              x2={138 + Math.cos(rad) * 14}
              y2={57 + Math.sin(rad) * 14}
              stroke="#555"
              strokeWidth="1"
            />
          )
        })}
        <circle cx="138" cy="57" r="3.5" fill="#666" />
        <circle cx="138" cy="57" r="2" fill="#888" />
        <circle cx="138" cy="57" r="17.5" fill="none" stroke="#222" strokeWidth="1" />
      </g>

      {/* ── REAR FENDER ────────────────────────────────────── */}
      <path
        d="M28 40 Q36 36 44 40"
        fill="none" stroke="#c00" strokeWidth="3" strokeLinecap="round"
      />

      {/* ── CHAIN STAY / SWING ARM ─────────────────────────── */}
      <path
        d="M36 57 L62 50 L78 50"
        fill="none" stroke="#3a3a3a" strokeWidth="3" strokeLinecap="round"
      />

      {/* ── MAIN FRAME ─────────────────────────────────────── */}
      {/* Backbone spine: head tube → seat */}
      <path
        d="M118 44 L96 28 L66 28 L54 42"
        fill="none" stroke="#b91c1c" strokeWidth="3.5"
        strokeLinecap="round" strokeLinejoin="round"
      />
      {/* Down tube */}
      <path
        d="M96 28 L82 46"
        fill="none" stroke="#991b1b" strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Seat tube */}
      <path
        d="M66 28 L62 50"
        fill="none" stroke="#991b1b" strokeWidth="3"
        strokeLinecap="round"
      />

      {/* ── ENGINE BLOCK ───────────────────────────────────── */}
      {/* Crankcase */}
      <rect x="62" y="42" width="32" height="18" rx="4" fill="#252525" />
      {/* Cylinder head */}
      <rect x="68" y="30" width="18" height="14" rx="3" fill="#2e2e2e" />
      {/* Fins on cylinder */}
      {[32, 35, 38, 40].map((y, i) => (
        <line key={i} x1="68" y1={y} x2="86" y2={y} stroke="#1a1a1a" strokeWidth="1" />
      ))}
      {/* Engine bolt details */}
      <circle cx="66" cy="45" r="2" fill="#333" />
      <circle cx="90" cy="45" r="2" fill="#333" />
      <circle cx="66" cy="57" r="2" fill="#333" />
      <circle cx="90" cy="57" r="2" fill="#333" />

      {/* ── EXHAUST PIPE (high scrambler style) ────────────── */}
      {/* Low section */}
      <path
        d="M62 55 Q52 56 44 54 Q36 52 30 52"
        fill="none" stroke="#888" strokeWidth="2.5" strokeLinecap="round"
      />
      {/* Heat wrap markings */}
      {[50, 46, 42, 38, 34].map((x, i) => (
        <line key={i} x1={x} y1={50} x2={x - 1} y2={55} stroke="#777" strokeWidth="1.2" />
      ))}
      {/* Muffler end cap */}
      <ellipse cx="29" cy="52" rx="3" ry="4" fill="#666" />
      <ellipse cx="27.5" cy="52" rx="1.5" ry="3" fill="#444" />

      {/* ── FUEL TANK (Triumph teardrop) ────────────────────── */}
      {/* Main tank body — iconic teardrop */}
      <path
        d="M62 28 Q65 14 82 12 Q96 12 100 22 L96 28 Z"
        fill="#dc2626"
      />
      {/* Tank shine/highlight — top */}
      <path
        d="M70 16 Q80 12 90 16"
        fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round"
      />
      {/* Tank badge / knee recess shadow */}
      <path
        d="M65 26 Q68 20 78 18 Q88 17 94 22"
        fill="none" stroke="#b91c1c" strokeWidth="1.5"
      />
      {/* Fuel cap */}
      <ellipse cx="78" cy="14" rx="5" ry="2.5" fill="#111" />
      <ellipse cx="78" cy="14" rx="3.5" ry="1.5" fill="#333" />

      {/* ── SEAT ───────────────────────────────────────────── */}
      <path
        d="M60 28 Q64 24 80 24 L80 28 Q70 30 60 28 Z"
        fill="#1a1a1a"
      />
      {/* Seat seam */}
      <path
        d="M60 26 Q70 28 80 26"
        fill="none" stroke="#333" strokeWidth="1"
      />

      {/* ── FRONT FORK (telescopic) ─────────────────────────── */}
      {/* Fork tubes */}
      <path
        d="M118 44 L130 56 L138 57"
        fill="none" stroke="#666" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"
      />
      <path
        d="M122 38 L134 54"
        fill="none" stroke="#777" strokeWidth="2.5" strokeLinecap="round"
      />
      {/* Fork brace */}
      <path
        d="M126 50 L132 50"
        fill="none" stroke="#555" strokeWidth="2"
      />
      {/* Front fender */}
      <path
        d="M130 42 Q140 39 146 44"
        fill="none" stroke="#c00" strokeWidth="3" strokeLinecap="round"
      />

      {/* ── HEADSTOCK + HANDLEBAR ───────────────────────────── */}
      {/* Head tube */}
      <rect x="116" y="32" width="6" height="15" rx="3" fill="#444" />
      {/* Handlebar stems */}
      <path
        d="M119 34 L116 26 M119 34 L126 28"
        fill="none" stroke="#555" strokeWidth="2.5" strokeLinecap="round"
      />
      {/* Bar ends */}
      <circle cx="116" cy="26" r="2.5" fill="#333" />
      <circle cx="126" cy="28" r="2.5" fill="#333" />
      {/* Throttle/grip detail */}
      <line x1="122" y1="27" x2="126" y2="29" stroke="#666" strokeWidth="3" strokeLinecap="round" />

      {/* ── HEADLIGHT (round, Speed 400 style) ─────────────── */}
      <circle cx="148" cy="40" r="9" fill="#222" />
      <circle cx="148" cy="40" r="7" fill="#1a1a1a" />
      {/* Lens */}
      <circle cx="148" cy="40" r="5.5" fill="#fffbeb" opacity="0.9" />
      <circle cx="148" cy="40" r="4" fill="#fef08a" />
      <circle cx="146" cy="38" r="1.5" fill="white" opacity="0.6" />
      {/* Light beam */}
      <path d="M153 37 L166 33 M154 40 L168 40 M153 43 L166 47"
        stroke="rgba(254,240,138,0.25)" strokeWidth="1.5" strokeLinecap="round"
      />
      {/* Headlight bracket */}
      <path d="M140 44 L144 44" stroke="#555" strokeWidth="2" strokeLinecap="round" />

      {/* ── TAIL LIGHT ─────────────────────────────────────── */}
      <rect x="42" y="35" width="7" height="4" rx="1.5" fill="#ff2020" opacity="0.85" />
      <rect x="43" y="36" width="5" height="2" rx="1" fill="#ff6060" opacity="0.7" />

      {/* ── FOOTPEGS ───────────────────────────────────────── */}
      <line x1="70" y1="60" x2="60" y2="63" stroke="#444" strokeWidth="2" strokeLinecap="round" />
      <line x1="88" y1="60" x2="98" y2="63" stroke="#444" strokeWidth="2" strokeLinecap="round" />

      {/* ── RIDER ──────────────────────────────────────────── */}
      {/* Helmet — full face, dark */}
      <ellipse cx="88" cy="10" rx="10" ry="11" fill="#111" />
      <path d="M79 8 Q78 4 82 1 Q88 -2 94 1 Q98 4 97 8" fill="#1a1a1a" />
      {/* Visor — amber tinted */}
      <path
        d="M80 10 Q84 16 88 16 Q92 16 96 10"
        fill="rgba(251,191,36,0.35)" stroke="rgba(251,191,36,0.2)" strokeWidth="0.5"
      />
      {/* Helmet chin */}
      <path d="M80 14 Q84 18 88 18 Q92 18 96 14" fill="#111" />
      {/* Riding jacket — darker top */}
      <path
        d="M88 22 Q78 24 72 32 L78 36 Q82 28 88 26 Q94 28 98 36 L104 32 Q98 24 88 22 Z"
        fill="#1a1a1a"
      />
      {/* Left arm (reaching for bars) */}
      <path
        d="M78 30 Q72 32 68 30 L66 33 Q72 36 78 34"
        fill="#111" stroke="#1a1a1a" strokeWidth="0.5"
      />
      {/* Gloves */}
      <circle cx="66" cy="32" r="3" fill="#222" />
      <circle cx="126" cy="26" r="3" fill="#222" />
      {/* Right arm extended to bar */}
      <path
        d="M98 28 Q112 24 122 26"
        fill="none" stroke="#1a1a1a" strokeWidth="5" strokeLinecap="round"
      />
      {/* Jacket detail — elbow patch */}
      <path d="M106 26 Q110 25 114 26" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" />
      {/* Legs / riding pants */}
      <path
        d="M78 36 Q72 44 72 56 L82 56 Q84 46 88 42 Q92 46 94 56 L104 56 Q104 44 98 36 Z"
        fill="#1e1e2e"
      />
      {/* Boots */}
      <path d="M72 56 Q68 58 66 62 L82 62 L82 56 Z" fill="#222" />
      <path d="M104 56 Q108 58 110 62 L94 62 L94 56 Z" fill="#222" />
    </svg>
  )
}
