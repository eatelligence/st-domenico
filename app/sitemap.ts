import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  // Only include canonical, indexable URLs. In-page anchors (#about, #menu,
  // #bookings, #contact) all canonicalise to the homepage, so listing them here
  // creates conflicting canonicalisation signals (Ahrefs: "Non-canonical page
  // in sitemap"). Search engines ignore URL fragments anyway.
  const lastModified = new Date()
  return [
    {
      url: 'https://stdomenicopizzabar.com',
      lastModified,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: 'https://stdomenicopizzabar.com/menu',
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: 'https://stdomenicopizzabar.com/pizza',
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ]
}
