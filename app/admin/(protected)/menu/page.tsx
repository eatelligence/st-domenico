import Link from 'next/link'
import { getAdminCategories } from '@/lib/db/queries/admin'
import { ChevronRight } from 'lucide-react'

export default async function AdminMenuPage() {
  const categories = await getAdminCategories()

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
      <div className="mb-8">
        <h1 className="font-playfair text-2xl sm:text-3xl text-charcoal">Menu</h1>
        <p className="font-inter text-sm text-charcoal/50 mt-1">Seleziona una categoria per gestire i prodotti.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/admin/menu/${cat.id}`}
            className={`bg-white border border-gold/20 p-5 hover:border-terracotta/40 hover:shadow-sm transition-all group ${
              !cat.isActive ? 'opacity-50' : ''
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-2xl mb-2">{cat.emoji}</div>
                <div className="font-playfair text-lg text-charcoal group-hover:text-terracotta transition-colors">
                  {cat.label}
                </div>
                <div className="font-inter text-xs text-charcoal/40 mt-1">
                  {cat.itemCount} {cat.itemCount === 1 ? 'prodotto' : 'prodotti'}
                </div>
              </div>
              <ChevronRight size={16} className="text-charcoal/20 group-hover:text-terracotta mt-1 transition-colors" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
