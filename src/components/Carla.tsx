import { useEffect, useRef, useState } from 'react'
import { PLANS } from '../data/products'
import { CONTACT } from '../data/contact'
import { fmtKz as fmt } from '../state/cart'

interface Msg {
  from: 'carla' | 'user'
  text: string
}

const QUICK = ['Serviços', 'Preços', 'Como confirmar um plano', 'Contactos']

function answer(input: string): string {
  const t = input.toLowerCase()
  if (/ol[áa]|bom dia|boa tarde|boa noite|hello|hi/.test(t))
    return 'Olá! Sou a Carla, assistente da MD Business. Posso ajudar com os nossos serviços, preços, como confirmar um plano, pagamento e contactos. O que procura?'
  if (/pre[çc]|custo|quanto|kz|valor/.test(t)) {
    const lp = PLANS.filter((p) => p.group === 'Landing Page').map((p) => `• ${p.name}: ${fmt(p.price)}`).join('\n')
    const wb = PLANS.filter((p) => p.group === 'Website').map((p) => `• ${p.name}: ${fmt(p.price)}`).join('\n')
    return `Os nossos preços (Kz):\n\nLanding Pages:\n${lp}\n\nWebsites:\n${wb}\n\nO plano Corporativo é personalizado conforme o projecto.`
  }
  if (/servi|o que faz|ofere/.test(t))
    return 'Os nossos serviços:\n• Landing Pages (Comercial, Especializada, Cinematográfica)\n• Websites & Plataformas\n• Sistemas & SaaS\n• E-Commerce\n• Branding Digital\n• Automação & IA\n\nPosso explicar o que cada um inclui ou como avançar.'
  if (/plano|confirmar|comprar|pedido|contrat/.test(t))
    return 'É simples:\n1) Adicione o plano ao pedido na secção Planos;\n2) Confirme via WhatsApp;\n3) Após confirmarmos o pagamento, o projecto começa;\n4) Acompanha o progresso com a nossa equipa.'
  if (/pagar|pagamento|multicaixa|transfer/.test(t))
    return 'Aceitamos transferência bancária (Angola), Multicaixa Express e pagamentos internacionais. O pagamento é dividido em duas fases: 50% no início e 50% na entrega. Quer falar connosco no WhatsApp?'
  if (/prazo|tempo|demora|quando/.test(t))
    return 'O prazo depende do plano e do âmbito do projecto. Após confirmar o plano, definimos consigo um prazo concreto. Quer combinar pelo WhatsApp?'
  if (/seo|google/.test(t))
    return 'Sim! Os nossos planos incluem SEO (básico nas Landing Pages e avançado nos Websites superiores) para melhorar a sua visibilidade no Google.'
  if (/contact|whatsapp|email|telefone|localiza/.test(t))
    return 'Pode falar connosco:\n• WhatsApp: +244 934 859 240\n• Email: mdbusinessorg@gmail.com\n• Localização: Angola, África\n\nResposta média em até 24 horas.'
  if (/obrigad|thanks|valeu/.test(t))
    return 'De nada! Estou aqui sempre que precisar. Deseja mais alguma informação?'
  return 'Posso ajudar com: serviços, preços, como confirmar um plano, pagamento e contactos. Experimente uma das opções abaixo ou fale connosco no WhatsApp.'
}

export function Carla() {
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState<Msg[]>([
    { from: 'carla', text: 'Olá! Sou a Carla, a assistente virtual da MD Business. Como posso ajudar hoje?' },
  ])
  const [input, setInput] = useState('')
  const list = useRef<HTMLDivElement>(null)

  useEffect(() => {
    list.current?.scrollTo({ top: list.current.scrollHeight, behavior: 'smooth' })
  }, [msgs, open])

  const send = (text: string) => {
    const v = text.trim()
    if (!v) return
    setMsgs((m) => [...m, { from: 'user', text: v }])
    setInput('')
    setTimeout(() => setMsgs((m) => [...m, { from: 'carla', text: answer(v) }]), 450)
  }

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Falar com a Carla"
        className="fixed bottom-6 right-6 z-[94] w-14 h-14 rounded-full bg-gold text-ink font-display font-800 text-lg shadow-[0_8px_30px_rgba(232,98,44,0.4)] hover:bg-gold-soft transition-colors"
      >
        {open ? '×' : 'C'}
      </button>

      {open && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-[94] w-[calc(100vw-2rem)] sm:w-[380px] max-h-[70vh] bg-coal border border-line rounded-3xl overflow-hidden flex flex-col shadow-2xl">
          <div className="flex items-center gap-3 p-4 border-b border-line bg-surface">
            <div className="w-10 h-10 rounded-full bg-gold flex items-center justify-center font-display font-800 text-ink">C</div>
            <div>
              <p className="font-display font-700 text-bone text-sm">Carla</p>
              <p className="text-xs text-dim flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" /> Assistente MD Business
              </p>
            </div>
            <a
              href={CONTACT.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto text-xs text-gold border border-gold/40 rounded-full px-3 py-1.5 hover:bg-gold hover:text-ink transition-colors"
            >
              WhatsApp
            </a>
          </div>

          <div ref={list} className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 min-h-[240px]">
            {msgs.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] px-4 py-3 text-sm leading-relaxed whitespace-pre-line rounded-2xl ${
                  m.from === 'carla'
                    ? 'bg-surface text-bone self-start rounded-bl-sm border border-line'
                    : 'bg-gold text-ink self-end rounded-br-sm'
                }`}
              >
                {m.text}
              </div>
            ))}
            <div className="flex flex-wrap gap-2 pt-1">
              {QUICK.map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="text-xs border border-line-strong text-mist rounded-full px-3 py-1.5 hover:text-bone hover:border-bone/40 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              send(input)
            }}
            className="flex items-center gap-2 p-3 border-t border-line"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escreve a tua mensagem…"
              className="flex-1 bg-surface border border-line rounded-full px-4 py-2.5 text-sm text-bone placeholder:text-dim outline-none focus:border-gold/60"
            />
            <button type="submit" aria-label="Enviar" className="w-10 h-10 rounded-full bg-gold text-ink font-bold hover:bg-gold-soft transition-colors">
              ↑
            </button>
          </form>
        </div>
      )}
    </>
  )
}
