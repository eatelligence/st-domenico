'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginForm() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    setError('')
    const form = new FormData(e.currentTarget)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email: String(form.get('email') ?? ''),
      password: String(form.get('password') ?? ''),
    })
    if (error) {
      setError('Incorrect email or password.')
      setPending(false)
      return
    }
    router.replace('/admin/menu')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-charcoal/70 mb-1.5">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="w-full border border-gold/30 bg-cream px-4 py-3 text-charcoal focus:outline-none focus:border-terracotta transition-colors"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-charcoal/70 mb-1.5">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full border border-gold/30 bg-cream px-4 py-3 text-charcoal focus:outline-none focus:border-terracotta transition-colors"
        />
      </div>

      {error && (
        <p className="text-sm text-terracotta bg-terracotta/5 border border-terracotta/20 px-3 py-2">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-charcoal text-cream font-bebas tracking-[0.2em] py-3.5 hover:bg-terracotta transition-colors disabled:opacity-50"
      >
        {pending ? 'Signing in...' : 'Enter Kitchen'}
      </button>
    </form>
  )
}
