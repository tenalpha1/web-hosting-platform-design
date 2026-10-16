import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

const DESCRIPTION =
  'Reliable, secure web hosting for people who want to get online without the technical maze. Indigenous-owned and Canadian, from $8.95/month CAD.'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.bgwdomains.com'),
  title: 'BGW Domain — A faster home for your website',
  description: DESCRIPTION,
  applicationName: 'BGW Domain',
  openGraph: {
    type: 'website',
    siteName: 'BGW Domain',
    title: 'BGW Domain — A faster home for your website',
    description: DESCRIPTION,
    locale: 'en_CA',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BGW Domain — A faster home for your website',
    description: DESCRIPTION,
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
