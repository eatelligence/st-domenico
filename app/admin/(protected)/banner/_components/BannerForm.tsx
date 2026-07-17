'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { updateBanner } from '@/app/admin/actions/banner'
import type { AdminBanner } from '@/lib/db/queries/admin'

const inputClass =
  'w-full border border-gold/30 px-3 py-2 text-sm text-charcoal focus:outline-none focus:border-terracotta bg-cream/40'
const labelClass = 'block text-xs font-inter text-charcoal/60 mb-1 uppercase tracking-wider'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-terracotta text-cream font-bebas tracking-[0.15em] py-2.5 px-8 hover:bg-terracotta/90 transition-colors disabled:opacity-50 text-sm"
    >
      {pending ? 'Saving...' : 'Save changes'}
    </button>
  )
}

export default function BannerForm({ banner }: { banner: AdminBanner }) {
  const boundUpdate = updateBanner.bind(null, banner.id)
  const [state, action] = useFormState(boundUpdate, { error: '' })

  return (
    <div className="bg-white border border-gold/20 p-6 max-w-xl">
      <form action={action} className="space-y-4">
        <div>
          <label className={labelClass}>Message *</label>
          <textarea name="message" defaultValue={banner.message} rows={2} required className={`${inputClass} resize-none`} />
        </div>

        <div>
          <label className={labelClass}>Link *</label>
          <input name="href" defaultValue={banner.href} required className={inputClass} />
          <p className="text-[10px] font-inter text-charcoal/40 mt-1">
            Where the bar links to — e.g. <code>#bookings</code>
          </p>
        </div>

        <label className="flex items-center gap-2 text-sm font-inter text-charcoal/70 cursor-pointer pt-1">
          <input type="checkbox" name="isActive" defaultChecked={banner.isActive} className="accent-terracotta w-4 h-4" />
          Show the bar on the site
        </label>

        {state.error && (
          <p className="text-xs text-terracotta bg-terracotta/5 border border-terracotta/20 px-3 py-2">{state.error}</p>
        )}

        <div className="pt-1">
          <SubmitButton />
        </div>
      </form>
    </div>
  )
}
