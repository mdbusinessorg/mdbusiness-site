import { requireSupabase } from './supabase'

/* ---------- types ---------- */

export interface QuoteRequest {
  id: string
  ref_code: string
  user_id: string | null
  name: string
  email: string
  phone: string | null
  service: string
  business_description: string | null
  features: string[] | null
  budget: string | null
  status: 'pending_review' | 'in_analysis' | 'proposal_sent' | 'converted' | 'declined'
  staff_notes: string | null
  created_at: string
}

export interface Project {
  id: string
  client_id: string
  quote_id: string | null
  name: string
  service: string | null
  agreed_price: number | null
  currency: string | null
  payment_terms: string | null
  payment_instructions: string | null
  status: 'active' | 'completed' | 'cancelled'
  next_step: string | null
  delivered_at: string | null
  created_at: string
  profiles?: { full_name: string | null; email: string | null; company: string | null } | null
}

export interface Stage {
  id: string
  project_id: string
  position: number
  title: string
  status: 'pending' | 'in_progress' | 'done'
  notes: string | null
  completed_at: string | null
  updated_at: string
}

export interface Payment {
  id: string
  project_id: string
  label: string | null
  amount_due: number | null
  amount_declared: number | null
  amount_received: number | null
  method: string | null
  proof_path: string | null
  proof_name: string | null
  status: 'awaiting' | 'submitted' | 'in_review' | 'confirmed' | 'rejected' | 'partial' | 'refunded' | 'cancelled'
  rejection_reason: string | null
  submitted_at: string | null
  reviewed_at: string | null
  created_at: string
}

export interface MaterialRequest {
  id: string
  project_id: string
  title: string
  purpose: string | null
  format: string | null
  due_date: string | null
  status: 'requested' | 'sent' | 'in_review' | 'approved' | 'changes_requested'
  staff_comment: string | null
  created_at: string
}

export interface Material {
  id: string
  project_id: string
  request_id: string | null
  file_path: string
  file_name: string
  mime_type: string | null
  size_bytes: number | null
  note: string | null
  created_at: string
}

export interface Message {
  id: string
  project_id: string
  sender_id: string
  body: string
  channel: 'portal' | 'email' | 'whatsapp'
  delivery_status: string
  template_id: string | null
  created_at: string
}

export interface MessageTemplate {
  id: string
  category: string
  title: string
  body: string
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  kind: string
  title: string
  body: string | null
  link: string | null
  read_at: string | null
  created_at: string
}

export interface ProjectUpdate {
  id: string
  project_id: string
  kind: string
  message: string | null
  attachment_path: string | null
  created_at: string
}

export interface ClientProfile {
  id: string
  email: string | null
  full_name: string | null
  phone: string | null
  company: string | null
  role: string
  created_at: string
}

/* ---------- helpers ---------- */

export const KZ = (n: number | null | undefined) =>
  n == null ? '—' : `${new Intl.NumberFormat('pt-PT', { maximumFractionDigits: 0 }).format(n)} Kz`

export const fmtDate = (d: string | null | undefined) =>
  d ? new Date(d).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'

export const PAYMENT_STATUS: Record<string, { label: string; cls: string }> = {
  awaiting: { label: 'A aguardar', cls: 'warn' },
  submitted: { label: 'Comprovativo enviado', cls: 'warn' },
  in_review: { label: 'Em verificação', cls: 'warn' },
  confirmed: { label: 'Confirmado', cls: 'ok' },
  rejected: { label: 'Rejeitado', cls: 'err' },
  partial: { label: 'Parcial', cls: 'warn' },
  refunded: { label: 'Reembolsado', cls: 'err' },
  cancelled: { label: 'Cancelado', cls: 'err' },
}

export const QUOTE_STATUS: Record<string, { label: string; cls: string }> = {
  pending_review: { label: 'Novo', cls: 'warn' },
  in_analysis: { label: 'Em análise', cls: 'warn' },
  proposal_sent: { label: 'Proposta enviada', cls: 'ok' },
  converted: { label: 'Convertido', cls: 'ok' },
  declined: { label: 'Recusado', cls: 'err' },
}

export const MREQ_STATUS: Record<string, { label: string; cls: string }> = {
  requested: { label: 'Solicitado', cls: 'warn' },
  sent: { label: 'Enviado', cls: 'warn' },
  in_review: { label: 'Em revisão', cls: 'warn' },
  approved: { label: 'Aprovado', cls: 'ok' },
  changes_requested: { label: 'Alterações pedidas', cls: 'err' },
}

export const STAGE_STATUS: Record<string, { label: string; cls: string }> = {
  pending: { label: 'Pendente', cls: '' },
  in_progress: { label: 'Em curso', cls: 'warn' },
  done: { label: 'Concluída', cls: 'ok' },
}

/* ---------- quotes ---------- */

