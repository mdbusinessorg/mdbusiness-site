import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

export function Spinner({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-dim">
      <div className="w-6 h-6 rounded-full border-2 border-line-strong border-t-bone animate-spin" />
      {label && <span className="text-sm">{label}</span>}
    </div>
  )
}

export function Empty({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="card text-center py-10">
      <p className="text-bone font-medium">{title}</p>
      {hint && <p className="text-dim text-sm mt-1">{hint}</p>}
    </div>
  )
}

export function SectionTitle({ kicker, title, right }: { kicker?: string; title: string; right?: ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-4 mb-6">
      <div>
        {kicker && <p className="text-[10px] tracking-[0.3em] uppercase text-dim mb-2">{kicker}</p>}
        <h2 className="font-display font-800 text-2xl md:text-3xl tracking-tight">{title}</h2>
      </div>
      {right}
    </div>
  )
}

/* ---------- toasts ---------- */

interface Toast { id: number; text: string; err?: boolean }
const ToastCtx = createContext<(text: string, err?: boolean) => void>(() => {})
export const useToast = () => useContext(ToastCtx)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const push = useCallback((text: string, err?: boolean) => {
    const id = Date.now() + Math.random()
    setToasts((t) => [...t, { id, text, err }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4200)
  }, [])
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="toast-stack">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.err ? 'border-red-400/40 text-red-200' : ''}`}>{t.text}</div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}

export function Modal({ title, onClose, children, wide }: { title: string; onClose: () => void; children: ReactNode; wide?: boolean }) {
  return (
    <div className="fixed inset-0 z-[96] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div
        className={`w-full ${wide ? 'sm:max-w-3xl' : 'sm:max-w-lg'} max-h-[92vh] overflow-y-auto card !rounded-b-none sm:!rounded-2xl border-line-strong`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display font-700 text-lg">{title}</h3>
          <button onClick={onClose} className="w-9 h-9 rounded-full border border-line-strong text-lg leading-none">×</button>
        </div>
        {children}
      </div>
    </div>
  )
}

export function PageShell({ children, wide }: { children: ReactNode; wide?: boolean }) {
  return (
    <div className={`mx-auto ${wide ? 'max-w-6xl' : 'max-w-2xl'} px-4 md:px-8 pt-28 md:pt-32 pb-20 min-h-screen`}>
      {children}
    </div>
  )
}
