'use client'

import type Lenis from '@studio-freight/lenis'
import { PropsWithChildren, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import {
  createLenisInstance,
  LenisManagerContext,
  type LenisManager
} from '@/lib/lenis'

export function LenisProvider({ children }: PropsWithChildren) {
  const [lenis, setLenis] = useState<Lenis | null>(null)
  const destroyRef = useRef<(() => void) | null>(null)

  const destroy = useCallback(() => {
    destroyRef.current?.()
    destroyRef.current = null
    setLenis(null)
  }, [])

  const recreate = useCallback(() => {
    destroy()

    const instance = createLenisInstance()
    destroyRef.current = instance.destroy
    setLenis(instance.lenis)
  }, [destroy])

  useEffect(() => {
    recreate()
    return destroy
  }, [destroy, recreate])

  const manager: LenisManager = useMemo(() => ({ lenis, destroy, recreate }), [lenis, destroy, recreate])

  return <LenisManagerContext.Provider value={manager}>{children}</LenisManagerContext.Provider>
}