export async function submitQuote(input: {
  name: string
  email: string
  phone: string
  service: string
  description: string
  features: string[]
  budget: string
}) {
  const sb = requireSupabase()
  const { data, error } = await sb.rpc('submit_quote', {
    p_name: input.name,
    p_email: input.email,
    p_phone: input.phone || null,
    p_service: input.service,
    p_description: input.description || null,
    p_features: input.features,
    p_budget: input.budget || null,
  })
  if (error) throw error
  return data as { id: string; ref_code: string }
}

/* ---------- client portal ---------- */

export async function myProjects() {
  const sb = requireSupabase()
  const { data, error } = await sb
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as Project[]
}

export async function myQuotes() {
  const sb = requireSupabase()
  const { data, error } = await sb
    .from('quote_requests')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as QuoteRequest[]
}

export async function projectBundle(projectId: string) {
  const sb = requireSupabase()
  const [project, stages, payments, mreq, materials, messages, updates] = await Promise.all([
    sb.from('projects').select('*').eq('id', projectId).single(),
    sb.from('project_stages').select('*').eq('project_id', projectId).order('position'),
    sb.from('payments').select('*').eq('project_id', projectId).order('created_at'),
    sb.from('material_requests').select('*').eq('project_id', projectId).order('created_at', { ascending: false }),
    sb.from('materials').select('*').eq('project_id', projectId).order('created_at', { ascending: false }),
    sb.from('messages').select('*').eq('project_id', projectId).order('created_at'),
    sb.from('project_updates').select('*').eq('project_id', projectId).order('created_at', { ascending: false }).limit(50),
  ])
  if (project.error) throw project.error
  return {
    project: project.data as Project,
    stages: (stages.data ?? []) as Stage[],
    payments: (payments.data ?? []) as Payment[],
    materialRequests: (mreq.data ?? []) as MaterialRequest[],
    materials: (materials.data ?? []) as Material[],
    messages: (messages.data ?? []) as Message[],
    updates: (updates.data ?? []) as ProjectUpdate[],
  }
}

export async function sendPortalMessage(projectId: string, body: string) {
  const sb = requireSupabase()
  const { data: u } = await sb.auth.getUser()
  const { error } = await sb.from('messages').insert({
    project_id: projectId,
    sender_id: u.user?.id,
    body,
    channel: 'portal',
    delivery_status: 'delivered',
  })
  if (error) throw error
}

/* ---------- files ---------- */

const PROOF_BUCKET = 'payment-proofs'
const MATERIAL_BUCKET = 'project-materials'

export async function uploadProof(projectId: string, paymentId: string, file: File, amount: number, method: string) {
  const sb = requireSupabase()
  const ext = file.name.split('.').pop() ?? 'bin'
  const path = `${projectId}/${paymentId}/${Date.now()}.${ext}`
  const { error: upErr } = await sb.storage.from(PROOF_BUCKET).upload(path, file, { upsert: false })
  if (upErr) throw upErr
  const { error } = await sb.rpc('submit_payment_proof', {
    p_project: projectId,
    p_payment: paymentId,
    p_path: path,
    p_name: file.name,
    p_amount: amount,
    p_method: method,
  })
  if (error) throw error
}

export async function uploadMaterial(projectId: string, requestId: string | null, file: File, note: string) {
  const sb = requireSupabase()
  const path = `${projectId}/${Date.now()}-${file.name.replace(/[^\w.\-]/g, '_')}`
  const { error: upErr } = await sb.storage.from(MATERIAL_BUCKET).upload(path, file, { upsert: false })
  if (upErr) throw upErr
  const { data: u } = await sb.auth.getUser()
  const { error } = await sb.from('materials').insert({
    project_id: projectId,
    request_id: requestId,
    uploaded_by: u.user?.id,
    file_path: path,
    file_name: file.name,
    mime_type: file.type || null,
    size_bytes: file.size,
    note: note || null,
  })
  if (error) throw error
}

export async function fileUrl(bucket: string, path: string) {
  const sb = requireSupabase()
  const { data, error } = await sb.storage.from(bucket).createSignedUrl(path, 300)
  if (error) throw error
  return data.signedUrl
}

export const proofUrl = (path: string) => fileUrl(PROOF_BUCKET, path)
export const materialUrl = (path: string) => fileUrl(MATERIAL_BUCKET, path)

/* ---------- notifications ---------- */

export async function myNotifications() {
  const sb = requireSupabase()
  const { data, error } = await sb
    .from('notifications')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)
  if (error) throw error
  return data as Notification[]
}

export async function markNotificationRead(id: string) {
  const sb = requireSupabase()
  await sb.from('notifications').update({ read_at: new Date().toISOString() }).eq('id', id)
}

/* ---------- admin ---------- */

export async function adminQuotes() {
  const sb = requireSupabase()
  const { data, error } = await sb.from('quote_requests').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data as QuoteRequest[]
}

export async function updateQuoteStatus(id: string, status: string, notes?: string) {
  const sb = requireSupabase()
  const { error } = await sb
    .from('quote_requests')
    .update({ status, ...(notes !== undefined ? { staff_notes: notes } : {}) })
    .eq('id', id)
  if (error) throw error
}

