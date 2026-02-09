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
  title: 'baseil — One intelligent layer. All your data.',
  description:
    'baseil connects to your databases, understands their structure, and figures out where your data lives from a simple question. Built for humans, agents, and apps.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${newsreader.variable} ${outfit.variable} antialiased`}>
        {children}
      </body>
    </html>
  )
}
