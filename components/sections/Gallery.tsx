'use client'

import { useState, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import ScrollReveal from '@/components/ui/ScrollReveal'

const galleryImages = [
  {
    src: '/images/StDomenico-Italian-Restaurant-Bridge-Road-Richmond-Pizza-Pasta.webp',
    alt: 'St Domenico — Neapolitan pizzas and pasta spread on rustic wooden table',
    span: 'col-span-2 row-span-2',
  },
  {
    src: '/images/StDomenico_20220218_-09340.webp',
    alt: 'St Domenico dining room — warm interior with bentwood chairs and natural light',
    span: 'col-span-1 row-span-1',
  },
  {
    src: '/images/FIORDILATTE2.webp',
    alt: 'Prosciutto crudo and burrata on a wooden board — St Domenico antipasto',
    span: 'col-span-1 row-span-1',
  },
  {
    src: '/images/STDOM_OCT_PS--21.webp',
    alt: 'Arancini and antipasto misto with beer — St Domenico starters',
    span: 'col-span-1 row-span-2',
  },
  {
    src: '/images/STDOM_OCT_PS--29.webp',
    alt: 'Linguine di mare — seafood pasta with mussels and prawns',
    span: 'col-span-1 row-span-1',
  },
  {
    src: '/images/0J5A9182.webp',
    alt: 'St Domenico Pizza Bar exterior — Bridge Road, Richmond',
    span: 'col-span-1 row-span-1',
  },
  {
    src: '/images/StDomenico_20220218_-09241.webp',
    alt: 'Outdoor dining at St Domenico — guests enjoying pizza and spritz in Richmond',
    span: 'col-span-2 row-span-1',
  },
]

export default function Gallery() {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const openLightbox = (index: number) => {
    setCurrentIndex(index)
    setLightboxOpen(true)
  }

  const closeLightbox = useCallback(() => setLightboxOpen(false), [])

  const prev = useCallback(() => {
    setCurrentIndex((i) => (i - 1 + galleryImages.length) % galleryImages.length)
  }, [])

  const next = useCallback(() => {
    setCurrentIndex((i) => (i + 1) % galleryImages.length)
  }, [])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!lightboxOpen) return
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [lightboxOpen, closeLightbox, prev, next])

  useEffect(() => {
    document.body.style.overflow = lightboxOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [lightboxOpen])

  return (
    <section
      id="gallery"
      className="py-16 sm:py-24 lg:py-32 bg-cream-dark grain-overlay"
      aria-labelledby="gallery-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <ScrollReveal>
            <span className="font-bebas text-terracotta tracking-[0.4em] text-sm">
              Gallery
            </span>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h2
              id="gallery-heading"
              className="font-playfair italic text-4xl lg:text-5xl text-charcoal mt-3 mb-4"
            >
              From Our Kitchen
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <div className="gold-divider" />
          </ScrollReveal>
        </div>

        {/* Mobile: uniform 2-col grid. md+: masonry with spans */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:auto-rows-[200px]">
          {galleryImages.map((img, i) => (
            <ScrollReveal key={i} delay={i * 0.06}>
              <button
                onClick={() => openLightbox(i)}
                className={`relative overflow-hidden group w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-gold
                  aspect-square md:aspect-auto md:h-full
                  ${i === 0 ? 'md:col-span-2 md:row-span-2' : ''}
                  ${i === 3 ? 'md:col-span-1 md:row-span-2' : ''}
                  ${i === 6 ? 'md:col-span-2 md:row-span-1' : ''}
                `}
                aria-label={`View photo: ${img.alt}`}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  quality={65}
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/30 transition-colors duration-300" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-9 h-9 border border-cream/70 flex items-center justify-center">
                    <span className="text-cream text-lg leading-none">+</span>
                  </div>
                </div>
              </button>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* Lightbox — CSS transitions, no framer-motion */}
      <div
        className={`fixed inset-0 z-50 bg-charcoal/95 flex items-center justify-center p-4 transition-opacity duration-300 ${
          lightboxOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeLightbox}
        role="dialog"
        aria-modal="true"
        aria-label="Image lightbox"
        aria-hidden={!lightboxOpen}
      >
        {/* Image */}
        <div
          className={`relative max-w-4xl max-h-[80vh] w-full transition-all duration-300 ${
            lightboxOpen ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative w-full h-full" style={{ aspectRatio: '16/10' }}>
            <Image
              src={galleryImages[currentIndex].src}
              alt={galleryImages[currentIndex].alt}
              fill
              className="object-contain"
              sizes="90vw"
            />
          </div>
          <p className="text-center text-cream/50 text-sm mt-3 font-inter">
            {galleryImages[currentIndex].alt}
          </p>
          <p className="text-center text-cream/30 text-xs mt-1">
            {currentIndex + 1} / {galleryImages.length}
          </p>
        </div>

        {/* Close */}
        <button
          onClick={closeLightbox}
          className="absolute top-6 right-6 text-cream/60 hover:text-cream transition-colors p-2"
          aria-label="Close lightbox"
        >
          <X size={24} />
        </button>

        {/* Prev */}
        <button
          onClick={(e) => { e.stopPropagation(); prev() }}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 text-cream/60 hover:text-cream transition-colors w-11 h-11 flex items-center justify-center hover:bg-white/10 rounded-full"
          aria-label="Previous image"
        >
          <ChevronLeft size={24} />
        </button>

        {/* Next */}
        <button
          onClick={(e) => { e.stopPropagation(); next() }}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 text-cream/60 hover:text-cream transition-colors w-11 h-11 flex items-center justify-center hover:bg-white/10 rounded-full"
          aria-label="Next image"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </section>
  )
}
