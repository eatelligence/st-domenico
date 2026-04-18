'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AccordionItem {
  title: string
  content: React.ReactNode
}

interface AccordionProps {
  items: AccordionItem[]
  className?: string
}

export default function Accordion({ items, className }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className={cn('divide-y divide-gold/20', className)}>
      {items.map((item, i) => (
        <div key={i} className="py-4">
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full flex items-center justify-between text-left group"
            aria-expanded={openIndex === i}
          >
            <span className="font-playfair text-lg text-charcoal group-hover:text-terracotta transition-colors">
              {item.title}
            </span>
            <ChevronDown
              size={18}
              className={cn(
                'text-gold transition-transform duration-300 flex-shrink-0',
                openIndex === i && 'rotate-180'
              )}
            />
          </button>
          <div
            className={cn(
              'overflow-hidden transition-all duration-400 ease-in-out',
              openIndex === i ? 'max-h-[600px] opacity-100 mt-4' : 'max-h-0 opacity-0'
            )}
          >
            <div className="text-charcoal/70 text-sm leading-relaxed">{item.content}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
