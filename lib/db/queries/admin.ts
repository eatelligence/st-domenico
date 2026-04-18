import { db } from '../client'

export type AdminMenuItem = {
  id: string
  categoryId: string
  name: string
  description: string
  price: string | null
  priceGF: string | null
  isVegetarian: boolean
  isGlutenFree: boolean
  isSeafood: boolean
  badge: string | null
  allergens: string | null
  sortOrder: number
  isActive: boolean
}

export type AdminCategory = {
  id: string
  label: string
  emoji: string
  sortOrder: number
  isActive: boolean
  itemCount: number
}

export async function getAdminCategories(): Promise<AdminCategory[]> {
  const result = await db.execute(`
    SELECT c.id, c.label, c.emoji, c.sort_order, c.is_active,
           COUNT(i.id) as item_count
    FROM menu_categories c
    LEFT JOIN menu_items i ON i.category_id = c.id AND i.is_active = 1
    GROUP BY c.id
    ORDER BY c.sort_order ASC
  `)
  return result.rows.map((r) => ({
    id: r.id as string,
    label: r.label as string,
    emoji: r.emoji as string,
    sortOrder: r.sort_order as number,
    isActive: r.is_active === 1,
    itemCount: r.item_count as number,
  }))
}

export async function getAdminCategoryItems(categoryId: string): Promise<AdminMenuItem[]> {
  const result = await db.execute({
    sql: `SELECT id, category_id, name, description, price, price_gf,
                 is_vegetarian, is_gluten_free, is_seafood, badge, allergens,
                 sort_order, is_active
          FROM menu_items WHERE category_id = ?
          ORDER BY sort_order ASC`,
    args: [categoryId],
  })
  return result.rows.map(rowToItem)
}

export async function getAdminItem(id: string): Promise<AdminMenuItem | null> {
  const result = await db.execute({ sql: `SELECT * FROM menu_items WHERE id = ?`, args: [id] })
  if (!result.rows[0]) return null
  return rowToItem(result.rows[0])
}

function rowToItem(r: Record<string, unknown>): AdminMenuItem {
  return {
    id: r.id as string,
    categoryId: r.category_id as string,
    name: r.name as string,
    description: r.description as string,
    price: r.price as string | null,
    priceGF: r.price_gf as string | null,
    isVegetarian: r.is_vegetarian === 1,
    isGlutenFree: r.is_gluten_free === 1,
    isSeafood: r.is_seafood === 1,
    badge: r.badge as string | null,
    allergens: r.allergens as string | null,
    sortOrder: r.sort_order as number,
    isActive: r.is_active === 1,
  }
}
