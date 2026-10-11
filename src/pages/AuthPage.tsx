import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { PageShell } from '../lib/ui'

type Mode = 'login' | 'register' | 'reset'

export function AuthPage() {
  const { signIn, signUp, resetPassword } = useAuth()
  const nav = useNavigate()
  const [mode, setMode] = useState<Mode>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<{ text: string; ok?: boolean } | null>(null)

  async function submit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setMsg(null)
    let err: string | null = null
    if (mode === 'login') err = await signIn(email.trim(), password)
    else if (mode === 'register') err = await signUp(name.trim(), email.trim(), password, phone.trim())
    else err = await resetPassword(email.trim())
    setBusy(false)
    if (err) return setMsg({ text: err })
    if (mode === 'reset') return setMsg({ text: 'Enviámos um link de recuperação para o teu email.', ok: true })
    if (mode === 'register') return setMsg({ text: 'Conta criada! Verifica o email para confirmar (se pedido) e depois entra.', ok: true })
    nav('/portal')
  }

  return (
    <PageShell>
      <Link to="/" className="text-dim text-sm hover:text-bone">← Voltar ao site</Link>
      <div className="card mt-6">
        <h1 className="font-display font-800 text-3xl mb-1">
          {mode === 'login' ? 'Área de cliente' : mode === 'register' ? 'Criar conta' : 'Recuperar acesso'}
        </h1>
        <p className="text-dim text-sm mb-8">
          {mode === 'login'
            ? 'Entra para acompanhar o teu projecto, pagamentos e materiais.'
            : mode === 'register'
              ? 'Regista-te para pedir orçamentos e acompanhar o teu projecto.'
              : 'Indica o email da tua conta.'}
        </p>

        <form onSubmit={submit} className="flex flex-col gap-4">
          {mode === 'register' && (
            <>
              <div>
                <label className="lbl">Nome completo</label>
                <input className="field" required value={name} onChange={(e) => setName(e.target.value)} placeholder="O teu nome" />
              </div>
              <div>
                <label className="lbl">Telefone / WhatsApp</label>
                <input className="field" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+244 9xx xxx xxx" />
              </div>
            </>
          )}
          <div>
            <label className="lbl">Email</label>
            <input className="field" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@exemplo.com" />
          </div>
          {mode !== 'reset' && (
            <div>
              <label className="lbl">Palavra-passe</label>
              <input className="field" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </div>
          )}

          {msg && (
            <p className={`text-sm ${msg.ok ? 'text-green-300' : 'text-red-300'}`}>{msg.text}</p>
          )}

          <button className="btn btn-primary mt-2" disabled={busy}>
            {busy ? 'A processar…' : mode === 'login' ? 'Entrar' : mode === 'register' ? 'Criar conta' : 'Enviar link'}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-line flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {mode !== 'login' && (
            <button className="text-mist hover:text-bone" onClick={() => setMode('login')}>Já tenho conta — entrar</button>
          )}
          {mode !== 'register' && (
            <button className="text-mist hover:text-bone" onClick={() => setMode('register')}>Criar conta nova</button>
          )}
          {mode !== 'reset' && (
            <button className="text-dim hover:text-bone" onClick={() => setMode('reset')}>Esqueci a palavra-passe</button>
          )}
        </div>
      </div>
    </PageShell>
  )
}
