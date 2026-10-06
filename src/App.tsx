import { useState } from 'react'
import { SmoothScroll } from './motion/SmoothScroll'
import { CartProvider } from './state/cart'
import { Cursor } from './components/Cursor'
import { Intro } from './components/Intro'
import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { Marquee } from './components/Marquee'
import { Statement } from './components/Statement'
import { Founder } from './components/Founder'
import { Services } from './components/Services'
import { Work } from './components/Work'
import { Stats } from './components/Stats'
import { Testimonials } from './components/Testimonials'
import { Plans } from './components/Plans'
import { Faq } from './components/Faq'
import { Cta } from './components/Cta'
import { Footer } from './components/Footer'
import { CartDrawer } from './components/CartDrawer'
import { Carla } from './components/Carla'

export default function App() {
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
            <Founder />
            <Services />
            <Work />
            <Stats />
            <Testimonials />
            <Plans />
            <Faq />
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
