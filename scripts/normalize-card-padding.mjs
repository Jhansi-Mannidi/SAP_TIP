#!/usr/bin/env node
/**
 * Strip redundant padding overrides from Card / CardContent / CardHeader / CardFooter
 * after moving uniform 4-side padding to the Card root.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')

const PADDING_RE =
  /\b(?:p|px|py|pt|pb|pl|pr)-(?:0|0\.5|1|1\.5|2|2\.5|3|3\.5|4|5|6|7|8|9|10|11|12|14|16|20|24|28|32|36|40|44|48|52|56|60|64|72|80|96)\b/g

const SKIP_DIRS = new Set(['node_modules', '.next', '.git', 'dist', 'build'])

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full, files)
    else if (/\.(tsx|ts|jsx|js)$/.test(entry.name)) files.push(full)
  }
  return files
}

function cleanPaddingClasses(className) {
  if (!className) return ''
  if (/\bp-0\b/.test(className) && !/\bp-[1-9]/.test(className)) {
    // Keep intentional flush (p-0 only)
    return className.replace(/\b(?:px|py|pt|pb|pl|pr)-\d+(?:\.\d+)?\b/g, '').replace(/\s+/g, ' ').trim()
  }
  return className.replace(PADDING_RE, '').replace(/\s+/g, ' ').trim()
}

function normalizeCardFlush(content) {
  // gap-0 py-0 / py-0 gap-0 on Card → padding="flush"
  return content.replace(
    /<Card([^>]*?)className="([^"]*?(?:gap-0|py-0)[^"]*)"([^>]*)>/g,
    (match, before, cls, after) => {
      if (/\bpadding=/.test(match)) return match
      const cleaned = cleanPaddingClasses(
        cls.replace(/\bgap-0\b/g, '').replace(/\bpy-0\b/g, '').replace(/\bp-0\b/g, ''),
      )
      const classAttr = cleaned ? ` className="${cleaned}"` : ''
      return `<Card padding="flush"${before}${classAttr}${after}>`
    },
  )
}

function normalizeSlot(tag, content) {
  const re = new RegExp(`<${tag} className="([^"]*)"\\s*>`, 'g')
  return content.replace(re, (match, cls) => {
    const cleaned = cleanPaddingClasses(cls)
    if (!cleaned) return `<${tag}>`
    if (cleaned === cls) return match
    return `<${tag} className="${cleaned}">`
  })
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8')
  const original = content

  content = normalizeCardFlush(content)
  for (const tag of ['CardContent', 'CardHeader', 'CardFooter', 'Card']) {
    content = normalizeSlot(tag, content)
  }

  // section-card with duplicate padding
  content = content.replace(
    /className="([^"]*section-card[^"]*)"/g,
    (match, cls) => {
      const cleaned = cleanPaddingClasses(cls)
      if (cleaned === cls) return match
      return `className="${cleaned}"`
    },
  )

  if (content !== original) {
    fs.writeFileSync(filePath, content)
    return true
  }
  return false
}

const files = walk(ROOT).filter(
  (f) =>
    !f.includes(`${path.sep}scripts${path.sep}`) &&
    !f.includes(`${path.sep}components${path.sep}ui${path.sep}card.tsx`),
)

let updated = 0
for (const file of files) {
  if (processFile(file)) {
    updated++
    console.log('updated:', path.relative(ROOT, file))
  }
}

console.log(`\nDone. Updated ${updated} file(s).`)
