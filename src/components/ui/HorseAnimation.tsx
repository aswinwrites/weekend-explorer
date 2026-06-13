'use client'
import { useState, useEffect } from 'react'

export function HorseAnimation() {
  const [running, setRunning] = useState(false)

  useEffect(() => {
    const first = setTimeout(() => triggerRun(), 8000)
    return () => clearTimeout(first)
  }, [])

  function triggerRun() {
    setRunning(true)
    setTimeout(() => {
      setRunning(false)
      setTimeout(() => triggerRun(), 45000)
    }, 11500)
  }

  if (!running) return null

  return (
    <div
      className="fixed z-30 pointer-events-none"
      style={{ bottom: 50, left: 0, right: 0, height: 92, overflow: 'hidden' }}
    >
      {/* Outer div: horizontal travel */}
      <div className="gallop-ride" style={{ position: 'absolute', bottom: 0 }}>
        {/* Inner div: body bob */}
        <div className="gallop-bob">
          {/* Hoof dust — behind the horse (right side, since horse moves left) */}
          <div style={{
            position: 'absolute',
            bottom: 2,
            right: -10,
            width: 60,
            height: 14,
            background: 'radial-gradient(ellipse at 60% 50%, rgba(180,150,110,0.45) 0%, transparent 70%)',
            animation: 'dustPuff 0.3s ease-out infinite',
          }} />
          <HorseSVG />
        </div>
      </div>
    </div>
  )
}

