import type { Metadata } from 'next'
import { Newsreader, Outfit } from 'next/font/google'
import { GoogleAnalytics } from '@next/third-parties/google'
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
    default: 'Baseil.ai - Get All Your Data Talking',
    template: '%s | Baseil',
  },
  description:
    'Baseil is the intelligent data harness. Connect your databases, expose them as MCP tools, and give agents (and humans) natural-language access with no code. One layer for every interface.',
  keywords: [
    'data harness',
    'intelligent data retrieval',
    'intelligent data agent',
    'agentic backends',
    'agentic data IDE',
    'AI retrieval',
    'self learning backend agent',
    'expose data as MCP',
    'expose database as MCP',
    'no code data analysis',
    'A2A agent',
    'build AI agents',
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
    'baseil',
    'baseil data agent',
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
    title: 'Baseil.ai - Get All Your Data Talking',
    description:
      'Baseil is the intelligent data harness. Connect your databases, expose them as MCP tools, and give agents (and humans) natural-language access with no code. One layer for every interface.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Baseil.ai - Get All Your Data Talking',
    description:
      'Baseil is the intelligent data harness. Connect your databases, expose them as MCP tools, and give agents (and humans) natural-language access with no code. One layer for every interface.',
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
              '@graph': [
                {
                  '@type': 'WebSite',
                  name: 'Baseil',
                  url: 'https://baseil.ai',
                  description:
                    'Baseil is the intelligent data harness. Connect your databases, expose them as MCP tools, and give agents (and humans) natural-language access with no code.',
                  publisher: {
                    '@type': 'Organization',
                    name: 'Baseil',
                    url: 'https://baseil.ai',
                    logo: {
                      '@type': 'ImageObject',
                      url: 'https://baseil.ai/robot/robot-leaf.png',
                    },
                  },
                },
                {
                  '@type': 'SoftwareApplication',
                  name: 'Baseil',
                  applicationCategory: 'DeveloperApplication',
                  operatingSystem: 'Cross-platform',
                  description:
                    'Baseil is the intelligent data harness. Connect your databases, expose them as MCP tools, and give agents (and humans) natural-language access with no code. One layer for every interface.',
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
                    'Expose databases as MCP tools',
                    'A2A-ready agent exposure',
                    'Cross-database joins',
                    'Schema auto-discovery',
                    'Intelligent data retrieval across databases',
                    'No-code data analysis',
                    'Data intelligence layer for AI agents',
                  ],
                },
                {
                  '@type': 'SiteNavigationElement',
                  name: 'Documentation',
                  url: 'https://baseil.ai/docs',
                  description: 'Install Baseil, connect databases, and get your first query running in minutes.',
                },
                {
                  '@type': 'SiteNavigationElement',
                  name: 'Blog',
                  url: 'https://baseil.ai/blog',
                  description: 'Guides, deep dives, and thought leadership on intelligent data retrieval and agentic systems.',
                },
                {
                  '@type': 'SiteNavigationElement',
                  name: 'Pricing',
                  url: 'https://baseil.ai/pricing',
                  description: 'Baseil pricing plans. Free during beta.',
                },
                {
                  '@type': 'SiteNavigationElement',
                  name: 'Platform',
                  url: 'https://baseil.ai/platform',
                  description: 'Baseil cloud platform for teams.',
                },
                {
                  '@type': 'SiteNavigationElement',
                  name: 'Contact',
                  url: 'https://baseil.ai/contact',
                  description: 'Get in touch with the Baseil team.',
                },
              ],
            }),
          }}
        />
      </head>
      {process.env.NEXT_PUBLIC_GA_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
      )}
      <body className={`${newsreader.variable} ${outfit.variable} antialiased`}>
        {children}
      </body>
    </html>
  )
}
