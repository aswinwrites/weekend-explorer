import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 7,
          background: '#0c0a09',
          display: 'flex',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Back mountains */}
        <svg
          width="32" height="32" viewBox="0 0 32 32"
          style={{ position: 'absolute', top: 0, left: 0 }}
        >
          <path d="M0 26 L8 13 L13 19 L18 11 L24 21 L32 14 L32 26 Z" fill="#065f46" />
          <path d="M0 26 L7 17 L12 22 L17 14 L22 20 L27 16 L32 21 L32 26 Z" fill="#10b981" />
          <circle cx="25" cy="9" r="3.5" fill="#fbbf24" />
        </svg>
      </div>
    ),
    { ...size },
  )
}
