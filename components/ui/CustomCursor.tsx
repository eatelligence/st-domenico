'use client'

import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    let mouseX = 0, mouseY = 0
    let ringX = 0, ringY = 0
    let dotScale = 1, ringScale = 1
    let hovering = false

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      // Detect interactive elements — scale up cursor on hover
      hovering = !!(e.target as Element)?.closest(
        'a, button, [role="button"], input, select, textarea, label'
      )
    }

    let rafId: number
    const animate = () => {
      // Smooth lag on ring position
      ringX += (mouseX - ringX) * 0.12
      ringY += (mouseY - ringY) * 0.12

      // Smooth scale interpolation — all in one transform, no CSS scale conflict
      const target = hovering ? 1.5 : 1
      dotScale  += (target - dotScale)  * 0.18
      ringScale += (target - ringScale) * 0.14

      // GPU-composited transforms only — no left/top, no width/height
      dot.style.transform  = `translate(${mouseX - 4}px,  ${mouseY - 4}px)  scale(${dotScale})`
      ring.style.transform = `translate(${ringX - 16}px, ${ringY - 16}px) scale(${ringScale})`

      rafId = requestAnimationFrame(animate)
    }

    document.addEventListener('mousemove', handleMouseMove, { passive: true })
    rafId = requestAnimationFrame(animate)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <>
      <div ref={dotRef} className="cursor-dot hidden md:block" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring hidden md:block" aria-hidden="true" />
    </>
  )
}
