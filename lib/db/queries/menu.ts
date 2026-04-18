import { unstable_cache } from 'next/cache'
import { db } from '../client'
import type { MenuCategory, MenuItem } from '@/lib/data/menu'

export const getMenuCategories = unstable_cache(
  async (): Promise<MenuCategory[]> => {
    const catsResult = await db.execute(
      `SELECT id, label, emoji FROM menu_categories
       WHERE is_active = 1 ORDER BY sort_order ASC`
    )

    const categories: MenuCategory[] = []

    for (const row of catsResult.rows) {
      const itemsResult = await db.execute({
        sql: `SELECT name, description, price, price_gf, is_vegetarian, is_gluten_free,
                     is_seafood, badge, allergens
              FROM menu_items
              WHERE category_id = ? AND is_active = 1
              ORDER BY sort_order ASC`,
        args: [row.id as string],
      })

      const items: MenuItem[] = itemsResult.rows.map((r) => ({
        name: r.name as string,
        description: r.description as string,
        price: (r.price as string | null) ?? undefined,
        priceGF: (r.price_gf as string | null) ?? undefined,
        isVegetarian: r.is_vegetarian === 1,
        isGlutenFree: r.is_gluten_free === 1,
        isSeafood: r.is_seafood === 1,
        badge: (r.badge as string | null) ?? undefined,
        allergens: (r.allergens as string | null) ?? undefined,
      }))

      categories.push({
        id: row.id as string,
        label: row.label as string,
        emoji: row.emoji as string,
        items,
      })
    }

    return categories
  },
  ['menu-categories'],
  { tags: ['menu'], revalidate: 3600 }
)
