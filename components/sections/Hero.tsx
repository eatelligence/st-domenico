'use client'

import { motion } from 'framer-motion'
import { ChevronDown, ArrowRight } from 'lucide-react'
import Image from 'next/image'

const titleWords = ['A', 'slice', 'of', 'Napoli', 'in', 'the', 'heart', 'of', 'Richmond']

export default function Hero() {
  return (
    <section
      className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden"
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
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/30 to-charcoal/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/40 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6"
        >
          <span className="font-bebas text-gold tracking-[0.4em] text-sm">
            Richmond, Melbourne · Est. 2015
          </span>
          <div className="gold-divider mt-3" />
        </motion.div>

        {/* Title with staggered words */}
        <h1 className="font-playfair italic text-cream mb-8 leading-tight">
          {/* Split into two lines */}
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-4xl sm:text-6xl lg:text-7xl xl:text-8xl">
            {['A', 'slice', 'of', 'Napoli'].map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.5 + i * 0.08,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                className="inline-block"
              >
                {word}
              </motion.span>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-4xl sm:text-6xl lg:text-7xl xl:text-8xl mt-1">
            {['in', 'the', 'heart', 'of', 'Richmond'].map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.82 + i * 0.08,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                className="inline-block"
              >
                {word}
              </motion.span>
            ))}
          </div>
        </h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.3 }}
          className="font-inter text-cream/75 text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed"
        >
          Richmond Melbourne&apos;s home of authentic Neapolitan pizza — wood-fired, hand-stretched,
          made with imported San Marzano tomatoes and fior di latte. Open Tuesday to Sunday from 4:30pm. BYO wine.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#bookings"
            className="font-bebas tracking-[0.2em] text-base bg-terracotta text-cream px-10 py-4 hover:bg-gold hover:text-charcoal transition-all duration-300 shadow-warm hover:shadow-gold group flex items-center gap-2"
          >
            Book a Table
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </a>

          <a
            href="https://www.menulog.com.au/restaurants-st-domenico-pizza-bar"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bebas tracking-[0.2em] text-base border border-cream/40 text-cream px-10 py-4 hover:bg-cream/10 hover:border-cream transition-all duration-300"
          >
            Order Pick-up
          </a>

          <a
            href="https://www.ubereats.com/au/store/st-domenico-pizza-bar"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bebas tracking-[0.2em] text-base border border-cream/40 text-cream px-10 py-4 hover:bg-cream/10 hover:border-cream transition-all duration-300"
          >
            Order Delivery
          </a>
        </motion.div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.8 }}
          className="mt-16 flex items-center justify-center gap-10 sm:gap-16"
        >
          {[
            { num: '15+', label: 'Years' },
            { num: '100%', label: 'Italian' },
            { num: 'BYO', label: 'Wine' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-playfair text-2xl sm:text-3xl text-gold">{stat.num}</div>
              <div className="font-bebas text-xs tracking-[0.2em] text-cream/50 mt-0.5">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-cream/50 hover:text-gold transition-colors group"
        aria-label="Scroll down"
      >
        <span className="font-bebas text-xs tracking-[0.3em]">Discover</span>
        <ChevronDown
          size={20}
          className="animate-bounce-gentle group-hover:text-gold"
        />
      </motion.a>
    </section>
  )
}
