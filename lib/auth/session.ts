import { getIronSession, type SessionOptions } from 'iron-session'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export type SessionData = {
  isAdmin?: boolean
}

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET as string,
  cookieName: 'stdomenico-admin',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
}

export async function getSession() {
  return getIronSession<SessionData>(await cookies(), sessionOptions)
}

export async function getAdminSession() {
  const session = await getSession()
  if (!session.isAdmin) redirect('/admin/login')
  return session
}
