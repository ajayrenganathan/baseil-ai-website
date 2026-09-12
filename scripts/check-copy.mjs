#!/usr/bin/env node
/**
 * Copy check for the Baseil marketing site. Plain Node ESM, no dependencies.
 * Run from the repo root: `npm run check:copy`.
 *
 * 1. The install snippet lives in `src/lib/install.ts` and must be duplicated
 *    verbatim in the markdown files listed in SNIPPET_FILES.
 * 2. No file under `src/` or `content/` may contain a forbidden string
 *    (commands the CLI does not ship, claims the product does not make).
 * 3. No `.tsx` file under `src/` may ship a placeholder `#` link.
 * 4. Any line anywhere that looks like a curl install line must match the
 *    canonical snippet exactly, so stale variants cannot linger.
 *
 * The snippet is read from `src/lib/install.ts` at runtime and is never
 * printed, so nothing here reproduces a curl-piped-to-shell line.
 */

import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const INSTALL_FILE = 'src/lib/install.ts'

const SNIPPET_FILES = [
  'content/docs/quickstart.md',
  'content/blog/database-to-agentic-backend-5-minutes.md',
  'content/blog/getting-started-with-baseil.md',
  'hn-launch.md', // untracked, skipped with a warning when absent
]

const OPTIONAL_FILES = new Set(['hn-launch.md'])

// Never write the install snippet here. It is extracted from INSTALL_FILE.
const FORBIDDEN = [
  'baseil connect ', // trailing space: do not match "baseil connecting"
  'baseil connections',
  'serve --mcp',
  'no hallucinations',
  'End-to-end encrypted',
  'No data leaves',
  'Self Host',
  'install.sh | bash',
  'Row-level access policies',
  'BASEIL_VERSION=beta',
]

const PLACEHOLDER_HREFS = ['href="#"', "href: '#'"]

const SCAN_DIRS = ['src', 'content']
const SCAN_EXTS = new Set(['.ts', '.tsx', '.md', '.mdx'])

let failed = false

function ok(message) {
  console.log(`OK   ${message}`)
}

function warn(message) {
  console.log(`WARN ${message}`)
}

function fail(message, details = []) {
  failed = true
  console.log(`FAIL ${message}`)
  for (const detail of details) console.log(`       ${detail}`)
}

function read(relPath) {
  return fs.readFileSync(path.join(ROOT, relPath), 'utf8')
}

function exists(relPath) {
  return fs.existsSync(path.join(ROOT, relPath))
}

function walk(relDir, files = []) {
  const abs = path.join(ROOT, relDir)
  if (!fs.existsSync(abs)) return files
  for (const entry of fs.readdirSync(abs, { withFileTypes: true })) {
    const rel = path.join(relDir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue
      walk(rel, files)
    } else if (SCAN_EXTS.has(path.extname(entry.name))) {
      files.push(rel)
    }
  }
  return files
}

/* 1. Extract the install snippet. */
let snippet = null
if (!exists(INSTALL_FILE)) {
  fail(`${INSTALL_FILE} is missing`)
} else {
  const match = read(INSTALL_FILE).match(
    /export\s+const\s+INSTALL_COMMAND\s*=\s*(['"`])([^'"`]+)\1/
  )
  if (!match || !match[2].trim()) {
    fail(`INSTALL_COMMAND string literal not found in ${INSTALL_FILE}`)
  } else {
    snippet = match[2]
    ok(`install snippet extracted from ${INSTALL_FILE} (${snippet.length} chars)`)
  }
}

/* 2. The snippet must appear verbatim in every file that documents it. */
if (snippet) {
  for (const relPath of SNIPPET_FILES) {
    if (!exists(relPath)) {
      if (OPTIONAL_FILES.has(relPath)) {
        warn(`${relPath} not present, skipping snippet check`)
      } else {
        fail(`${relPath} is missing`)
      }
      continue
    }
    if (read(relPath).includes(snippet)) {
      ok(`install snippet present in ${relPath}`)
    } else {
      fail(`install snippet missing or altered in ${relPath}`)
    }
  }
}

/* 3. Forbidden strings. */
const scanned = SCAN_DIRS.flatMap(dir => walk(dir))
if (exists('hn-launch.md')) scanned.push('hn-launch.md')

const forbiddenHits = []
for (const relPath of scanned) {
  const lines = read(relPath).split('\n')
  lines.forEach((line, index) => {
    for (const term of FORBIDDEN) {
      if (line.includes(term)) {
        forbiddenHits.push(`${relPath}:${index + 1}  forbidden: "${term}"`)
      }
    }
  })
}
if (forbiddenHits.length === 0) {
  ok(`no forbidden strings in ${scanned.length} files`)
} else {
  fail(`${forbiddenHits.length} forbidden string(s) found`, forbiddenHits)
}

/* 4. Placeholder hrefs in .tsx files. */
const hrefHits = []
for (const relPath of scanned) {
  if (path.extname(relPath) !== '.tsx' || !relPath.startsWith('src')) continue
  const lines = read(relPath).split('\n')
  lines.forEach((line, index) => {
    if (line.trim().startsWith('//')) return
    for (const term of PLACEHOLDER_HREFS) {
      if (line.includes(term)) {
        hrefHits.push(`${relPath}:${index + 1}  placeholder link: ${term}`)
      }
    }
  })
}
if (hrefHits.length === 0) {
  ok('no placeholder "#" hrefs in src/**/*.tsx')
} else {
  fail(`${hrefHits.length} placeholder href(s) found`, hrefHits)
}

/* 5. Every curl install line must match the canonical snippet. */
if (snippet) {
  const INSTALL_LINE = /curl .*install\.sh/
  const staleInstallLines = []
  for (const relPath of scanned) {
    const lines = read(relPath).split('\n')
    lines.forEach((line, index) => {
      if (!INSTALL_LINE.test(line)) return
      if (!line.includes(snippet)) {
        staleInstallLines.push(
          `${relPath}:${index + 1}  install line does not match ${INSTALL_FILE}`
        )
      }
    })
  }
  if (staleInstallLines.length === 0) {
    ok('every curl install line matches the canonical snippet')
  } else {
    fail(`${staleInstallLines.length} stale install line(s) found`, staleInstallLines)
  }
}

process.exit(failed ? 1 : 0)
