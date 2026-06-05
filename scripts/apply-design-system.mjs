#!/usr/bin/env node
/**
 * Applies Portfolio Intelligence design system + motion patterns across all pages.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const APP_DIR = path.join(ROOT, 'app')

const DESIGN_IMPORT =
  "import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'\n"

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full, files)
    else if (entry.name === 'page.tsx') files.push(full)
  }
  return files
}

function ensureUseClient(content) {
  if (content.includes("'use client'") || content.includes('"use client"')) return content
  if (!content.includes('PageHeader') && !content.includes('StaggerGrid')) return content
  return `'use client'\n\n${content}`
}

function ensureDesignImport(content) {
  if (content.includes("@/components/design-system")) return content
  if (!content.includes('AppShell')) return content

  const match = content.match(/import[^\n]*AppShell[^\n]*\n/)
  if (!match) return content
  const idx = content.indexOf(match[0]) + match[0].length
  return content.slice(0, idx) + DESIGN_IMPORT + content.slice(idx)
}

function convertHeaders(content) {
  if (content.includes('<PageHeader')) return content

  // With multiline description
  content = content.replace(
    /\{\/\*\s*Header\s*\*\/\}\s*\n\s*<div className="flex flex-col gap-2">\s*\n\s*<h1 className="[^"]*">([^<]+)<\/h1>\s*\n\s*<p className="text-muted-foreground">\s*\n?\s*([\s\S]*?)\s*<\/p>\s*\n\s*<\/div>/g,
    (_, title, desc) => {
      const d = desc.trim().replace(/\s+/g, ' ')
      return `<PageHeader title="${title.trim()}" description="${d}" />`
    },
  )

  // Single-line description
  content = content.replace(
    /\{\/\*\s*Header\s*\*\/\}\s*\n\s*<div className="flex flex-col gap-2">\s*\n\s*<h1 className="[^"]*">([^<]+)<\/h1>\s*\n\s*<p className="text-muted-foreground">([^<]+)<\/p>\s*\n\s*<\/div>/g,
    (_, title, desc) => `<PageHeader title="${title.trim()}" description="${desc.trim()}" />`,
  )

  return content
}

function convertGrids(content) {
  return content.replace(
    /<div className="grid (grid-cols-[^"]+) gap-([^"]+)">/g,
    (match, cols, gap) => {
      if (content.slice(Math.max(0, content.indexOf(match) - 20), content.indexOf(match)).includes('StaggerGrid')) {
        return match
      }
      return `<StaggerGrid columns="${cols}" className="gap-${gap}" fast>`
    },
  )
}

function closeStaggerGrids(content) {
  const lines = content.split('\n')
  const out = []
  const stack = []

  for (const line of lines) {
    const open = line.match(/<StaggerGrid[^>]*>/)
    const closeDiv = line.trim() === '</div>'

    if (open) {
      stack.push('stagger')
      out.push(line)
      continue
    }

    if (closeDiv && stack.length > 0 && stack[stack.length - 1] === 'stagger') {
      stack.pop()
      out.push(line.replace('</div>', '</StaggerGrid>'))
      continue
    }

    out.push(line)
  }

  return out.join('\n')
}

function unwrapOuterLayout(content) {
  // AppShell now provides PageLayout — remove duplicate wrappers
  content = content.replace(/<PageLayout>\s*/g, '')
  content = content.replace(/<PageLayout[^>]*>\s*/g, '')
  content = content.replace(/\s*<\/PageLayout>(?=\s*<\/AppShell>)/g, '')

  if (content.includes('flex flex-col h-full')) return content

  const re = /(<AppShell[^>]*>)\s*<div className="flex flex-col gap-6(?: p-6)?">\s*\n/
  if (!re.test(content)) return content

  content = content.replace(re, '$1\n      ')

  // Remove the matching closing div before </AppShell>
  const idx = content.lastIndexOf('</AppShell>')
  if (idx === -1) return content
  const before = content.slice(0, idx)
  const after = content.slice(idx)
  const lastDiv = before.lastIndexOf('\n      </div>')
  if (lastDiv !== -1) {
    content = before.slice(0, lastDiv) + before.slice(lastDiv + '\n      </div>'.length) + after
  }

  return content
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8')

  if (!content.includes('AppShell')) return false
  if (/export default function[^{]*\{[\s\n]*redirect\(/.test(content)) return false

  const original = content
  content = ensureDesignImport(content)
  content = convertHeaders(content)
  content = convertGrids(content)
  content = closeStaggerGrids(content)
  content = unwrapOuterLayout(content)
  content = ensureUseClient(content)

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8')
    return true
  }
  return false
}

const files = walk(APP_DIR)
let updated = 0
for (const file of files) {
  if (processFile(file)) {
    updated++
    console.log('Updated:', path.relative(ROOT, file))
  }
}
console.log(`\nDone. Updated ${updated} of ${files.length} pages.`)
