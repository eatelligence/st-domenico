'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { login } from '@/app/admin/actions/auth'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-charcoal text-cream font-bebas tracking-[0.2em] py-3.5 hover:bg-terracotta transition-colors disabled:opacity-50"
    >
      {pending ? 'Accesso...' : 'Entra nella cucina'}
    </button>
  )
}

export default function LoginForm() {
  const [state, action] = useFormState(login, { error: '' })

  return (
    <form action={action} className="space-y-5">
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

      {state.error && (
        <p className="text-sm text-terracotta bg-terracotta/5 border border-terracotta/20 px-3 py-2">
          {state.error}
        </p>
      )}

      <SubmitButton />
    </form>
  )
}
