import { getSession } from '@/lib/auth/session'
import { redirect } from 'next/navigation'
import LoginForm from './_components/LoginForm'

export const metadata = { title: 'Admin — St Domenico' }

export default async function LoginPage() {
  const session = await getSession()
  if (session.isAdmin) redirect('/admin/menu')

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="font-bebas text-3xl tracking-[0.15em] text-charcoal mb-1">
            St Domenico
          </div>
          <div className="text-xs font-inter text-charcoal/40 tracking-[0.3em] uppercase">
            Area Amministrativa
          </div>
          <div className="w-12 h-px bg-gold mx-auto mt-4" />
        </div>

        <div className="bg-white border border-gold/20 p-8 shadow-sm">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
