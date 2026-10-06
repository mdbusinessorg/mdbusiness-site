import { useState } from 'react'
import { FAQS } from '../data/faq'
import { Reveal, SplitWords } from '../motion/Reveal'

export function Faq() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <section className="bg-ink py-28 md:py-36">
      <div className="mx-auto max-w-[900px] px-6 md:px-10">
        <Reveal>
          <p className="text-xs tracking-[0.35em] uppercase text-gold mb-6">Questões Frequentes</p>
        </Reveal>
        <SplitWords
          as="h2"
          text="Tudo o que precisas de saber."
          className="font-display font-800 text-4xl md:text-5xl tracking-tight text-bone mb-12"
        />
        <div className="flex flex-col">
          {FAQS.map((f, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full text-left border-t border-line py-6 flex items-start justify-between gap-6 group"
                aria-expanded={open === i}
              >
                <div>
                  <h3 className="font-display font-700 text-lg md:text-xl text-bone group-hover:text-gold transition-colors">
                    {f.q}
                  </h3>
                  <div
                    className="overflow-hidden transition-all duration-500"
                    style={{ maxHeight: open === i ? 200 : 0, opacity: open === i ? 1 : 0 }}
                  >
                    <p className="text-mist text-sm md:text-base leading-relaxed pt-4 max-w-2xl">{f.a}</p>
                  </div>
                </div>
                <span
                  className={`text-2xl text-dim transition-transform duration-300 shrink-0 ${open === i ? 'rotate-45 text-gold' : ''}`}
                >
                  +
                </span>
              </button>
            </Reveal>
          ))}
          <div className="border-t border-line" />
        </div>
      </div>
    </section>
  )
}
