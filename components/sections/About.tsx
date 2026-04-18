'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'
import ScrollReveal from '@/components/ui/ScrollReveal'

const badges = [
  { num: '15+', label: 'Years of\nPassion' },
  { num: '100%', label: 'Imported\nIngredients' },
  { num: 'BYO', label: 'Wine\nWelcome' },
]

export default function About() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section
      id="about"
      className="relative py-24 lg:py-36 bg-cream grain-overlay overflow-hidden"
      aria-labelledby="about-heading"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 opacity-[0.03]">
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="90" stroke="#C04A2B" strokeWidth="0.5" />
          <circle cx="100" cy="100" r="70" stroke="#C04A2B" strokeWidth="0.5" />
          <circle cx="100" cy="100" r="50" stroke="#C04A2B" strokeWidth="0.5" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image side */}
          <ScrollReveal direction="left">
            <div className="relative">
              {/* Main image */}
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src="/images/StDomenico_20220218_-09241.webp"
                  alt="St Domenico — outdoor dining experience with attentive service in Richmond"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/20 to-transparent" />
              </div>

              {/* Floating accent image */}
              <div className="absolute -bottom-8 -right-8 w-48 h-48 overflow-hidden border-4 border-cream shadow-warm-lg hidden lg:block">
                <Image
                  src="/images/STDOM_OCT_PS--11.webp"
                  alt="St Domenico antipasto — prosciutto and fior di latte"
                  fill
                  className="object-cover"
                  sizes="192px"
                />
              </div>

              {/* Decorative frame */}
              <div className="absolute -top-4 -left-4 w-32 h-32 border border-gold/30 hidden lg:block pointer-events-none" />
            </div>
          </ScrollReveal>

          {/* Content side */}
          <div ref={ref} className="lg:pl-8">
            <ScrollReveal direction="right" delay={0.1}>
              <div className="mb-6">
                <span className="font-bebas text-terracotta tracking-[0.4em] text-sm">
                  Our Story
                </span>
                <div className="w-12 h-px bg-terracotta mt-2" />
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right" delay={0.2}>
              <h2
                id="about-heading"
                className="font-playfair text-4xl lg:text-5xl text-charcoal mb-6 leading-tight"
              >
                Where Naples
                <br />
                <em className="text-terracotta">meets Melbourne</em>
              </h2>
            </ScrollReveal>

            <ScrollReveal direction="right" delay={0.3}>
              <div className="space-y-4 font-inter text-charcoal/70 text-[17px] leading-relaxed mb-10">
                <p>
                  St Domenico was born from a simple but profound belief: that the finest pizza
                  in the world should be available to Melbourne. For over 15 years, our kitchen
                  has been driven by an uncompromising passion for authentic Neapolitan craft —
                  every dough ball hand-stretched, every sauce made from Italian tomatoes, every
                  pizza fired in our wood-burning forno.
                </p>
                <p>
                  Nestled on Bridge Road in the heart of Richmond, our dining room welcomes you
                  with the warmth of a true Italian trattoria. Whether you're settling in for a
                  long evening with a BYO bottle, catching a family meal on the terrace, or
                  celebrating with friends — this is your table.
                </p>
              </div>
            </ScrollReveal>

            {/* Badges */}
            <ScrollReveal direction="right" delay={0.4}>
              <div className="flex flex-wrap gap-6 mb-10">
                {badges.map((badge, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                    className="w-24 h-24 rounded-full border-2 border-gold/40 flex flex-col items-center justify-center text-center bg-cream-dark"
                  >
                    <span className="font-playfair text-xl font-bold text-terracotta leading-none">
                      {badge.num}
                    </span>
                    <span
                      className="font-inter text-[9px] tracking-wide text-charcoal/60 mt-1 whitespace-pre-line leading-tight"
                      style={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}
                    >
                      {badge.label}
                    </span>
                  </motion.div>
                ))}
              </div>
            </ScrollReveal>

            {/* Features */}
            <ScrollReveal direction="right" delay={0.5}>
              <div className="grid grid-cols-2 gap-4">
                {[
                  'Indoor & outdoor dining',
                  'BYO wine (no corkage)',
                  'Community focused',
                  'Italian imported ingredients',
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-sm text-charcoal/70">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                    {feature}
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  )
}
