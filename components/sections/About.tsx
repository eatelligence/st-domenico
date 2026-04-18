'use client'

import Image from 'next/image'
import ScrollReveal from '@/components/ui/ScrollReveal'

const badges = [
  { num: '15+', label: 'Years of\nPassion' },
  { num: '100%', label: 'Imported\nIngredients' },
  { num: 'BYO', label: 'Wine\nWelcome' },
]

export default function About() {
  return (
    <section
      id="about"
      className="relative py-16 sm:py-24 lg:py-36 bg-cream grain-overlay overflow-hidden"
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
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
                  quality={70}
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
          <div className="lg:pl-8">
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
                  St Domenico is Richmond Melbourne&apos;s home of authentic Neapolitan pizza. Since
                  2015, our kitchen has been driven by one belief: that the world&apos;s finest pizza
                  deserves to be made properly. Every dough ball is hand-stretched, every sauce
                  built on imported San Marzano tomatoes, every pizza fired in our wood-burning
                  forno at 450°C — the only way to achieve that signature charred, airy crust.
                </p>
                <p>
                  Located on Bridge Road in Richmond, we&apos;re your neighbourhood Italian restaurant
                  for relaxed weeknight dinners, long weekend feasts, and everything in between.
                  BYO wine with no corkage fee, indoor and outdoor dining, and a menu that
                  covers the full Italian table — from antipasto to dolci.
                </p>
              </div>
            </ScrollReveal>

            {/* Badges */}
            <ScrollReveal direction="right" delay={0.4}>
              <div className="flex flex-wrap gap-6 mb-10">
                {badges.map((badge, i) => (
                  <div
                    key={i}
                    className="w-24 h-24 rounded-full border-2 border-gold/40 flex flex-col items-center justify-center text-center bg-cream-dark"
                    style={{
                      animation: 'popIn 0.5s ease-out both',
                      animationDelay: `${0.6 + i * 0.1}s`,
                    }}
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
                  </div>
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
