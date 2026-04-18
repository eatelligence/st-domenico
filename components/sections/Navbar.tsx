'use client'

import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Menu', href: '#menu' },
  { label: 'Functions', href: '#bookings' },
  { label: "What's On", href: '#specials' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <>
      <nav
        className={cn(
          'w-full transition-[background-color,border-color,box-shadow,backdrop-filter,padding] duration-500',
          scrolled
            ? 'navbar-blur bg-cream/90 shadow-sm border-b border-gold/10 py-2 lg:py-3'
            : 'bg-transparent py-3 lg:py-5'
        )}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Logo — HTML text so next/font CSS classes always apply correctly */}
          <a href="#" className="group select-none" aria-label="St Domenico — Home">
            <Logo scrolled={scrolled} />
          </a>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  'font-bebas text-sm tracking-[0.15em] transition-colors duration-200 relative group',
                  scrolled ? 'text-charcoal hover:text-terracotta' : 'text-cream hover:text-gold'
                )}
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href="#bookings"
              className={cn(
                'font-bebas text-sm tracking-[0.2em] px-6 py-2.5 transition-all duration-300',
                scrolled
                  ? 'bg-terracotta text-cream hover:bg-gold hover:text-charcoal'
                  : 'bg-cream/10 border border-cream/40 text-cream hover:bg-cream hover:text-charcoal'
              )}
            >
              Book Now
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className={cn(
              'lg:hidden flex items-center justify-center w-11 h-11 transition-colors rounded',
              scrolled ? 'text-charcoal' : 'text-cream'
            )}
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            aria-expanded={mobileOpen}
          >
            <Menu size={22} />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div
        className={cn(
          'fixed inset-0 z-50 lg:hidden transition-all duration-500',
          mobileOpen ? 'visible' : 'invisible'
        )}
      >
        <div
          className={cn(
            'absolute inset-0 bg-charcoal/80 backdrop-blur-sm transition-opacity duration-500',
            mobileOpen ? 'opacity-100' : 'opacity-0'
          )}
          onClick={() => setMobileOpen(false)}
        />
        <div
          className={cn(
            'absolute right-0 top-0 w-4/5 max-w-xs bg-charcoal flex flex-col transition-transform duration-500 ease-out',
            mobileOpen ? 'translate-x-0' : 'translate-x-full'
          )}
          style={{ height: '100dvh' }}
        >
          <div className="flex justify-between items-center px-6 py-5 border-b border-gold/10">
            <span className="font-playfair text-gold text-lg italic">Menu</span>
            <button
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center w-11 h-11 text-cream/60 hover:text-cream transition-colors -mr-2"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>
          <nav className="flex-1 flex flex-col justify-center px-8 gap-5">
            {navLinks.map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="font-bebas text-2xl tracking-[0.15em] text-cream hover:text-gold transition-colors py-1"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div
            className="px-8 pb-8 pt-6 border-t border-gold/10"
            style={{ paddingBottom: 'calc(2rem + env(safe-area-inset-bottom))' }}
          >
            <a
              href="#bookings"
              onClick={() => setMobileOpen(false)}
              className="block text-center font-bebas text-lg tracking-widest bg-terracotta text-cream py-4 hover:bg-gold hover:text-charcoal transition-colors"
            >
              Book Now
            </a>
            <p className="text-cream/30 text-xs text-center mt-4 font-inter">
              428 Bridge Rd, Richmond · 0468 318 624
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

function Logo({ scrolled }: { scrolled: boolean }) {
  const textColor = scrolled ? 'text-charcoal' : 'text-cream'
  return (
    <div className="flex flex-col items-center w-28 sm:w-32 lg:w-36">
      {/* Top rule */}
      <div className="w-full h-px bg-gold/60 mb-[3px]" />
      {/* Brand name — uses CSS font class, never clips like SVG text */}
      <span className={cn('font-bebas tracking-[0.22em] text-[17px] sm:text-[18px] lg:text-[20px] leading-none transition-colors duration-300', textColor)}>
        ST DOMENICO
      </span>
      {/* Tagline */}
      <span className="font-inter text-[6.5px] sm:text-[7px] tracking-[0.32em] uppercase leading-none mt-[3px]" style={{ color: '#C9A96E' }}>
        EST. 2015 · RICHMOND
      </span>
      {/* Bottom rule */}
      <div className="w-full h-px bg-gold/60 mt-[3px]" />
    </div>
  )
}
