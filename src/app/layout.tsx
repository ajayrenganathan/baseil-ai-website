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
    default: 'Baseil',
    template: '%s | Baseil',
  },
  description:
    'Baseil is an open-source data agent that connects to your databases, maps every schema, and serves structured answers to humans and AI agents. Turn any database into MCP tools with zero configuration.',
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
    'open source data agent',
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
    title: 'Baseil',
    description:
      'An open-source data agent for data retrieval, schema discovery, and database-to-MCP conversion. Data intelligence for humans and AI agents.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Baseil',
    description:
      'An open-source data agent for data retrieval, schema discovery, and database-to-MCP conversion. Data intelligence for humans and AI agents.',
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
                'An open-source data agent that connects to your databases, discovers schemas, and provides data retrieval for humans and AI agents. Converts any database to MCP tools for data intelligence.',
              url: 'https://baseil.ai',
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
