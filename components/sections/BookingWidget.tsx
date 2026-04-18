'use client'

import { useEffect } from 'react'
import Accordion from '@/components/ui/Accordion'
import ScrollReveal from '@/components/ui/ScrollReveal'

const accordionItems = [
  {
    title: 'Booking Terms & Conditions',
    content: (
      <div className="space-y-3 text-charcoal/70 text-sm leading-relaxed">
        <ul className="space-y-2 list-disc list-inside">
          <li>Maximum 10 guests per online booking.</li>
          <li>
            Sittings available: <strong>5:00pm–7:00pm</strong> and{' '}
            <strong>7:15pm–10:00pm</strong>.
          </li>
          <li>Maximum 40 guests per sitting.</li>
          <li>
            Please inform us of any dietary requirements or allergies at the time of booking.
          </li>
          <li>We hold reservations for 15 minutes. Please call if you are running late.</li>
          <li>Groups of 10+ please contact us directly for private dining options.</li>
        </ul>
      </div>
    ),
  },
  {
    title: 'Functions & Catering',
    content: (
      <div className="space-y-3 text-charcoal/70 text-sm leading-relaxed">
        <p>
          Planning a special event? St Domenico offers exclusive catering and function packages
          for birthdays, corporate events, and private dining experiences.
        </p>
        <p>
          Our team will work with you to create a bespoke menu of authentic Neapolitan pizza,
          pasta, and antipasto that will delight your guests.
        </p>
        <p>
          <strong>Contact us:</strong>{' '}
          <a href="tel:+61468318624" className="text-terracotta hover:underline">
            0468 318 624
          </a>{' '}
          or email{' '}
          <a href="mailto:info@stdomenicopizzabar.com" className="text-terracotta hover:underline">
            info@stdomenicopizzabar.com
          </a>
        </p>
      </div>
    ),
  },
  {
    title: 'Delivery Areas',
    content: (
      <div className="space-y-3 text-charcoal/70 text-sm leading-relaxed">
        <p>We deliver to the following Melbourne suburbs:</p>
        <div className="grid grid-cols-2 gap-1">
          {[
            'Abbotsford',
            'Burnley',
            'Cremorne',
            'East Melbourne',
            'Fitzroy',
            'Hawthorn',
            'Richmond',
            'South Yarra',
          ].map((suburb) => (
            <div key={suburb} className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-gold" />
              {suburb}
            </div>
          ))}
        </div>
        <p className="mt-2">
          Order via{' '}
          <a
            href="https://www.ubereats.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-terracotta hover:underline"
          >
            Uber Eats
          </a>{' '}
          or{' '}
          <a
            href="https://www.menulog.com.au"
            target="_blank"
            rel="noopener noreferrer"
            className="text-terracotta hover:underline"
          >
            Menulog
          </a>
          .
        </p>
      </div>
    ),
  },
]

export default function BookingWidget() {
  useEffect(() => {
    // Avoid injecting the script more than once
    if (document.getElementById('oddle-widget-script')) return

    const script = document.createElement('script')
    script.id = 'oddle-widget-script'
    script.type = 'text/javascript'
    script.src =
      'https://reserve.oddle.me/js/widget.js?type=standard&brandShortName=stdomenico&utm_source=corp-website'
    script.async = true
    document.body.appendChild(script)

    return () => {
      // Clean up on unmount so HMR re-injects cleanly in dev
      const existing = document.getElementById('oddle-widget-script')
      if (existing) existing.remove()
    }
  }, [])

  return (
    <section
      id="bookings"
      className="py-16 sm:py-24 lg:py-36 bg-cream grain-overlay relative"
      aria-labelledby="booking-heading"
    >
      <div className="absolute inset-8 border border-gold/10 pointer-events-none hidden lg:block" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <ScrollReveal>
            <span className="font-bebas text-gold tracking-[0.4em] text-sm">
              Make a Reservation
            </span>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h2
              id="booking-heading"
              className="font-playfair italic text-4xl lg:text-5xl text-charcoal mt-3 mb-3"
            >
              Reserve Your Table
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p className="font-inter text-charcoal/60 text-base max-w-lg mx-auto">
              Join us for an authentic Neapolitan experience. Book online or call us on{' '}
              <a href="tel:+61468318624" className="text-terracotta hover:underline font-medium">
                0468 318 624
              </a>
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.25}>
            <div className="gold-divider mt-6" />
          </ScrollReveal>
        </div>

        {/* Oddle booking widget — no overflow-hidden so the iframe renders fully */}
        <ScrollReveal delay={0.3}>
          <div className="bg-white border border-gold/20 shadow-warm mb-10 relative">
            {/* Corner ornaments — pointer-events-none so they never block the widget */}
            <div className="absolute top-4 left-4 w-6 h-6 border-l border-t border-gold/30 z-10 pointer-events-none" />
            <div className="absolute top-4 right-4 w-6 h-6 border-r border-t border-gold/30 z-10 pointer-events-none" />
            <div className="absolute bottom-4 left-4 w-6 h-6 border-l border-b border-gold/30 z-10 pointer-events-none" />
            <div className="absolute bottom-4 right-4 w-6 h-6 border-r border-b border-gold/30 z-10 pointer-events-none" />

            {/* min-h ensures container is visible while widget loads */}
            <div id="reserve-container" className="min-h-[400px] w-full" />
          </div>
        </ScrollReveal>

        {/* Hours reminder */}
        <ScrollReveal delay={0.35}>
          <div className="text-center mb-10">
            <p className="font-inter text-charcoal/50 text-sm">
              Open <strong className="text-charcoal">Tuesday – Sunday</strong>, 4:30pm – 10:00pm
              &nbsp;·&nbsp; Monday closed
            </p>
          </div>
        </ScrollReveal>

        {/* Accordion — reduced horizontal padding on mobile */}
        <ScrollReveal delay={0.4}>
          <div className="border border-gold/20 bg-white/50 px-4 sm:px-8 py-4">
            <Accordion items={accordionItems} />
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
