import TopBar from '@/components/sections/TopBar'
import Navbar from '@/components/sections/Navbar'
import Hero from '@/components/sections/Hero'
import About from '@/components/sections/About'
import Specials from '@/components/sections/Specials'
import BookingWidget from '@/components/sections/BookingWidget'
import Menu from '@/components/sections/Menu'
import Gallery from '@/components/sections/Gallery'
import FAQ from '@/components/sections/FAQ'
import Contact from '@/components/sections/Contact'
import Footer from '@/components/sections/Footer'

export default function Home() {
  return (
    <main className="relative">
      <TopBar />
      <Navbar />
      <Hero />
      <About />
      <Specials />
      <BookingWidget />
      <Menu />
      <Gallery />
      <FAQ />
      <Contact />
      <Footer />
    </main>
  )
}
