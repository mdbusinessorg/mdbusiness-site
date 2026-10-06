import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Plan } from '../data/products'

interface CartCtx {
  items: Plan[]
  open: boolean
  setOpen: (v: boolean) => void
  add: (p: Plan) => void
  remove: (id: string) => void
  clear: () => void
}

const Ctx = createContext<CartCtx | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Plan[]>([])
  const [open, setOpen] = useState(false)
  const add = (p: Plan) => {
    setItems((prev) => (prev.some((i) => i.id === p.id) ? prev : [...prev, p]))
    setOpen(true)
  }
  const remove = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id))
  const clear = () => setItems([])
  return <Ctx.Provider value={{ items, open, setOpen, add, remove, clear }}>{children}</Ctx.Provider>
}

export function useCart() {
  const c = useContext(Ctx)
  if (!c) throw new Error('useCart fora de CartProvider')
  return c
}

export const fmtKz = (n: number | null) => (n == null ? 'Personalizado' : `${n.toLocaleString('pt-PT').replace(/,/g, '.')} Kz`)
