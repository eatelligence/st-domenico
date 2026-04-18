import { Instagram, Facebook } from 'lucide-react'
import { restaurantInfo, openingHours } from '@/lib/data/hours'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-charcoal text-cream" role="contentinfo">
      {/* Gold ornament top */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
      <div className="pt-4 pb-1">
        <div className="gold-divider" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          {/* Brand column */}
          <div className="lg:col-span-1">
            {/* Logo */}
            <div className="mb-6">
              <svg
                width="140"
                height="48"
                viewBox="0 0 160 52"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="St Domenico"
              >
                <line x1="5" y1="8" x2="155" y2="8" stroke="#C9A96E" strokeWidth="0.5" opacity="0.5" />
                <text x="80" y="30" textAnchor="middle" fontFamily="'Bebas Neue', sans-serif" fontSize="22" letterSpacing="5" fill="#F5EFE4">ST DOMENICO</text>
                <text x="80" y="42" textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize="7" letterSpacing="4" fill="#C9A96E" opacity="0.8">EST. 2015 · RICHMOND</text>
                <line x1="5" y1="47" x2="155" y2="47" stroke="#C9A96E" strokeWidth="0.5" opacity="0.5" />
                <circle cx="5" cy="8" r="1.2" fill="#C9A96E" opacity="0.4" />
                <circle cx="155" cy="8" r="1.2" fill="#C9A96E" opacity="0.4" />
                <circle cx="5" cy="47" r="1.2" fill="#C9A96E" opacity="0.4" />
                <circle cx="155" cy="47" r="1.2" fill="#C9A96E" opacity="0.4" />
              </svg>
            </div>
            <div className="space-y-2 text-cream/50 text-sm font-inter">
              <p>428 Bridge Rd</p>
              <p>Richmond VIC 3121</p>
              <p>Melbourne, Australia</p>
            </div>
            <a
              href={restaurantInfo.phoneHref}
              className="block mt-3 text-gold/70 hover:text-gold transition-colors text-sm font-inter"
            >
              {restaurantInfo.phone}
            </a>
            <div className="flex gap-3 mt-5">
              <a
                href={restaurantInfo.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 border border-gold/20 flex items-center justify-center text-cream/50 hover:text-gold hover:border-gold/50 transition-all"
                aria-label="Instagram"
              >
                <Instagram size={15} />
              </a>
              <a
                href={restaurantInfo.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 border border-gold/20 flex items-center justify-center text-cream/50 hover:text-gold hover:border-gold/50 transition-all"
                aria-label="Facebook"
              >
                <Facebook size={15} />
              </a>
            </div>
          </div>

          {/* Hours column */}
          <div>
            <h3 className="font-bebas text-xs tracking-[0.3em] text-gold/60 mb-5 uppercase">
              Opening Hours
            </h3>
            <div className="space-y-2">
              {openingHours.map((day) => (
                <div key={day.day} className="flex justify-between text-sm">
                  <span className={day.open ? 'text-cream/60' : 'text-cream/25'}>{day.day.slice(0, 3)}</span>
                  <span className={day.open ? 'text-cream/50' : 'text-cream/20'}>{day.open ? '4:30–10pm' : 'Closed'}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Site map column */}
          <div>
            <h3 className="font-bebas text-xs tracking-[0.3em] text-gold/60 mb-5 uppercase">
              Navigate
            </h3>
            <ul className="space-y-2.5">
              {[
                { label: 'About', href: '#about' },
                { label: 'Our Menu', href: '#menu' },
                { label: 'Functions', href: '#bookings' },
                { label: "What's On", href: '#specials' },
                { label: 'Gallery', href: '#gallery' },
                { label: 'Contact', href: '#contact' },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="font-inter text-sm text-cream/50 hover:text-gold transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Bookings column */}
          <div>
            <h3 className="font-bebas text-xs tracking-[0.3em] text-gold/60 mb-5 uppercase">
              Order & Book
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#bookings"
                  className="inline-flex items-center gap-2 font-bebas text-sm tracking-widest bg-terracotta text-cream px-6 py-3 hover:bg-gold hover:text-charcoal transition-all duration-300"
                >
                  Book a Table
                </a>
              </li>
              <li>
                <a
                  href={restaurantInfo.orderPickup}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-inter text-sm text-cream/50 hover:text-gold transition-colors block"
                >
                  Order Pick-Up →
                </a>
              </li>
              <li>
                <a
                  href={restaurantInfo.orderDelivery}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-inter text-sm text-cream/50 hover:text-gold transition-colors block"
                >
                  Order Delivery →
                </a>
              </li>
            </ul>

            <div className="mt-8 p-4 border border-gold/10 bg-cream/5">
              <p className="font-playfair italic text-gold/80 text-sm mb-1">BYO Wine</p>
              <p className="font-inter text-cream/40 text-xs">No corkage fee · Enjoy your favourite bottle</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gold/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="font-inter text-cream/30 text-xs">
            © {currentYear} St Domenico Pizza Bar. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="font-inter text-cream/30 hover:text-cream/50 text-xs transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="font-inter text-cream/30 hover:text-cream/50 text-xs transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
