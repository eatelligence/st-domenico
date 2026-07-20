import type { Metadata } from 'next'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import StickyHeader from '@/components/sections/StickyHeader'
import MenuFull from '@/components/sections/MenuFull'
import { getMenuCategories } from '@/lib/db/queries/menu'
import { menuCategories as staticCategories } from '@/lib/data/menu'
import { restaurantInfo } from '@/lib/data/hours'

const Footer = dynamic(() => import('@/components/sections/Footer'))

export const metadata: Metadata = {
  title: 'Menu | St Domenico — Italian Restaurant & Pizzeria, Richmond',
  description:
    'The full St Domenico menu: Neapolitan pizza, house-made pasta, antipasti and dolci. Bridge Rd, Richmond. Gluten-free bases available. BYO wine. Open Tue–Sun from 4:30pm.',
  alternates: {
    canonical: 'https://stdomenicopizzabar.com/menu',
  },
  openGraph: {
    title: 'Menu | St Domenico — Italian Restaurant & Pizzeria, Richmond',
    description:
      'Neapolitan pizza, house-made pasta, antipasti and dolci at St Domenico on Bridge Rd, Richmond. BYO wine.',
    url: 'https://stdomenicopizzabar.com/menu',
    siteName: 'St Domenico',
    locale: 'en_AU',
    type: 'article',
    images: [{ url: '/images/pizza-1.jpg', width: 1200, height: 630, alt: 'The menu at St Domenico Richmond' }],
  },
}

export default async function MenuPage() {
  // Same fallback as MenuServer: the DB is the source of truth, static data only
  // covers the window where the DB is unreachable or empty.
  let categories = await getMenuCategories().catch(() => [])
  if (categories.length === 0) categories = staticCategories

  return (
    <main className="relative bg-cream">
      <StickyHeader />

      <div className="max-w-3xl mx-auto px-5 sm:px-8 pt-32 pb-4">
        <span className="font-bebas text-terracotta tracking-[0.4em] text-sm">
          Richmond, Melbourne
        </span>
        <div className="w-12 h-px bg-terracotta mt-2 mb-6" />
        <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl text-charcoal leading-tight mb-6">
          The St Domenico <em className="text-terracotta">menu</em>
        </h1>
        <p className="font-inter text-charcoal/70 text-lg leading-relaxed mb-4">
          Our kitchen covers the full Italian table — antipasti, house-made pasta, wood-fired{' '}
          <Link href="/pizza" className="text-terracotta underline underline-offset-4">
            Neapolitan pizza
          </Link>{' '}
          and dolci. Everything is cooked to order at {restaurantInfo.address}, Tuesday to Sunday
          from 4:30pm.
        </p>
        <p className="font-inter text-charcoal/60 text-sm leading-relaxed">
          A gluten-free pizza base is available for every pizza on the menu for an additional $3.
          St Domenico is BYO wine. Prices and dishes may change with seasonal availability.
        </p>
      </div>

      <MenuFull categories={categories} />

      <div className="max-w-3xl mx-auto px-5 sm:px-8 pb-20 flex flex-wrap gap-4">
        <a
          href={restaurantInfo.bookingUrl}
          className="font-bebas tracking-[0.2em] text-sm px-8 py-4 bg-terracotta text-cream hover:bg-terracotta/90 transition-colors"
        >
          Book a table
        </a>
        <a
          href={restaurantInfo.orderPickup}
          className="font-bebas tracking-[0.2em] text-sm px-8 py-4 border border-charcoal/30 text-charcoal hover:bg-charcoal hover:text-cream transition-colors"
        >
          Order pickup
        </a>
      </div>

      <Footer />
    </main>
  )
}
