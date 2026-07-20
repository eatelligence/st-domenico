import type { Metadata } from 'next'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import StickyHeader from '@/components/sections/StickyHeader'
import { restaurantInfo } from '@/lib/data/hours'

const Footer = dynamic(() => import('@/components/sections/Footer'))

export const metadata: Metadata = {
  title: 'Wood-Fired Neapolitan Pizza in Richmond | St Domenico',
  description:
    'Hand-stretched Neapolitan pizza on Bridge Rd, Richmond. Italian "00" flour, San Marzano tomatoes, fior di latte, fired at 450°C. Gluten-free bases available. BYO wine.',
  alternates: {
    canonical: 'https://stdomenicopizzabar.com/pizza',
  },
  openGraph: {
    title: 'Wood-Fired Neapolitan Pizza in Richmond | St Domenico',
    description:
      'Hand-stretched Neapolitan pizza on Bridge Rd, Richmond. Fired at 450°C in a wood-burning forno. Gluten-free bases available. BYO wine.',
    url: 'https://stdomenicopizzabar.com/pizza',
    siteName: 'St Domenico',
    locale: 'en_AU',
    type: 'article',
    images: [{ url: '/images/pizza-1.jpg', width: 1200, height: 630, alt: 'Neapolitan pizza at St Domenico Richmond' }],
  },
}

const steps = [
  {
    title: 'The dough',
    body: 'Every dough ball is made with Italian "00" flour and hand-stretched to order — never rolled, never pressed by machine. Hand-stretching is what pushes the air out to the rim and leaves the centre thin, which is why the cornicione puffs the way it does.',
  },
  {
    title: 'The tomatoes',
    body: 'San Marzano tomatoes, grown in the volcanic soil on the slopes of Mount Vesuvius. They are lower in acid and sweeter than standard tinned tomatoes, so the sauce needs nothing but a little salt.',
  },
  {
    title: 'The cheese',
    body: 'Imported fior di latte, torn rather than grated. It carries more moisture than pre-shredded mozzarella, which is what gives a Neapolitan pizza its pooled, milky finish.',
  },
  {
    title: 'The forno',
    body: 'Sixty to ninety seconds in a wood-burning oven at 450°C. That heat is the part that cannot be faked — a conventional domestic oven tops out around 250°C and will never produce the leopard-spotted char on the crust.',
  },
]

export default function PizzaPage() {
  return (
    <main className="relative bg-cream">
      <StickyHeader />

      <article className="max-w-3xl mx-auto px-5 sm:px-8 pt-32 pb-20">
        <header className="mb-12">
          <span className="font-bebas text-terracotta tracking-[0.4em] text-sm">
            Richmond, Melbourne
          </span>
          <div className="w-12 h-px bg-terracotta mt-2 mb-6" />
          <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl text-charcoal leading-tight mb-6">
            Wood-fired Neapolitan pizza <em className="text-terracotta">in Richmond</em>
          </h1>
          <p className="font-inter text-charcoal/70 text-lg leading-relaxed">
            St Domenico has been making Neapolitan pizza on Bridge Road since 2015. Not
            Neapolitan-style — Neapolitan: hand-stretched dough, imported ingredients, and a
            wood-burning forno that runs hot enough to cook a pizza in under ninety seconds.
          </p>
        </header>

        <section className="mb-14">
          <h2 className="font-playfair text-3xl text-charcoal mb-8">
            What makes it Neapolitan
          </h2>
          <div className="space-y-8">
            {steps.map((step) => (
              <div key={step.title}>
                <h3 className="font-playfair text-xl font-semibold text-charcoal mb-2">
                  {step.title}
                </h3>
                <p className="font-inter text-charcoal/70 leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-14">
          <h2 className="font-playfair text-3xl text-charcoal mb-6">What to order</h2>
          <p className="font-inter text-charcoal/70 leading-relaxed mb-4">
            The <strong>Margherita</strong> is the benchmark — San Marzano, fior di latte, basil,
            and nowhere to hide. The <strong>Della Lupa</strong> pairs nduja and honey against
            burrata for a sweet-heat contrast, and the <strong>Tartufo</strong> leans earthy with
            mushrooms, truffle oil and parmigiano. For something richer, the{' '}
            <strong>Quattro Formaggi</strong> runs gorgonzola, pecorino, parmigiano and fior di
            latte together.
          </p>
          <p className="font-inter text-charcoal/70 leading-relaxed">
            Every pizza on the menu is available on a <strong>gluten-free base</strong> for an
            additional $3. Please tell your server about any gluten sensitivity or coeliac
            requirement when ordering — every care is taken, though the kitchen does handle
            gluten-containing products.
          </p>
        </section>

        <section className="mb-14">
          <h2 className="font-playfair text-3xl text-charcoal mb-6">Visiting us</h2>
          <p className="font-inter text-charcoal/70 leading-relaxed">
            We are at <strong>{restaurantInfo.address}</strong>, open Tuesday to Sunday from
            4:30pm and closed Mondays. St Domenico is <strong>BYO wine</strong> — bring your own
            bottle, or order from our list of Italian and Australian wines by the glass. Street
            parking is available on Bridge Road and the surrounding streets.
          </p>
        </section>

        <div className="flex flex-wrap gap-4">
          <Link
            href="/menu"
            className="font-bebas tracking-[0.2em] text-sm px-8 py-4 bg-terracotta text-cream hover:bg-terracotta/90 transition-colors"
          >
            See the full menu
          </Link>
          <a
            href={restaurantInfo.bookingUrl}
            className="font-bebas tracking-[0.2em] text-sm px-8 py-4 border border-charcoal/30 text-charcoal hover:bg-charcoal hover:text-cream transition-colors"
          >
            Book a table
          </a>
        </div>
      </article>

      <Footer />
    </main>
  )
}
