'use client'

import { usePathname } from 'next/navigation'
import { PropsWithChildren } from 'react'

import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'

export function Shell({ children }: PropsWithChildren) {
  const pathname = usePathname()
  const isTestTaking = /^\/tests\/[^/]+$/.test(pathname)

  if (isTestTaking) {
    return <main className="min-h-screen bg-cream text-charcoal">{children}</main>
  }

  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  )
}
