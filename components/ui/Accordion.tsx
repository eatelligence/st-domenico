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
          {/* Grid trick: GPU-composited expand/collapse — no layout reflow unlike max-height */}
          <div
            className="grid transition-[grid-template-rows] duration-300 ease-in-out"
            style={{ gridTemplateRows: openIndex === i ? '1fr' : '0fr' }}
          >
            <div className="overflow-hidden">
              <div
                className="pt-4 text-charcoal/70 text-sm leading-relaxed"
                style={{
                  opacity: openIndex === i ? 1 : 0,
                  transition: 'opacity 0.25s ease',
                }}
              >
                {item.content}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
