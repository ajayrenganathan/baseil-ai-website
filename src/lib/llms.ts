import { getAllPosts } from '@/lib/blog'
import { DOC_CATEGORY_LABELS, getAllDocs, type DocPage } from '@/lib/docs'
import { INSTALL_COMMAND } from '@/lib/install'

// Plain-text views of the site for language models, following the llms.txt
// convention (llmstxt.org): /llms.txt is a short index, /llms-full.txt is every
// doc in one file. Both are built from content/ at deploy, so they always match
// the docs and the blog. Every fact below is one the docs already state.

const SITE = 'https://baseil.ai'

const SUMMARY =
  'Baseil is an AI data harness. It onboards your databases, maps their schemas on its own, and answers questions in plain English, for people in a web chat and for agents as MCP tools. Every answer comes with the SQL that ran.'

const DETAILS =
  'Baseil runs on your machine, on macOS (Apple Silicon) or Linux (x64), and enforces read-only access at the SQL level. PostgreSQL is generally available; MySQL, SQLite, and Elasticsearch are in beta. Install it with one command:'

const link = (title: string, url: string, note: string) => `- [${title}](${url})${note ? `: ${note}` : ''}`

/** Docs grouped by category, in the same order as the /docs page. */
function docsByCategory(): [string, DocPage[]][] {
  const groups = new Map<string, DocPage[]>()
  for (const doc of getAllDocs()) groups.set(doc.category, [...(groups.get(doc.category) ?? []), doc])
  return [...groups]
}

/** Root-relative Markdown links become absolute: a reader of these files has no page to resolve them against. */
function absolute(markdown: string) {
  return markdown.replace(/\]\(\//g, `](${SITE}/`)
}

export function llmsIndex(): string {
  const lines = [
    '# Baseil',
    '',
    `> ${SUMMARY}`,
    '',
    DETAILS,
    '',
    '```bash',
    INSTALL_COMMAND,
    '```',
    '',
    `The full documentation in one file: ${SITE}/llms-full.txt`,
  ]
  for (const [category, docs] of docsByCategory()) {
    lines.push('', `## ${DOC_CATEGORY_LABELS[category] ?? category}`, '')
    for (const doc of docs) lines.push(link(doc.title, `${SITE}/docs/${doc.slug}`, doc.description))
  }
  const posts = getAllPosts()
  if (posts.length) {
    lines.push('', '## Blog', '')
    for (const post of posts) lines.push(link(post.title, `${SITE}/blog/${post.slug}`, post.description))
  }
  lines.push(
    '',
    '## Optional',
    '',
    link('Pricing', `${SITE}/pricing`, 'Pro is free during beta; Teams and Enterprise are on the waitlist.'),
  )
  return lines.join('\n') + '\n'
}

export function llmsFull(): string {
  const parts = [`# Baseil documentation\n\n> ${SUMMARY}\n\nEvery page of ${SITE}/docs, in order.`]
  for (const [, docs] of docsByCategory()) {
    for (const doc of docs) {
      parts.push(`# ${doc.title}\n\nSource: ${SITE}/docs/${doc.slug}\n\n${absolute(doc.content.trim())}`)
    }
  }
  return parts.join('\n\n---\n\n') + '\n'
}
