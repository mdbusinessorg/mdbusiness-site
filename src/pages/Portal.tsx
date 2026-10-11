import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import {
  KZ, fmtDate, PAYMENT_STATUS, QUOTE_STATUS, MREQ_STATUS, STAGE_STATUS,
  myProjects, myQuotes, myNotifications, markNotificationRead,
  projectBundle, sendPortalMessage, uploadProof, uploadMaterial,
  type Project, type QuoteRequest, type Notification,
} from '../lib/api'
import { supabaseEnabled } from '../lib/supabase'
import { Empty, PageShell, SectionTitle, Spinner, useToast } from '../lib/ui'

/* ================= dashboard ================= */

export function PortalHome() {
  const { user, profile, loading, signOut, isStaff } = useAuth()
  const nav = useNavigate()
  const [projects, setProjects] = useState<Project[] | null>(null)
  const [quotes, setQuotes] = useState<QuoteRequest[]>([])
  const [notifs, setNotifs] = useState<Notification[]>([])

  useEffect(() => {
    if (!loading && !user) nav('/entrar')
  }, [loading, user, nav])

  useEffect(() => {
    if (!user) return
    myProjects().then(setProjects).catch(() => setProjects([]))
    myQuotes().then(setQuotes).catch(() => {})
    myNotifications().then(setNotifs).catch(() => {})
  }, [user])

  if (loading || !user) return <PageShell><Spinner label="A carregar a tua área…" /></PageShell>
  if (!supabaseEnabled) return <PageShell><Empty title="Portal em configuração" hint="O backend ainda não está ligado. Tenta mais tarde." /></PageShell>

  const unread = notifs.filter((n) => !n.read_at)

  return (
    <PageShell wide>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-dim mb-2">Área de cliente</p>
          <h1 className="font-display font-800 text-3xl md:text-4xl">Olá, {profile?.full_name?.split(' ')[0] ?? 'cliente'}</h1>
        </div>
        <div className="flex gap-2">
          {isStaff && <Link to="/admin" className="btn btn-ghost btn-sm">Painel da equipa</Link>}
          <Link to="/orcamento" className="btn btn-primary btn-sm">Novo pedido</Link>
          <button onClick={() => { signOut(); nav('/') }} className="btn btn-ghost btn-sm">Sair</button>
        </div>
      </div>

      {unread.length > 0 && (
        <div className="card mb-8 border-line-strong">
          <p className="text-[10px] tracking-[0.25em] uppercase text-dim mb-3">Notificações ({unread.length})</p>
          <div className="flex flex-col gap-3">
            {unread.slice(0, 6).map((n) => (
              <button
                key={n.id}
                className="text-left flex items-start justify-between gap-4 hover:bg-surface rounded-lg p-2 -m-2"
                onClick={() => { markNotificationRead(n.id); if (n.link) nav(n.link) }}
              >
                <div>
                  <p className="text-sm text-bone font-medium">{n.title}</p>
                  {n.body && <p className="text-xs text-dim mt-0.5">{n.body}</p>}
                </div>
                <span className="text-[10px] text-dim whitespace-nowrap">{fmtDate(n.created_at)}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <SectionTitle kicker="Projectos" title="Os teus projectos" />
      {projects === null ? (
        <Spinner />
      ) : projects.length === 0 ? (
        <Empty title="Ainda não tens projectos" hint="Pede um orçamento e a nossa equipa abre o teu projecto aqui." />
      ) : (
        <div className="grid md:grid-cols-2 gap-4 mb-12">
          {projects.map((p) => (
            <Link key={p.id} to={`/portal/${p.id}`} className="card hover:border-bone/30 transition-colors block">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-display font-700 text-lg">{p.name}</p>
                  <p className="text-dim text-sm mt-1">{p.service ?? '—'}</p>
                </div>
                <span className={`badge ${p.status === 'completed' ? 'ok' : p.status === 'cancelled' ? 'err' : 'warn'}`}>
                  {p.status === 'active' ? 'Em curso' : p.status === 'completed' ? 'Concluído' : 'Cancelado'}
                </span>
              </div>
              {p.next_step && <p className="text-mist text-sm mt-4"><span className="text-dim">Próximo passo:</span> {p.next_step}</p>}
              <p className="text-sm mt-3">{KZ(p.agreed_price)}</p>
            </Link>
          ))}
        </div>
      )}

      {quotes.length > 0 && (
        <>
          <SectionTitle kicker="Pedidos" title="Os teus pedidos de orçamento" />
          <div className="card overflow-x-auto !p-0">
            <table className="tbl">
              <thead><tr><th>Ref</th><th>Serviço</th><th>Estado</th><th>Data</th></tr></thead>
              <tbody>
                {quotes.map((q) => (
                  <tr key={q.id}>
                    <td className="font-mono text-xs">{q.ref_code}</td>
                    <td>{q.service}</td>
                    <td><span className={`badge ${QUOTE_STATUS[q.status]?.cls}`}>{QUOTE_STATUS[q.status]?.label ?? q.status}</span></td>
                    <td className="text-dim">{fmtDate(q.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </PageShell>
  )
}

/* ================= project detail ================= */

type Bundle = Awaited<ReturnType<typeof projectBundle>>
type Tab = 'progresso' | 'pagamentos' | 'materiais' | 'mensagens'

export function PortalProject() {
  const { id } = useParams()
  const { user, loading } = useAuth()
  const nav = useNavigate()
  const toast = useToast()
  const [b, setB] = useState<Bundle | null>(null)
  const [tab, setTab] = useState<Tab>('progresso')
  const [msgDraft, setMsgDraft] = useState('')
  const fileProof = useRef<Record<string, HTMLInputElement | null>>({})
  const fileMat = useRef<HTMLInputElement | null>(null)
  const [payForm, setPayForm] = useState<Record<string, { amount: string; method: string }>>({})
  const [matReq, setMatReq] = useState<string | null>(null)
  const [matNote, setMatNote] = useState('')
  const [busy, setBusy] = useState(false)

  const load = useCallback(() => {
    if (id) projectBundle(id).then(setB).catch(() => setB(null))
  }, [id])

  useEffect(() => { if (!loading && !user) nav('/entrar') }, [loading, user, nav])
  useEffect(() => { load() }, [load])

  if (loading || !user) return <PageShell><Spinner /></PageShell>
  if (!b) return <PageShell><Empty title="Projecto não encontrado" hint="Verifica o link ou fala connosco." /></PageShell>

  const { project, stages, payments, materialRequests, materials, messages, updates } = b
  const doneStages = stages.filter((s) => s.status === 'done').length
  const progress = stages.length ? Math.round((doneStages / stages.length) * 100) : 0
  const pendingMats = materialRequests.filter((m) => m.status === 'requested' || m.status === 'changes_requested')

  async function sendMsg() {
    if (!msgDraft.trim() || !id) return
    setBusy(true)
    try {
      await sendPortalMessage(id, msgDraft.trim())
      setMsgDraft('')
      load()
    } catch (e) { toast(e instanceof Error ? e.message : 'Erro', true) }
    setBusy(false)
  }

  async function submitProof(paymentId: string) {
    const input = fileProof.current[paymentId]
    const file = input?.files?.[0]
    if (!file || !id) return toast('Escolhe o ficheiro do comprovativo.', true)
    setBusy(true)
    try {
      const pf = payForm[paymentId] ?? { amount: '', method: 'Transferência' }
      await uploadProof(id, paymentId, file, Number(pf.amount) || 0, pf.method || 'Transferência')
      toast('Comprovativo enviado para verificação.')
      load()
    } catch (e) { toast(e instanceof Error ? e.message : 'Erro ao enviar.', true) }
    setBusy(false)
  }

  async function sendMaterial() {
    const file = fileMat.current?.files?.[0]
    if (!file || !id) return toast('Escolhe um ficheiro.', true)
    setBusy(true)
    try {
      await uploadMaterial(id, matReq, file, matNote)
      toast('Material enviado.')
      setMatNote('')
      setMatReq(null)
      if (fileMat.current) fileMat.current.value = ''
      load()
    } catch (e) { toast(e instanceof Error ? e.message : 'Erro ao enviar.', true) }
    setBusy(false)
  }

  return (
    <PageShell wide>
      <Link to="/portal" className="text-dim text-sm hover:text-bone">← Os meus projectos</Link>

      <div className="flex flex-wrap items-start justify-between gap-4 mt-4 mb-8">
        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-dim mb-2">{project.service ?? 'Projecto'}</p>
          <h1 className="font-display font-800 text-3xl md:text-4xl">{project.name}</h1>
          {project.next_step && <p className="text-mist text-sm mt-2">Próximo passo: {project.next_step}</p>}
        </div>
        <div className="text-right">
          <p className="font-display font-800 text-2xl">{progress}%</p>
          <p className="text-dim text-xs">{doneStages}/{stages.length} etapas</p>
        </div>
      </div>

      <div className="h-1 rounded-full bg-surface mb-8 overflow-hidden">
        <div className="h-full bg-bone rounded-full transition-all" style={{ width: `${progress}%` }} />
      </div>

      <div className="flex gap-2 mb-8 overflow-x-auto no-scrollbar">
        {(['progresso', 'pagamentos', 'materiais', 'mensagens'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`btn btn-sm whitespace-nowrap ${tab === t ? 'btn-primary' : 'btn-ghost'}`}
          >
            {t === 'progresso' ? 'Acompanhamento' : t === 'pagamentos' ? `Pagamentos (${payments.length})` : t === 'materiais' ? `Materiais (${pendingMats.length ? `${pendingMats.length} pend.` : materialRequests.length})` : `Mensagens (${messages.length})`}
          </button>
        ))}
      </div>

      {tab === 'progresso' && (
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-8">
          <div className="card">
            <p className="text-[10px] tracking-[0.25em] uppercase text-dim mb-5">Etapas</p>
            {stages.length === 0 ? <p className="text-dim text-sm">As etapas do projecto serão definidas pela equipa.</p> : (
              <div className="tl">
                {stages.map((s) => (
                  <div key={s.id} className={`tl-item ${s.status === 'done' ? 'done' : s.status === 'in_progress' ? 'now' : ''}`}>
                    <div className="flex items-center justify-between gap-3">
                      <p className={`text-sm font-medium ${s.status === 'pending' ? 'text-dim' : 'text-bone'}`}>{s.title}</p>
                      <span className={`badge ${STAGE_STATUS[s.status]?.cls}`}>{STAGE_STATUS[s.status]?.label}</span>
                    </div>
                    {s.notes && <p className="text-xs text-dim mt-1">{s.notes}</p>}
                    {s.completed_at && <p className="text-[10px] text-dim mt-1">Concluída em {fmtDate(s.completed_at)}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="card h-fit">
            <p className="text-[10px] tracking-[0.25em] uppercase text-dim mb-4">Histórico</p>
            {updates.length === 0 ? <p className="text-dim text-sm">Sem actualizações ainda.</p> : (
              <div className="flex flex-col gap-4">
                {updates.map((u) => (
                  <div key={u.id} className="border-b border-line pb-3 last:border-0">
                    <p className="text-sm text-mist">{u.message}</p>
                    <p className="text-[10px] text-dim mt-1">{fmtDate(u.created_at)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {tab === 'pagamentos' && (
        <div className="flex flex-col gap-4">
          {project.payment_instructions && (
            <div className="card border-line-strong">
              <p className="text-[10px] tracking-[0.25em] uppercase text-dim mb-2">Instruções de pagamento</p>
              <p className="text-sm text-mist whitespace-pre-line">{project.payment_instructions}</p>
              {project.payment_terms && <p className="text-xs text-dim mt-2">{project.payment_terms}</p>}
            </div>
          )}
          {payments.length === 0 && <Empty title="Sem pagamentos registados" hint="Quando a equipa registar valores, aparecem aqui." />}
          {payments.map((p) => {
            const st = PAYMENT_STATUS[p.status] ?? { label: p.status, cls: '' }
            const needsProof = p.status === 'awaiting' || p.status === 'rejected'
            return (
              <div key={p.id} className="card">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{p.label ?? 'Pagamento'}</p>
                    <p className="text-2xl font-display font-800 mt-1">{KZ(p.amount_due)}</p>
                    {p.amount_received != null && <p className="text-xs text-dim mt-1">Recebido: {KZ(p.amount_received)}</p>}
                  </div>
                  <span className={`badge ${st.cls}`}>{st.label}</span>
                </div>
                {p.status === 'rejected' && p.rejection_reason && (
                  <p className="text-red-300 text-sm mt-3">Motivo: {p.rejection_reason}</p>
                )}
                {p.proof_name && (
                  <p className="text-xs text-dim mt-3">Comprovativo: {p.proof_name} · {fmtDate(p.submitted_at)} · {p.method}</p>
                )}
                {needsProof && (
                  <div className="mt-4 pt-4 border-t border-line grid sm:grid-cols-[1fr_auto_auto] gap-3 items-end">
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        className="field" placeholder="Valor (Kz)" inputMode="numeric"
                        value={payForm[p.id]?.amount ?? ''}
                        onChange={(e) => setPayForm((f) => ({ ...f, [p.id]: { amount: e.target.value, method: f[p.id]?.method ?? 'Transferência' } }))}
                      />
                      <select
                        className="field"
                        value={payForm[p.id]?.method ?? 'Transferência'}
                        onChange={(e) => setPayForm((f) => ({ ...f, [p.id]: { amount: f[p.id]?.amount ?? '', method: e.target.value } }))}
                      >
                        <option>Transferência</option>
                        <option>Depósito</option>
                        <option>Multicaixa Express</option>
                        <option>TPA</option>
                      </select>
                    </div>
                    <input ref={(el) => { fileProof.current[p.id] = el }} type="file" accept="image/*,.pdf" className="field !py-2.5" />
                    <button className="btn btn-primary btn-sm" disabled={busy} onClick={() => submitProof(p.id)}>Enviar comprovativo</button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {tab === 'materiais' && (
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="flex flex-col gap-4">
            <p className="text-[10px] tracking-[0.25em] uppercase text-dim">Pedidos da equipa</p>
            {materialRequests.length === 0 && <Empty title="Sem pedidos" hint="Quando a equipa precisar de fotos, logotipos ou textos, os pedidos aparecem aqui." />}
            {materialRequests.map((m) => {
              const st = MREQ_STATUS[m.status] ?? { label: m.status, cls: '' }
              return (
                <div key={m.id} className="card">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">{m.title}</p>
                      {m.purpose && <p className="text-xs text-dim mt-1">Para: {m.purpose}</p>}
                      {m.format && <p className="text-xs text-dim">Formato: {m.format}</p>}
                      {m.due_date && <p className="text-xs text-dim">Prazo: {fmtDate(m.due_date)}</p>}
                      {m.staff_comment && <p className="text-xs text-mist mt-2">Equipa: {m.staff_comment}</p>}
                    </div>
                    <span className={`badge ${st.cls}`}>{st.label}</span>
                  </div>
                  {(m.status === 'requested' || m.status === 'changes_requested') && (
                    <button className="btn btn-ghost btn-sm mt-3" onClick={() => setMatReq(m.id)}>Enviar este material</button>
                  )}
                </div>
              )
            })}
          </div>
          <div>
            <div className="card">
              <p className="text-[10px] tracking-[0.25em] uppercase text-dim mb-4">Enviar material</p>
              <div className="flex flex-col gap-3">
                <select className="field" value={matReq ?? ''} onChange={(e) => setMatReq(e.target.value || null)}>
                  <option value="">Material livre (sem pedido)</option>
                  {materialRequests.filter((m) => m.status !== 'approved').map((m) => (
                    <option key={m.id} value={m.id}>{m.title}</option>
                  ))}
                </select>
                <input ref={fileMat} type="file" className="field !py-2.5" />
                <input className="field" placeholder="Nota (opcional)" value={matNote} onChange={(e) => setMatNote(e.target.value)} />
                <button className="btn btn-primary" disabled={busy} onClick={sendMaterial}>Enviar</button>
              </div>
            </div>
            <p className="text-[10px] tracking-[0.25em] uppercase text-dim mt-8 mb-3">Já enviados</p>
            <div className="flex flex-col gap-2">
              {materials.length === 0 && <p className="text-dim text-sm">Nada enviado ainda.</p>}
              {materials.map((m) => (
                <div key={m.id} className="card !p-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm truncate">{m.file_name}</p>
                    <p className="text-[10px] text-dim">{fmtDate(m.created_at)}{m.note ? ` · ${m.note}` : ''}</p>
                  </div>
                  <span className="text-[10px] text-dim whitespace-nowrap">{m.size_bytes ? `${Math.round(m.size_bytes / 1024)} KB` : ''}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'mensagens' && (
        <div className="card">
          <p className="text-[10px] tracking-[0.25em] uppercase text-dim mb-4">Conversa com a equipa</p>
          <div className="flex flex-col gap-3 mb-6 max-h-[50vh] overflow-y-auto pr-1">
            {messages.length === 0 && <p className="text-dim text-sm">Sem mensagens. Escreve a primeira.</p>}
            {messages.map((m) => {
              const mine = m.sender_id === user.id
              return (
                <div key={m.id} className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${mine ? 'self-end bg-bone text-ink' : 'self-start bg-surface text-bone'}`}>
                  <p className="whitespace-pre-line">{m.body}</p>
                  <p className={`text-[9px] mt-1 ${mine ? 'text-ink/60' : 'text-dim'}`}>
                    {mine ? 'Tu' : 'MD Business'} · {fmtDate(m.created_at)}{m.channel !== 'portal' ? ` · ${m.channel}` : ''}
                  </p>
                </div>
              )
            })}
          </div>
          <div className="flex gap-2">
            <input
              className="field flex-1"
              placeholder="Escreve a tua mensagem…"
              value={msgDraft}
              onChange={(e) => setMsgDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') sendMsg() }}
            />
            <button className="btn btn-primary" disabled={busy || !msgDraft.trim()} onClick={sendMsg}>Enviar</button>
          </div>
        </div>
      )}
    </PageShell>
  )
}
