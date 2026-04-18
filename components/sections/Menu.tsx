'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { menuCategories, type MenuItem } from '@/lib/data/menu'
import ScrollReveal from '@/components/ui/ScrollReveal'

type FilterType = 'all' | 'vegetarian' | 'gf' | 'seafood'

function MenuItemRow({ item }: { item: MenuItem }) {
  return (
    <div className="py-4 border-b border-gold/10 last:border-0 group hover:bg-cream-dark/50 -mx-2 px-2 transition-colors duration-200 rounded">
      <div className="flex items-baseline gap-0 w-full">
        <div className="flex-shrink-0 max-w-[55%]">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-playfair text-[16px] font-semibold text-charcoal group-hover:text-terracotta transition-colors">
              {item.name}
            </span>
            <div className="flex gap-1">
              {item.isVegetarian && (
                <span
                  className="text-[9px] font-bebas tracking-wide bg-deep-green/10 text-deep-green px-1.5 py-0.5 rounded-sm"
                  title="Vegetarian"
                >
                  VEG
                </span>
              )}
              {item.isSeafood && (
                <span
                  className="text-[9px] font-bebas tracking-wide bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-sm"
                  title="Contains seafood"
                >
                  SEAFOOD
                </span>
              )}
              {item.badge && (
                <span className="text-[9px] font-bebas tracking-wide bg-terracotta/10 text-terracotta px-1.5 py-0.5 rounded-sm">
                  {item.badge}
                </span>
              )}
            </div>
          </div>
          {item.description && (
            <p className="font-inter text-xs text-charcoal/50 mt-0.5 leading-relaxed line-clamp-2">
              {item.description}
            </p>
          )}
        </div>

        {/* Dots */}
        <div className="menu-dots" aria-hidden="true" />

        {/* Price */}
        <div className="flex-shrink-0 text-right">
          {item.price && (
            <span className="font-playfair text-[15px] text-charcoal">{item.price}</span>
          )}
          {item.priceGF && (
            <span className="font-inter text-[11px] text-charcoal/40 ml-2">
              GF {item.priceGF}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState('pizze')
  const [filter, setFilter] = useState<FilterType>('all')
  const [isStuck, setIsStuck] = useState(false)
  const tabsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tabs = tabsRef.current
    if (!tabs) return

    const observer = new IntersectionObserver(
      ([entry]) => setIsStuck(!entry.isIntersecting),
      { threshold: 1, rootMargin: '-73px 0px 0px 0px' }
    )

    const sentinel = document.createElement('div')
    sentinel.style.height = '1px'
    sentinel.style.position = 'absolute'
    tabs.parentElement?.insertBefore(sentinel, tabs)
    observer.observe(sentinel)

    return () => {
      observer.disconnect()
      sentinel.remove()
    }
  }, [])

  const currentCategory = menuCategories.find((c) => c.id === activeCategory)

  const filteredItems = currentCategory?.items.filter((item) => {
    if (filter === 'vegetarian') return item.isVegetarian
    if (filter === 'gf') return item.priceGF !== undefined
    if (filter === 'seafood') return item.isSeafood
    return true
  }) ?? []

  return (
    <section
      id="menu"
      className="bg-cream grain-overlay relative"
      aria-labelledby="menu-heading"
    >
      {/* Header */}
      <div className="py-20 lg:py-28 pb-0 max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <ScrollReveal>
            <span className="font-bebas text-terracotta tracking-[0.4em] text-sm">
              Our Menu
            </span>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h2
              id="menu-heading"
              className="font-playfair italic text-4xl lg:text-6xl text-charcoal mt-3 mb-4"
            >
              La Cucina
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p className="font-inter text-charcoal/60 max-w-md mx-auto text-[17px]">
              Every dish crafted with imported Italian ingredients. Gluten-free bases available on
              all pizzas.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.25}>
            <div className="gold-divider mt-6" />
          </ScrollReveal>
        </div>

        {/* Filter chips */}
        <ScrollReveal delay={0.3}>
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {(
              [
                { key: 'all', label: 'All' },
                { key: 'vegetarian', label: '🌱 Vegetarian' },
                { key: 'gf', label: 'GF Available' },
                { key: 'seafood', label: '🦐 Seafood' },
              ] as { key: FilterType; label: string }[]
            ).map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={cn(
                  'font-bebas text-xs tracking-[0.15em] px-5 py-2.5 border transition-all duration-200',
                  filter === key
                    ? 'bg-terracotta text-cream border-terracotta'
                    : 'bg-transparent text-charcoal/60 border-gold/30 hover:border-terracotta hover:text-terracotta'
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </ScrollReveal>
      </div>

      {/* Sticky tabs */}
      <div
        ref={tabsRef}
        className={cn(
          'menu-tabs-sticky transition-shadow duration-300',
          isStuck && 'shadow-sm'
        )}
        role="tablist"
        aria-label="Menu categories"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex overflow-x-auto scrollbar-hide gap-0 -mb-px">
            {menuCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                role="tab"
                aria-selected={activeCategory === cat.id}
                aria-controls={`panel-${cat.id}`}
                className={cn(
                  'flex-shrink-0 font-bebas text-sm tracking-[0.12em] px-5 py-4 border-b-2 transition-all duration-200 whitespace-nowrap',
                  activeCategory === cat.id
                    ? 'border-terracotta text-terracotta'
                    : 'border-transparent text-charcoal/50 hover:text-charcoal hover:border-gold/40'
                )}
              >
                <span className="mr-1.5">{cat.emoji}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu content */}
      <div className="max-w-7xl mx-auto px-6 py-10 pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeCategory}-${filter}`}
            id={`panel-${activeCategory}`}
            role="tabpanel"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            {filteredItems.length === 0 ? (
              <div className="text-center py-16 text-charcoal/40">
                <p className="font-playfair text-2xl italic mb-2">Nothing here yet</p>
                <p className="text-sm">Try a different filter or category.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-x-16">
                {filteredItems.map((item, i) => (
                  <MenuItemRow key={`${item.name}-${i}`} item={item} />
                ))}
              </div>
            )}

            {/* Category note */}
            {activeCategory === 'pizze' && filter === 'all' && (
              <p className="text-center font-inter text-charcoal/40 text-xs mt-8 tracking-wide">
                All pizzas available with gluten-free base (+$3) · 12&quot; standard size
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
