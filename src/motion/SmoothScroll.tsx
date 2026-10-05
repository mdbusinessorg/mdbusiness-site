import { createContext, useContext, useEffect, useRef, type ReactNode } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger, reducedMotion } from './gsap'

const LenisCtx = createContext<Lenis | null>(null)
export const useLenis = () => useContext(LenisCtx)

export function SmoothScroll({ children }: { children: ReactNode }) {
  const ref = useRef<Lenis | null>(null)

  useEffect(() => {
    if (reducedMotion()) return
    const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, smoothWheel: true })
    ref.current = lenis
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
      ref.current = null
    }
  }, [])

  return <LenisCtx.Provider value={ref.current}>{children}</LenisCtx.Provider>
}
