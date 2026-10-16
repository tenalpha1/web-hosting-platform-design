import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/dashboard', '/api/'] },
    sitemap: 'https://www.bgwdomains.com/sitemap.xml',
    host: 'https://www.bgwdomains.com',
  }
}
