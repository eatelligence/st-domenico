import { createClient } from '@/lib/supabase/server'

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
  const { data: cats, error: catsError } = await supabase
    .from('menu_categories')
    .select('id, label, emoji, sort_order, is_active')
    .order('sort_order', { ascending: true })
  if (catsError) console.error('getAdminCategories failed:', catsError)
  const { data: items, error: itemsError } = await supabase
    .from('menu_items')
    .select('category_id')
    .eq('is_active', true)
  if (itemsError) console.error('getAdminCategories failed:', itemsError)

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

type ItemRow = {
  id: string
  category_id: string
  name: string
  description: string
  price: string | null
  price_gf: string | null
  is_vegetarian: boolean
  is_gluten_free: boolean
  is_seafood: boolean
  badge: string | null
  allergens: string | null
  sort_order: number
  is_active: boolean
}

const ITEM_COLS =
  'id, category_id, name, description, price, price_gf, is_vegetarian, is_gluten_free, is_seafood, badge, allergens, sort_order, is_active'

function rowToItem(r: ItemRow): AdminMenuItem {
  return {
    id: r.id,
    categoryId: r.category_id,
    name: r.name,
    description: r.description,
    price: r.price,
    priceGF: r.price_gf,
    isVegetarian: r.is_vegetarian,
    isGlutenFree: r.is_gluten_free,
    isSeafood: r.is_seafood,
    badge: r.badge,
    allergens: r.allergens,
    sortOrder: r.sort_order,
    isActive: r.is_active,
  }
}

export async function getAdminCategoryItems(categoryId: string): Promise<AdminMenuItem[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('menu_items')
    .select(ITEM_COLS)
    .eq('category_id', categoryId)
    .order('sort_order', { ascending: true })
  if (error) console.error('getAdminCategoryItems failed:', error)
  return (data ?? []).map((r) => rowToItem(r as ItemRow))
}

export async function getAdminItem(id: string): Promise<AdminMenuItem | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.from('menu_items').select(ITEM_COLS).eq('id', id).maybeSingle()
  if (error) console.error('getAdminItem failed:', error)
  return data ? rowToItem(data as ItemRow) : null
}

export type AdminSpecial = {
  id: string
  title: string
  subtitle: string
  description: string
  highlight: string | null
  days: string
  time: string | null
  note: string | null
  imageUrl: string
  theme: 'green' | 'terracotta' | 'charcoal'
  sortOrder: number
  isActive: boolean
}

export type AdminBanner = {
  id: string
  message: string
  href: string
  isActive: boolean
}

type SpecialRow = {
  id: string
  title: string
  subtitle: string
  description: string
  highlight: string | null
  days: string
  time: string | null
  note: string | null
  image_url: string
  theme: string
  sort_order: number
  is_active: boolean
}

const SPECIAL_COLS =
  'id, title, subtitle, description, highlight, days, time, note, image_url, theme, sort_order, is_active'

function rowToSpecial(r: SpecialRow): AdminSpecial {
  return {
    id: r.id,
    title: r.title,
    subtitle: r.subtitle,
    description: r.description,
    highlight: r.highlight,
    days: r.days,
    time: r.time,
    note: r.note,
    imageUrl: r.image_url,
    theme: r.theme as AdminSpecial['theme'],
    sortOrder: r.sort_order,
    isActive: r.is_active,
  }
}

export async function getAdminSpecials(): Promise<AdminSpecial[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('specials')
    .select(SPECIAL_COLS)
    .order('sort_order', { ascending: true })
  if (error) console.error('getAdminSpecials failed:', error)
  return (data ?? []).map((r) => rowToSpecial(r as SpecialRow))
}

export async function getAdminSpecial(id: string): Promise<AdminSpecial | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.from('specials').select(SPECIAL_COLS).eq('id', id).maybeSingle()
  if (error) console.error('getAdminSpecial failed:', error)
  return data ? rowToSpecial(data as SpecialRow) : null
}

export async function getAdminBanner(): Promise<AdminBanner | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('site_banner')
    .select('id, message, href, is_active')
    .maybeSingle()
  if (error) console.error('getAdminBanner failed:', error)
  return data ? { id: data.id, message: data.message, href: data.href, isActive: data.is_active } : null
}
