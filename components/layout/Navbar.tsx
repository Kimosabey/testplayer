'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/Button'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 80)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={
        'sticky top-0 z-50 bg-cream/90 backdrop-blur-[2px] border-b border-subtle transition-shadow ' +
        (scrolled ? 'shadow-[0_18px_40px_rgba(17,16,16,0.08)]' : 'shadow-none')
      }
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/" className="font-serif italic text-xl tracking-tight">
          TestPlayer
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-muted md:flex">
          <Link href="/tests" className="hover:text-charcoal transition-colors">
            Tests
          </Link>
          <a href="#pricing" className="hover:text-charcoal transition-colors">
            Pricing
          </a>
          <a href="#faq" className="hover:text-charcoal transition-colors">
            FAQ
          </a>
        </nav>

        <Button href="/tests" variant="primary" size="sm">
          Start a Test
        </Button>
      </div>
    </header>
  )
}
