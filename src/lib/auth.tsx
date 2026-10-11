import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from './supabase'

export interface Profile {
  id: string
  email: string | null
  full_name: string | null
  phone: string | null
  company: string | null
  role: 'client' | 'admin' | 'project_manager' | 'designer' | 'developer' | 'support'
}

const STAFF_ROLES = ['admin', 'project_manager', 'designer', 'developer', 'support']

interface AuthState {
  session: Session | null
  user: User | null
  profile: Profile | null
  loading: boolean
  isStaff: boolean
  isAdmin: boolean
  signIn: (email: string, password: string) => Promise<string | null>
  signUp: (name: string, email: string, password: string, phone?: string) => Promise<string | null>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<string | null>
}

const Ctx = createContext<AuthState>({
  session: null,
  user: null,
  profile: null,
  loading: true,
  isStaff: false,
  isAdmin: false,
  signIn: async () => null,
  signUp: async () => null,
  signOut: async () => {},
  resetPassword: async () => null,
})

export const useAuth = () => useContext(Ctx)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }
    let alive = true
    supabase.auth.getSession().then(({ data }) => {
      if (!alive) return
      setSession(data.session)
      loadProfile(data.session?.user.id ?? null)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_ev, s) => {
      setSession(s)
      loadProfile(s?.user.id ?? null)
    })
    return () => {
      alive = false
      sub.subscription.unsubscribe()
    }
  }, [])

  async function loadProfile(uid: string | null) {
    if (!uid || !supabase) {
      setProfile(null)
      setLoading(false)
      return
    }
    const { data } = await supabase.from('profiles').select('*').eq('id', uid).maybeSingle()
    setProfile((data as Profile) ?? { id: uid, email: null, full_name: null, phone: null, company: null, role: 'client' })
    setLoading(false)
  }

  const signIn = async (email: string, password: string) => {
    if (!supabase) return 'Serviço indisponível'
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return error ? translateAuthError(error.message) : null
  }

  const signUp = async (name: string, email: string, password: string, phone?: string) => {
    if (!supabase) return 'Serviço indisponível'
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name, phone: phone ?? null } },
    })
    return error ? translateAuthError(error.message) : null
  }

  const signOut = async () => {
    await supabase?.auth.signOut()
    setProfile(null)
  }

  const resetPassword = async (email: string) => {
    if (!supabase) return 'Serviço indisponível'
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/entrar`,
    })
    return error ? translateAuthError(error.message) : null
  }

  const role = profile?.role ?? 'client'

  return (
    <Ctx.Provider
      value={{
        session,
        user: session?.user ?? null,
        profile,
        loading,
        isStaff: STAFF_ROLES.includes(role),
        isAdmin: role === 'admin',
        signIn,
        signUp,
        signOut,
        resetPassword,
      }}
    >
      {children}
    </Ctx.Provider>
  )
}

function translateAuthError(msg: string): string {
  if (msg.includes('Invalid login')) return 'Email ou palavra-passe incorrectos.'
  if (msg.includes('already registered')) return 'Este email já está registado. Tenta entrar.'
  if (msg.includes('Email not confirmed')) return 'Confirma o teu email antes de entrar. Verifica a caixa de entrada.'
  if (msg.toLowerCase().includes('password')) return 'Palavra-passe demasiado fraca (mín. 6 caracteres).'
  return msg
}
