import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  // Only include canonical, indexable URLs. In-page anchors (#about, #menu,
  // #bookings, #contact) all canonicalise to the homepage, so listing them here
  // creates conflicting canonicalisation signals (Ahrefs: "Non-canonical page
  // in sitemap"). Search engines ignore URL fragments anyway.
  return [
    {
      url: 'https://stdomenicopizzabar.com',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ]
}
