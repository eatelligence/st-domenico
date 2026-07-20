import type { Metadata } from 'next'
import { Playfair_Display, Inter, Bebas_Neue } from 'next/font/google'
import dynamic from 'next/dynamic'
import './globals.css'
import { restaurantInfo } from '@/lib/data/hours'

const CustomCursor = dynamic(() => import('@/components/ui/CustomCursor'), { ssr: false })
const CookieBanner = dynamic(() => import('@/components/ui/CookieBanner'), { ssr: false })

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
})

const bebas = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-bebas',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://stdomenicopizzabar.com'),
  title: 'Italian Restaurant & Pizzeria Richmond | St Domenico',
  description:
    'Italian restaurant and wood-fired pizzeria on Bridge Rd, Richmond. Neapolitan pizza, house pasta, BYO wine. Open Tue–Sun from 4:30pm. Book a table online.',
  authors: [{ name: 'St Domenico Pizza Bar' }],
  openGraph: {
    title: 'Italian Restaurant & Pizzeria Richmond | St Domenico',
    description: 'Italian restaurant and wood-fired pizzeria on Bridge Rd, Richmond. Neapolitan pizza, house pasta, BYO wine. Open Tue–Sun from 4:30pm. Book a table online.',
    url: 'https://stdomenicopizzabar.com',
    siteName: 'St Domenico Pizza Bar',
    locale: 'en_AU',
    type: 'website',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'St Domenico Pizza Bar',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Italian Restaurant & Pizzeria Richmond | St Domenico',
    description: 'Italian restaurant and wood-fired pizzeria on Bridge Rd, Richmond. BYO wine. Open Tue–Sun.',
    images: ['/images/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://stdomenicopizzabar.com',
  },
  verification: {
    google: 'GTpcrQhqu4ESHoctX0QgX6mO9ic3nX93KHLxQemQNxo',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Restaurant',
  name: restaurantInfo.name,
  description:
    'Authentic Neapolitan pizza bar in Richmond, Melbourne, serving traditional Italian cuisine with imported ingredients.',
  url: 'https://stdomenicopizzabar.com',
  telephone: restaurantInfo.phone,
  address: {
    '@type': 'PostalAddress',
    streetAddress: '428 Bridge Rd',
    addressLocality: 'Richmond',
    addressRegion: 'VIC',
    postalCode: '3121',
    addressCountry: 'AU',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: -37.824,
    longitude: 144.991,
  },
  servesCuisine: ['Italian', 'Neapolitan Pizza'],
  priceRange: '$$',
  currenciesAccepted: 'AUD',
  paymentAccepted: 'Cash, Credit Card',
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '16:30',
      closes: '22:00',
    },
  ],
  hasMap: restaurantInfo.googleMaps,
  sameAs: [restaurantInfo.instagram, restaurantInfo.facebook],
  hasMenu: 'https://stdomenicopizzabar.com/menu',
  acceptsReservations: restaurantInfo.bookingUrl,
  image: ['/images/restaurant-1.jpg', '/images/pizza-1.jpg', '/images/interior-1.jpg'],
  // No aggregateRating: self-serving review markup (ratings not collected on this
  // site) violates Google's structured data guidelines and risks a manual action.
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Preconnect to booking widget origin — saves ~340ms LCP */}
        <link rel="preconnect" href="https://reserve.oddle.me" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${playfair.variable} ${inter.variable} ${bebas.variable} antialiased`}>
        <CustomCursor />
        {children}
        <CookieBanner />
      </body>
    </html>
  )
}
