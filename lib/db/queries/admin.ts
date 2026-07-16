import { createClient } from '@/lib/supabase/server'
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
  const supabase = await createClient()
  const { data: cats } = await supabase
    .from('menu_categories')
    .select('id, label, emoji, sort_order, is_active')
    .order('sort_order', { ascending: true })
  const { data: items } = await supabase
    .from('menu_items')
    .select('category_id')
    .eq('is_active', true)

  const counts = new Map<string, number>()
  for (const i of items ?? []) {
    counts.set(i.category_id, (counts.get(i.category_id) ?? 0) + 1)
  }

  return (cats ?? []).map((c) => ({
    id: c.id,
    label: c.label,
    emoji: c.emoji,
    sortOrder: c.sort_order,
    isActive: c.is_active,
    itemCount: counts.get(c.id) ?? 0,
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
