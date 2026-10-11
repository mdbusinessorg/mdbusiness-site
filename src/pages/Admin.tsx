import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import {
  KZ, fmtDate, PAYMENT_STATUS, QUOTE_STATUS, MREQ_STATUS, STAGE_STATUS, TEMPLATE_VARS,
  adminQuotes, updateQuoteStatus, adminClients, adminProjects, createProject, updateProject,
  upsertStage, deleteStage, postProjectUpdate, createPayment, reviewPayment,
  createMaterialRequest, updateMaterialRequest, listTemplates, saveTemplate, deleteTemplate,
  sendMessage, projectBundle, renderTemplate, proofUrl, materialUrl,
  type QuoteRequest, type ClientProfile, type Project, type MessageTemplate, type Stage, type Payment, type MaterialRequest, type Message,
} from '../lib/api'
import { Empty, Modal, PageShell, SectionTitle, Spinner, useToast } from '../lib/ui'

const DEFAULT_STAGES = [
  'Pedido recebido', 'Proposta e requisitos definidos', 'Pagamento inicial confirmado',
  'Recolha de conteúdos e materiais', 'Estrutura e design em preparação', 'Desenvolvimento',
  'Revisão interna', 'Revisão pelo cliente', 'Ajustes solicitados', 'Testes e validação',
  'Preparação para publicação', 'Website publicado e projecto entregue',
]

type AdminTab = 'pedidos' | 'clientes' | 'projectos' | 'templates'

/* ================= shell ================= */

export function AdminHome() {
  const { user, isStaff, loading, signOut } = useAuth()
  const nav = useNavigate()
  const [tab, setTab] = useState<AdminTab>('pedidos')
  const [quotes, setQuotes] = useState<QuoteRequest[] | null>(null)
  const [clients, setClients] = useState<ClientProfile[] | null>(null)
  const [projects, setProjects] = useState<Project[] | null>(null)
  const [templates, setTemplates] = useState<MessageTemplate[] | null>(null)
  const toast = useToast()

  const reload = useCallback(() => {
    adminQuotes().then(setQuotes).catch(() => setQuotes([]))
    adminClients().then(setClients).catch(() => setClients([]))
    adminProjects().then(setProjects).catch(() => setProjects([]))
    listTemplates().then(setTemplates).catch(() => setTemplates([]))
  }, [])

  useEffect(() => { if (!loading && (!user || !isStaff)) nav('/portal') }, [loading, user, isStaff, nav])
  useEffect(() => { if (isStaff) reload() }, [isStaff, reload])

  if (loading || !user || !isStaff) return <PageShell><Spinner /></PageShell>

  const pendingQuotes = quotes?.filter((q) => q.status === 'pending_review' || q.status === 'in_analysis').length ?? 0

  return (
    <PageShell wide>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-dim mb-2">Painel interno</p>
          <h1 className="font-display font-800 text-3xl md:text-4xl">MD Business — Admin</h1>
        </div>
        <div className="flex gap-2">
          <Link to="/portal" className="btn btn-ghost btn-sm">Área de cliente</Link>
          <button onClick={() => { signOut(); nav('/') }} className="btn btn-ghost btn-sm">Sair</button>
        </div>
      </div>

      <div className="flex gap-2 mb-8 overflow-x-auto no-scrollbar">
        {([['pedidos', `Pedidos (${pendingQuotes})`], ['projectos', `Projectos (${projects?.length ?? 0})`], ['clientes', `Clientes (${clients?.length ?? 0})`], ['templates', 'Mensagens']] as [AdminTab, string][]).map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)} className={`btn btn-sm whitespace-nowrap ${tab === t ? 'btn-primary' : 'btn-ghost'}`}>{l}</button>
        ))}
      </div>

      {tab === 'pedidos' && <QuotesTab quotes={quotes} reload={reload} toast={toast} />}
      {tab === 'projectos' && <ProjectsTab projects={projects} clients={clients ?? []} reload={reload} toast={toast} />}
      {tab === 'clientes' && <ClientsTab clients={clients} toast={toast} reload={reload} />}
      {tab === 'templates' && <TemplatesTab templates={templates} reload={reload} toast={toast} />}
    </PageShell>
  )
}

/* ================= quotes ================= */

