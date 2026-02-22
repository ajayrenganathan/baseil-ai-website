import type { Metadata } from 'next'
import { Newsreader, Outfit } from 'next/font/google'
import './globals.css'

const newsreader = Newsreader({
  subsets: ['latin'],
  variable: '--font-newsreader',
  display: 'swap',
})

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://baseil.ai'),
  title: {
    default: 'Baseil — Get All Your Data Talking',
    template: '%s | Baseil',
  },
  description:
    'One data agent. Every database. Ask in plain English, get answers instantly. Baseil maps your schemas, connects your data, and serves it to humans and AI agents.',
  keywords: [
    'data agent',
    'data retrieval',
    'AI agents for data',
    'data intelligence',
    'database to MCP',
    'MCP tools',
    'natural language database query',
    'cross database joins',
    'schema discovery',
    'unified data layer',
    'baseil data agent',
    'baseil',
    'database AI agent',
    'data retrieval AI',
  ],
  authors: [{ name: 'Baseil' }],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Baseil',
    title: 'Baseil — Get All Your Data Talking',
    description:
      'One data agent. Every database. Ask in plain English, get answers instantly. Baseil maps your schemas, connects your data, and serves it to humans and AI agents.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Baseil — Get All Your Data Talking',
    description:
      'One data agent. Every database. Ask in plain English, get answers instantly. Baseil maps your schemas, connects your data, and serves it to humans and AI agents.',
  },
  icons: {
    icon: '/robot/robot-leaf.png',
    apple: '/robot/robot-leaf.png',
  },
  alternates: {
    canonical: '/',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'Baseil',
              applicationCategory: 'DeveloperApplication',
              operatingSystem: 'Cross-platform',
              description:
                'One data agent. Every database. Ask in plain English, get answers instantly. Baseil maps your schemas, connects your data, and serves it to humans and AI agents.',
              url: 'https://baseil.ai',
              logo: 'https://baseil.ai/robot/robot-leaf.png',
              image: 'https://baseil.ai/opengraph-image',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
              featureList: [
                'Natural language data retrieval',
                'Database to MCP conversion',
                'Cross-database joins',
                'Schema auto-discovery',
                'Data intelligence layer for AI agents',
              ],
            }),
          }}
        />
      </head>
      <body className={`${newsreader.variable} ${outfit.variable} antialiased`}>
        {children}
      </body>
    </html>
  )
}
