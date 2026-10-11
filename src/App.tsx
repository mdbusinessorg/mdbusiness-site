import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { SmoothScroll } from './motion/SmoothScroll'
import { CartProvider } from './state/cart'
import { AuthProvider } from './lib/auth'
import { ToastProvider } from './lib/ui'
import { Cursor } from './components/Cursor'
import { Intro } from './components/Intro'
import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { Marquee } from './components/Marquee'
import { Statement } from './components/Statement'
import { Founder } from './components/Founder'
import { Services } from './components/Services'
import { Process } from './components/Process'
import { Work } from './components/Work'
import { Stats } from './components/Stats'
import { Testimonials } from './components/Testimonials'
import { Plans } from './components/Plans'
import { Faq } from './components/Faq'
import { Cta } from './components/Cta'
import { Footer } from './components/Footer'
import { CartDrawer } from './components/CartDrawer'
import { Carla } from './components/Carla'
import { QuotePage } from './pages/QuotePage'
import { AuthPage } from './pages/AuthPage'
import { PortalHome, PortalProject } from './pages/Portal'
import { AdminHome, AdminProject } from './pages/Admin'

function Landing() {
  const [started, setStarted] = useState(false)
  return (
    <CartProvider>
      <SmoothScroll>
        <div className="grain min-h-screen bg-ink text-bone">
          <Cursor />
          <Intro onDone={() => setStarted(true)} />
          <Nav />
          <main>
            <Hero started={started} />
            <Marquee />
            <Statement />
            <Services />
            <Process />
            <Work />
            <Stats />
            <Testimonials />
            <Plans />
            <Faq />
            <Founder />
            <Cta />
          </main>
          <Footer />
          <CartDrawer />
          <Carla />
        </div>
      </SmoothScroll>
    </CartProvider>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/orcamento" element={<QuotePage />} />
            <Route path="/entrar" element={<AuthPage />} />
            <Route path="/portal" element={<PortalHome />} />
            <Route path="/portal/:id" element={<PortalProject />} />
            <Route path="/admin" element={<AdminHome />} />
            <Route path="/admin/:id" element={<AdminProject />} />
            <Route path="*" element={<Landing />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
