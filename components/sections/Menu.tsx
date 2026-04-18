'use client'

import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { type MenuItem, type MenuCategory } from '@/lib/data/menu'
import ScrollReveal from '@/components/ui/ScrollReveal'

type FilterType = 'all' | 'vegetarian' | 'gf' | 'seafood'

function MenuItemRow({ item }: { item: MenuItem }) {
  return (
    <div className="py-3 sm:py-4 border-b border-gold/10 last:border-0 group hover:bg-cream-dark/50 -mx-1 px-1 transition-colors duration-200 rounded">
      {/* Stack layout on mobile, dot-leader row on sm+ */}
      <div className="flex items-start gap-2 w-full sm:items-baseline">

        {/* Name + badges + description */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-playfair text-[15px] sm:text-[16px] font-semibold text-charcoal group-hover:text-terracotta transition-colors leading-snug">
              {item.name}
            </span>
            <div className="flex gap-1 flex-wrap">
              {item.isVegetarian && (
                <span className="text-[8px] font-bebas tracking-wide bg-deep-green/10 text-deep-green px-1.5 py-0.5 rounded-sm whitespace-nowrap" title="Vegetarian">
                  VEG
                </span>
              )}
              {item.isSeafood && (
                <span className="text-[8px] font-bebas tracking-wide bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-sm whitespace-nowrap" title="Contains seafood">
                  SEAFOOD
                </span>
              )}
              {item.badge && (
                <span className="text-[8px] font-bebas tracking-wide bg-terracotta/10 text-terracotta px-1.5 py-0.5 rounded-sm whitespace-nowrap">
                  {item.badge}
                </span>
              )}
            </div>
          </div>
          {item.description && (
            <p className="font-inter text-[11px] sm:text-xs text-charcoal/50 mt-0.5 leading-relaxed line-clamp-2">
              {item.description}
            </p>
          )}
        </div>

        {/* Dot leader — hidden on mobile, shown sm+ */}
        <div className="menu-dots hidden sm:block" aria-hidden="true" />

        {/* Price — right-aligned; on mobile sits after the name block */}
        <div className="flex-shrink-0 text-right self-start sm:self-auto">
          {item.price && (
            <span className="font-playfair text-[14px] sm:text-[15px] text-charcoal whitespace-nowrap">
              {item.price}
            </span>
          )}
          {item.priceGF && (
            <span className="font-inter text-[10px] sm:text-[11px] text-charcoal/40 ml-1.5 whitespace-nowrap">
              GF {item.priceGF}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Menu({ initialCategories }: { initialCategories: MenuCategory[] }) {
  const [activeCategory, setActiveCategory] = useState(initialCategories[0]?.id ?? 'pizze')
  const [filter, setFilter] = useState<FilterType>('all')
  const [isStuck, setIsStuck] = useState(false)
  const tabsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tabs = tabsRef.current
    if (!tabs) return
    // Observe the tabs element itself — no DOM insertion, no forced reflow
    const observer = new IntersectionObserver(
      ([entry]) => setIsStuck(entry.intersectionRatio < 1),
      { threshold: [1], rootMargin: '-57px 0px 0px 0px' }
    )
    observer.observe(tabs)
    return () => observer.disconnect()
  }, [])

  const currentCategory = initialCategories.find((c) => c.id === activeCategory)

  const filteredItems = currentCategory?.items.filter((item) => {
    if (filter === 'vegetarian') return item.isVegetarian
    if (filter === 'gf') return item.priceGF !== undefined
    if (filter === 'seafood') return item.isSeafood
    return true
  }) ?? []

  return (
    <section id="menu" className="bg-cream grain-overlay relative" aria-labelledby="menu-heading">

      {/* Header */}
      <div className="py-14 sm:py-20 lg:py-28 pb-0 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-12">
          <ScrollReveal>
            <span className="font-bebas text-terracotta tracking-[0.4em] text-sm">Our Menu</span>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h2 id="menu-heading" className="font-playfair italic text-3xl sm:text-4xl lg:text-6xl text-charcoal mt-3 mb-4">
              La Cucina
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p className="font-inter text-charcoal/60 max-w-md mx-auto text-base sm:text-[17px]">
              Every dish crafted with imported Italian ingredients. Gluten-free bases available on all pizzas.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.25}>
            <div className="gold-divider mt-6" />
          </ScrollReveal>
        </div>

        {/* Filter chips — scrollable row on mobile */}
        <ScrollReveal delay={0.3}>
          <div className="flex overflow-x-auto scrollbar-hide gap-2 mb-6 sm:mb-8 sm:flex-wrap sm:justify-center pb-1">
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
                  'font-bebas text-xs tracking-[0.15em] px-4 py-2.5 border transition-all duration-200 whitespace-nowrap shrink-0 min-h-[44px]',
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

      {/* Sticky category tabs */}
      <div
        ref={tabsRef}
        className={cn('menu-tabs-sticky transition-shadow duration-300', isStuck && 'shadow-sm')}
        role="tablist"
        aria-label="Menu categories"
      >
        <div className="max-w-7xl mx-auto px-2 sm:px-6">
          <div className="flex overflow-x-auto scrollbar-hide gap-0 -mb-px">
            {initialCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                role="tab"
                aria-selected={activeCategory === cat.id}
                aria-controls={`panel-${cat.id}`}
                className={cn(
                  'flex-shrink-0 font-bebas text-xs sm:text-sm tracking-[0.1em] sm:tracking-[0.12em] px-3 sm:px-5 py-4 border-b-2 transition-all duration-200 whitespace-nowrap min-h-[44px]',
                  activeCategory === cat.id
                    ? 'border-terracotta text-terracotta'
                    : 'border-transparent text-charcoal/50 hover:text-charcoal hover:border-gold/40'
                )}
              >
                <span className="mr-1">{cat.emoji}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 pb-16 sm:pb-24">
        <div
          key={`${activeCategory}-${filter}`}
          id={`panel-${activeCategory}`}
          role="tabpanel"
          style={{ animation: 'menuTabIn 0.25s ease-out both' }}
        >
            {filteredItems.length === 0 ? (
              <div className="text-center py-16 text-charcoal/40">
                <p className="font-playfair text-2xl italic mb-2">Nothing here yet</p>
                <p className="text-sm">Try a different filter or category.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 md:gap-x-16">
                {filteredItems.map((item, i) => (
                  <MenuItemRow key={`${item.name}-${i}`} item={item} />
                ))}
              </div>
            )}

            {activeCategory === 'pizze' && filter === 'all' && (
              <p className="text-center font-inter text-charcoal/40 text-xs mt-8 tracking-wide px-4">
                All pizzas available with gluten-free base (+$3) · 12&quot; standard size
              </p>
            )}
        </div>
      </div>
    </section>
  )
}
