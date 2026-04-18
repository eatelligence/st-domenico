'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { useEffect, useRef } from 'react'
import { createMenuItem, updateMenuItem } from '@/app/admin/actions/menu'
import type { AdminMenuItem } from '@/lib/db/queries/admin'

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex-1 bg-terracotta text-cream font-bebas tracking-[0.15em] py-2.5 hover:bg-terracotta/90 transition-colors disabled:opacity-50 text-sm"
    >
      {pending ? 'Salvataggio...' : label}
    </button>
  )
}

type Props = {
  categoryId: string
  editItem: AdminMenuItem | null
  onCancelEdit: () => void
}

export default function ItemForm({ categoryId, editItem, onCancelEdit }: Props) {
  const isEditing = editItem !== null
  const formRef = useRef<HTMLFormElement>(null)

  const boundCreate = createMenuItem.bind(null, categoryId)
  const boundUpdate = isEditing
    ? updateMenuItem.bind(null, editItem.id, categoryId)
    : createMenuItem.bind(null, categoryId)

  const [stateCreate, actionCreate] = useFormState(boundCreate, { error: '' })
  const [stateUpdate, actionUpdate] = useFormState(boundUpdate, { error: '' })

  const state = isEditing ? stateUpdate : stateCreate
  const action = isEditing ? actionUpdate : actionCreate

  useEffect(() => {
    if (!isEditing && stateCreate.error === '') {
      formRef.current?.reset()
    }
  }, [stateCreate, isEditing])

  const f = <K extends keyof AdminMenuItem>(field: K) => editItem?.[field]

  return (
    <div className="bg-white border border-gold/20 p-6">
      <h2 className="font-playfair text-lg text-charcoal mb-5">
        {isEditing ? `Modifica: ${editItem.name}` : 'Aggiungi prodotto'}
      </h2>

      <form ref={formRef} action={action} className="space-y-4">
        <div>
          <label className="block text-xs font-inter text-charcoal/60 mb-1 uppercase tracking-wider">Nome *</label>
          <input
            name="name"
            defaultValue={(f('name') as string) ?? ''}
            required
            className="w-full border border-gold/30 px-3 py-2 text-sm text-charcoal focus:outline-none focus:border-terracotta bg-cream/40"
          />
        </div>

        <div>
          <label className="block text-xs font-inter text-charcoal/60 mb-1 uppercase tracking-wider">Descrizione</label>
          <textarea
            name="description"
            defaultValue={(f('description') as string) ?? ''}
            rows={2}
            className="w-full border border-gold/30 px-3 py-2 text-sm text-charcoal focus:outline-none focus:border-terracotta bg-cream/40 resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-inter text-charcoal/60 mb-1 uppercase tracking-wider">Prezzo</label>
            <input name="price" defaultValue={(f('price') as string) ?? ''} placeholder="es. $24"
              className="w-full border border-gold/30 px-3 py-2 text-sm text-charcoal focus:outline-none focus:border-terracotta bg-cream/40" />
          </div>
          <div>
            <label className="block text-xs font-inter text-charcoal/60 mb-1 uppercase tracking-wider">Prezzo GF</label>
            <input name="priceGF" defaultValue={(f('priceGF') as string) ?? ''} placeholder="es. $27"
              className="w-full border border-gold/30 px-3 py-2 text-sm text-charcoal focus:outline-none focus:border-terracotta bg-cream/40" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-inter text-charcoal/60 mb-1 uppercase tracking-wider">Allergeni</label>
          <input name="allergens" defaultValue={(f('allergens') as string) ?? ''} placeholder="es. glutine, latte, uova"
            className="w-full border border-gold/30 px-3 py-2 text-sm text-charcoal focus:outline-none focus:border-terracotta bg-cream/40" />
        </div>

        <div>
          <label className="block text-xs font-inter text-charcoal/60 mb-1 uppercase tracking-wider">Badge (opzionale)</label>
          <input name="badge" defaultValue={(f('badge') as string) ?? ''} placeholder="es. Free Tue–Thu"
            className="w-full border border-gold/30 px-3 py-2 text-sm text-charcoal focus:outline-none focus:border-terracotta bg-cream/40" />
        </div>

        <div className="flex flex-wrap gap-4 pt-1">
          {[
            { name: 'isVegetarian', label: '🌱 Vegetariano', field: 'isVegetarian' as const },
            { name: 'isGlutenFree', label: 'GF Disponibile', field: 'isGlutenFree' as const },
            { name: 'isSeafood', label: '🦐 Pesce', field: 'isSeafood' as const },
          ].map(({ name, label, field }) => (
            <label key={name} className="flex items-center gap-2 text-sm font-inter text-charcoal/70 cursor-pointer">
              <input type="checkbox" name={name} defaultChecked={(f(field) as boolean) ?? false} className="accent-terracotta w-4 h-4" />
              {label}
            </label>
          ))}
        </div>

        {state.error && (
          <p className="text-xs text-terracotta bg-terracotta/5 border border-terracotta/20 px-3 py-2">{state.error}</p>
        )}

        <div className="flex gap-2 pt-1">
          <SubmitButton label={isEditing ? 'Salva modifiche' : 'Aggiungi'} />
          {isEditing && (
            <button type="button" onClick={onCancelEdit}
              className="px-4 border border-gold/30 text-charcoal/60 font-inter text-sm hover:bg-cream/50 transition-colors">
              Annulla
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
