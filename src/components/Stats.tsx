import { STATS } from '../data/stats'
import { Counter, Reveal } from '../motion/Reveal'

export function Stats() {
  if (STATS.length === 0) return null
  return (
    <section className="bg-ink py-20 md:py-28 border-y border-line">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 grid grid-cols-2 lg:grid-cols-4 gap-10">
        {STATS.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08} className="text-center lg:text-left">
            <div className="font-display font-900 text-5xl md:text-7xl text-bone tracking-tight">
              <Counter value={s.value} suffix={s.suffix} />
            </div>
            <p className="text-dim text-xs md:text-sm uppercase tracking-[0.25em] mt-3">{s.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
