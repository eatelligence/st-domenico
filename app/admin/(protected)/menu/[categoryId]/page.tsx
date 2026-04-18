import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAdminCategories, getAdminCategoryItems } from '@/lib/db/queries/admin'
import ItemList from './_components/ItemList'
import { ChevronLeft } from 'lucide-react'

type Props = { params: Promise<{ categoryId: string }> }

export default async function CategoryPage({ params }: Props) {
  const { categoryId } = await params
  const [categories, items] = await Promise.all([
    getAdminCategories(),
    getAdminCategoryItems(categoryId),
  ])
  const category = categories.find((c) => c.id === categoryId)
  if (!category) notFound()

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/admin/menu" className="flex items-center gap-1 text-sm font-inter text-charcoal/40 hover:text-charcoal transition-colors">
          <ChevronLeft size={14} />
          Menu
        </Link>
        <span className="text-charcoal/20">/</span>
        <span className="text-sm font-inter text-charcoal">
          {category.emoji} {category.label}
        </span>
      </div>

      <div className="mb-6">
        <h1 className="font-playfair text-2xl sm:text-3xl text-charcoal">
          {category.emoji} {category.label}
        </h1>
        <p className="font-inter text-sm text-charcoal/40 mt-1">
          {items.filter((i) => i.isActive).length} active items
          {items.filter((i) => !i.isActive).length > 0 && (
            <span className="ml-1">· {items.filter((i) => !i.isActive).length} hidden</span>
          )}
        </p>
      </div>

      <ItemList categoryId={categoryId} items={items} />
    </div>
  )
}
