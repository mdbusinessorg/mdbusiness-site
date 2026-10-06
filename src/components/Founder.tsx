import { Reveal, SplitWords, Parallax } from '../motion/Reveal'
import { BUSINESS, FOUNDER } from '../data/business'
import { CONTACT } from '../data/contact'

export function Founder() {
  return (
    <section id="fundador" className="relative bg-ink py-20 md:py-36 overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 grid md:grid-cols-[0.9fr_1.1fr] gap-10 md:gap-20 items-center">
        <Parallax speed={0.06}>
          <div className="relative img-rounded aspect-[4/5] bg-coal">
            <img
              src={FOUNDER.photo}
              alt={`${FOUNDER.name}, ${FOUNDER.role} da ${BUSINESS.name}`}
              className="w-full h-full object-cover object-top"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <p className="font-display font-800 text-2xl md:text-3xl text-bone tracking-tight">{FOUNDER.name}</p>
              <p className="text-gold text-xs tracking-[0.3em] uppercase mt-2">{FOUNDER.role}</p>
            </div>
          </div>
        </Parallax>

        <div>
          <Reveal>
            <p className="text-xs tracking-[0.35em] uppercase text-gold mb-6">Liderança</p>
          </Reveal>
          <SplitWords
            as="h2"
            text="Uma empresa angolana, liderada por quem a fundou."
            className="font-display font-800 text-3xl md:text-5xl xl:text-6xl leading-[1.04] tracking-tight text-bone"
          />
          <Reveal delay={0.1} className="mt-8 max-w-lg">
            <p className="text-mist text-base md:text-lg leading-relaxed">
              A {BUSINESS.name} foi fundada por {FOUNDER.name} em {BUSINESS.location} para juntar, numa só equipa,
              marketing digital e desenvolvimento de software. Cada projecto tem acompanhamento directo e
              comunicação clara do início à entrega.
            </p>
          </Reveal>
          <Reveal delay={0.2} className="mt-10 flex flex-wrap gap-3">
            <a
              href={CONTACT.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-7 py-4 rounded-full bg-gold text-ink font-display font-700 text-sm uppercase tracking-wider hover:bg-gold-soft transition-colors"
            >
              Falar com a equipa <span>↗</span>
            </a>
            <a
              href={`mailto:${CONTACT.email}`}
              className="inline-flex items-center gap-3 px-7 py-4 rounded-full border border-line-strong text-bone font-display font-700 text-sm uppercase tracking-wider hover:border-bone/40 transition-colors"
            >
              Email
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
