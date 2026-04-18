'use client'

import { useEffect, useRef, useState, startTransition } from 'react'

interface ScrollRevealProps {
  children: React.ReactNode
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  className?: string
  once?: boolean
}

const offsets: Record<string, string> = {
  up:    'translateY(32px)',
  down:  'translateY(-32px)',
  left:  'translateY(20px)',
  right: 'translateY(20px)',
  none:  'translateY(0)',
}

export default function ScrollReveal({
  children,
  delay = 0,
  direction = 'up',
  className,
  once = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Already in viewport on mount — show immediately, skip animation entirely
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight * 0.95) {
      setVisible(true)
      return
    }

    let cleanup: (() => void) | undefined

    const setup = () => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            startTransition(() => setVisible(true))
            if (once) observer.disconnect()
          } else if (!once) {
            startTransition(() => setVisible(false))
          }
        },
        { threshold: 0.08, rootMargin: '-20px 0px' }
      )
      observer.observe(el)
      cleanup = () => observer.disconnect()
    }

    // Defer observer creation to idle time — avoids blocking the initial hydration burst
    if ('requestIdleCallback' in window) {
      const id = (window as typeof window & { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => number }).requestIdleCallback(setup, { timeout: 500 })
      return () => {
        ;(window as typeof window & { cancelIdleCallback: (id: number) => void }).cancelIdleCallback(id)
        cleanup?.()
      }
    }

    setup()
    return () => cleanup?.()
  }, [once])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : offsets[direction],
        transition: `opacity 0.55s ease ${delay}s, transform 0.55s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  )
}
