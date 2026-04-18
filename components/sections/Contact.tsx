'use client'

import { MapPin, Phone, Clock, Instagram, Facebook, ExternalLink } from 'lucide-react'
import { openingHours, restaurantInfo } from '@/lib/data/hours'
import ScrollReveal from '@/components/ui/ScrollReveal'

export default function Contact() {
  const today = new Date().toLocaleDateString('en-AU', { weekday: 'long' })

  return (
    <section
      id="contact"
      className="py-16 sm:py-24 lg:py-36 bg-charcoal grain-overlay relative"
      aria-labelledby="contact-heading"
    >
      {/* Top gold line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-16">
          <ScrollReveal>
            <span className="font-bebas text-gold tracking-[0.4em] text-sm">
              Visit Us
            </span>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h2
              id="contact-heading"
              className="font-playfair italic text-4xl lg:text-5xl text-cream mt-3 mb-4"
            >
              Find Us in Richmond
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <div className="gold-divider" />
          </ScrollReveal>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Map */}
          <ScrollReveal direction="left">
            <div className="relative h-56 sm:h-80 lg:h-[480px] overflow-hidden border border-gold/10">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.8354068394607!2d144.9887!3d-37.8235!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642cabb2d4b73%3A0xf60c3c7e7ad34f0b!2s428%20Bridge%20Rd%2C%20Richmond%20VIC%203121!5e0!3m2!1sen!2sau!4v1700000000000!5m2!1sen!2sau"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'sepia(20%) contrast(90%)' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="St Domenico location map"
                aria-label="Google Maps showing St Domenico location at 428 Bridge Rd, Richmond"
              />
              {/* Map overlay pin animation */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none">
                <div className="bg-terracotta text-cream text-xs font-bebas tracking-widest px-4 py-2 shadow-lg whitespace-nowrap">
                  ST DOMENICO
                </div>
              </div>
            </div>

            <a
              href={restaurantInfo.googleMaps}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full mt-3 font-bebas text-sm tracking-[0.2em] border border-gold/30 text-gold py-3 hover:bg-gold hover:text-charcoal transition-all duration-300"
            >
              Get Directions
              <ExternalLink size={14} />
            </a>
          </ScrollReveal>

          {/* Contact info */}
          <div className="space-y-10">
            <ScrollReveal direction="right" delay={0.1}>
              <div className="flex gap-5 items-start">
                <div className="w-10 h-10 border border-gold/30 flex items-center justify-center flex-shrink-0 mt-1">
                  <MapPin size={18} className="text-gold" />
                </div>
                <div>
                  <p className="font-bebas text-xs tracking-[0.2em] text-gold/60 mb-1">Address</p>
                  <p className="font-playfair text-xl text-cream leading-snug">
                    428 Bridge Rd
                  </p>
                  <p className="font-inter text-cream/60 text-sm mt-1">
                    Richmond VIC 3121, Melbourne
                  </p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right" delay={0.15}>
              <div className="flex gap-5 items-start">
                <div className="w-10 h-10 border border-gold/30 flex items-center justify-center flex-shrink-0 mt-1">
                  <Phone size={18} className="text-gold" />
                </div>
                <div>
                  <p className="font-bebas text-xs tracking-[0.2em] text-gold/60 mb-1">Phone</p>
                  <a
                    href={restaurantInfo.phoneHref}
                    className="font-playfair text-xl text-cream hover:text-gold transition-colors"
                  >
                    {restaurantInfo.phone}
                  </a>
                  <p className="font-inter text-cream/40 text-xs mt-1">
                    Call to book or enquire
                  </p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right" delay={0.2}>
              <div className="flex gap-5 items-start">
                <div className="w-10 h-10 border border-gold/30 flex items-center justify-center flex-shrink-0 mt-1">
                  <Clock size={18} className="text-gold" />
                </div>
                <div className="flex-1">
                  <p className="font-bebas text-xs tracking-[0.2em] text-gold/60 mb-3">
                    Opening Hours
                  </p>
                  <div className="space-y-2">
                    {openingHours.map((day) => {
                      const isToday = day.day === today
                      return (
                        <div
                          key={day.day}
                          className={`flex justify-between items-center py-1 border-b border-gold/5 ${
                            isToday ? 'text-gold' : ''
                          }`}
                        >
                          <span
                            className={`font-inter text-sm ${
                              isToday
                                ? 'text-gold font-semibold'
                                : day.open
                                ? 'text-cream'
                                : 'text-cream/30'
                            }`}
                          >
                            {day.day}
                            {isToday && (
                              <span className="ml-2 text-[10px] font-bebas tracking-wide bg-terracotta/20 text-terracotta px-1.5 py-0.5 rounded-sm">
                                Today
                              </span>
                            )}
                          </span>
                          <span
                            className={`font-inter text-sm ${
                              day.open ? 'text-cream/70' : 'text-cream/30'
                            }`}
                          >
                            {day.hours}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Social */}
            <ScrollReveal direction="right" delay={0.25}>
              <div>
                <p className="font-bebas text-xs tracking-[0.2em] text-gold/60 mb-4">Follow Us</p>
                <div className="flex flex-col xs:flex-row gap-3">
                  <a
                    href={restaurantInfo.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 border border-gold/20 text-cream/70 hover:text-cream hover:border-gold/50 px-5 py-3 transition-all duration-200 text-sm font-inter min-h-[48px]"
                    aria-label="St Domenico on Instagram"
                  >
                    <Instagram size={16} />
                    Instagram
                  </a>
                  <a
                    href={restaurantInfo.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 border border-gold/20 text-cream/70 hover:text-cream hover:border-gold/50 px-5 py-3 transition-all duration-200 text-sm font-inter min-h-[48px]"
                    aria-label="St Domenico on Facebook"
                  >
                    <Facebook size={16} />
                    Facebook
                  </a>
                </div>
              </div>
            </ScrollReveal>

            {/* BYO note */}
            <ScrollReveal direction="right" delay={0.3}>
              <div className="border border-gold/10 bg-cream/5 p-5">
                <p className="font-playfair italic text-gold text-lg mb-1">BYO Wine Welcome</p>
                <p className="font-inter text-cream/50 text-sm leading-relaxed">
                  Bring your favourite bottle — no corkage fee. We also offer a curated selection
                  of Italian wines by the glass.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  )
}
