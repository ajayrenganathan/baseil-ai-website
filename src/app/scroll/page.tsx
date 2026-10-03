import type { Metadata } from 'next'
import { DataBloom } from './DataBloom'

export const metadata: Metadata = {
  title: 'The deep dive',
  description: 'Every row of a sample database, flown into the answer to one question.',
  robots: { index: false, follow: false },
}

export default function ScrollPreviewPage() {
  return <DataBloom />
}
