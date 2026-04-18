'use server'

import { revalidateTag, revalidatePath } from 'next/cache'
import { z } from 'zod'
import { db } from '@/lib/db/client'
import { getAdminSession } from '@/lib/auth/session'

const ItemSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().default(''),
  price: z.string().optional(),
  priceGF: z.string().optional(),
  allergens: z.string().optional(),
  badge: z.string().optional(),
  isVegetarian: z.boolean().default(false),
  isGlutenFree: z.boolean().default(false),
  isSeafood: z.boolean().default(false),
})

function parseForm(formData: FormData) {
  return ItemSchema.parse({
    name: formData.get('name'),
    description: formData.get('description') ?? '',
    price: formData.get('price') || undefined,
    priceGF: formData.get('priceGF') || undefined,
    allergens: formData.get('allergens') || undefined,
    badge: formData.get('badge') || undefined,
    isVegetarian: formData.get('isVegetarian') === 'on',
    isGlutenFree: formData.get('isGlutenFree') === 'on',
    isSeafood: formData.get('isSeafood') === 'on',
  })
}

function invalidate(categoryId: string) {
  revalidateTag('menu')
  revalidatePath(`/admin/menu/${categoryId}`, 'page')
}

export async function createMenuItem(categoryId: string, prevState: { error: string }, formData: FormData) {
  await getAdminSession()
  try {
    const data = parseForm(formData)
    const maxOrder = await db.execute({
      sql: `SELECT COALESCE(MAX(sort_order), -1) as m FROM menu_items WHERE category_id = ?`,
      args: [categoryId],
    })
    const sortOrder = (maxOrder.rows[0].m as number) + 1
    await db.execute({
      sql: `INSERT INTO menu_items
            (category_id, name, description, price, price_gf, is_vegetarian, is_gluten_free,
             is_seafood, badge, allergens, sort_order)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        categoryId, data.name, data.description,
        data.price ?? null, data.priceGF ?? null,
        data.isVegetarian ? 1 : 0, data.isGlutenFree ? 1 : 0, data.isSeafood ? 1 : 0,
        data.badge ?? null, data.allergens ?? null, sortOrder,
      ],
    })
    invalidate(categoryId)
    return { error: '' }
  } catch (e) {
    return { error: e instanceof z.ZodError ? e.issues[0]?.message ?? 'Invalid data.' : 'Error saving.' }
  }
}

export async function updateMenuItem(id: string, categoryId: string, prevState: { error: string }, formData: FormData) {
  await getAdminSession()
  try {
    const data = parseForm(formData)
    await db.execute({
      sql: `UPDATE menu_items SET
              name=?, description=?, price=?, price_gf=?,
              is_vegetarian=?, is_gluten_free=?, is_seafood=?,
              badge=?, allergens=?
            WHERE id=?`,
      args: [
        data.name, data.description,
        data.price ?? null, data.priceGF ?? null,
        data.isVegetarian ? 1 : 0, data.isGlutenFree ? 1 : 0, data.isSeafood ? 1 : 0,
        data.badge ?? null, data.allergens ?? null, id,
      ],
    })
    invalidate(categoryId)
    return { error: '' }
  } catch (e) {
    return { error: e instanceof z.ZodError ? e.issues[0]?.message ?? 'Invalid data.' : 'Error saving.' }
  }
}

export async function deleteMenuItem(id: string, categoryId: string) {
  await getAdminSession()
  await db.execute({ sql: `UPDATE menu_items SET is_active = 0 WHERE id = ?`, args: [id] })
  invalidate(categoryId)
}

export async function restoreMenuItem(id: string, categoryId: string) {
  await getAdminSession()
  await db.execute({ sql: `UPDATE menu_items SET is_active = 1 WHERE id = ?`, args: [id] })
  invalidate(categoryId)
}
