import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { submitQuote } from '../lib/api'
import { PageShell } from '../lib/ui'
import { CONTACT } from '../data/contact'

const SERVICES = [
  'Website institucional',
  'Landing page',
  'Loja virtual',
  'Marketing digital',
  'Branding & identidade',
  'Software à medida',
  'Aplicação mobile',
]

const FEATURES = [
  'Catálogo de produtos',
  'Pagamentos online',
  'Blog / notícias',
  'Área de clientes',
  'Integração WhatsApp',
  'Multi-idioma',
  'SEO avançado',
  'Gestão de conteúdo',
]

const BUDGETS = ['Até 50.000 Kz', '50.000 – 150.000 Kz', '150.000 – 500.000 Kz', 'Mais de 500.000 Kz', 'A definir']

export function QuotePage() {
  const { user } = useAuth()
  const [form, setForm] = useState({ name: '', email: user?.email ?? '', phone: '', service: '', description: '', budget: '' })
  const [features, setFeatures] = useState<string[]>([])
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)

  const set = (k: keyof typeof form) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const toggleFeature = (f: string) =>
    setFeatures((xs) => (xs.includes(f) ? xs.filter((x) => x !== f) : [...xs, f]))

  async function submit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setErr(null)
    try {
      const res = await submitQuote({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        service: form.service,
        description: form.description.trim(),
        features,
        budget: form.budget,
      })
      setDone(res.ref_code ?? 'OK')
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : 'Erro ao enviar o pedido.')
    } finally {
      setBusy(false)
    }
  }

  if (done) {
    return (
      <PageShell>
        <div className="card text-center py-14">
          <p className="text-[10px] tracking-[0.3em] uppercase text-dim mb-3">Pedido registado</p>
          <h1 className="font-display font-800 text-3xl mb-4">Recebemos o teu pedido</h1>
          <p className="text-mist max-w-md mx-auto mb-2">
            A referência do teu pedido é <b className="text-bone">{done}</b>. A nossa equipa vai analisar e responde-te com uma proposta.
          </p>
          <p className="text-dim text-sm mb-8">Podes acompanhar tudo na área de cliente.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to={user ? '/portal' : '/entrar'} className="btn btn-primary">Área de cliente</Link>
            <a className="btn btn-ghost" href={CONTACT.whatsapp} target="_blank" rel="noreferrer">WhatsApp</a>
          </div>
        </div>
      </PageShell>
    )
  }

  return (
    <PageShell>
      <Link to="/" className="text-dim text-sm hover:text-bone">← Voltar ao site</Link>
      <div className="mt-6 mb-8">
        <p className="text-[10px] tracking-[0.3em] uppercase text-dim mb-2">Orçamento</p>
        <h1 className="font-display font-800 text-3xl md:text-4xl">Inicia o teu projecto</h1>
        <p className="text-mist mt-2 text-sm">Conta-nos o que precisas. Respondemos com uma proposta e abrimos o teu projecto no portal.</p>
      </div>

      <form onSubmit={submit} className="card flex flex-col gap-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="lbl">Nome *</label>
            <input className="field" required value={form.name} onChange={set('name')} placeholder="O teu nome ou empresa" />
          </div>
          <div>
            <label className="lbl">Telefone / WhatsApp</label>
            <input className="field" value={form.phone} onChange={set('phone')} placeholder="+244 9xx xxx xxx" />
          </div>
        </div>
        <div>
          <label className="lbl">Email *</label>
          <input className="field" type="email" required value={form.email} onChange={set('email')} placeholder="email@exemplo.com" />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="lbl">Serviço *</label>
            <select className="field" required value={form.service} onChange={set('service')}>
              <option value="">Escolher…</option>
              {SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="lbl">Orçamento previsto</label>
            <select className="field" value={form.budget} onChange={set('budget')}>
              <option value="">Escolher…</option>
              {BUDGETS.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="lbl">Funcionalidades pretendidas</label>
          <div className="flex flex-wrap gap-2">
            {FEATURES.map((f) => (
              <button
                type="button"
                key={f}
                onClick={() => toggleFeature(f)}
                className={`badge !py-2 !px-4 cursor-pointer ${features.includes(f) ? '!border-bone text-bone bg-surface' : ''}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="lbl">Sobre o negócio / projecto</label>
          <textarea className="field" rows={4} value={form.description} onChange={set('description')} placeholder="Descreve o teu negócio, o objectivo do projecto e referências (links) se tiveres." />
        </div>

        {err && <p className="text-red-300 text-sm">{err}</p>}

        <button className="btn btn-primary" disabled={busy}>
          {busy ? 'A enviar…' : 'Enviar pedido de orçamento'}
        </button>
        {!user && (
          <p className="text-dim text-xs">Dica: <Link to="/entrar" className="underline">cria conta</Link> para acompanhares o pedido no portal.</p>
        )}
      </form>
    </PageShell>
  )
}