// ── Galloping horse SVG ──────────────────────────────────────────────────────
// Horse faces LEFT (direction of travel). Head at left, rump+tail at right.
function HorseSVG() {
  const CYCLE = '0.45s'

  const leg = (
    origin: string,
    anim: string,
    delay: string,
    x1: number, y1: number,
    x2: number, y2: number,
    x3: number, y3: number,
    hoofX: number, hoofY: number,
    shade: string,
  ) => (
    <g style={{ transformOrigin: origin, animation: `${anim} ${CYCLE} ease-in-out infinite`, animationDelay: delay }}>
      {/* Upper leg */}
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={shade} strokeWidth="5.5" strokeLinecap="round" />
      {/* Lower leg */}
      <line x1={x2} y1={y2} x2={x3} y2={y3} stroke={shade} strokeWidth="4" strokeLinecap="round" />
      {/* Hoof */}
      <ellipse cx={hoofX} cy={hoofY} rx={4} ry={2.2} fill="#1a0800" />
    </g>
  )

  return (
    <svg
      viewBox="0 0 158 90"
      width="158"
      height="90"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', overflow: 'visible' }}
    >
      {/* Ground shadow */}
      <ellipse cx="78" cy="87" rx="55" ry="4" fill="rgba(0,0,0,0.22)" />

      {/* ── TAIL (right/rear, animated) ──────────────────────── */}
      <g style={{ transformOrigin: '122px 52px', animation: `tailSwing ${CYCLE} ease-in-out infinite` }}>
        <path d="M122 52 Q136 44 142 34 Q146 26 140 20"
          fill="none" stroke="#1a0800" strokeWidth="4" strokeLinecap="round" />
        <path d="M122 52 Q138 48 144 40 Q148 32 144 24"
          fill="none" stroke="#0f0500" strokeWidth="3" strokeLinecap="round" />
        <path d="M122 52 Q134 50 138 44 Q142 38 140 30"
          fill="none" stroke="#1a0800" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M122 52 Q132 52 134 48 Q136 42 132 36"
          fill="none" stroke="#2a1000" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* ── BACK LEGS (right side of body) ─────────────────── */}
      {/* Back-right (slightly behind, lighter shade) */}
      {leg('104px 64px', 'backLegB', '-0.11s', 104, 64, 106, 77, 102, 88, 102, 88, '#5C2408')}
      {/* Back-left (leading back leg) */}
      {leg('98px 64px', 'backLegA', '0s', 98, 64, 100, 77, 96, 88, 96, 88, '#7D3312')}

      {/* ── MAIN BODY ────────────────────────────────────────── */}
      {/*
        Horse body as a solid silhouette:
        - Rump at right (~x=120)
        - Chest at left (~x=38)
        - Belly below, back above
      */}
      <path
        d="
          M 118,68
          Q 124,50 118,42
          Q 108,37 88,36
          Q 68,35 50,39
          Q 38,43 36,56
          Q 36,68 48,70
          Q 70,74 96,72
          Q 112,70 118,68 Z
        "
        fill="#7D3312"
      />
      {/* Back highlight — top ridge */}
      <path d="M 50,39 Q 68,34 88,36 Q 108,37 118,42"
        fill="none" stroke="#9B4018" strokeWidth="1.5" strokeLinecap="round" />
      {/* Belly shadow */}
      <path d="M 46,68 Q 70,74 100,72 Q 112,70 118,68"
        fill="none" stroke="#5C2408" strokeWidth="1.5" strokeLinecap="round" />

      {/* ── NECK ─────────────────────────────────────────────── */}
      <path
        d="M 38,54 Q 30,42 26,28 L 38,24 Q 42,36 48,48 Z"
        fill="#7D3312"
      />
      {/* Neck highlight */}
      <path d="M 38,24 Q 36,36 40,48" fill="none" stroke="#9B4018" strokeWidth="1.5" strokeLinecap="round" />

      {/* ── HEAD ─────────────────────────────────────────────── */}
      <path
        d="
          M 26,28
          Q 20,20 16,18
          Q 8,18 8,26
          Q 8,34 16,36
          Q 22,38 28,34
          Q 30,30 26,28 Z
        "
        fill="#7D3312"
      />
      {/* Muzzle area (slightly lighter) */}
      <path
        d="M 8,26 Q 8,34 16,36 Q 12,32 12,26 Q 12,20 16,18"
        fill="#6B2B0A"
      />
      {/* Nostril */}
      <ellipse cx="10" cy="30" rx="2.2" ry="1.5" fill="#3a1000" transform="rotate(10 10 30)" />
      {/* Mouth line */}
      <path d="M 8,33 Q 12,35 16,34" fill="none" stroke="#5C2408" strokeWidth="1" strokeLinecap="round" />

      {/* ── EAR ──────────────────────────────────────────────── */}
      <path d="M 20,18 L 18,10 L 24,16 Z" fill="#7D3312" />
      <path d="M 20,17 L 19,12 L 23,16 Z" fill="#5C2408" />

      {/* ── EYE ──────────────────────────────────────────────── */}
      <circle cx="18" cy="24" r="2.8" fill="#1a0800" />
      <circle cx="17" cy="23" r="1" fill="rgba(255,255,255,0.45)" />

      {/* ── MANE (flowing back/right since horse moves left) ─── */}
      <path d="M 24,18 Q 30,22 34,30 Q 36,36 34,42"
        fill="none" stroke="#1a0800" strokeWidth="5" strokeLinecap="round" />
      <path d="M 26,17 Q 33,22 38,30 Q 40,36 38,42"
        fill="none" stroke="#0f0500" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M 28,16 Q 36,22 40,30 Q 42,36 40,44"
        fill="none" stroke="#1a0800" strokeWidth="3" strokeLinecap="round" />
      <path d="M 30,15 Q 38,22 42,30 Q 44,38 42,46"
        fill="none" stroke="#2a1000" strokeWidth="2" strokeLinecap="round" />

      {/* ── FRONT LEGS (left side of body) ─────────────────── */}
      {/* Front-right (slightly behind, lighter shade) */}
      {leg('48px 66px', 'frontLegB', '-0.11s', 48, 66, 46, 78, 50, 88, 50, 88, '#5C2408')}
      {/* Front-left (leading front leg) */}
      {leg('42px 66px', 'frontLegA', '0s', 42, 66, 40, 78, 44, 88, 44, 88, '#7D3312')}
    </svg>
  )
}
