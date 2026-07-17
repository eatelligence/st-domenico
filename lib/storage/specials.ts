import type { SupabaseClient } from '@supabase/supabase-js'

const MAX_BYTES = 5 * 1024 * 1024
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp']

const EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}

/**
 * Uploads a special's image to the public `specials` bucket.
 * Returns the public URL. Throws with a user-facing message on invalid input.
 */
export async function uploadSpecialImage(supabase: SupabaseClient, file: File): Promise<string> {
  if (!ALLOWED.includes(file.type)) {
    throw new Error('Image must be a JPEG, PNG or WebP file.')
  }
  if (file.size > MAX_BYTES) {
    throw new Error('Image must be smaller than 5 MB.')
  }

  const path = `${crypto.randomUUID()}.${EXT[file.type]}`
  const { error } = await supabase.storage.from('specials').upload(path, file, {
    contentType: file.type,
    upsert: false,
  })
  if (error) throw new Error('Image upload failed. Please try again.')

  const { data } = supabase.storage.from('specials').getPublicUrl(path)
  return data.publicUrl
}
