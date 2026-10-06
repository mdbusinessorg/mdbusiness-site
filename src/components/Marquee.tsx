export function Marquee() {
  const items = ['Marketing Digital', 'Redes Sociais', 'Tráfego Pago', 'Branding', 'Websites', 'Software à Medida', 'Apps Mobile', 'E-commerce', 'Automação']
  const row = [...items, ...items]
  return (
    <div className="bg-gold text-ink py-4 overflow-hidden border-y border-ink/20" aria-hidden>
      <div className="marquee-track flex w-max items-center gap-8 pr-8">
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-8 font-display font-800 uppercase tracking-widest text-sm whitespace-nowrap">
            {t}
            <span className="text-ink/50">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}
