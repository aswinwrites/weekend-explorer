import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { PostHogProvider } from '@/components/providers/PostHogProvider'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://weekendexplorer.in'

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: 'Weekend Explorer Bengaluru',
    template: '%s | Weekend Explorer Bengaluru',
  },
  description:
    'Discover 100+ weekend destinations around Bengaluru — treks, forts, waterfalls, lakes, and hidden gems. Built for riders, trekkers, and weekend explorers.',
  keywords: [
    'bengaluru weekend trips',
    'karnataka trekking',
    'places near bangalore',
    'weekend getaway bangalore',
    'motorcycle rides bangalore',
    'offbeat karnataka',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: APP_URL,
    siteName: 'Weekend Explorer Bengaluru',
    title: 'Weekend Explorer Bengaluru',
    description: 'Discover 100+ weekend destinations around Bengaluru.',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Weekend Explorer Bengaluru',
    description: 'Discover 100+ weekend destinations around Bengaluru.',
    images: ['/og-image.png'],
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="antialiased font-sans">
        <PostHogProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </PostHogProvider>
      </body>
    </html>
  )
}
