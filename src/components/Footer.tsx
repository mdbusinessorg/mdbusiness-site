import { Reveal, Parallax } from '../motion/Reveal'
import { EMAIL, WHATSAPP } from '../content'

const COLS = [
  {
    t: 'Navegação',
    links: [
      ['Início', '#top'],
      ['Serviços', '#servicos'],
      ['Projectos', '#projectos'],
      ['Planos', '#planos'],
    ],
  },
  {
    t: 'Serviços',
    links: [
      ['Landing Pages', '#servicos'],
      ['Websites', '#servicos'],
      ['Sistemas & SaaS', '#servicos'],
      ['Automação & IA', '#servicos'],
    ],
  },
  {
    t: 'Social',
    links: [
      ['Instagram', 'https://instagram.com/md_business.ao'],
      ['Facebook', 'https://facebook.com/mdbusinessao'],
      ['LinkedIn', 'https://linkedin.com/company/md-business-ao'],
      ['WhatsApp', WHATSAPP],
    ],
  },
]

export function Footer() {
  return (
    <footer className="relative bg-coal border-t border-line overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 pt-20 pb-10">
        <div className="grid md:grid-cols-[1.4fr_1fr_1fr_1fr] gap-10 pb-16">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <img src="/logo.png" alt="MD Business" className="w-11 h-11 object-contain invert" />
              <span className="font-display font-800 tracking-tight">MD BUSINESS</span>
            </div>
            <p className="text-dim text-sm max-w-xs leading-relaxed">
              Sistemas de alto desempenho para organizações que definem o futuro. O seu parceiro estratégico em toda Angola.
            </p>
            <a href={`mailto:${EMAIL}`} className="block text-mist text-sm mt-4 hover:text-gold transition-colors">
              {EMAIL}
            </a>
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="block text-mist text-sm mt-1 hover:text-gold transition-colors">
              +244 934 859 240
            </a>
          </div>
          {COLS.map((c) => (
            <div key={c.t}>
              <p className="text-xs uppercase tracking-[0.3em] text-dim mb-5">{c.t}</p>
              <ul className="flex flex-col gap-3">
                {c.links.map(([l, h]) => (
                  <li key={l}>
                    <a
                      href={h}
                      target={h.startsWith('http') ? '_blank' : undefined}
                      rel={h.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="text-mist text-sm hover:text-bone transition-colors"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* giant wordmark finale */}
        <Parallax speed={0.06}>
          <Reveal clip className="select-none" >
            <div className="font-display font-900 uppercase text-center leading-none tracking-tighter text-[clamp(3.5rem,13vw,13rem)] text-bone/95">
              MD<span className="text-gold">·</span>BUSINESS
            </div>
          </Reveal>
        </Parallax>

        <div className="mt-12 pt-8 border-t border-line flex flex-wrap items-center justify-between gap-4 text-xs text-dim">
          <span>© 2026 MD Business. Angola, África. Designed for the 1%.</span>
          <span>Excelência Técnica · Estratégia & Resultados</span>
        </div>
      </div>
    </footer>
  )
}
