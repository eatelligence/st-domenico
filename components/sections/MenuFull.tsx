import { type MenuCategory } from '@/lib/data/menu'

/**
 * Server-rendered, non-interactive rendering of the entire menu.
 *
 * The homepage uses the tabbed <Menu /> client component, which only ever puts a
 * single category into the HTML. This component exists so /menu ships every
 * category and every dish as crawlable markup — that depth is the whole point of
 * the page, and it is also what makes /menu meaningfully different from the
 * homepage section rather than a duplicate of it.
 */
export default function MenuFull({ categories }: { categories: MenuCategory[] }) {
  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 pb-16">
      {categories.map((category) => (
        <section key={category.id} className="mb-14" aria-labelledby={`menu-${category.id}`}>
          <h2
            id={`menu-${category.id}`}
            className="font-playfair italic text-3xl sm:text-4xl text-charcoal mb-6 pb-3 border-b border-gold/30"
          >
            {category.label}
          </h2>

          <ul className="space-y-5">
            {category.items.map((item) => (
              <li key={item.name}>
                <div className="flex items-baseline gap-3">
                  <h3 className="font-playfair text-[17px] font-semibold text-charcoal">
                    {item.name}
                  </h3>
                  <div className="flex gap-1.5 flex-wrap">
                    {item.isVegetarian && (
                      <span className="text-[9px] font-bebas tracking-wide bg-deep-green/10 text-deep-green px-1.5 py-0.5 rounded-sm">
                        VEG
                      </span>
                    )}
                    {item.isSeafood && (
                      <span className="text-[9px] font-bebas tracking-wide bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-sm">
                        SEAFOOD
                      </span>
                    )}
                    {item.badge && (
                      <span className="text-[9px] font-bebas tracking-wide bg-terracotta/10 text-terracotta px-1.5 py-0.5 rounded-sm">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <div className="menu-dots hidden sm:block" aria-hidden="true" />
                  <span className="font-playfair text-[15px] text-charcoal whitespace-nowrap ml-auto sm:ml-0">
                    {item.price}
                    {item.priceGF && (
                      <span className="font-inter text-[11px] text-charcoal/40 ml-1.5">
                        GF {item.priceGF}
                      </span>
                    )}
                  </span>
                </div>
                {item.description && (
                  <p className="font-inter text-[13px] text-charcoal/55 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
