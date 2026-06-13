import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: 40,
          background: '#0c0a09',
          display: 'flex',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <svg
          width="180" height="180" viewBox="0 0 180 180"
          style={{ position: 'absolute', top: 0, left: 0 }}
        >
          <path d="M0 148 L45 74 L76 108 L101 58 L136 118 L175 74 L175 148 Z" fill="#065f46" />
          <path d="M0 148 L40 96 L68 124 L95 78 L124 113 L152 86 L175 116 L175 148 Z" fill="#10b981" />
          <circle cx="143" cy="50" r="20" fill="#fbbf24" />
        </svg>
      </div>
    ),
    { ...size },
  )
}
