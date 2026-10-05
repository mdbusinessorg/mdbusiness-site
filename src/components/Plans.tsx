import { useState } from 'react'
import { PLANS, type Plan } from '../content'
import { Reveal, SplitWords } from '../motion/Reveal'
import { fmtKz, useCart } from '../state/cart'
import { Magnetic } from '../motion/Magnetic'

const GROUPS = ['Todos', 'Landing Pages', 'Websites', 'Corporativo'] as const

export function Plans() {
  const [g, setG] = useState<(typeof GROUPS)[number]>('Todos')
  const { add, items } = useCart()
  const inCart = (id: string) => items.some((i) => i.id === id)

  const filter = (p: Plan) =>
    g === 'Todos' ||
    (g === 'Landing Pages' && p.group === 'Landing Page') ||
    (g === 'Websites' && p.group === 'Website') ||
    (g === 'Corporativo' && p.group === 'Corporativo')

  return (
    <section id="planos" className="bg-coal py-28 md:py-36">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-8 mb-14">
          <div>
            <Reveal>
              <p className="text-xs tracking-[0.35em] uppercase text-gold mb-6">Preços</p>
            </Reveal>
            <SplitWords
              as="h2"
              text="Escolhe o teu nível de impacto."
              className="font-display font-800 text-4xl md:text-6xl tracking-tight text-bone"
            />
            <Reveal delay={0.1}>
              <p className="text-mist mt-5 max-w-lg">
                Da landing page essencial ao sistema corporativo sob medida — escolha o nível de impacto digital que o seu negócio precisa.
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.15} className="flex flex-wrap gap-2">
            {GROUPS.map((x) => (
              <button
                key={x}
                onClick={() => setG(x)}
                className={`px-5 py-2.5 rounded-full text-sm border transition-colors ${
                  g === x ? 'bg-bone text-ink border-bone' : 'border-line-strong text-mist hover:text-bone'
                }`}
              >
                {x}
              </button>
            ))}
          </Reveal>
        </div>

        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {PLANS.filter(filter).map((p, i) => {
            const featured = p.id === 'lp-cine' || p.id === 'web-pro'
            return (
              <Reveal key={p.id} delay={(i % 3) * 0.08}>
                <article
                  className={`group relative img-rounded p-8 flex flex-col h-full border transition-colors duration-500 ${
                    featured
                      ? 'bg-gold text-ink border-gold'
                      : 'bg-surface border-line hover:border-line-strong'
                  }`}
                >
                  <p className={`text-[11px] uppercase tracking-[0.3em] ${featured ? 'text-ink/70' : 'text-gold'}`}>
                    {p.group}
                  </p>
                  <h3 className={`font-display font-800 text-2xl mt-3 tracking-tight ${featured ? 'text-ink' : 'text-bone'}`}>
                    {p.name}
                  </h3>
                  <p className={`text-sm mt-3 leading-relaxed ${featured ? 'text-ink/80' : 'text-mist'}`}>{p.desc}</p>
                  <ul className="mt-6 flex flex-col gap-2.5">
                    {p.features.map((f) => (
                      <li key={f} className={`flex items-center gap-3 text-sm ${featured ? 'text-ink/85' : 'text-mist'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${featured ? 'bg-ink' : 'bg-gold'}`} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-8 flex items-end justify-between gap-4">
                    <div>
                      <p className={`font-display font-900 text-4xl tracking-tight ${featured ? 'text-ink' : 'text-bone'}`}>
                        {fmtKz(p.price)}
                      </p>
                    </div>
                  </div>
                  <Magnetic className="mt-6">
                    <button
                      onClick={() => add(p)}
                      disabled={inCart(p.id)}
                      className={`w-full py-4 rounded-full font-display font-700 text-sm uppercase tracking-wider transition-colors ${
                        featured
                          ? 'bg-ink text-bone hover:bg-coal'
                          : inCart(p.id)
                            ? 'bg-line text-dim cursor-default'
                            : 'bg-bone text-ink hover:bg-gold'
                      }`}
                    >
                      {inCart(p.id) ? 'No carrinho ✓' : 'Adicionar ao pedido'}
                    </button>
                  </Magnetic>
                </article>
              </Reveal>
            )
          })}
        </div>

        <Reveal delay={0.1} className="mt-10 text-center text-dim text-sm">
          Pagamento em duas fases: 50% no início, 50% na entrega. Transferência, Multicaixa Express e pagamentos internacionais.
        </Reveal>
      </div>
    </section>
  )
}
