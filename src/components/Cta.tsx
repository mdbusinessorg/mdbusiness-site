import { useEffect, useRef } from 'react'
import { gsap, reducedMotion } from '../motion/gsap'
import { CONTACT } from '../data/contact'
import { Magnetic } from '../motion/Magnetic'
import { Reveal } from '../motion/Reveal'

export function Cta() {
  const bg = useRef<HTMLDivElement>(null)
  const sec = useRef<HTMLElement>(null)

  useEffect(() => {
    if (reducedMotion() || !sec.current || !bg.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        bg.current,
        { yPercent: -15, scale: 1.1 },
        {
          yPercent: 15,
          scale: 1,
          ease: 'none',
          scrollTrigger: { trigger: sec.current, start: 'top bottom', end: 'bottom top', scrub: true },
        },
      )
    }, sec.current)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sec} id="contacto" className="relative overflow-hidden bg-ink">
      <div ref={bg} className="absolute inset-0 will-change-transform">
        <img
          src="/img/cta.jpg"
          alt=""
          className="w-full h-[130%] object-cover opacity-35"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/70 to-ink" />
      </div>
      <div className="relative z-10 mx-auto max-w-[1400px] px-6 md:px-10 py-24 md:py-52 text-center">
        <Reveal>
          <p className="text-xs tracking-[0.35em] uppercase text-gold mb-8">Vamos Conversar</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="font-display font-900 uppercase tracking-tight leading-[0.9] text-[clamp(3rem,9vw,8rem)] text-bone">
            Vamos dar vida<br />
            <span className="text-gold">à tua visão.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="text-mist text-lg max-w-xl mx-auto mt-8">
            Conte-nos o seu objectivo — mais clientes, uma marca mais forte ou um sistema para organizar a empresa. Respondemos no WhatsApp.
          </p>
        </Reveal>
        <Reveal delay={0.3} className="mt-12">
          <Magnetic>
            <a
              href={CONTACT.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-10 py-5 rounded-full bg-gold text-ink font-display font-800 text-base uppercase tracking-wider hover:bg-gold-soft transition-colors"
              data-cursor="abrir"
            >
              Iniciar Projecto
              <span>↗</span>
            </a>
          </Magnetic>
        </Reveal>
        <Reveal delay={0.4} className="mt-10 text-dim text-sm">
          mdbusinessorg@gmail.com · +244 934 859 240 · Resposta média até 24h
        </Reveal>
      </div>
    </section>
  )
}
