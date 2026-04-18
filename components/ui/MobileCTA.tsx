'use client'

import { useEffect, useState } from 'react'
import { Phone } from 'lucide-react'

export default function MobileCTA() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Show after scrolling past the hero (roughly 80vh)
    const threshold = window.innerHeight * 0.8
    const handleScroll = () => setVisible(window.scrollY > threshold)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      className={`
        md:hidden fixed bottom-0 left-0 right-0 z-40
        transition-transform duration-300 ease-out
        ${visible ? 'translate-y-0' : 'translate-y-full'}
      `}
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      aria-label="Quick actions"
    >
      <div className="bg-charcoal border-t border-gold/20 grid grid-cols-2">
        <a
          href="#bookings"
          className="flex items-center justify-center gap-2 font-bebas text-sm tracking-[0.2em] text-cream bg-terracotta py-4 hover:bg-terracotta-dark active:bg-terracotta-dark transition-colors"
        >
          Book a Table
        </a>
        <a
          href="tel:+61468318624"
          className="flex items-center justify-center gap-2 font-bebas text-sm tracking-[0.2em] text-cream py-4 hover:bg-charcoal/80 active:bg-charcoal/80 transition-colors"
        >
          <Phone size={14} />
          Call Us
        </a>
      </div>
    </div>
  )
}
