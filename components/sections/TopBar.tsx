'use client'

import { useState } from 'react'
import { ChevronRight, X } from 'lucide-react'

export default function TopBar() {
  const [visible, setVisible] = useState(true)

  if (!visible) return null

  return (
    <div className="bg-terracotta text-cream relative z-50">
      <div className="max-w-7xl mx-auto px-4 pr-10 py-2 flex items-center justify-center gap-2 text-center">
        <span className="text-sm shrink-0">🍰</span>
        <p className="text-[11px] sm:text-sm font-inter tracking-wide leading-snug">
          <strong className="font-semibold">Free Nutella Calzone</strong>{' '}
          after dinner <strong className="font-semibold">Tue – Thu</strong>
        </p>
        <a
          href="#bookings"
          className="hidden sm:flex items-center gap-0.5 text-gold-light hover:text-gold transition-colors text-sm font-semibold whitespace-nowrap group shrink-0"
          aria-label="Book now"
        >
          Book Now
          <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </a>
      </div>
      {/* 44×44 dismiss touch target */}
      <button
        onClick={() => setVisible(false)}
        className="absolute right-0 top-0 bottom-0 w-11 flex items-center justify-center text-cream/60 hover:text-cream transition-colors"
        aria-label="Close promotional bar"
      >
        <X size={13} />
      </button>
    </div>
  )
}
