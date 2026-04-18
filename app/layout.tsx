import type { Metadata } from 'next'
import { Playfair_Display, Inter, Bebas_Neue } from 'next/font/google'
import './globals.css'
import { restaurantInfo } from '@/lib/data/hours'
import CookieBanner from '@/components/ui/CookieBanner'
import CustomCursor from '@/components/ui/CustomCursor'

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
  title: 'Best Neapolitan Pizza in Richmond Melbourne | St Domenico Pizza Bar',
  description:
    'St Domenico is Richmond Melbourne\'s home of authentic Neapolitan pizza. Wood-fired, hand-stretched dough, San Marzano tomatoes, imported fior di latte. Open Tue–Sun 4:30pm. BYO wine. Book online.',
  keywords: [
    'Neapolitan pizza Richmond Melbourne',
    'best pizza Richmond Melbourne',
    'St Domenico pizza bar',
    'Italian restaurant Richmond',
    'wood fired pizza Melbourne',
    'pizza bar Richmond Melbourne',
    'BYO pizza Richmond',
    'authentic Neapolitan pizza Melbourne',
    'pizza Bridge Road Richmond',
    'gluten free pizza Richmond',
  ],
  authors: [{ name: 'St Domenico Pizza Bar' }],
  openGraph: {
    title: 'Best Neapolitan Pizza in Richmond Melbourne | St Domenico Pizza Bar',
    description: 'Wood-fired Neapolitan pizza in Richmond, Melbourne. Hand-stretched dough, San Marzano tomatoes, imported fior di latte. BYO wine. Open Tue–Sun. Book online.',
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
    title: 'Best Neapolitan Pizza in Richmond Melbourne | St Domenico Pizza Bar',
    description: 'Wood-fired Neapolitan pizza in Richmond, Melbourne. BYO wine. Open Tue–Sun.',
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
  menu: 'https://stdomenicopizzabar.com/#menu',
  reservations: restaurantInfo.bookingUrl,
  image: ['/images/restaurant-1.jpg', '/images/pizza-1.jpg', '/images/interior-1.jpg'],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.7',
    reviewCount: '342',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
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
