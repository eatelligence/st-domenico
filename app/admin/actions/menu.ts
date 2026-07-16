'use server'

import { revalidateTag, revalidatePath } from 'next/cache'
import { z } from 'zod'
import { requireUser } from '@/lib/supabase/server'

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
  const { supabase } = await requireUser()
  try {
    const data = parseForm(formData)
    const { data: maxRow } = await supabase
      .from('menu_items')
      .select('sort_order')
      .eq('category_id', categoryId)
      .order('sort_order', { ascending: false })
      .limit(1)
      .maybeSingle()
    const sortOrder = (maxRow?.sort_order ?? -1) + 1
    const { error } = await supabase.from('menu_items').insert({
      category_id: categoryId,
      name: data.name,
      description: data.description,
      price: data.price ?? null,
      price_gf: data.priceGF ?? null,
      is_vegetarian: data.isVegetarian,
      is_gluten_free: data.isGlutenFree,
      is_seafood: data.isSeafood,
      badge: data.badge ?? null,
      allergens: data.allergens ?? null,
      sort_order: sortOrder,
    })
    if (error) throw error
    invalidate(categoryId)
    return { error: '' }
  } catch (e) {
    return { error: e instanceof z.ZodError ? e.issues[0]?.message ?? 'Invalid data.' : 'Error saving.' }
  }
}

export async function updateMenuItem(id: string, categoryId: string, prevState: { error: string }, formData: FormData) {
  const { supabase } = await requireUser()
  try {
    const data = parseForm(formData)
    const { error } = await supabase
      .from('menu_items')
      .update({
        name: data.name,
        description: data.description,
        price: data.price ?? null,
        price_gf: data.priceGF ?? null,
        is_vegetarian: data.isVegetarian,
        is_gluten_free: data.isGlutenFree,
        is_seafood: data.isSeafood,
        badge: data.badge ?? null,
        allergens: data.allergens ?? null,
      })
      .eq('id', id)
    if (error) throw error
    invalidate(categoryId)
    return { error: '' }
  } catch (e) {
    return { error: e instanceof z.ZodError ? e.issues[0]?.message ?? 'Invalid data.' : 'Error saving.' }
  }
}

export async function deleteMenuItem(id: string, categoryId: string) {
  const { supabase } = await requireUser()
  const { error } = await supabase.from('menu_items').update({ is_active: false }).eq('id', id)
  if (error) { console.error('deleteMenuItem failed:', error); return }
  invalidate(categoryId)
}

export async function restoreMenuItem(id: string, categoryId: string) {
  const { supabase } = await requireUser()
  const { error } = await supabase.from('menu_items').update({ is_active: true }).eq('id', id)
  if (error) { console.error('restoreMenuItem failed:', error); return }
  invalidate(categoryId)
}
