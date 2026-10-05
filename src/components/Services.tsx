import { useState } from 'react'
import { SERVICES } from '../content'
import { Reveal, SplitWords } from '../motion/Reveal'

export function Services() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section id="servicos" className="relative bg-ink py-28 md:py-36">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-14">
          <div>
            <Reveal>
              <p className="text-xs tracking-[0.35em] uppercase text-gold mb-6">Nossos Serviços</p>
            </Reveal>
            <SplitWords
              as="h2"
              text="Soluções que elevam a sua marca."
              className="font-display font-800 text-4xl md:text-6xl tracking-tight text-bone"
            />
          </div>
          <Reveal delay={0.1}>
            <p className="text-dim text-sm max-w-xs">
              Desenvolvemos soluções adaptadas às necessidades operacionais e estratégicas de cada cliente.
            </p>
          </Reveal>
        </div>

        <div>
          {SERVICES.map((s, i) => (
            <div
              key={s.num}
              className={`service-row group cursor-pointer ${open === i ? 'open' : ''}`}
              onClick={() => setOpen(open === i ? null : i)}
              data-cursor="abrir"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setOpen(open === i ? null : i)}
            >
              <div className="grid grid-cols-[auto_1fr_auto] md:grid-cols-[90px_1fr_300px_auto] items-center gap-4 md:gap-8 px-2 md:px-6 py-7 md:py-9">
                <span className="font-display text-gold text-sm md:text-base font-700">{s.num}</span>
                <div>
                  <h3 className="font-display font-800 uppercase tracking-tight text-2xl md:text-4xl xl:text-5xl text-bone transition-transform duration-500 group-hover:translate-x-3">
                    {s.title}
                  </h3>
                  <div className="svc-desc">
                    <p className="text-mist text-sm md:text-base max-w-lg pt-4">{s.desc}</p>
                    <div className="flex flex-wrap gap-2 pt-3">
                      {s.tags.map((t) => (
                        <span key={t} className="text-[11px] uppercase tracking-widest text-dim border border-line-strong rounded-full px-3 py-1">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="svc-img img-rounded hidden md:block w-[300px] aspect-[16/10]">
                  <img src={s.img} alt="" className="w-full h-full object-cover" loading="lazy" />
                </div>
                <span className="text-mist text-2xl transition-transform duration-500 group-hover:rotate-45 group-hover:text-gold">↗</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
