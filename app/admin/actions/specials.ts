'use server'

import { revalidateTag, revalidatePath } from 'next/cache'
import { z } from 'zod'
import { requireUser } from '@/lib/supabase/server'
import { uploadSpecialImage } from '@/lib/storage/specials'

const SpecialSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().default(''),
  description: z.string().default(''),
  highlight: z.string().optional(),
  days: z.string().default(''),
  time: z.string().optional(),
  note: z.string().optional(),
  theme: z.enum(['green', 'terracotta', 'charcoal']),
})

function parseForm(formData: FormData) {
  return SpecialSchema.parse({
    title: formData.get('title'),
    subtitle: formData.get('subtitle') ?? '',
    description: formData.get('description') ?? '',
    highlight: formData.get('highlight') || undefined,
    days: formData.get('days') ?? '',
    time: formData.get('time') || undefined,
    note: formData.get('note') || undefined,
    theme: formData.get('theme'),
  })
}

function pickFile(formData: FormData): File | null {
  const file = formData.get('image')
  // An untouched file input still submits an empty File — treat that as "no file".
  if (file instanceof File && file.size > 0) return file
  return null
}

function invalidate() {
  revalidateTag('specials')
  revalidatePath('/admin/specials', 'page')
}

function toMessage(e: unknown): string {
  if (e instanceof z.ZodError) return e.issues[0]?.message ?? 'Invalid data.'
  if (e instanceof Error) return e.message
  return 'Error saving.'
}

export async function createSpecial(prevState: { error: string }, formData: FormData) {
  const { supabase } = await requireUser()
  try {
    const data = parseForm(formData)
    const file = pickFile(formData)
    if (!file) throw new Error('An image is required.')
    const imageUrl = await uploadSpecialImage(supabase, file)

    const { data: maxRow } = await supabase
      .from('specials')
      .select('sort_order')
      .order('sort_order', { ascending: false })
      .limit(1)
      .maybeSingle()
    const sortOrder = (maxRow?.sort_order ?? -1) + 1

    const { error } = await supabase.from('specials').insert({
      title: data.title,
      subtitle: data.subtitle,
      description: data.description,
      highlight: data.highlight ?? null,
      days: data.days,
      time: data.time ?? null,
      note: data.note ?? null,
      image_url: imageUrl,
      theme: data.theme,
      sort_order: sortOrder,
    })
    if (error) throw error
    invalidate()
    return { error: '' }
  } catch (e) {
    return { error: toMessage(e) }
  }
}

export async function updateSpecial(id: string, prevState: { error: string }, formData: FormData) {
  const { supabase } = await requireUser()
  try {
    const data = parseForm(formData)
    const file = pickFile(formData)

    const fields: Record<string, unknown> = {
      title: data.title,
      subtitle: data.subtitle,
      description: data.description,
      highlight: data.highlight ?? null,
      days: data.days,
      time: data.time ?? null,
      note: data.note ?? null,
      theme: data.theme,
    }
    // No new file chosen — keep the existing image_url untouched.
    if (file) fields.image_url = await uploadSpecialImage(supabase, file)

    const { error } = await supabase.from('specials').update(fields).eq('id', id)
    if (error) throw error
    invalidate()
    return { error: '' }
  } catch (e) {
    return { error: toMessage(e) }
  }
}

export async function deleteSpecial(id: string) {
  const { supabase } = await requireUser()
  const { error } = await supabase.from('specials').update({ is_active: false }).eq('id', id)
  if (error) { console.error('deleteSpecial failed:', error); return }
  invalidate()
}

export async function restoreSpecial(id: string) {
  const { supabase } = await requireUser()
  const { error } = await supabase.from('specials').update({ is_active: true }).eq('id', id)
  if (error) { console.error('restoreSpecial failed:', error); return }
  invalidate()
}
