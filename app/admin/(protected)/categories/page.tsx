import { getAdminCategories } from '@/lib/db/queries/admin'
import CategoryManager from './_components/CategoryManager'

export default async function CategoriesPage() {
  const categories = await getAdminCategories()

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
      <div className="mb-8">
        <h1 className="font-playfair text-2xl sm:text-3xl text-charcoal">Categories</h1>
        <p className="font-inter text-sm text-charcoal/50 mt-1">Manage menu categories.</p>
      </div>
      <CategoryManager categories={categories} />
    </div>
  )
}
