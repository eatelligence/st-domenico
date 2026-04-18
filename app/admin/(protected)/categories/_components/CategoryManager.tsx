'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { useRef, useState, useTransition } from 'react'
import { createCategory, deleteCategory } from '@/app/admin/actions/categories'
import type { AdminCategory } from '@/lib/db/queries/admin'
import { Trash2 } from 'lucide-react'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-terracotta text-cream font-bebas tracking-[0.15em] py-2.5 hover:bg-terracotta/90 transition-colors disabled:opacity-50 text-sm"
    >
      {pending ? 'Salvataggio...' : 'Aggiungi'}
    </button>
  )
}

type Props = { categories: AdminCategory[] }

export default function CategoryManager({ categories }: Props) {
  const formRef = useRef<HTMLFormElement>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState('')
  const [isPending, startTransition] = useTransition()
  const [state, action] = useFormState(createCategory, { error: '' })

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const result = await deleteCategory(id)
      if (result?.error) setDeleteError(result.error)
      setConfirmDelete(null)
    })
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1">
        <div className="bg-white border border-gold/20">
          {categories.map((cat) => (
            <div key={cat.id} className={`flex items-center gap-4 px-4 py-4 border-b border-gold/10 last:border-0 ${!cat.isActive ? 'opacity-40' : ''}`}>
              <span className="text-xl w-8 text-center">{cat.emoji}</span>
              <div className="flex-1">
                <div className="font-inter text-sm font-medium text-charcoal">{cat.label}</div>
                <div className="font-inter text-xs text-charcoal/40">
                  {cat.itemCount} {cat.itemCount === 1 ? 'prodotto' : 'prodotti'}
                </div>
              </div>
              {cat.isActive && (
                confirmDelete === cat.id ? (
                  <span className="flex items-center gap-1 text-xs font-inter">
                    <button onClick={() => handleDelete(cat.id)} disabled={isPending} className="text-terracotta hover:underline">Sì</button>
                    <span className="text-charcoal/30">/</span>
                    <button onClick={() => { setConfirmDelete(null); setDeleteError('') }} className="text-charcoal/40 hover:underline">No</button>
                  </span>
                ) : (
                  <button onClick={() => { setConfirmDelete(cat.id); setDeleteError('') }}
                    className="p-2 text-charcoal/20 hover:text-terracotta transition-colors" title="Elimina categoria">
                    <Trash2 size={14} />
                  </button>
                )
              )}
            </div>
          ))}
          {categories.length === 0 && (
            <div className="px-6 py-10 text-center font-inter text-sm text-charcoal/40">Nessuna categoria.</div>
          )}
        </div>
        {deleteError && <p className="text-xs text-terracotta mt-2 px-1">{deleteError}</p>}
      </div>

      <div className="lg:w-72 shrink-0">
        <div className="bg-white border border-gold/20 p-6">
          <h2 className="font-playfair text-lg text-charcoal mb-5">Aggiungi categoria</h2>
          <form ref={formRef} action={action} className="space-y-4">
            <div>
              <label className="block text-xs font-inter text-charcoal/60 mb-1 uppercase tracking-wider">Emoji</label>
              <input name="emoji" defaultValue="🍽️" className="w-full border border-gold/30 px-3 py-2 text-sm focus:outline-none focus:border-terracotta bg-cream/40" />
            </div>
            <div>
              <label className="block text-xs font-inter text-charcoal/60 mb-1 uppercase tracking-wider">Nome *</label>
              <input name="label" required className="w-full border border-gold/30 px-3 py-2 text-sm focus:outline-none focus:border-terracotta bg-cream/40" />
            </div>
            {state.error && <p className="text-xs text-terracotta">{state.error}</p>}
            <SubmitButton />
          </form>
        </div>
      </div>
    </div>
  )
}
