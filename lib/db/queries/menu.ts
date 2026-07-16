import { unstable_cache } from 'next/cache'
import { createAnonClient } from '@/lib/supabase/anon'
import type { MenuCategory, MenuItem } from '@/lib/data/menu'

async function fetchMenu(): Promise<MenuCategory[]> {
  const supabase = createAnonClient()

  const { data: cats, error: catsError } = await supabase
    .from('menu_categories')
    .select('id, label, emoji')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
  if (catsError) console.error('getMenuCategories failed:', catsError)

  if (!cats || cats.length === 0) return []

  const categories: MenuCategory[] = []
  for (const c of cats) {
    const { data: items, error: itemsError } = await supabase
      .from('menu_items')
      .select(
        'name, description, price, price_gf, is_vegetarian, is_gluten_free, is_seafood, badge, allergens'
      )
      .eq('category_id', c.id)
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
    if (itemsError) console.error('getMenuCategories failed:', itemsError)

    const mapped: MenuItem[] = (items ?? []).map((r) => ({
      name: r.name,
      description: r.description,
      price: r.price ?? undefined,
      priceGF: r.price_gf ?? undefined,
      isVegetarian: r.is_vegetarian,
      isGlutenFree: r.is_gluten_free,
      isSeafood: r.is_seafood,
      badge: r.badge ?? undefined,
      allergens: r.allergens ?? undefined,
    }))

    categories.push({ id: c.id, label: c.label, emoji: c.emoji, items: mapped })
  }

  return categories
}

export const getMenuCategories = unstable_cache(fetchMenu, ['menu-categories'], {
  tags: ['menu'],
  revalidate: 3600,
})
