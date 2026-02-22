import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Platform',
  description:
    'The Baseil Platform — scale your data agent across teams. Data intelligence, database-to-MCP conversion, and swarm deployment for AI agents.',
  alternates: { canonical: '/platform' },
  openGraph: {
    title: 'Platform — Baseil',
    description:
      'The Baseil Platform — scale your data agent across teams. Data intelligence, database-to-MCP conversion, and swarm deployment for AI agents.',
  },
}

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
