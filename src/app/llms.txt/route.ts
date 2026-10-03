import { llmsIndex } from '@/lib/llms'

// Built once at deploy from content/, then served like a static file.
export const dynamic = 'force-static'

export function GET() {
  return new Response(llmsIndex(), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
