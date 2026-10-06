import { useEffect, useRef } from 'react'
import { gsap, reducedMotion } from '../motion/gsap'
import { Magnetic } from '../motion/Magnetic'
import { CONTACT } from '../data/contact'

const CHIPS = ['Marketing Digital', 'Redes Sociais', 'Branding', 'Websites', 'Software', 'Apps']

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
        .fromTo('.hero-line > span', { yPercent: 110, y: 0 }, { yPercent: 0, y: 0, duration: 1.1, stagger: 0.09 }, '-=0.3')
        .fromTo('.hero-side > *', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.08 }, '-=0.7')
        .fromTo('.hero-img', { clipPath: 'inset(0 0 100% 0)', scale: 1.1 }, { clipPath: 'inset(0 0 0% 0)', scale: 1, duration: 1.3 }, '-=1')
        .fromTo('.hero-chip', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.06 }, '-=0.8')

      gsap.to(bg.current, {
        scale: 1.08,
        yPercent: 8,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true },
      })
      gsap.to('.hero-title', {
        yPercent: -20,
        opacity: 0.4,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true },
      })
    }, el)
    return () => ctx.revert()
  }, [started])

  return (
    <section ref={root} id="top" className="relative min-h-[100svh] overflow-hidden bg-ink">
      {/* CEO portrait — dark studio photo blends into the ink background */}
      <div ref={bg} className="absolute inset-0 will-change-transform">
        <div className="hero-img absolute right-0 bottom-0 h-[62%] w-full md:top-0 md:h-full md:w-[46%]">
          <img
            src="/img/hero.jpg"
            alt="Equipa em reunião de estratégia"
            className="h-full w-full object-cover opacity-70"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-ink md:bg-gradient-to-r md:from-ink md:via-ink/20 md:to-transparent" />
          <div className="absolute inset-0 hidden md:block bg-gradient-to-t from-ink via-transparent to-ink/50" />
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 md:px-10 pt-28 md:pt-40 pb-12 md:pb-16 min-h-[100svh] flex flex-col justify-between">
        <div className="grid lg:grid-cols-[1.5fr_1fr] gap-10 items-start">
          <div>
            <p className="hero-label text-[11px] md:text-sm tracking-[0.3em] uppercase text-gold mb-5 md:mb-6 opacity-0">
              Agência de Marketing &amp; Software · Luanda
            </p>
            <h1 className="hero-title font-display font-900 uppercase leading-[0.9] tracking-tight text-[clamp(2.7rem,11.5vw,9.5rem)] lg:text-[clamp(4rem,7vw,8.5rem)] [&_span]:whitespace-nowrap">
              <span className="hero-line rl"><span>Marketing</span></span>
              <span className="hero-line rl"><span>&amp; Software</span></span>
              <span className="hero-line rl"><span className="text-gold">de Impacto.</span></span>
            </h1>
            <p className="hero-side mt-6 max-w-sm text-mist text-base leading-relaxed lg:hidden">
              <span className="block opacity-0">Estratégia, redes sociais, websites e sistemas para empresas angolanas que querem crescer.</span>
            </p>
          </div>

          <div className="hero-side hidden lg:flex flex-col items-end gap-8 pt-6">
            <p className="text-mist text-lg max-w-[300px] text-right leading-relaxed opacity-0">
              Estratégia e conteúdo para atrair clientes. Websites, sistemas e apps para os servir melhor.
            </p>
            <Magnetic className="opacity-0">
              <a
                href="#contacto"
                className="group inline-flex items-center gap-3 px-7 py-4 rounded-full border border-gold/60 text-gold font-display font-700 text-sm uppercase tracking-wider hover:bg-gold hover:text-ink transition-colors"
              >
                Falar connosco
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
              </a>
            </Magnetic>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="hero-chip opacity-0 self-start md:self-end flex items-center gap-3 rounded-full border border-line-strong bg-ink/50 backdrop-blur-md pl-2 pr-5 py-2">
            <span className="w-2 h-2 rounded-full bg-gold ml-2" />
            <span className="text-xs md:text-sm text-bone font-medium">Agência &amp; Software</span>
            <span className="text-xs text-dim">Luanda, Angola</span>
          </div>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="hidden sm:flex flex-wrap gap-3">
              {CHIPS.map((t) => (
                <span key={t} className="hero-chip opacity-0 px-5 py-2.5 rounded-full border border-line-strong text-sm text-mist backdrop-blur-sm bg-ink/40">
                  {t}
                </span>
              ))}
            </div>
            <div className="flex w-full sm:w-auto gap-3">
              <a
                href={CONTACT.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="hero-chip opacity-0 sm:hidden flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-gold text-ink font-display font-700 text-sm uppercase tracking-wider"
              >
                WhatsApp ↗
              </a>
              <Magnetic className="hero-chip opacity-0 flex-1 sm:flex-none">
                <a
                  href="#servicos"
                  className="group w-full inline-flex items-center justify-center gap-3 px-7 py-4 rounded-full bg-bone text-ink font-display font-700 text-sm uppercase tracking-wider"
                >
                  Serviços
                  <span className="inline-block transition-transform duration-300 group-hover:translate-y-1">↓</span>
                </a>
              </Magnetic>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-8 bg-coal rounded-t-[2.5rem]" />
    </section>
  )
}
