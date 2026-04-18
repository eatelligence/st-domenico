'use client'

import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { useRef, MouseEvent } from 'react'
import Image from 'next/image'
import { specials } from '@/lib/data/specials'
import ScrollReveal from '@/components/ui/ScrollReveal'

const specialImages = [
  '/images/0J5A9373.webp',
  '/images/image-asset.webp',
  '/images/STDOM_OCT_PS--07.webp',
]

function SpecialCard({
  special,
  index,
  imageUrl,
}: {
  special: (typeof specials)[0]
  index: number
  imageUrl: string
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useTransform(y, [-0.5, 0.5], [4, -4])
  const rotateY = useTransform(x, [-0.5, 0.5], [-4, 4])
  const springConfig = { stiffness: 300, damping: 30 }
  const rotateXSpring = useSpring(rotateX, springConfig)
  const rotateYSpring = useSpring(rotateY, springConfig)

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <ScrollReveal delay={index * 0.15}>
      <motion.div
        ref={cardRef}
        style={{ rotateX: rotateXSpring, rotateY: rotateYSpring, transformPerspective: 1000 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative overflow-hidden rounded-none h-[480px] group cursor-default"
      >
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src={imageUrl}
            alt={special.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>

        {/* Gradient overlay */}
        <div
          className={`absolute inset-0 transition-opacity duration-500 ${
            index === 0
              ? 'bg-gradient-to-t from-deep-green/95 via-deep-green/50 to-transparent'
              : index === 1
              ? 'bg-gradient-to-t from-terracotta/95 via-terracotta/50 to-transparent'
              : 'bg-gradient-to-t from-charcoal/95 via-charcoal/60 to-transparent'
          } group-hover:opacity-90`}
        />

        {/* Content */}
        <div className="absolute inset-0 p-8 flex flex-col justify-end">
          {/* Price / highlight badge */}
          {special.highlight && (
            <div className="mb-4">
              <span className="font-bebas text-3xl text-gold tracking-wider">
                {special.highlight}
              </span>
            </div>
          )}

          <span className="font-bebas text-xs tracking-[0.3em] text-gold/80 mb-2 uppercase">
            {special.subtitle}
          </span>

          <h3 className="font-playfair text-2xl text-cream leading-snug mb-3">
            {special.title}
          </h3>

          <div className="w-8 h-px bg-gold mb-4" />

          <p className="font-inter text-cream/70 text-sm leading-relaxed mb-4 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
            {special.description}
          </p>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gold" />
              <span className="font-inter text-cream/60 text-xs tracking-wide">{special.days}</span>
            </div>
            {special.time && (
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                <span className="font-inter text-cream/60 text-xs">{special.time}</span>
              </div>
            )}
          </div>

          {special.note && (
            <p className="font-inter text-gold/70 text-xs mt-3 leading-relaxed border-t border-gold/20 pt-3 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-75">
              {special.note}
            </p>
          )}
        </div>

        {/* Corner accent */}
        <div className="absolute top-6 right-6 w-8 h-8 border-r border-t border-gold/30" />
        <div className="absolute bottom-6 left-6 w-8 h-8 border-l border-b border-gold/30" />
      </motion.div>
    </ScrollReveal>
  )
}

export default function Specials() {
  return (
    <section
      id="specials"
      className="py-24 lg:py-36 bg-charcoal relative overflow-hidden"
      aria-labelledby="specials-heading"
    >
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, #C9A96E 0, #C9A96E 1px, transparent 0, transparent 50%)',
          backgroundSize: '20px 20px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <ScrollReveal>
            <span className="font-bebas text-terracotta tracking-[0.4em] text-sm">
              Weekly Specials
            </span>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h2
              id="specials-heading"
              className="font-playfair italic text-4xl lg:text-6xl text-cream mt-3 mb-4"
            >
              What&apos;s On
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <div className="gold-divider" />
          </ScrollReveal>
        </div>

        {/* Cards grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {specials.map((special, i) => (
            <SpecialCard
              key={special.id}
              special={special}
              index={i}
              imageUrl={specialImages[i]}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <ScrollReveal delay={0.3}>
          <div className="text-center mt-14">
            <a
              href="#bookings"
              className="inline-flex items-center gap-3 font-bebas text-base tracking-[0.25em] text-gold border border-gold/30 px-10 py-4 hover:bg-gold hover:text-charcoal transition-all duration-300"
            >
              Reserve Your Table
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