export async function adminClients() {
  const sb = requireSupabase()
  const { data, error } = await sb.from('profiles').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data as ClientProfile[]
}

export async function adminProjects() {
  const sb = requireSupabase()
  const { data, error } = await sb
    .from('projects')
    .select('*, profiles:client_id(full_name, email, company)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as Project[]
}

export async function createProject(input: {
  clientId: string
  name: string
  service: string
  price: number | null
  terms: string
  instructions: string
  nextStep: string
  stages: string[]
  quoteId?: string | null
}) {
  const sb = requireSupabase()
  const { data, error } = await sb.rpc('create_project', {
    p_client: input.clientId,
    p_name: input.name,
    p_service: input.service,
    p_price: input.price,
    p_terms: input.terms || null,
    p_instructions: input.instructions || null,
    p_next_step: input.nextStep || null,
    p_stages: input.stages,
    p_quote: input.quoteId ?? null,
  })
  if (error) throw error
  return data
}

export async function updateProject(id: string, patch: Partial<Project>) {
  const sb = requireSupabase()
  const { error } = await sb.from('projects').update(patch).eq('id', id)
  if (error) throw error
}

export async function upsertStage(stage: Partial<Stage> & { project_id: string }) {
  const sb = requireSupabase()
  const { error } = await sb.from('project_stages').upsert(stage)
  if (error) throw error
}

export async function deleteStage(id: string) {
  const sb = requireSupabase()
  const { error } = await sb.from('project_stages').delete().eq('id', id)
  if (error) throw error
}

export async function postProjectUpdate(projectId: string, kind: string, message: string) {
  const sb = requireSupabase()
  const { data: u } = await sb.auth.getUser()
  const { error } = await sb.from('project_updates').insert({
    project_id: projectId,
    author_id: u.user?.id,
    kind,
    message,
  })
  if (error) throw error
}

export async function createPayment(projectId: string, label: string, amount: number) {
  const sb = requireSupabase()
  const { error } = await sb.from('payments').insert({
    project_id: projectId,
    label,
    amount_due: amount,
    status: 'awaiting',
  })
  if (error) throw error
}

export async function reviewPayment(paymentId: string, status: 'confirmed' | 'rejected' | 'partial', reason: string | null, amountReceived: number | null) {
  const sb = requireSupabase()
  const { error } = await sb.rpc('review_payment', {
    p_payment: paymentId,
    p_status: status,
    p_reason: reason,
    p_amount_received: amountReceived,
  })
  if (error) throw error
}

export async function createMaterialRequest(input: {
  project_id: string
  title: string
  purpose: string
  format: string
  due_date: string | null
}) {
  const sb = requireSupabase()
  const { data: u } = await sb.auth.getUser()
  const { error } = await sb.from('material_requests').insert({
    ...input,
    created_by: u.user?.id,
    status: 'requested',
  })
  if (error) throw error
}

export async function updateMaterialRequest(id: string, status: string, comment?: string | null) {
  const sb = requireSupabase()
  const { error } = await sb.from('material_requests').update({ status, staff_comment: comment ?? null }).eq('id', id)
  if (error) throw error
}

/* ---------- templates & messages ---------- */

export async function listTemplates() {
  const sb = requireSupabase()
  const { data, error } = await sb.from('message_templates').select('*').order('category').order('title')
  if (error) throw error
  return data as MessageTemplate[]
}

export async function saveTemplate(t: Partial<MessageTemplate>) {
  const sb = requireSupabase()
  const { error } = await sb.from('message_templates').upsert(t)
  if (error) throw error
}

export async function deleteTemplate(id: string) {
  const sb = requireSupabase()
  const { error } = await sb.from('message_templates').delete().eq('id', id)
  if (error) throw error
}

export async function sendMessage(projectId: string, body: string, channel: string, templateId?: string | null) {
  const sb = requireSupabase()
  const { data: u } = await sb.auth.getUser()
  const { error } = await sb.from('messages').insert({
    project_id: projectId,
    sender_id: u.user?.id,
    body,
    channel,
    template_id: templateId ?? null,
    delivery_status: channel === 'portal' ? 'delivered' : 'manual',
  })
  if (error) throw error
}

export async function updateProfile(id: string, patch: Partial<ClientProfile>) {
  const sb = requireSupabase()
  const { error } = await sb.from('profiles').update(patch).eq('id', id)
  if (error) throw error
}

/* ---------- misc ---------- */

export function renderTemplate(body: string, vars: Record<string, string>) {
  return body.replace(/\{\{(\w+)\}\}/g, (_, k: string) => vars[k] ?? `{{${k}}}`)
}

export const TEMPLATE_VARS = [
  'nome_cliente',
  'nome_projeto',
  'servico',
  'etapa_atual',
  'materiais_pendentes',
  'link_portal',
  'proxima_acao',
  'data_prevista',
]
