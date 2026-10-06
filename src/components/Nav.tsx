import { useEffect, useRef, useState } from 'react'
import { gsap, reducedMotion } from '../motion/gsap'
import { useCart } from '../state/cart'
import { Magnetic } from '../motion/Magnetic'
import { NAV_LINKS as LINKS } from '../data/navigation'
import { CONTACT } from '../data/contact'

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menu, setMenu] = useState(false)
  const { items, setOpen } = useCart()
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!menu || !menuRef.current || reducedMotion()) return
    gsap.fromTo(
      menuRef.current.querySelectorAll('.m-item'),
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.06, ease: 'expo.out', delay: 0.15 },
    )
  }, [menu])

  const go = (href: string) => {
    setMenu(false)
    document.querySelector(href)?.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth' })
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[90] px-4 md:px-8 pt-4">
        <nav
          className={`nav-shell mx-auto max-w-[1400px] flex items-center justify-between rounded-full border border-transparent px-5 md:px-7 py-3 ${scrolled ? 'scrolled' : ''}`}
        >
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault()
              window.scrollTo({ top: 0, behavior: reducedMotion() ? 'auto' : 'smooth' })
            }}
            className="flex items-center gap-3"
            aria-label="MD Business — início"
          >
            <img src="/logo.png" alt="MD Business" className="w-9 h-9 object-contain invert" />
            <span className="font-display font-800 tracking-tight text-sm hidden sm:block">MD BUSINESS</span>
          </a>

          <div className="hidden lg:flex items-center gap-8">
            {LINKS.map((l) => (
              <button
                key={l.href}
                onClick={() => go(l.href)}
                className="text-sm text-mist hover:text-bone transition-colors"
              >
                {l.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={() => setOpen(true)}
              aria-label="Abrir carrinho"
              className="relative w-10 h-10 rounded-full border border-line-strong flex items-center justify-center text-mist hover:text-bone hover:border-bone/40 transition-colors"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M6 7h12l-1.5 12h-9L6 7z" />
                <path d="M9 7a3 3 0 016 0" />
              </svg>
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gold text-ink text-[10px] font-bold flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </button>
            <Magnetic className="hidden md:block">
              <button
                onClick={() => go('#planos')}
                className="px-6 py-2.5 rounded-full bg-gold text-ink text-sm font-semibold hover:bg-gold-soft transition-colors"
              >
                Iniciar Projecto
              </button>
            </Magnetic>
            <button
              onClick={() => setMenu(true)}
              aria-label="Abrir menu"
              className="lg:hidden w-10 h-10 rounded-full border border-line-strong flex flex-col items-center justify-center gap-1.5"
            >
              <span className="w-4 h-px bg-bone" />
              <span className="w-4 h-px bg-bone" />
            </button>
          </div>
        </nav>
      </header>

      {menu && (
        <div ref={menuRef} className="fixed inset-0 z-[95] bg-ink flex flex-col" role="dialog" aria-label="Menu">
          <div className="flex items-center justify-between px-6 pt-7">
            <img src="/logo.png" alt="MD Business" className="w-10 h-10 object-contain invert" />
            <button
              onClick={() => setMenu(false)}
              aria-label="Fechar menu"
              className="w-11 h-11 rounded-full border border-line-strong flex items-center justify-center text-2xl leading-none"
            >
              ×
            </button>
          </div>
          <div className="flex-1 flex flex-col justify-center px-8 gap-2">
            {LINKS.map((l, i) => (
              <button
                key={l.href}
                onClick={() => go(l.href)}
                className="m-item text-left font-display font-800 uppercase tracking-tight text-5xl sm:text-6xl text-bone hover:text-gold transition-colors py-1"
                style={{ transitionDelay: `${i * 20}ms` }}
              >
                {l.label}
              </button>
            ))}
          </div>
          <div className="px-8 pb-10 flex items-center justify-between text-sm text-dim">
            <span>{CONTACT.email}</span>
            <span>{CONTACT.phone}</span>
          </div>
        </div>
      )}
    </>
  )
}