function QuotesTab({ quotes, reload, toast }: { quotes: QuoteRequest[] | null; reload: () => void; toast: (t: string, e?: boolean) => void }) {
  const [open, setOpen] = useState<QuoteRequest | null>(null)
  const [note, setNote] = useState('')

  async function setStatus(q: QuoteRequest, status: string) {
    try {
      await updateQuoteStatus(q.id, status, note || undefined)
      toast('Pedido actualizado.')
      setOpen(null)
      setNote('')
      reload()
    } catch (e) { toast(e instanceof Error ? e.message : 'Erro', true) }
  }

  if (quotes === null) return <Spinner />
  if (quotes.length === 0) return <Empty title="Sem pedidos de orçamento" hint="Os pedidos enviados no site aparecem aqui." />

  return (
    <>
      <div className="card !p-0 overflow-x-auto">
        <table className="tbl">
          <thead><tr><th>Ref</th><th>Nome</th><th>Serviço</th><th>Orçamento</th><th>Estado</th><th>Data</th><th /></tr></thead>
          <tbody>
            {quotes.map((q) => (
              <tr key={q.id}>
                <td className="font-mono text-xs">{q.ref_code}</td>
                <td>{q.name}<br /><span className="text-dim text-xs">{q.email}</span></td>
                <td>{q.service}</td>
                <td className="text-dim">{q.budget ?? '—'}</td>
                <td><span className={`badge ${QUOTE_STATUS[q.status]?.cls}`}>{QUOTE_STATUS[q.status]?.label ?? q.status}</span></td>
                <td className="text-dim whitespace-nowrap">{fmtDate(q.created_at)}</td>
                <td><button className="btn btn-ghost btn-sm" onClick={() => { setOpen(q); setNote(q.staff_notes ?? '') }}>Abrir</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && (
        <Modal title={`Pedido ${open.ref_code}`} onClose={() => setOpen(null)} wide>
          <div className="grid sm:grid-cols-2 gap-4 text-sm mb-6">
            <p><span className="text-dim">Nome:</span> {open.name}</p>
            <p><span className="text-dim">Email:</span> {open.email}</p>
            <p><span className="text-dim">Telefone:</span> {open.phone ?? '—'}</p>
            <p><span className="text-dim">Serviço:</span> {open.service}</p>
            <p><span className="text-dim">Orçamento:</span> {open.budget ?? '—'}</p>
            <p><span className="text-dim">Data:</span> {fmtDate(open.created_at)}</p>
          </div>
          {open.features && open.features.length > 0 && (
            <div className="mb-4"><label className="lbl">Funcionalidades</label>
              <div className="flex flex-wrap gap-2">{open.features.map((f) => <span key={f} className="badge">{f}</span>)}</div>
            </div>
          )}
          {open.business_description && (
            <div className="mb-5"><label className="lbl">Descrição</label><p className="text-sm text-mist whitespace-pre-line">{open.business_description}</p></div>
          )}
          <div className="mb-5">
            <label className="lbl">Notas internas</label>
            <textarea className="field" rows={2} value={note} onChange={(e) => setNote(e.target.value)} />
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="btn btn-ghost btn-sm" onClick={() => setStatus(open, 'in_analysis')}>Em análise</button>
            <button className="btn btn-ghost btn-sm" onClick={() => setStatus(open, 'proposal_sent')}>Proposta enviada</button>
            <button className="btn btn-primary btn-sm" onClick={() => setStatus(open, 'converted')}>Convertido</button>
            <button className="btn btn-ghost btn-sm !text-red-300" onClick={() => setStatus(open, 'declined')}>Recusar</button>
          </div>
        </Modal>
      )}
    </>
  )
}

/* ================= clients ================= */

function ClientsTab({ clients, toast, reload }: { clients: ClientProfile[] | null; toast: (t: string, e?: boolean) => void; reload: () => void }) {
  if (clients === null) return <Spinner />
  if (clients.length === 0) return <Empty title="Sem clientes registados" />
  return (
    <div className="card !p-0 overflow-x-auto">
      <table className="tbl">
        <thead><tr><th>Nome</th><th>Contacto</th><th>Empresa</th><th>Papel</th><th>Desde</th></tr></thead>
        <tbody>
          {clients.map((c) => (
            <tr key={c.id}>
              <td>{c.full_name ?? '—'}</td>
              <td>{c.email}<br /><span className="text-dim text-xs">{c.phone ?? ''}</span></td>
              <td className="text-dim">{c.company ?? '—'}</td>
              <td><span className="badge">{c.role}</span></td>
              <td className="text-dim whitespace-nowrap">{fmtDate(c.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-[10px] text-dim p-3">Papéis alteram-se directamente na base de dados por um administrador — nenhum utilizador se pode auto-promover.</p>
    </div>
  )
}

/* ================= projects ================= */

function ProjectsTab({ projects, clients, reload, toast }: { projects: Project[] | null; clients: ClientProfile[]; reload: () => void; toast: (t: string, e?: boolean) => void }) {
  const [creating, setCreating] = useState(false)
  const nav = useNavigate()

  if (projects === null) return <Spinner />
  return (
    <>
      <div className="flex justify-end mb-4">
        <button className="btn btn-primary btn-sm" onClick={() => setCreating(true)}>+ Novo projecto</button>
      </div>
      {projects.length === 0 ? <Empty title="Sem projectos" hint="Cria o primeiro projecto a partir de um pedido ou manualmente." /> : (
        <div className="grid md:grid-cols-2 gap-4">
          {projects.map((p) => (
            <button key={p.id} onClick={() => nav(`/admin/${p.id}`)} className="card text-left hover:border-bone/30 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-display font-700 text-lg">{p.name}</p>
                  <p className="text-dim text-xs mt-1">{p.profiles?.full_name ?? '—'} · {p.profiles?.email ?? ''}</p>
                  <p className="text-dim text-sm mt-1">{p.service ?? '—'}</p>
                </div>
                <span className={`badge ${p.status === 'completed' ? 'ok' : p.status === 'cancelled' ? 'err' : 'warn'}`}>
                  {p.status === 'active' ? 'Activo' : p.status === 'completed' ? 'Concluído' : 'Cancelado'}
                </span>
              </div>
              <p className="text-sm mt-3">{KZ(p.agreed_price)}</p>
            </button>
          ))}
        </div>
      )}
      {creating && <CreateProjectModal clients={clients} onClose={() => setCreating(false)} onDone={() => { setCreating(false); reload() }} toast={toast} />}
    </>
  )
}

function CreateProjectModal({ clients, onClose, onDone, toast }: { clients: ClientProfile[]; onClose: () => void; onDone: () => void; toast: (t: string, e?: boolean) => void }) {
  const [form, setForm] = useState({ clientId: '', name: '', service: '', price: '', terms: '', instructions: '', nextStep: '' })
  const [stages, setStages] = useState<string[]>(DEFAULT_STAGES)
  const [newStage, setNewStage] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    try {
      await createProject({
        clientId: form.clientId,
        name: form.name,
        service: form.service,
        price: form.price ? Number(form.price.replace(/\D/g, '')) : null,
        terms: form.terms,
        instructions: form.instructions,
        nextStep: form.nextStep,
        stages: stages.filter(Boolean),
      })
      toast('Projecto criado.')
      onDone()
    } catch (ex) { toast(ex instanceof Error ? ex.message : 'Erro', true) }
    setBusy(false)
  }

  const clientOptions = clients.filter((c) => c.role === 'client' || c.role === 'admin')

  return (
    <Modal title="Novo projecto" onClose={onClose} wide>
      <form onSubmit={submit} className="flex flex-col gap-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="lbl">Cliente *</label>
            <select className="field" required value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })}>
              <option value="">Escolher…</option>
              {clientOptions.map((c) => <option key={c.id} value={c.id}>{c.full_name ?? c.email}</option>)}
            </select>
          </div>
          <div>
            <label className="lbl">Nome do projecto *</label>
            <input className="field" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="ex.: Website — Padaria Central" />
          </div>
          <div>
            <label className="lbl">Serviço</label>
            <input className="field" value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} placeholder="ex.: Website institucional" />
          </div>
          <div>
            <label className="lbl">Preço acordado (Kz)</label>
            <input className="field" inputMode="numeric" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="ex.: 150000" />
          </div>
        </div>
        <div>
          <label className="lbl">Condições de pagamento</label>
          <input className="field" value={form.terms} onChange={(e) => setForm({ ...form, terms: e.target.value })} placeholder="ex.: 50% início, 50% na entrega" />
        </div>
        <div>
          <label className="lbl">Instruções de pagamento (visível ao cliente)</label>
          <textarea className="field" rows={2} value={form.instructions} onChange={(e) => setForm({ ...form, instructions: e.target.value })} placeholder="Conta bancária / referência Multicaixa Express…" />
        </div>
        <div>
          <label className="lbl">Próximo passo</label>
          <input className="field" value={form.nextStep} onChange={(e) => setForm({ ...form, nextStep: e.target.value })} placeholder="ex.: Enviar logotipo e fotos dos produtos" />
        </div>
        <div>
          <label className="lbl">Etapas ({stages.length})</label>
          <div className="flex flex-col gap-2 mb-2">
            {stages.map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-dim text-xs w-5">{i + 1}.</span>
                <input className="field !py-2" value={s} onChange={(e) => setStages((xs) => xs.map((x, j) => (j === i ? e.target.value : x)))} />
                <button type="button" className="text-dim hover:text-red-300" onClick={() => setStages((xs) => xs.filter((_, j) => j !== i))}>×</button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input className="field !py-2" placeholder="Adicionar etapa…" value={newStage} onChange={(e) => setNewStage(e.target.value)} />
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => { if (newStage.trim()) { setStages((xs) => [...xs, newStage.trim()]); setNewStage('') } }}>+</button>
          </div>
        </div>
        <button className="btn btn-primary" disabled={busy}>{busy ? 'A criar…' : 'Criar projecto'}</button>
      </form>
    </Modal>
  )
}

/* ================= project detail (admin) ================= */

type Bundle = Awaited<ReturnType<typeof projectBundle>>

export function AdminProject() {
  const { id } = useParams()
  const { user, isStaff, loading } = useAuth()
  const nav = useNavigate()
  const toast = useToast()
  const [b, setB] = useState<Bundle | null>(null)
  const [clients, setClients] = useState<ClientProfile[]>([])
  const [templates, setTemplates] = useState<MessageTemplate[]>([])
  const [tplId, setTplId] = useState('')
  const [msgDraft, setMsgDraft] = useState('')
  const [newStage, setNewStage] = useState('')
  const [payForm, setPayForm] = useState({ label: '', amount: '' })
  const [mreqForm, setMreqForm] = useState({ title: '', purpose: '', format: '', due: '' })
  const [note, setNote] = useState('')
  const [busy, setBusy] = useState(false)

  const load = useCallback(() => {
    if (!id) return
    projectBundle(id).then(setB).catch(() => setB(null))
    adminClients().then(setClients).catch(() => {})
    listTemplates().then(setTemplates).catch(() => {})
  }, [id])

  useEffect(() => { if (!loading && (!user || !isStaff)) nav('/portal') }, [loading, user, isStaff, nav])
  useEffect(() => { load() }, [load])

  if (loading || !user || !isStaff) return <PageShell><Spinner /></PageShell>
  if (!b) return <PageShell><Empty title="Projecto não encontrado" /></PageShell>

  const { project, stages, payments, materialRequests, materials, messages } = b
  const client = clients.find((c) => c.id === project.client_id)
  const done = stages.filter((s) => s.status === 'done').length
  const progress = stages.length ? Math.round((done / stages.length) * 100) : 0

  async function patchProject(patch: Partial<Project>) {
    try { await updateProject(project.id, patch); load() } catch (e) { toast(e instanceof Error ? e.message : 'Erro', true) }
  }

  async function addStage() {
    if (!newStage.trim()) return
    try {
      await upsertStage({ project_id: project.id, title: newStage.trim(), position: stages.length + 1, status: 'pending' })
      setNewStage(''); load()
    } catch (e) { toast(e instanceof Error ? e.message : 'Erro', true) }
  }

  async function setStageStatus(s: Stage, status: 'pending' | 'in_progress' | 'done') {
    try {
      await upsertStage({ id: s.id, project_id: s.project_id, status, completed_at: status === 'done' ? new Date().toISOString() : null })
      load()
    } catch (e) { toast(e instanceof Error ? e.message : 'Erro', true) }
  }

  async function addPayment() {
    if (!payForm.amount) return
    try {
      await createPayment(project.id, payForm.label || 'Pagamento', Number(payForm.amount.replace(/\D/g, '')))
      setPayForm({ label: '', amount: '' }); load(); toast('Pagamento registado.')
    } catch (e) { toast(e instanceof Error ? e.message : 'Erro', true) }
  }

  async function review(p: Payment, status: 'confirmed' | 'rejected' | 'partial') {
    const reason = status === 'rejected' ? window.prompt('Motivo da rejeição:') : null
    if (status === 'rejected' && reason === null) return
    const amount = status === 'partial' ? Number(window.prompt('Valor recebido (Kz):')?.replace(/\D/g, '')) : null
    try {
      await reviewPayment(p.id, status, reason, Number.isFinite(amount) ? amount : null)
      toast(status === 'confirmed' ? 'Pagamento confirmado.' : status === 'rejected' ? 'Comprovativo rejeitado.' : 'Pagamento parcial registado.')
      load()
    } catch (e) { toast(e instanceof Error ? e.message : 'Erro', true) }
  }

  async function addMreq() {
    if (!mreqForm.title.trim()) return
    try {
      await createMaterialRequest({
        project_id: project.id, title: mreqForm.title, purpose: mreqForm.purpose,
        format: mreqForm.format, due_date: mreqForm.due || null,
      })
      setMreqForm({ title: '', purpose: '', format: '', due: '' }); load(); toast('Pedido enviado ao cliente.')
    } catch (e) { toast(e instanceof Error ? e.message : 'Erro', true) }
  }

  async function setMreqStatus(m: MaterialRequest, status: string) {
    const comment = status === 'changes_requested' ? window.prompt('Que alterações são necessárias?') : null
    if (status === 'changes_requested' && comment === null) return
    try { await updateMaterialRequest(m.id, status, comment); load() } catch (e) { toast(e instanceof Error ? e.message : 'Erro', true) }
  }

  function applyTemplate(tpl: MessageTemplate | undefined) {
    if (!tpl) return setMsgDraft('')
    const pending = materialRequests.filter((m) => m.status === 'requested' || m.status === 'changes_requested').map((m) => m.title).join(', ') || '—'
    const current = stages.find((s) => s.status === 'in_progress')?.title ?? '—'
    setMsgDraft(renderTemplate(tpl.body, {
      nome_cliente: client?.full_name ?? 'cliente',
      nome_projeto: project.name,
      servico: project.service ?? '—',
      etapa_atual: current,
      materiais_pendentes: pending,
      link_portal: `${window.location.origin}/portal/${project.id}`,
      proxima_acao: project.next_step ?? '—',
      data_prevista: '—',
    }))
  }

  async function send(channel: 'portal' | 'whatsapp') {
    if (!msgDraft.trim()) return
    setBusy(true)
    try {
      if (channel === 'whatsapp' && client?.phone) {
        window.open(`https://wa.me/${client.phone.replace(/\D/g, '')}?text=${encodeURIComponent(msgDraft)}`, '_blank')
      }
      await sendMessage(project.id, msgDraft, channel, tplId || null)
      setMsgDraft(''); setTplId(''); toast('Mensagem registada.')
      load()
    } catch (e) { toast(e instanceof Error ? e.message : 'Erro', true) }
    setBusy(false)
  }

  async function addNote() {
    if (!note.trim()) return
    try { await postProjectUpdate(project.id, 'note', note.trim()); setNote(''); load() } catch (e) { toast(e instanceof Error ? e.message : 'Erro', true) }
  }

  return (
    <PageShell wide>
      <Link to="/admin" className="text-dim text-sm hover:text-bone">← Todos os projectos</Link>

      <div className="flex flex-wrap items-start justify-between gap-4 mt-4 mb-8">
        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-dim mb-2">{project.service ?? 'Projecto'}</p>
          <h1 className="font-display font-800 text-3xl">{project.name}</h1>
          <p className="text-dim text-sm mt-1">{client?.full_name ?? project.client_id} · {client?.email ?? ''} {client?.phone ? `· ${client.phone}` : ''}</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="field !w-auto !py-2" value={project.status} onChange={(e) => patchProject({ status: e.target.value as Project['status'] })}>
            <option value="active">Activo</option>
            <option value="completed">Concluído</option>
            <option value="cancelled">Cancelado</option>
          </select>
          <span className="font-display font-800 text-2xl">{progress}%</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* coluna esquerda */}
        <div className="flex flex-col gap-6">
          <div className="card">
            <SectionTitle title="Detalhes" />
            <div className="grid grid-cols-2 gap-3 text-sm mb-4">
              <p><span className="text-dim block text-[10px] uppercase tracking-widest">Preço</span>{KZ(project.agreed_price)}</p>
              <p><span className="text-dim block text-[10px] uppercase tracking-widest">Condições</span>{project.payment_terms ?? '—'}</p>
            </div>
            <label className="lbl">Instruções de pagamento</label>
            <textarea className="field mb-2" rows={2} defaultValue={project.payment_instructions ?? ''} onBlur={(e) => { if (e.target.value !== (project.payment_instructions ?? '')) patchProject({ payment_instructions: e.target.value }) }} />
            <label className="lbl">Próximo passo</label>
            <input className="field" defaultValue={project.next_step ?? ''} onBlur={(e) => { if (e.target.value !== (project.next_step ?? '')) patchProject({ next_step: e.target.value }) }} />
            <div className="mt-4">
              <label className="lbl">Nota / actualização ao cliente</label>
              <div className="flex gap-2">
                <input className="field" value={note} onChange={(e) => setNote(e.target.value)} placeholder="ex.: Design da homepage pronto para revisão" />
                <button className="btn btn-ghost btn-sm" onClick={addNote}>Registar</button>
              </div>
            </div>
          </div>

          <div className="card">
            <SectionTitle title={`Etapas (${done}/${stages.length})`} />
            <div className="flex flex-col gap-2 mb-3">
              {stages.map((s) => (
                <div key={s.id} className="flex items-center gap-2 text-sm">
                  <span className={`badge ${STAGE_STATUS[s.status]?.cls}`}>{STAGE_STATUS[s.status]?.label}</span>
                  <span className="flex-1">{s.title}</span>
                  {s.status !== 'done' && <button className="btn btn-ghost btn-sm !px-2" onClick={() => setStageStatus(s, s.status === 'pending' ? 'in_progress' : 'done')}>{s.status === 'pending' ? '▶' : '✓'}</button>}
                  {s.status === 'done' && <button className="btn btn-ghost btn-sm !px-2" onClick={() => setStageStatus(s, 'pending')}>↺</button>}
                  <button className="text-dim hover:text-red-300" onClick={async () => { if (confirm('Apagar etapa?')) { await deleteStage(s.id); load() } }}>×</button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input className="field !py-2" placeholder="Nova etapa…" value={newStage} onChange={(e) => setNewStage(e.target.value)} />
              <button className="btn btn-ghost btn-sm" onClick={addStage}>+</button>
            </div>
          </div>

          <div className="card">
            <SectionTitle title="Materiais" />
            <div className="flex flex-col gap-3 mb-4">
              {materialRequests.map((m) => (
                <div key={m.id} className="flex items-start justify-between gap-3 border-b border-line pb-3 last:border-0">
                  <div>
                    <p className="text-sm font-medium">{m.title}</p>
                    <p className="text-[10px] text-dim">{[m.purpose, m.format, m.due_date ? `até ${fmtDate(m.due_date)}` : null].filter(Boolean).join(' · ')}</p>
                    {m.staff_comment && <p className="text-xs text-mist mt-1">{m.staff_comment}</p>}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`badge ${MREQ_STATUS[m.status]?.cls}`}>{MREQ_STATUS[m.status]?.label}</span>
                    {m.status === 'sent' && (
                      <div className="flex gap-1">
                        <button className="btn btn-ghost btn-sm !px-2" onClick={() => setMreqStatus(m, 'approved')}>Aprovar</button>
                        <button className="btn btn-ghost btn-sm !px-2" onClick={() => setMreqStatus(m, 'changes_requested')}>Pedir alterações</button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {materialRequests.length === 0 && <p className="text-dim text-sm">Sem pedidos ainda.</p>}
            </div>
            <div className="border-t border-line pt-4 flex flex-col gap-2">
              <label className="lbl">Solicitar material ao cliente</label>
              <input className="field !py-2" placeholder="O quê (ex.: Logotipo em alta resolução)" value={mreqForm.title} onChange={(e) => setMreqForm({ ...mreqForm, title: e.target.value })} />
              <input className="field !py-2" placeholder="Para quê (ex.: cabeçalho do site)" value={mreqForm.purpose} onChange={(e) => setMreqForm({ ...mreqForm, purpose: e.target.value })} />
              <div className="grid grid-cols-2 gap-2">
                <input className="field !py-2" placeholder="Formato (ex.: PNG, PDF)" value={mreqForm.format} onChange={(e) => setMreqForm({ ...mreqForm, format: e.target.value })} />
                <input className="field !py-2" type="date" value={mreqForm.due} onChange={(e) => setMreqForm({ ...mreqForm, due: e.target.value })} />
              </div>
              <button className="btn btn-ghost btn-sm self-start" onClick={addMreq}>Solicitar</button>
            </div>
            {materials.length > 0 && (
              <div className="mt-4 pt-4 border-t border-line flex flex-col gap-2">
                <p className="text-[10px] tracking-[0.25em] uppercase text-dim">Ficheiros recebidos</p>
                {materials.map((m) => (
                  <button key={m.id} className="text-left text-sm text-mist hover:text-bone truncate" onClick={async () => window.open(await materialUrl(m.file_path), '_blank')}>
                    {m.file_name} <span className="text-dim text-[10px]">· {fmtDate(m.created_at)}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* coluna direita */}
        <div className="flex flex-col gap-6">
          <div className="card">
            <SectionTitle title={`Pagamentos (${payments.length})`} />
            <div className="flex flex-col gap-3 mb-4">
              {payments.map((p) => {
                const st = PAYMENT_STATUS[p.status] ?? { label: p.status, cls: '' }
                return (
                  <div key={p.id} className="border-b border-line pb-3 last:border-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium">{p.label} — {KZ(p.amount_due)}</p>
                        {p.proof_name && (
                          <button className="text-xs text-mist underline" onClick={async () => window.open(await proofUrl(p.proof_path!), '_blank')}>
                            Ver comprovativo ({p.proof_name})
                          </button>
                        )}
                        {p.amount_received != null && <p className="text-xs text-dim">Recebido: {KZ(p.amount_received)}</p>}
                        {p.rejection_reason && <p className="text-xs text-red-300">Motivo: {p.rejection_reason}</p>}
                      </div>
                      <span className={`badge ${st.cls}`}>{st.label}</span>
                    </div>
                    {(p.status === 'submitted' || p.status === 'in_review') && (
                      <div className="flex gap-2 mt-2">
                        <button className="btn btn-primary btn-sm" onClick={() => review(p, 'confirmed')}>Confirmar</button>
                        <button className="btn btn-ghost btn-sm" onClick={() => review(p, 'partial')}>Parcial</button>
                        <button className="btn btn-ghost btn-sm !text-red-300" onClick={() => review(p, 'rejected')}>Rejeitar</button>
                      </div>
                    )}
                  </div>
                )
              })}
              {payments.length === 0 && <p className="text-dim text-sm">Sem pagamentos.</p>}
            </div>
            <div className="border-t border-line pt-4 flex gap-2">
              <input className="field !py-2" placeholder="Descrição (ex.: Entrada 50%)" value={payForm.label} onChange={(e) => setPayForm({ ...payForm, label: e.target.value })} />
              <input className="field !py-2 !w-32" placeholder="Kz" inputMode="numeric" value={payForm.amount} onChange={(e) => setPayForm({ ...payForm, amount: e.target.value })} />
              <button className="btn btn-ghost btn-sm" onClick={addPayment}>Registar</button>
            </div>
          </div>

          <div className="card">
            <SectionTitle title="Comunicação" />
            <div className="mb-3">
              <label className="lbl">Modelo</label>
              <select className="field" value={tplId} onChange={(e) => { setTplId(e.target.value); applyTemplate(templates.find((t) => t.id === e.target.value)) }}>
                <option value="">Mensagem livre…</option>
                {templates.map((t) => <option key={t.id} value={t.id}>[{t.category}] {t.title}</option>)}
              </select>
              <p className="text-[10px] text-dim mt-1">Variáveis: {TEMPLATE_VARS.map((v) => `{{${v}}}`).join(' ')}</p>
            </div>
            <textarea className="field mb-3" rows={5} value={msgDraft} onChange={(e) => setMsgDraft(e.target.value)} placeholder="Escreve ou escolhe um modelo…" />
            <div className="flex gap-2 mb-5">
              <button className="btn btn-primary btn-sm" disabled={busy} onClick={() => send('portal')}>Enviar no portal</button>
              <button className="btn btn-ghost btn-sm" disabled={busy} onClick={() => send('whatsapp')} title={client?.phone ? `Abre o WhatsApp de ${client.phone}` : 'Cliente sem telefone'}>WhatsApp ↗</button>
            </div>
            <p className="text-[10px] tracking-[0.25em] uppercase text-dim mb-3">Histórico</p>
            <div className="flex flex-col gap-3 max-h-[40vh] overflow-y-auto">
              {messages.length === 0 && <p className="text-dim text-sm">Sem mensagens.</p>}
              {messages.map((m: Message) => (
                <div key={m.id} className="border-b border-line pb-2 last:border-0">
                  <p className="text-sm text-mist whitespace-pre-line">{m.body}</p>
                  <p className="text-[10px] text-dim mt-1">{m.channel} · {m.delivery_status} · {fmtDate(m.created_at)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  )
}

/* ================= templates ================= */

function TemplatesTab({ templates, reload, toast }: { templates: MessageTemplate[] | null; reload: () => void; toast: (t: string, e?: boolean) => void }) {
  const [editing, setEditing] = useState<Partial<MessageTemplate> | null>(null)
  const [filter, setFilter] = useState('')

  async function save(e: FormEvent) {
    e.preventDefault()
    try {
      await saveTemplate(editing!)
      toast('Modelo guardado.')
      setEditing(null); reload()
    } catch (ex) { toast(ex instanceof Error ? ex.message : 'Erro', true) }
  }

  if (templates === null) return <Spinner />
  const cats = [...new Set(templates.map((t) => t.category))]
  const shown = filter ? templates.filter((t) => t.category === filter) : templates

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex flex-wrap gap-2">
          <button className={`badge !py-1.5 cursor-pointer ${!filter ? '!border-bone text-bone' : ''}`} onClick={() => setFilter('')}>Todas</button>
          {cats.map((c) => <button key={c} className={`badge !py-1.5 cursor-pointer ${filter === c ? '!border-bone text-bone' : ''}`} onClick={() => setFilter(c)}>{c}</button>)}
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setEditing({ category: '', title: '', body: '' })}>+ Novo modelo</button>
      </div>
      {shown.length === 0 ? <Empty title="Sem modelos" /> : (
        <div className="grid md:grid-cols-2 gap-4">
          {shown.map((t) => (
            <div key={t.id} className="card">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="badge mb-2">{t.category}</span>
                  <p className="font-medium">{t.title}</p>
                </div>
                <div className="flex gap-2">
                  <button className="btn btn-ghost btn-sm" onClick={() => setEditing(t)}>Editar</button>
                  <button className="btn btn-ghost btn-sm !text-red-300" onClick={async () => { if (confirm('Apagar modelo?')) { await deleteTemplate(t.id); reload() } }}>×</button>
                </div>
              </div>
              <p className="text-xs text-dim mt-3 whitespace-pre-line line-clamp-4">{t.body}</p>
            </div>
          ))}
        </div>
      )}
      {editing && (
        <Modal title={editing.id ? 'Editar modelo' : 'Novo modelo'} onClose={() => setEditing(null)} wide>
          <form onSubmit={save} className="flex flex-col gap-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className="lbl">Categoria</label><input className="field" required value={editing.category ?? ''} onChange={(e) => setEditing({ ...editing, category: e.target.value })} placeholder="ex.: Pagamento" /></div>
              <div><label className="lbl">Título</label><input className="field" required value={editing.title ?? ''} onChange={(e) => setEditing({ ...editing, title: e.target.value })} placeholder="ex.: Confirmação de comprovativo" /></div>
            </div>
            <div>
              <label className="lbl">Mensagem — variáveis: {TEMPLATE_VARS.map((v) => `{{${v}}}`).join(' ')}</label>
              <textarea className="field" rows={7} required value={editing.body ?? ''} onChange={(e) => setEditing({ ...editing, body: e.target.value })} />
            </div>
            <button className="btn btn-primary">Guardar</button>
          </form>
        </Modal>
      )}
    </>
  )
}
