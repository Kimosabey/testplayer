import type { Metadata } from 'next'
import { Newsreader } from 'next/font/google'
import localFont from 'next/font/local'

import './globals.css'

import { LenisProvider } from '@/components/layout/LenisProvider'
import { Shell } from '@/components/layout/Shell'

const newsreader = Newsreader({
  subsets: ['latin'],
  weight: ['800'],
  variable: '--font-newsreader',
  display: 'swap'
})


const satoshi = localFont({
  src: [
    {
      path: '../public/fonts/satoshi/WNDVG7O66ENLOD43GS7FBUCC4KMT5OM2.woff2',
      weight: '300',
      style: 'normal'
    },
    {
      path: '../public/fonts/satoshi/7AHDUZ4A7LFLVFUIFSARGIWCRQJHISQP.woff2',
      weight: '500',
      style: 'normal'
    }
  ],
  variable: '--font-satoshi',
  display: 'swap'
})

export const metadata: Metadata = {
  title: 'TestPlayer',
  description: 'A SaaS-quality platform for taking tests and analyzing results.'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${newsreader.variable} ${satoshi.variable}`}>
      <body className="min-h-screen bg-cream text-charcoal">
        <LenisProvider>
          <Shell>{children}</Shell>
        </LenisProvider>
      </body>
    </html>
  )
}
