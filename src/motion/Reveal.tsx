import { useEffect, useRef, type ReactNode, type CSSProperties } from 'react'
import { gsap, reducedMotion } from './gsap'

/** Clip/mask reveal for blocks & images */
export function Reveal({
  children,
  delay = 0,
  y = 48,
  clip = false,
  className = '',
  style,
}: {
  children: ReactNode
  delay?: number
  y?: number
  clip?: boolean
  className?: string
  style?: CSSProperties
}) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || reducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        clip
          ? { clipPath: 'inset(0 0 100% 0)', y: 0 }
          : { y, opacity: 0 },
        {
          clipPath: 'inset(0 0 0% 0)',
          y: 0,
          opacity: 1,
          duration: 1.1,
          delay,
          ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        },
      )
    }, el)
    return () => ctx.revert()
  }, [delay, y, clip])
  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  )
}

/** Word-staggered heading reveal */
export function SplitWords({
  text,
  className = '',
  as: Tag = 'span',
}: {
  text: string
  className?: string
  as?: 'span' | 'h1' | 'h2' | 'h3' | 'p'
}) {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || reducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll('.w'),
        { yPercent: 110, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.045,
          ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        },
      )
    }, el)
    return () => ctx.revert()
  }, [text])
  const Comp = Tag as any
  return (
    <Comp ref={ref} className={className} aria-label={text}>
      {text.split(' ').map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom" aria-hidden>
          <span className="w inline-block will-change-transform">{w}</span>
          {i < text.split(' ').length - 1 ? <span>&nbsp;</span> : null}
        </span>
      ))}
    </Comp>
  )
}

/** Simple parallax on an inner element based on scroll */
export function Parallax({
  children,
  speed = 0.15,
  className = '',
}: {
  children: ReactNode
  speed?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || reducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { yPercent: -speed * 100 },
        {
          yPercent: speed * 100,
          ease: 'none',
          scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
        },
      )
    }, el)
    return () => ctx.revert()
  }, [speed])
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}

/** Animated counter */
export function Counter({ value, suffix = '', className = '' }: { value: number; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (reducedMotion()) {
      el.textContent = `${value}${suffix}`
      return
    }
    const obj = { n: 0 }
    const ctx = gsap.context(() => {
      gsap.to(obj, {
        n: value,
        duration: 1.4,
        ease: 'power3.out',
        snap: { n: 1 },
        onUpdate: () => {
          el.textContent = `${Math.round(obj.n)}${suffix}`
        },
        scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      })
    }, el)
    return () => ctx.revert()
  }, [value, suffix])
  return (
    <span ref={ref} className={className}>
      0{suffix}
    </span>
  )
}
