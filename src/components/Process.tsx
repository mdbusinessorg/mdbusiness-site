import { Reveal } from '../motion/Reveal'

const STEPS = [
  { n: '01', t: 'Pedido & proposta', d: 'Contas-nos o que precisas. Analisamos e enviamos proposta com preço e prazo.' },
  { n: '02', t: 'Pagamento inicial', d: 'Confirmamos o comprovativo e o projecto arranca — acompanhas tudo no portal.' },
  { n: '03', t: 'Materiais', d: 'Pedimos fotos, logotipo e textos na tua área de cliente. Enviar é simples.' },
  { n: '04', t: 'Design & desenvolvimento', d: 'Trabalhamos por etapas visíveis — vês o progresso em tempo real.' },
  { n: '05', t: 'Revisão & entrega', d: 'Revisas, pedes ajustes e recebes o website publicado.' },
]

export function Process() {
  return (
    <section id="processo" className="bg-ink py-24 md:py-36 px-6 md:px-10">
      <div className="mx-auto max-w-[1400px]">
        <Reveal>
          <p className="text-[11px] tracking-[0.3em] uppercase text-dim mb-4">Como trabalhamos</p>
          <h2 className="font-display font-800 uppercase tracking-tight text-4xl md:text-6xl mb-16 max-w-3xl">
            Do pedido à entrega, <span className="text-dim">sem surpresas.</span>
          </h2>
        </Reveal>
        <div className="grid md:grid-cols-5 gap-px bg-line-strong rounded-2xl overflow-hidden">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.08}>
              <div className="bg-ink p-8 h-full flex flex-col gap-4 hover:bg-surface transition-colors">
                <span className="font-display font-800 text-4xl text-dim/60">{s.n}</span>
                <h3 className="font-display font-700 text-lg">{s.t}</h3>
                <p className="text-mist text-sm leading-relaxed">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
