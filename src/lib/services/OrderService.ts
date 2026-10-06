import { CONTACT } from '../../data/contact'
import type { Plan } from '../../data/products'
import type { ServiceResult } from './types'

const fmtKz = (v: number | null) => (v == null ? 'Sob consulta' : `${v.toLocaleString('pt-PT')} Kz`)

/**
 * Order checkout. There is no payment backend yet — orders are
 * handed off to WhatsApp, which IS the real current channel.
 */
export const OrderService = {
  buildOrderUrl(items: Plan[]): ServiceResult<string> {
    const total = items.reduce((s, i) => s + (i.price ?? 0), 0)
    const text = encodeURIComponent(
      `Olá MD Business! Quero confirmar o meu pedido:\n\n${items
        .map((i) => `• ${i.name} — ${fmtKz(i.price)}`)
        .join('\n')}\n\nTotal estimado: ${fmtKz(total)}`,
    )
    return { status: 'real', data: `${CONTACT.whatsapp}?text=${text}` }
  },
}
