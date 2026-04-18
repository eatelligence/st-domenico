import TopBar from '@/components/sections/TopBar'
import Navbar from '@/components/sections/Navbar'
import Hero from '@/components/sections/Hero'
import About from '@/components/sections/About'
import Specials from '@/components/sections/Specials'
import BookingWidget from '@/components/sections/BookingWidget'
import MenuServer from '@/components/sections/MenuServer'
import Gallery from '@/components/sections/Gallery'
import FAQ from '@/components/sections/FAQ'
import Contact from '@/components/sections/Contact'
import Footer from '@/components/sections/Footer'
import MobileCTA from '@/components/ui/MobileCTA'

export default function Home() {
  return (
    // has-mobile-cta adds bottom padding on mobile so content never hides behind the CTA bar
    <main className="relative has-mobile-cta">
      <TopBar />
      <Navbar />
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
