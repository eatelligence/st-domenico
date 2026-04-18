'use server'

import { revalidateTag, revalidatePath } from 'next/cache'
import { z } from 'zod'
import { db } from '@/lib/db/client'
import { getAdminSession } from '@/lib/auth/session'

const CatSchema = z.object({
  label: z.string().min(1, 'Name is required'),
  emoji: z.string().default('🍽️'),
})

function invalidate() {
  revalidateTag('menu')
  revalidatePath('/admin/menu', 'page')
  revalidatePath('/admin/categories', 'page')
}

export async function createCategory(prevState: { error: string }, formData: FormData) {
  await getAdminSession()
  try {
    const data = CatSchema.parse({
      label: formData.get('label'),
      emoji: formData.get('emoji') || '🍽️',
    })
    const id = data.label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    const maxOrder = await db.execute(`SELECT COALESCE(MAX(sort_order), -1) as m FROM menu_categories`)
    const sortOrder = (maxOrder.rows[0].m as number) + 1
    await db.execute({
      sql: `INSERT OR IGNORE INTO menu_categories (id, label, emoji, sort_order) VALUES (?, ?, ?, ?)`,
      args: [id, data.label, data.emoji, sortOrder],
    })
    invalidate()
    return { error: '' }
  } catch (e) {
    return { error: e instanceof z.ZodError ? e.issues[0]?.message ?? 'Invalid data.' : 'Error saving.' }
  }
}

export async function updateCategory(id: string, prevState: { error: string }, formData: FormData) {
  await getAdminSession()
  try {
    const data = CatSchema.parse({ label: formData.get('label'), emoji: formData.get('emoji') || '🍽️' })
    await db.execute({ sql: `UPDATE menu_categories SET label=?, emoji=? WHERE id=?`, args: [data.label, data.emoji, id] })
    invalidate()
    return { error: '' }
  } catch (e) {
    return { error: e instanceof z.ZodError ? e.issues[0]?.message ?? 'Invalid data.' : 'Error saving.' }
  }
}

export async function deleteCategory(id: string) {
  await getAdminSession()
  const count = await db.execute({
    sql: `SELECT COUNT(*) as c FROM menu_items WHERE category_id = ? AND is_active = 1`,
    args: [id],
  })
  if ((count.rows[0].c as number) > 0) {
    return { error: 'Remove all products from this category first.' }
  }
  await db.execute({ sql: `UPDATE menu_categories SET is_active = 0 WHERE id = ?`, args: [id] })
  invalidate()
  return { error: '' }
}

export async function reorderCategories(orderedIds: string[]) {
  await getAdminSession()
  const stmts = orderedIds.map((id, i) => ({
    sql: `UPDATE menu_categories SET sort_order = ? WHERE id = ?`,
    args: [i, id] as (string | number)[],
  }))
  await db.batch(stmts, 'write')
  invalidate()
}
