import { MetadataRoute } from 'next'

// AI assistant / answer-engine crawlers we explicitly welcome so St Domenico can
// be surfaced and cited by ChatGPT, Claude, Perplexity, Google AI Overviews, etc.
// (Allow is the default, but stating it explicitly is a clear, durable signal.)
const aiBots = [
  'GPTBot',
  'ChatGPT-User',
  'OAI-SearchBot',
  'ClaudeBot',
  'Claude-User',
  'anthropic-ai',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
  'Amazonbot',
  'CCBot',
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: '/admin' },
      { userAgent: aiBots, allow: '/', disallow: '/admin' },
    ],
    sitemap: 'https://stdomenicopizzabar.com/sitemap.xml',
    host: 'https://stdomenicopizzabar.com',
  }
}
