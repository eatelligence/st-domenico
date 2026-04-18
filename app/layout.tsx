import type { Metadata } from 'next'
import './globals.css'
import { restaurantInfo } from '@/lib/data/hours'
import CookieBanner from '@/components/ui/CookieBanner'
import CustomCursor from '@/components/ui/CustomCursor'

export const metadata: Metadata = {
  metadataBase: new URL('https://stdomenicopizzabar.com'),
  title: 'St Domenico Pizza Bar | Authentic Neapolitan Pizza in Richmond, Melbourne',
  description:
    'Experience the authentic taste of Naples at St Domenico Pizza Bar in Richmond. Award-winning Neapolitan pizza, handcrafted with imported Italian ingredients. Book your table today.',
  keywords: [
    'St Domenico',
    'pizza bar',
    'Richmond Melbourne',
    'Neapolitan pizza',
    'Italian restaurant',
    'pizza Richmond',
    'authentic Italian',
    'pizza Melbourne',
  ],
  authors: [{ name: 'St Domenico Pizza Bar' }],
  openGraph: {
    title: 'St Domenico Pizza Bar | Richmond, Melbourne',
    description: 'Authentic Neapolitan pizza in the heart of Richmond. Book your table today.',
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
    title: 'St Domenico Pizza Bar | Richmond, Melbourne',
    description: 'Authentic Neapolitan pizza in the heart of Richmond.',
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        <CustomCursor />
        {children}
        <CookieBanner />
      </body>
    </html>
  )
}
