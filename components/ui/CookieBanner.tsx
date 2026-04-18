'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const accepted = localStorage.getItem('cookie-consent')
    if (!accepted) {
      const timer = setTimeout(() => setVisible(true), 2000)
      return () => clearTimeout(timer)
    }
  }, [])

  const accept = () => {
    localStorage.setItem('cookie-consent', 'accepted')
    setVisible(false)
  }

  const decline = () => {
    localStorage.setItem('cookie-consent', 'declined')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-6 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 animate-fade-in-up">
      <div className="bg-charcoal text-cream rounded-lg p-5 shadow-2xl border border-gold/20">
        <button
          onClick={decline}
          className="absolute top-3 right-3 text-cream/50 hover:text-cream transition-colors"
          aria-label="Close"
        >
          <X size={16} />
        </button>
        <p className="font-playfair text-sm mb-1 text-gold">A little heads up</p>
        <p className="text-cream/70 text-xs leading-relaxed mb-4">
          We use cookies to enhance your experience and analyse site traffic. By continuing to browse, you agree to our use of cookies.
        </p>
        <div className="flex gap-3">
          <button
            onClick={accept}
            className="flex-1 bg-terracotta text-cream text-xs font-semibold py-2 px-4 rounded hover:bg-terracotta-dark transition-colors"
          >
            Accept
          </button>
          <button
            onClick={decline}
            className="flex-1 border border-cream/20 text-cream/60 text-xs py-2 px-4 rounded hover:border-cream/40 transition-colors"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  )
}
