import { unstable_cache } from 'next/cache'
import { createAnonClient } from '@/lib/supabase/anon'
import type { Special, SpecialTheme } from '@/lib/data/specials'

export type Banner = {
  message: string
  href: string
}

async function fetchSpecials(): Promise<Special[]> {
  const supabase = createAnonClient()
  const { data, error } = await supabase
    .from('specials')
    .select('id, title, subtitle, description, highlight, days, time, note, image_url, theme')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
  if (error) console.error('getSpecials failed:', error)

  return (data ?? []).map((r) => ({
    id: r.id,
    title: r.title,
    subtitle: r.subtitle,
    description: r.description,
    days: r.days,
    time: r.time ?? undefined,
    note: r.note ?? undefined,
    highlight: r.highlight ?? undefined,
    imageUrl: r.image_url,
    theme: r.theme as SpecialTheme,
  }))
}

export const getSpecials = unstable_cache(fetchSpecials, ['specials'], {
  tags: ['specials'],
  revalidate: 3600,
})

// The anon RLS policy hides the row when is_active = false, so an inactive
// banner simply returns no row and the bar does not render.
async function fetchBanner(): Promise<Banner | null> {
  const supabase = createAnonClient()
  const { data, error } = await supabase
    .from('site_banner')
    .select('message, href')
    .eq('is_active', true)
    .maybeSingle()
  if (error) console.error('getBanner failed:', error)
  return data ? { message: data.message, href: data.href } : null
}

export const getBanner = unstable_cache(fetchBanner, ['site-banner'], {
  tags: ['banner'],
  revalidate: 3600,
})
