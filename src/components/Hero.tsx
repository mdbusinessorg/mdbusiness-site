import { useEffect, useRef } from 'react'
import { gsap, reducedMotion } from '../motion/gsap'
import { Magnetic } from '../motion/Magnetic'

const STATS = [
  { n: '30+', l: 'Projectos entregues' },
  { n: '300%', l: 'Conversão média' },
  { n: '24h', l: 'Resposta média' },
]

export function Hero({ started }: { started: boolean }) {
  const root = useRef<HTMLElement>(null)
  const bg = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!started || reducedMotion()) return
    const el = root.current
    if (!el) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
      tl.fromTo('.hero-label', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 })
        .fromTo(
          '.hero-line > span',
          { yPercent: 110 },
          { yPercent: 0, duration: 1.1, stagger: 0.09 },
          '-=0.3',
        )
        .fromTo('.hero-side > *', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.08 }, '-=0.7')
        .fromTo('.hero-img', { clipPath: 'inset(0 0 100% 0)', scale: 1.15 }, { clipPath: 'inset(0 0 0% 0)', scale: 1, duration: 1.3 }, '-=1')
        .fromTo('.hero-chip', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.1 }, '-=0.8')

      // scroll-out transform: hero transforms into next section
      gsap.to(bg.current, {
        scale: 1.12,
        yPercent: 12,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true },
      })
      gsap.to('.hero-title', {
        yPercent: -30,
        opacity: 0.35,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true },
      })
      gsap.to('.hero-float', {
        yPercent: -18,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true },
      })
    }, el)
    return () => ctx.revert()
  }, [started])

  return (
    <section ref={root} id="top" className="relative min-h-screen overflow-hidden bg-ink">
      {/* portrait / backdrop */}
      <div ref={bg} className="absolute inset-0 will-change-transform">
        <div className="hero-img absolute right-0 top-0 h-full w-full md:w-[58%]">
          <img
            src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=1400&q=75&auto=format&fit=crop"
            alt=""
            className="h-full w-full object-cover opacity-60 md:opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/40" />
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 md:px-10 pt-32 md:pt-40 pb-16 min-h-screen flex flex-col justify-between">
        <div className="grid lg:grid-cols-[1.5fr_1fr] gap-10 items-start">
          <div>
            <p className="hero-label text-xs md:text-sm tracking-[0.35em] uppercase text-gold mb-6 opacity-0">
              Estúdio Digital · Luanda, Angola
            </p>
            <h1 className="hero-title font-display font-900 uppercase leading-[0.88] tracking-tight text-[clamp(3.4rem,11vw,10.5rem)]">
              <span className="hero-line rl"><span>Sistemas</span></span>
              <span className="hero-line rl"><span>Digitais de</span></span>
              <span className="hero-line rl"><span className="text-gold">Impacto.</span></span>
            </h1>
          </div>

          <div className="hero-side hidden lg:flex flex-col items-end gap-8 pt-6">
            <p className="text-mist text-lg max-w-[280px] text-right leading-relaxed opacity-0">
              Design que entrega resultados reais — interfaces cinematográficas para marcas que decidiram liderar.
            </p>
            <div className="flex flex-col gap-5">
              {STATS.map((s) => (
                <div key={s.l} className="text-right opacity-0">
                  <div className="font-display font-800 text-4xl xl:text-5xl text-gold">{s.n}</div>
                  <div className="text-xs uppercase tracking-widest text-dim mt-1">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="hero-float flex flex-wrap items-end justify-between gap-8">
          <div className="flex flex-wrap gap-3">
            {['Landing Pages', 'Websites', 'Sistemas', 'E-Commerce', 'Automação'].map((t) => (
              <span key={t} className="hero-chip opacity-0 px-5 py-2.5 rounded-full border border-line-strong text-sm text-mist backdrop-blur-sm bg-ink/40">
                {t}
              </span>
            ))}
          </div>
          <Magnetic className="hero-chip opacity-0">
            <a
              href="#servicos"
              className="group inline-flex items-center gap-3 px-7 py-4 rounded-full bg-bone text-ink font-display font-700 text-sm uppercase tracking-wider"
            >
              Explorar
              <span className="inline-block transition-transform duration-300 group-hover:translate-y-1">↓</span>
            </a>
          </Magnetic>
        </div>
      </div>

      {/* curved seam into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-coal rounded-t-[2.5rem]" />
    </section>
  )
}
