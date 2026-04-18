'use client'

import { useState, useTransition } from 'react'
import { deleteMenuItem, restoreMenuItem } from '@/app/admin/actions/menu'
import type { AdminMenuItem } from '@/lib/db/queries/admin'
import { Pencil, Trash2, RotateCcw } from 'lucide-react'
import ItemForm from './ItemForm'

type Props = {
  categoryId: string
  items: AdminMenuItem[]
}

export default function ItemList({ categoryId, items }: Props) {
  const [editItem, setEditItem] = useState<AdminMenuItem | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleDelete = (id: string) => {
    startTransition(() => {
      deleteMenuItem(id, categoryId)
      setConfirmDelete(null)
    })
  }

  const handleRestore = (id: string) => {
    startTransition(() => restoreMenuItem(id, categoryId))
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Item list */}
      <div className="flex-1 min-w-0">
        <div className="bg-white border border-gold/20">
          {items.length === 0 && (
            <div className="px-6 py-12 text-center font-inter text-sm text-charcoal/40">
              Nessun prodotto in questa categoria.
            </div>
          )}
          {items.map((item) => (
            <div
              key={item.id}
              className={`flex items-start gap-3 px-4 py-4 border-b border-gold/10 last:border-0 ${
                !item.isActive ? 'opacity-40 bg-cream/30' : ''
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="font-inter text-sm font-medium text-charcoal">{item.name}</span>
                  {item.isVegetarian && <span className="text-[10px] bg-deep-green/10 text-deep-green px-1.5 py-0.5 font-bebas tracking-wide">VEG</span>}
                  {item.isGlutenFree && <span className="text-[10px] bg-gold/10 text-charcoal/60 px-1.5 py-0.5 font-bebas tracking-wide">GF</span>}
                  {item.isSeafood && <span className="text-[10px] bg-blue-50 text-blue-500 px-1.5 py-0.5 font-bebas tracking-wide">PESCE</span>}
                  {item.badge && <span className="text-[10px] bg-terracotta/10 text-terracotta px-1.5 py-0.5 font-bebas tracking-wide">{item.badge}</span>}
                </div>
                {item.description && (
                  <p className="font-inter text-xs text-charcoal/40 mt-0.5 line-clamp-1">{item.description}</p>
                )}
                <div className="flex gap-3 mt-1">
                  {item.price && <span className="font-inter text-xs text-charcoal/60">{item.price}</span>}
                  {item.priceGF && <span className="font-inter text-xs text-charcoal/40">GF {item.priceGF}</span>}
                  {item.allergens && <span className="font-inter text-xs text-charcoal/40 italic">{item.allergens}</span>}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0">
                {!item.isActive ? (
                  <button
                    onClick={() => handleRestore(item.id)}
                    disabled={isPending}
                    className="p-2 text-charcoal/30 hover:text-deep-green transition-colors"
                    title="Ripristina"
                  >
                    <RotateCcw size={14} />
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => { setEditItem(item); setConfirmDelete(null) }}
                      className="p-2 text-charcoal/30 hover:text-terracotta transition-colors"
                      title="Modifica"
                    >
                      <Pencil size={14} />
                    </button>
                    {confirmDelete === item.id ? (
                      <span className="flex items-center gap-1 text-xs font-inter">
                        <button
                          onClick={() => handleDelete(item.id)}
                          disabled={isPending}
                          className="text-terracotta hover:underline"
                        >
                          Sì
                        </button>
                        <span className="text-charcoal/30">/</span>
                        <button
                          onClick={() => setConfirmDelete(null)}
                          className="text-charcoal/40 hover:underline"
                        >
                          No
                        </button>
                      </span>
                    ) : (
                      <button
                        onClick={() => setConfirmDelete(item.id)}
                        className="p-2 text-charcoal/30 hover:text-terracotta transition-colors"
                        title="Elimina"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Form panel */}
      <div className="lg:w-80 shrink-0">
        <ItemForm
          categoryId={categoryId}
          editItem={editItem}
          onCancelEdit={() => setEditItem(null)}
        />
      </div>
    </div>
  )
}
