import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const DOCS_DIR = path.join(process.cwd(), 'content/docs')

export interface DocPage {
  slug: string
  title: string
  description: string
  order: number
  category: string
  content: string
  readTime: string
}

export function getAllDocs(): DocPage[] {
  if (!fs.existsSync(DOCS_DIR)) return []

  const files = fs.readdirSync(DOCS_DIR).filter(f => f.endsWith('.md'))

  const docs = files.map(filename => {
    const slug = filename.replace('.md', '')
    const filePath = path.join(DOCS_DIR, filename)
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const { data, content } = matter(fileContent)

    return {
      slug,
      title: data.title || slug,
      description: data.description || '',
      order: typeof data.order === 'number' ? data.order : 999,
      category: data.category || 'general',
      content,
      readTime: data.readTime || estimateReadTime(content),
    }
  })

  return docs.sort((a, b) => a.order - b.order)
}

export function getDocBySlug(slug: string): DocPage | null {
  if (!/^[a-zA-Z0-9_-]+$/.test(slug)) return null

  const filePath = path.join(DOCS_DIR, `${slug}.md`)
  if (!fs.existsSync(filePath)) return null

  const fileContent = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(fileContent)

  return {
    slug,
    title: data.title || slug,
    description: data.description || '',
    order: typeof data.order === 'number' ? data.order : 999,
    category: data.category || 'general',
    content,
    readTime: data.readTime || estimateReadTime(content),
  }
}

function estimateReadTime(content: string): string {
  const words = content.split(/\s+/).length
  const minutes = Math.max(1, Math.ceil(words / 230))
  return `${minutes} min read`
}
