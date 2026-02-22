import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'The Problem',
  description:
    'See why AI agents struggle with direct database connections — and how Baseil solves it with an intelligent data layer.',
  alternates: { canonical: '/problem' },
  openGraph: {
    title: 'The Problem — Baseil',
    description:
      'See why AI agents struggle with direct database connections — and how Baseil solves it with an intelligent data layer.',
  },
}

export default function ProblemLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
