import { Reveal, SplitWords, Parallax } from '../motion/Reveal'
import { PAIN_POINTS } from '../data/faq'

/** Editorial "crafting" section — big heading + supporting copy + floating image composition */
export function Statement() {
  return (
    <section id="sobre" className="relative bg-coal py-28 md:py-40 overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 grid lg:grid-cols-2 gap-16 items-start">
        <div>
          <Reveal>
            <p className="text-xs tracking-[0.35em] uppercase text-gold mb-8">A Nossa Essência</p>
          </Reveal>
          <SplitWords
            as="h2"
            text="Construímos marcas digitais com significado e experiências que se destacam."
            className="font-display font-800 text-4xl md:text-5xl xl:text-6xl leading-[1.02] tracking-tight text-bone"
          />
          <Reveal delay={0.15} className="mt-10 max-w-md">
            <p className="text-mist text-lg leading-relaxed">
              Uma equipa técnica obcecada por rigor, performance e impacto digital em toda Angola e África.
              Cada sistema que entregamos é pensado para converter, escalar e transmitir autoridade imediata.
            </p>
          </Reveal>

          <div className="mt-14 flex flex-col gap-6">
            {PAIN_POINTS.map((p, i) => (
              <Reveal key={i} delay={0.1 * i} className="grid md:grid-cols-2 gap-2 md:gap-6 border-t border-line pt-6">
                <p className="text-dim text-sm line-through decoration-gold/60">{p.pain}</p>
                <p className="text-bone text-sm md:text-base">{p.gain}</p>
              </Reveal>
            ))}
          </div>
        </div>

        {/* floating bento composition */}
        <div className="relative h-[560px] md:h-[680px] hidden md:block">
          <Parallax speed={0.08} className="absolute top-0 right-0 w-[62%]">
            <div className="img-rounded aspect-[4/5]" data-cursor="ver">
              <img
                src="/img/statement-1.jpg"
                alt="Trabalho de estúdio"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </Parallax>
          <Parallax speed={0.16} className="absolute bottom-[18%] left-0 w-[46%]">
            <div className="img-rounded aspect-square">
              <img
                src="/img/statement-2.jpg"
                alt="Detalhe de design"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </Parallax>
          <Parallax speed={0.22} className="absolute bottom-0 right-[8%] w-[34%]">
            <div className="img-rounded aspect-[3/4]">
              <img
                src="/img/statement-3.jpg"
                alt="Interface em desenvolvimento"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </Parallax>
          <Reveal className="absolute top-[8%] left-[6%] w-24 md:w-28">
            <img src="/logo.png" alt="" className="w-full invert opacity-90" />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
