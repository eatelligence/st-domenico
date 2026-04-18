'use client'

import { ChevronRight, X } from 'lucide-react'

const MSG = '🍰  Free Nutella Calzone after dinner Tue – Thu  ·  Book Now  ›'

interface TopBarProps {
  onDismiss?: () => void
}

export default function TopBar({ onDismiss }: TopBarProps) {
  return (
    <div className="bg-terracotta text-cream relative overflow-hidden" style={{ height: '36px' }}>
      {/* Marquee track — two copies side-by-side so the loop is seamless */}
      <div className="flex items-center h-full">
        <div className="flex whitespace-nowrap animate-marquee">
          {/* Repeat the message many times so there are no gaps regardless of screen width */}
          {Array.from({ length: 6 }).map((_, i) => (
            <a
              key={i}
              href="#bookings"
              className="inline-flex items-center gap-2 px-12 text-[11px] sm:text-xs font-inter tracking-wide hover:text-gold-light transition-colors"
              aria-label="Book now — Free Nutella Calzone offer"
            >
              <span>{MSG}</span>
              <ChevronRight size={11} className="opacity-70 shrink-0" />
            </a>
          ))}
        </div>
      </div>

      {/* Dismiss — sits above the marquee */}
      <button
        onClick={onDismiss}
        className="absolute right-0 top-0 bottom-0 w-10 flex items-center justify-center text-cream/60 hover:text-cream transition-colors bg-terracotta z-10"
        aria-label="Close promotional bar"
      >
        <X size={12} />
      </button>
    </div>
  )
}
