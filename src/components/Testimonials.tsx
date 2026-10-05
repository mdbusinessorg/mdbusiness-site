import { TESTIMONIALS } from '../content'
import { Reveal, SplitWords } from '../motion/Reveal'

export function Testimonials() {
  const [main, ...rest] = TESTIMONIALS
  return (
    <section className="bg-ink py-28 md:py-36">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <Reveal>
          <p className="text-xs tracking-[0.35em] uppercase text-gold mb-6">Confiança de Clientes</p>
        </Reveal>
        <SplitWords
          as="h2"
          text="Trusted by brands, loved by clients."
          className="font-display font-800 text-4xl md:text-6xl tracking-tight text-bone mb-16"
        />

        <div className="grid lg:grid-cols-[1.3fr_1fr] gap-8">
          <Reveal className="relative img-rounded bg-surface border border-line p-8 md:p-12 flex flex-col justify-between min-h-[320px]">
            <span className="font-display text-gold text-7xl leading-none">“</span>
            <p className="text-bone text-xl md:text-2xl leading-relaxed font-500">{main.quote}</p>
            <div className="flex items-center gap-4 mt-8">
              <div className="w-11 h-11 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center font-display font-700 text-gold">
                {main.name[0]}
              </div>
              <div>
                <p className="text-bone text-sm font-semibold">{main.name}</p>
                <p className="text-dim text-xs">{main.role}</p>
              </div>
              <div className="ml-auto text-gold text-sm tracking-widest">★★★★★</div>
            </div>
          </Reveal>

          <div className="flex flex-col gap-6">
            {rest.map((t, i) => (
              <Reveal key={i} delay={0.1 * (i + 1)} className="img-rounded bg-card border border-line p-6 md:p-7">
                <div className="text-gold text-xs tracking-widest mb-3">★★★★★</div>
                <p className="text-mist text-sm leading-relaxed">{t.quote}</p>
                <p className="text-dim text-xs mt-4">
                  <span className="text-bone">{t.name}</span> — {t.role}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
