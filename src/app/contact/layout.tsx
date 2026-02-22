import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch with Baseil — questions, partnership inquiries, or enterprise support. Reach us at support@baseil.ai.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact — Baseil',
    description:
      'Get in touch with Baseil — questions, partnership inquiries, or enterprise support. Reach us at support@baseil.ai.',
  },
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
