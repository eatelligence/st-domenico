'use server'

import bcrypt from 'bcryptjs'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth/session'

export async function login(prevState: { error: string }, formData: FormData) {
  const password = formData.get('password') as string
  const hash = process.env.ADMIN_PASSWORD_HASH as string

  const valid = await bcrypt.compare(password, hash)
  if (!valid) return { error: 'Incorrect password.' }

  const session = await getSession()
  session.isAdmin = true
  await session.save()

  redirect('/admin/menu')
}

export async function logout() {
  const session = await getSession()
  session.destroy()
  redirect('/admin/login')
}
