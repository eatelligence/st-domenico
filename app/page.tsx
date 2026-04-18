import dynamic from 'next/dynamic'
import StickyHeader from '@/components/sections/StickyHeader'
import Hero from '@/components/sections/Hero'
import About from '@/components/sections/About'
import Specials from '@/components/sections/Specials'
import MenuServer from '@/components/sections/MenuServer'

// Code-split below-fold sections — defers their JS from the initial hydration burst
const BookingWidget = dynamic(() => import('@/components/sections/BookingWidget'))
const Gallery = dynamic(() => import('@/components/sections/Gallery'))
const FAQ = dynamic(() => import('@/components/sections/FAQ'))
const Contact = dynamic(() => import('@/components/sections/Contact'))
const Footer = dynamic(() => import('@/components/sections/Footer'))
const MobileCTA = dynamic(() => import('@/components/ui/MobileCTA'))

export default function Home() {
  return (
    <main className="relative has-mobile-cta">
      <StickyHeader />
      <Hero />
      <About />
      <Specials />
      <BookingWidget />
      <MenuServer />
      <Gallery />
      <FAQ />
      <Contact />
      <Footer />
      <MobileCTA />
    </main>
  )
}
