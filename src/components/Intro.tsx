import { useEffect, useRef, useState } from 'react'
import { gsap, reducedMotion } from '../motion/gsap'

export function Intro({ onDone }: { onDone: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const bar = useRef<HTMLDivElement>(null)
  const logo = useRef<HTMLImageElement>(null)
  const word = useRef<HTMLDivElement>(null)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    if (reducedMotion()) {
      setGone(true)
      onDone()
      return
    }
    const tl = gsap.timeline({
      onComplete: () => {
        setGone(true)
        onDone()
      },
    })
    tl.fromTo(logo.current, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.45, ease: 'power3.out' })
      .fromTo(word.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3 }, '-=0.15')
      .fromTo(bar.current, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'power2.inOut' }, '-=0.1')
      .to(ref.current, { yPercent: -100, duration: 0.7, ease: 'expo.inOut', delay: 0.05 })
  }, [onDone])

  if (gone) return null
  return (
    <div ref={ref} className="fixed inset-0 z-[100] bg-ink flex flex-col items-center justify-center gap-6">
      <img ref={logo} src="/logo.png" alt="MD Business" className="w-20 h-20 md:w-24 md:h-24 object-contain invert" />
      <div ref={word} className="font-display text-xs tracking-[0.4em] uppercase text-mist">
        MD Business
      </div>
      <div className="w-40 h-px bg-line-strong overflow-hidden">
        <div ref={bar} className="h-full w-full bg-gold origin-left scale-x-0" />
      </div>
    </div>
  )
}
