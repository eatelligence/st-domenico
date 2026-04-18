'use client'

import { useState } from 'react'
import { ChevronRight, X } from 'lucide-react'

export default function TopBar() {
  const [visible, setVisible] = useState(true)

  if (!visible) return null

  return (
    <div className="bg-terracotta text-cream relative z-50">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-center gap-3 text-center">
        <span className="text-base">🍰</span>
        <p className="text-xs sm:text-sm font-inter tracking-wide leading-snug">
          <strong className="font-semibold">Free Nutella Calzone</strong> after dinner every{' '}
          <strong className="font-semibold">Tuesday – Thursday</strong>
        </p>
        <a
          href="#bookings"
          className="hidden sm:flex items-center gap-0.5 text-gold-light hover:text-gold transition-colors text-sm font-semibold whitespace-nowrap group"
          aria-label="Book now"
        >
          Book Now
          <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </a>
        <button
          onClick={() => setVisible(false)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-cream/60 hover:text-cream transition-colors"
          aria-label="Close promotional bar"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  )
}
