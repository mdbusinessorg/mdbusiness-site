import { useEffect, useRef } from 'react'
import { gsap, reducedMotion } from '../motion/gsap'
import { PROJECTS } from '../content'
import { Reveal, SplitWords } from '../motion/Reveal'

export function Work() {
  const section = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = section.current
    const tr = track.current
    if (!el || !tr || reducedMotion()) return
    const mm = gsap.matchMedia()
    mm.add('(min-width: 768px)', () => {
      const distance = () => tr.scrollWidth - el.clientWidth
      const tween = gsap.to(tr, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      })
      return () => tween.scrollTrigger?.kill()
    })
    return () => mm.revert()
  }, [])

  return (
    <section ref={section} id="projectos" className="relative bg-coal overflow-hidden">
      <div className="md:h-screen flex flex-col justify-center py-24 md:py-0">
        <div className="mx-auto w-full max-w-[1400px] px-6 md:px-10 mb-10 md:mb-14 flex flex-wrap items-end justify-between gap-6">
          <div>
            <Reveal>
              <p className="text-xs tracking-[0.35em] uppercase text-gold mb-6">Projectos de Referência</p>
            </Reveal>
            <SplitWords
              as="h2"
              text="Resultados reais para marcas que decidiram liderar."
              className="font-display font-800 text-4xl md:text-6xl tracking-tight text-bone max-w-3xl"
            />
          </div>
          <Reveal delay={0.1} className="hidden md:block">
            <p className="text-dim text-sm">Continua a descer — os projectos movem-se contigo.</p>
          </Reveal>
        </div>

        <div
          ref={track}
          className="hscroll-track flex flex-col md:flex-row gap-6 md:gap-10 px-6 md:px-10 md:w-max"
        >
          {PROJECTS.map((p, i) => (
            <article
              key={p.title}
              className="group relative shrink-0 w-full md:w-[62vw] lg:w-[52vw] xl:w-[44vw] img-rounded bg-surface border border-line"
              data-cursor="ver"
            >
              <div className="relative aspect-[16/9] overflow-hidden">
                <img
                  src={p.img}
                  alt={p.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-transparent to-transparent" />
                <span className="absolute top-5 left-5 text-[11px] uppercase tracking-[0.25em] text-bone/80 bg-ink/50 backdrop-blur px-4 py-2 rounded-full border border-line">
                  {p.category}
                </span>
                <span className="absolute top-5 right-5 font-display font-800 text-bone/30 text-5xl">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <div className="p-6 md:p-8 flex flex-wrap items-end justify-between gap-4">
                <div className="max-w-md">
                  <h3 className="font-display font-800 text-2xl md:text-3xl text-bone tracking-tight">{p.title}</h3>
                  <p className="text-mist text-sm md:text-base mt-2">{p.desc}</p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {p.tech.map((t) => (
                      <span key={t} className="text-[11px] uppercase tracking-widest text-dim border border-line-strong rounded-full px-3 py-1">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <span className="text-gold text-3xl transition-transform duration-500 group-hover:translate-x-2 group-hover:-translate-y-2">↗</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
