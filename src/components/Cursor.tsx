import { useEffect, useRef } from 'react'
import { gsap, reducedMotion } from '../motion/gsap'

export function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const label = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (reducedMotion() || window.matchMedia('(pointer: coarse)').matches) return
    document.documentElement.classList.add('has-cursor')
    const d = dot.current!
    const r = ring.current!
    const l = label.current!
    const dx = gsap.quickTo(d, 'x', { duration: 0.08, ease: 'power3.out' })
    const dy = gsap.quickTo(d, 'y', { duration: 0.08, ease: 'power3.out' })
    const rx = gsap.quickTo(r, 'x', { duration: 0.35, ease: 'power3.out' })
    const ry = gsap.quickTo(r, 'y', { duration: 0.35, ease: 'power3.out' })

    const move = (e: PointerEvent) => {
      dx(e.clientX)
      dy(e.clientY)
      rx(e.clientX)
      ry(e.clientY)
    }
    const over = (e: Event) => {
      const t = (e.target as HTMLElement).closest<HTMLElement>('[data-cursor]')
      if (t) {
        r.classList.add('is-active')
        l.textContent = t.dataset.cursor!.toUpperCase()
      } else {
        const inter = (e.target as HTMLElement).closest('a,button,[role="button"]')
        r.classList.toggle('is-active', !!inter)
        l.textContent = ''
      }
    }
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerover', over, { passive: true })
    return () => {
      document.documentElement.classList.remove('has-cursor')
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerover', over)
    }
  }, [])

  return (
    <>
      <div ref={ring} className="cursor-ring" aria-hidden>
        <span ref={label} className="cursor-label" />
      </div>
      <div ref={dot} className="cursor-dot" aria-hidden />
    </>
  )
}
