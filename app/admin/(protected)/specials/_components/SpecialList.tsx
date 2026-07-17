'use client'

import { useState, useTransition } from 'react'
import Image from 'next/image'
import { deleteSpecial, restoreSpecial } from '@/app/admin/actions/specials'
import type { AdminSpecial } from '@/lib/db/queries/admin'
import { Pencil, Trash2, RotateCcw } from 'lucide-react'
import SpecialForm from './SpecialForm'

export default function SpecialList({ specials }: { specials: AdminSpecial[] }) {
  const [editSpecial, setEditSpecial] = useState<AdminSpecial | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleDelete = (id: string) => {
    startTransition(() => {
      deleteSpecial(id)
      setConfirmDelete(null)
    })
  }

  const handleRestore = (id: string) => {
    startTransition(() => restoreSpecial(id))
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1 min-w-0">
        <div className="bg-white border border-gold/20">
          {specials.length === 0 && (
            <div className="px-6 py-12 text-center font-inter text-sm text-charcoal/40">
              No specials yet.
            </div>
          )}
          {specials.map((special) => (
            <div
              key={special.id}
              className={`flex items-start gap-3 px-4 py-4 border-b border-gold/10 last:border-0 ${
                !special.isActive ? 'opacity-40 bg-cream/30' : ''
              }`}
            >
              <div className="relative w-16 h-12 shrink-0 bg-cream/50">
                <Image src={special.imageUrl} alt="" fill quality={40} sizes="64px" className="object-cover" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="font-inter text-sm font-medium text-charcoal">{special.title}</span>
                  <span className="text-[10px] bg-gold/10 text-charcoal/60 px-1.5 py-0.5 font-bebas tracking-wide uppercase">
                    {special.theme}
                  </span>
                  {special.highlight && (
                    <span className="text-[10px] bg-terracotta/10 text-terracotta px-1.5 py-0.5 font-bebas tracking-wide">
                      {special.highlight}
                    </span>
                  )}
                </div>
                {special.subtitle && (
                  <p className="font-inter text-xs text-charcoal/40 mt-0.5 line-clamp-1">{special.subtitle}</p>
                )}
                <div className="flex gap-3 mt-1">
                  {special.days && <span className="font-inter text-xs text-charcoal/60">{special.days}</span>}
                  {special.time && <span className="font-inter text-xs text-charcoal/40">{special.time}</span>}
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                {!special.isActive ? (
                  <button onClick={() => handleRestore(special.id)} disabled={isPending}
                    className="p-2 text-charcoal/30 hover:text-deep-green transition-colors" title="Restore">
                    <RotateCcw size={14} />
                  </button>
                ) : (
                  <>
                    <button onClick={() => { setEditSpecial(special); setConfirmDelete(null) }}
                      className="p-2 text-charcoal/30 hover:text-terracotta transition-colors" title="Edit">
                      <Pencil size={14} />
                    </button>
                    {confirmDelete === special.id ? (
                      <span className="flex items-center gap-1 text-xs font-inter">
                        <button onClick={() => handleDelete(special.id)} disabled={isPending}
                          className="text-terracotta hover:underline">Yes</button>
                        <span className="text-charcoal/30">/</span>
                        <button onClick={() => setConfirmDelete(null)}
                          className="text-charcoal/40 hover:underline">No</button>
                      </span>
                    ) : (
                      <button onClick={() => setConfirmDelete(special.id)}
                        className="p-2 text-charcoal/30 hover:text-terracotta transition-colors" title="Delete">
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

      <div className="lg:w-80 shrink-0">
        <SpecialForm editSpecial={editSpecial} onCancelEdit={() => setEditSpecial(null)} />
      </div>
    </div>
  )
}
