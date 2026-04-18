'use client'

import { ChevronDown, ArrowRight } from 'lucide-react'
import Image from 'next/image'

const anim = (delay: number, duration = 0.6, type: 'up' | 'fade' = 'up') => ({
  animation: `${type === 'up' ? 'fadeInUp' : 'fadeIn'} ${duration}s ease-out both`,
  animationDelay: `${delay}s`,
})

export default function Hero() {
  return (
    <section
      className="relative flex items-center justify-center overflow-hidden"
      style={{ minHeight: '100dvh' }}
      aria-label="Hero section"
    >
      {/* Background image with Ken Burns */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full animate-ken-burns">
          <Image
            src="/images/StDomenico-Italian-Restaurant-Bridge-Road-Richmond-Pizza-Pasta.webp"
            alt="St Domenico — authentic Neapolitan pizzas, pasta and Italian drinks on a rustic table"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/40 to-charcoal/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/40 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 text-center pt-24 pb-20 sm:pt-28 sm:pb-24">
        {/* Eyebrow */}
        <div className="hero-anim mb-4 sm:mb-6" style={anim(0.2)}>
          <span className="font-bebas text-gold tracking-[0.3em] sm:tracking-[0.4em] text-xs sm:text-sm">
            Richmond, Melbourne · Est. 2015
          </span>
          <div className="gold-divider mt-3" />
        </div>

        {/* Title */}
        <h1 className="font-playfair italic text-cream mb-5 sm:mb-8 leading-tight">
          <div className="flex flex-wrap justify-center gap-x-2 sm:gap-x-3 gap-y-1 text-[2.25rem] sm:text-6xl lg:text-7xl xl:text-8xl">
            {['A', 'slice', 'of', 'Napoli'].map((word, i) => (
              <span
                key={i}
                className="hero-anim inline-block"
                style={anim(0.5 + i * 0.08)}
              >
                {word}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-x-2 sm:gap-x-3 gap-y-1 text-[2.25rem] sm:text-6xl lg:text-7xl xl:text-8xl mt-1">
            {['in', 'the', 'heart', 'of', 'Richmond'].map((word, i) => (
              <span
                key={i}
                className="hero-anim inline-block"
                style={anim(0.82 + i * 0.08)}
              >
                {word}
              </span>
            ))}
          </div>
        </h1>

        {/* Subtitle — hidden on very small screens to save vertical space */}
        <p
          className="hero-anim hidden sm:block font-inter text-cream/75 text-base sm:text-lg max-w-xl mx-auto mb-8 leading-relaxed"
          style={anim(1.3, 0.8, 'fade')}
        >
          Richmond Melbourne&apos;s home of authentic Neapolitan pizza — wood-fired, hand-stretched,
          made with imported San Marzano tomatoes and fior di latte. Open Tuesday to Sunday from 4:30pm. BYO wine.
        </p>

        {/* Short subtitle on xs only */}
        <p
          className="hero-anim sm:hidden font-inter text-cream/70 text-sm mx-auto mb-7 leading-relaxed"
          style={anim(1.3, 0.8, 'fade')}
        >
          Authentic Neapolitan pizza · Richmond · BYO wine
        </p>

        {/* CTAs */}
        <div
          className="hero-anim flex flex-col xs:flex-row flex-wrap items-center justify-center gap-3"
          style={anim(1.5)}
        >
          <a
            href="#bookings"
            className="w-full xs:w-auto font-bebas tracking-[0.2em] text-base bg-terracotta text-cream px-8 py-4 hover:bg-gold hover:text-charcoal transition-all duration-300 shadow-warm group flex items-center justify-center gap-2 min-h-[52px]"
          >
            Book a Table
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="https://www.menulog.com.au/restaurants-st-domenico-pizza-bar"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full xs:w-auto font-bebas tracking-[0.2em] text-base border border-cream/40 text-cream px-8 py-4 hover:bg-cream/10 hover:border-cream transition-all duration-300 text-center min-h-[52px] flex items-center justify-center"
          >
            Order Pick-up
          </a>
          <a
            href="https://www.ubereats.com/au/store/st-domenico-pizza-bar"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full xs:w-auto font-bebas tracking-[0.2em] text-base border border-cream/40 text-cream px-8 py-4 hover:bg-cream/10 hover:border-cream transition-all duration-300 text-center min-h-[52px] flex items-center justify-center"
          >
            Order Delivery
          </a>
        </div>

        {/* Stats strip */}
        <div
          className="hero-anim mt-10 sm:mt-16 flex items-center justify-center gap-8 sm:gap-16"
          style={anim(1.8, 0.8, 'fade')}
        >
          {[
            { num: '15+', label: 'Years' },
            { num: '100%', label: 'Italian' },
            { num: 'BYO', label: 'Wine' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-playfair text-xl sm:text-3xl text-gold">{stat.num}</div>
              <div className="font-bebas text-[10px] sm:text-xs tracking-[0.2em] text-cream/50 mt-0.5">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator — hidden on mobile to reduce clutter */}
      <a
        href="#about"
        className="hero-anim hidden sm:flex absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex-col items-center gap-2 text-cream/50 hover:text-gold transition-colors group"
        style={anim(2.2, 0.6, 'fade')}
        aria-label="Scroll down"
      >
        <span className="font-bebas text-xs tracking-[0.3em]">Discover</span>
        <ChevronDown size={20} className="animate-bounce-gentle group-hover:text-gold" />
      </a>
    </section>
  )
}
