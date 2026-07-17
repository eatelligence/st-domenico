'use server'

import { revalidateTag, revalidatePath } from 'next/cache'
import { z } from 'zod'
import { requireUser } from '@/lib/supabase/server'

const BannerSchema = z.object({
  message: z.string().min(1, 'Message is required'),
  href: z.string().min(1, 'Link is required'),
  isActive: z.boolean(),
})

export async function updateBanner(id: string, prevState: { error: string }, formData: FormData) {
  const { supabase } = await requireUser()
  try {
    const data = BannerSchema.parse({
      message: formData.get('message'),
      href: formData.get('href'),
      isActive: formData.get('isActive') === 'on',
    })

    const { error } = await supabase
      .from('site_banner')
      .update({ message: data.message, href: data.href, is_active: data.isActive })
      .eq('id', id)
    if (error) throw error

    revalidateTag('banner')
    revalidatePath('/admin/banner', 'page')
    return { error: '' }
  } catch (e) {
    return { error: e instanceof z.ZodError ? e.issues[0]?.message ?? 'Invalid data.' : 'Error saving.' }
  }
}
