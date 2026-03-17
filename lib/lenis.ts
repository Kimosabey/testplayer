'use client'

import Lenis from '@studio-freight/lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { createContext, useContext } from 'react'

export type LenisManager = {
  lenis: Lenis | null
  recreate: () => void
  destroy: () => void
}

export const LenisManagerContext = createContext<LenisManager | null>(null)

export function useLenis() {
  return useContext(LenisManagerContext)?.lenis ?? null
}

export function useLenisManager() {
  return useContext(LenisManagerContext)
}

export function createLenisInstance() {
  gsap.registerPlugin(ScrollTrigger)

  const lenis = new Lenis({
    lerp: 0.08,
    duration: 1.2
  })

  lenis.on('scroll', ScrollTrigger.update)

  const raf = (time: number) => {
    lenis.raf(time * 1000)
  }

  gsap.ticker.add(raf)
  gsap.ticker.lagSmoothing(0)

  return {
    lenis,
    destroy: () => {
      gsap.ticker.remove(raf)
      lenis.destroy()
    }
  }
}
