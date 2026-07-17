'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { useEffect, useRef } from 'react'
import { createSpecial, updateSpecial } from '@/app/admin/actions/specials'
import type { AdminSpecial } from '@/lib/db/queries/admin'

const THEMES = [
  { value: 'green', label: 'Green' },
  { value: 'terracotta', label: 'Terracotta' },
  { value: 'charcoal', label: 'Charcoal' },
] as const

const inputClass =
  'w-full border border-gold/30 px-3 py-2 text-sm text-charcoal focus:outline-none focus:border-terracotta bg-cream/40'
const labelClass = 'block text-xs font-inter text-charcoal/60 mb-1 uppercase tracking-wider'

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex-1 bg-terracotta text-cream font-bebas tracking-[0.15em] py-2.5 hover:bg-terracotta/90 transition-colors disabled:opacity-50 text-sm"
    >
      {pending ? 'Saving...' : label}
    </button>
  )
}

type Props = {
  editSpecial: AdminSpecial | null
  onCancelEdit: () => void
}

export default function SpecialForm({ editSpecial, onCancelEdit }: Props) {
  const isEditing = editSpecial !== null
  const formRef = useRef<HTMLFormElement>(null)

  const boundUpdate = isEditing ? updateSpecial.bind(null, editSpecial.id) : createSpecial

  const [stateCreate, actionCreate] = useFormState(createSpecial, { error: '' })
  const [stateUpdate, actionUpdate] = useFormState(boundUpdate, { error: '' })

  const state = isEditing ? stateUpdate : stateCreate
  const action = isEditing ? actionUpdate : actionCreate

  useEffect(() => {
    if (!isEditing && stateCreate.error === '') {
      formRef.current?.reset()
    }
  }, [stateCreate, isEditing])

  return (
    <div className="bg-white border border-gold/20 p-6">
      <h2 className="font-playfair text-lg text-charcoal mb-5">
        {isEditing ? `Edit: ${editSpecial.title}` : 'Add special'}
      </h2>

      <form ref={formRef} action={action} encType="multipart/form-data" className="space-y-4">
        <div>
          <label className={labelClass}>Title *</label>
          <input name="title" defaultValue={editSpecial?.title ?? ''} required className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Subtitle</label>
          <input name="subtitle" defaultValue={editSpecial?.subtitle ?? ''} placeholder="e.g. All You Can Eat" className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Description</label>
          <textarea name="description" defaultValue={editSpecial?.description ?? ''} rows={4}
            className={`${inputClass} resize-none`} />
        </div>

        <div>
          <label className={labelClass}>Highlight</label>
          <input name="highlight" defaultValue={editSpecial?.highlight ?? ''} placeholder="e.g. $39 per person" className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Days</label>
          <input name="days" defaultValue={editSpecial?.days ?? ''} placeholder="e.g. Tuesday · Wednesday · Thursday" className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Time</label>
          <input name="time" defaultValue={editSpecial?.time ?? ''} placeholder="e.g. From 5:00pm" className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Note</label>
          <textarea name="note" defaultValue={editSpecial?.note ?? ''} rows={2}
            placeholder="Small print shown under the card" className={`${inputClass} resize-none`} />
        </div>

        <div>
          <label className={labelClass}>Theme</label>
          <select name="theme" defaultValue={editSpecial?.theme ?? 'charcoal'} className={inputClass}>
            {THEMES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Image {isEditing ? '(leave empty to keep current)' : '*'}</label>
          <input
            type="file"
            name="image"
            accept="image/jpeg,image/png,image/webp"
            className="w-full text-xs font-inter text-charcoal/60 file:mr-3 file:border-0 file:bg-charcoal file:text-cream file:px-3 file:py-1.5 file:text-xs file:font-bebas file:tracking-wider"
          />
          <p className="text-[10px] font-inter text-charcoal/40 mt-1">JPEG, PNG or WebP · max 5 MB</p>
        </div>

        {state.error && (
          <p className="text-xs text-terracotta bg-terracotta/5 border border-terracotta/20 px-3 py-2">{state.error}</p>
        )}

        <div className="flex gap-2 pt-1">
          <SubmitButton label={isEditing ? 'Save changes' : 'Add special'} />
          {isEditing && (
            <button type="button" onClick={onCancelEdit}
              className="px-4 border border-gold/30 text-charcoal/60 font-inter text-sm hover:bg-cream/50 transition-colors">
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
