import { useEffect, useRef } from 'react'
import { gsap, reducedMotion } from '../motion/gsap'
import { useCart, fmtKz } from '../state/cart'
import { OrderService } from '../lib/services'

export function CartDrawer() {
  const { items, open, setOpen, remove, clear } = useCart()
  const panel = useRef<HTMLDivElement>(null)
  const overlay = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!panel.current || !overlay.current) return
    if (reducedMotion()) {
      panel.current.style.transform = open ? 'none' : 'translateX(100%)'
      overlay.current.style.opacity = open ? '1' : '0'
      return
    }
    gsap.to(panel.current, { x: open ? 0 : '100%', duration: 0.55, ease: 'expo.out' })
    gsap.to(overlay.current, { opacity: open ? 1 : 0, duration: 0.4 })
  }, [open])

  const total = items.reduce((s, i) => s + (i.price ?? 0), 0)
  const orderUrl = OrderService.buildOrderUrl(items).data

  return (
    <div className={`fixed inset-0 z-[96] ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open}>
      <div
        ref={overlay}
        className="absolute inset-0 bg-ink/70 backdrop-blur-sm opacity-0"
        onClick={() => setOpen(false)}
      />
      <aside
        ref={panel}
        className="absolute right-0 top-0 h-full w-full sm:w-[440px] bg-coal border-l border-line flex flex-col translate-x-full"
        role="dialog"
        aria-label="Carrinho de pedidos"
      >
        <div className="flex items-center justify-between p-6 border-b border-line">
          <h2 className="font-display font-800 text-xl tracking-tight">O Teu Pedido</h2>
          <button
            onClick={() => setOpen(false)}
            aria-label="Fechar carrinho"
            className="w-10 h-10 rounded-full border border-line-strong flex items-center justify-center text-xl"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 text-dim">
              <p>O teu pedido está vazio.</p>
              <button
                onClick={() => {
                  setOpen(false)
                  document.querySelector('#planos')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="px-6 py-3 rounded-full border border-line-strong text-mist text-sm hover:text-bone"
              >
                Explorar Planos
              </button>
            </div>
          ) : (
            items.map((i) => (
              <div key={i.id} className="flex items-start justify-between gap-4 border border-line rounded-2xl p-5 bg-surface">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-gold">{i.group}</p>
                  <p className="font-display font-700 text-bone mt-1">{i.name}</p>
                  <p className="text-gold font-display font-700 mt-1">{fmtKz(i.price)}</p>
                </div>
                <button onClick={() => remove(i.id)} aria-label={`Remover ${i.name}`} className="text-dim hover:text-bone text-lg">
                  ×
                </button>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t border-line">
            <div className="flex justify-between items-baseline mb-5">
              <span className="text-dim text-sm uppercase tracking-widest">Total estimado</span>
              <span className="font-display font-900 text-3xl text-bone">{fmtKz(total)}</span>
            </div>
            <a
              href={orderUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={clear}
              className="block w-full py-4 rounded-full bg-gold text-ink font-display font-800 text-sm uppercase tracking-widest text-center hover:bg-gold-soft transition-colors"
            >
              Confirmar via WhatsApp
            </a>
            <p className="text-dim text-xs text-center mt-4">
              Um especialista MD Business entrará em contacto para confirmar detalhes técnicos e prazos.
            </p>
          </div>
        )}
      </aside>
    </div>
  )
}
