'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logout } from '@/app/admin/actions/auth'
import { LayoutGrid, Tag, LogOut } from 'lucide-react'

const links = [
  { href: '/admin/menu', label: 'Menu', icon: LayoutGrid },
  { href: '/admin/categories', label: 'Categorie', icon: Tag },
]

export default function AdminNav() {
  const pathname = usePathname()

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-56 shrink-0 bg-charcoal min-h-screen">
        <div className="px-6 py-6 border-b border-white/10">
          <div className="font-bebas text-xl tracking-[0.15em] text-cream">St Domenico</div>
          <div className="text-[10px] font-inter text-cream/30 tracking-[0.25em] uppercase mt-0.5">Admin</div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm font-inter rounded transition-colors ${
                  active ? 'bg-white/10 text-cream' : 'text-cream/50 hover:text-cream hover:bg-white/5'
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            )
          })}
        </nav>

        <div className="px-3 pb-6">
          <form action={logout}>
            <button
              type="submit"
              className="flex items-center gap-3 px-3 py-2.5 w-full text-sm font-inter text-cream/40 hover:text-cream transition-colors rounded hover:bg-white/5"
            >
              <LogOut size={16} />
              Esci
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile bottom bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-charcoal border-t border-white/10 flex">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-inter tracking-wide transition-colors ${
                active ? 'text-cream' : 'text-cream/40'
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          )
        })}
        <form action={logout} className="flex-1">
          <button type="submit" className="flex flex-col items-center gap-1 py-3 w-full text-[10px] font-inter tracking-wide text-cream/40">
            <LogOut size={18} />
            Esci
          </button>
        </form>
      </nav>
    </>
  )
}
