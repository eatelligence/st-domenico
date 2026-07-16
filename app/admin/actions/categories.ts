'use server'

import { revalidateTag, revalidatePath } from 'next/cache'
import { z } from 'zod'
import { requireUser } from '@/lib/supabase/server'

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
  const { supabase } = await requireUser()
  try {
    const data = CatSchema.parse({
      label: formData.get('label'),
      emoji: formData.get('emoji') || '🍽️',
    })
    const { data: maxRow } = await supabase
      .from('menu_categories')
      .select('sort_order')
      .order('sort_order', { ascending: false })
      .limit(1)
      .maybeSingle()
    const sortOrder = (maxRow?.sort_order ?? -1) + 1
    const { error } = await supabase
      .from('menu_categories')
      .insert({ label: data.label, emoji: data.emoji, sort_order: sortOrder })
    if (error) throw error
    invalidate()
    return { error: '' }
  } catch (e) {
    return { error: e instanceof z.ZodError ? e.issues[0]?.message ?? 'Invalid data.' : 'Error saving.' }
  }
}

export async function updateCategory(id: string, prevState: { error: string }, formData: FormData) {
  const { supabase } = await requireUser()
  try {
    const data = CatSchema.parse({ label: formData.get('label'), emoji: formData.get('emoji') || '🍽️' })
    const { error } = await supabase
      .from('menu_categories')
      .update({ label: data.label, emoji: data.emoji })
      .eq('id', id)
    if (error) throw error
    invalidate()
    return { error: '' }
  } catch (e) {
    return { error: e instanceof z.ZodError ? e.issues[0]?.message ?? 'Invalid data.' : 'Error saving.' }
  }
}

export async function deleteCategory(id: string) {
  const { supabase } = await requireUser()
  const { count } = await supabase
    .from('menu_items')
    .select('id', { count: 'exact', head: true })
    .eq('category_id', id)
    .eq('is_active', true)
  if ((count ?? 0) > 0) {
    return { error: 'Remove all products from this category first.' }
  }
  const { error } = await supabase.from('menu_categories').update({ is_active: false }).eq('id', id)
  if (error) return { error: 'Error deleting.' }
  invalidate()
  return { error: '' }
}

export async function reorderCategories(orderedIds: string[]) {
  const { supabase } = await requireUser()
  await Promise.all(
    orderedIds.map((id, i) =>
      supabase.from('menu_categories').update({ sort_order: i }).eq('id', id)
    )
  )
  invalidate()
}
