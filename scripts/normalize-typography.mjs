#!/usr/bin/env node
/**
 * Unify typography classes across the application.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const SKIP_DIRS = new Set(['node_modules', '.next', '.git', 'dist', 'build', 'scripts'])

const TYPOGRAPHY_TOKENS = new Set([
  'page-title',
  'page-description',
  'section-title',
  'section-description',
  'card-title-text',
  'stat-value',
  'kpi-value',
  'kpi-value-accent',
  'micro-label',
  'body-text',
  'caption-text',
])

const TYPO_RE =
  /\b(?:text-(?:xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|\[[^\]]+\])|(?:sm|md|lg|xl|2xl):text-\S+|font-(?:bold|semibold|medium|normal|display|mono)|tracking-(?:tight|tighter|wide|wider|normal)|leading-(?:tight|snug|normal|relaxed|none)|text-foreground|text-muted-foreground|uppercase|normal-case|tabular-nums)\b/g

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full, files)
    else if (/\.(tsx|ts|jsx|js)$/.test(entry.name)) files.push(full)
  }
  return files
}

function stripTypography(classes) {
  return classes
    .replace(TYPO_RE, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function hasToken(classes, token) {
  return new RegExp(`\\b${token}\\b`).test(classes)
}

function mergeClass(token, classes) {
  const rest = stripTypography(classes)
    .split(' ')
    .filter((c) => c && !TYPOGRAPHY_TOKENS.has(c))
    .join(' ')
  return rest ? `${token} ${rest}` : token
}

function normalizeTag(content, tag, token) {
  const re = new RegExp(`<${tag} className="([^"]*)"\\s*>`, 'g')
  return content.replace(re, (match, cls) => {
    if (hasToken(cls, token)) {
      const cleaned = mergeClass(token, cls)
      return cleaned === cls ? match : `<${tag} className="${cleaned}">`
    }
    const merged = mergeClass(token, cls)
    return `<${tag} className="${merged}">`
  })
}

function normalizeStatValues(content) {
  for (const tag of ['p', 'span', 'div']) {
    const re = new RegExp(`<${tag} className="([^"]*)"\\s*>`, 'g')
    content = content.replace(re, (match, cls) => {
      if (!/\btext-2xl\b/.test(cls) || !/\bfont-(bold|semibold)\b/.test(cls)) return match
      if (hasToken(cls, 'stat-value') || hasToken(cls, 'kpi-value')) return match
      const merged = mergeClass('stat-value', cls)
      return `<${tag} className="${merged}">`
    })
  }
  return content
}

function normalizeCaptionLabels(content) {
  const re = /<p className="([^"]*)"\s*>/g
  return content.replace(re, (match, cls) => {
    if (hasToken(cls, 'caption-text') || hasToken(cls, 'micro-label') || hasToken(cls, 'page-description')) return match
    if (cls !== 'text-xs text-muted-foreground' && !/^text-xs text-muted-foreground\s/.test(cls)) return match
    const merged = mergeClass('caption-text', cls)
    return `<p className="${merged}">`
  })
}

function normalizeDescriptions(content) {
  const patterns = [
    /text-sm text-muted-foreground(?: leading-relaxed)?(?: max-w-2xl)?/,
    /text-muted-foreground(?: mt-\d+)?/,
  ]

  const re = /<p className="([^"]*)"\s*>/g
  return content.replace(re, (match, cls) => {
    if (hasToken(cls, 'page-description') || hasToken(cls, 'section-description')) return match
    const isDesc = patterns.some((p) => p.test(cls)) && !/\btext-(xs|lg|xl|2xl|3xl)\b/.test(cls)
    if (!isDesc) return match
    const token = hasToken(cls, 'mt-0.5') || cls.includes('section') ? 'section-description' : 'page-description'
    const merged = mergeClass(token, cls)
    return `<p className="${merged}">`
  })
}

function normalizeSectionTitles(content) {
  return content.replace(/<h2 className="([^"]*)"\s*>/g, (match, cls) => {
    if (hasToken(cls, 'section-title')) {
      const cleaned = mergeClass('section-title', cls)
      return cleaned === cls ? match : `<h2 className="${cleaned}">`
    }
    if (!/\btext-lg\b/.test(cls) && !/\btext-xl\b/.test(cls) && !/\btext-2xl\b/.test(cls)) return match
    if (/\btext-2xl\b/.test(cls) && !/\btext-lg\b/.test(cls)) return match
    const merged = mergeClass('section-title', cls)
    return `<h2 className="${merged}">`
  })
}

function normalizeMicroLabels(content) {
  return content.replace(/<p className="([^"]*)"\s*>/g, (match, cls) => {
    if (!/\buppercase\b/.test(cls) || !/\btracking-(wide|wider|\[[^\]]+\])\b/.test(cls)) return match
    if (hasToken(cls, 'micro-label')) return match
    const merged = mergeClass('micro-label', cls)
    return `<p className="${merged}">`
  })
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8')
  const original = content

  content = normalizeTag(content, 'h1', 'page-title')
  content = normalizeSectionTitles(content)
  content = normalizeDescriptions(content)
  content = normalizeStatValues(content)
  content = normalizeCaptionLabels(content)
  content = normalizeMicroLabels(content)

  if (content !== original) {
    fs.writeFileSync(filePath, content)
    return true
  }
  return false
}

const files = walk(ROOT).filter(
  (f) =>
    f.includes(`${path.sep}app${path.sep}`) ||
    f.includes(`${path.sep}components${path.sep}`),
)

let updated = 0
for (const file of files) {
  if (processFile(file)) {
    updated++
    console.log('updated:', path.relative(ROOT, file))
  }
}

console.log(`\nDone. Updated ${updated} file(s).`)
