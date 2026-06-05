#!/usr/bin/env node
/**
 * Repairs incorrect </StaggerGrid> tags introduced by naive migration.
 * Resets all closes to </div>, then re-applies correct </StaggerGrid> per open.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const APP_DIR = path.join(ROOT, 'app')

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full, files)
    else if (entry.name === 'page.tsx') files.push(full)
  }
  return files
}

function findMatchingCloseDiv(content, openEnd) {
  let depth = 1
  let j = openEnd
  while (j < content.length && depth > 0) {
    const nextOpenDiv = content.indexOf('<div', j)
    const nextOpenStagger = content.indexOf('<StaggerGrid', j)
    const nextOpen = [nextOpenDiv, nextOpenStagger]
      .filter((x) => x !== -1)
      .sort((a, b) => a - b)[0]

    const nextCloseStagger = content.indexOf('</StaggerGrid>', j)
    const nextCloseDiv = content.indexOf('</div>', j)
    const nextClose = [nextCloseDiv, nextCloseStagger]
      .filter((x) => x !== -1)
      .sort((a, b) => a - b)[0]

    if (nextClose === undefined) return -1

    const isOpenFirst = nextOpen !== undefined && nextOpen < nextClose

    if (isOpenFirst) {
      depth++
      j = nextOpen + 4
    } else {
      depth--
      if (depth === 0) return nextClose
      j = nextClose + (content.slice(nextClose).startsWith('</StaggerGrid>') ? 14 : 6)
    }
  }
  return -1
}

function fixFile(content) {
  if (!content.includes('<StaggerGrid')) return content

  // Reset all stagger closes to div closes
  content = content.replace(/<\/StaggerGrid>/g, '</div>')

  const opens = []
  let search = 0
  while (true) {
    const idx = content.indexOf('<StaggerGrid', search)
    if (idx === -1) break
    const openEnd = content.indexOf('>', idx) + 1
    opens.push(openEnd)
    search = openEnd
  }

  // Replace matching closes from last to first (preserve indices)
  const replacements = []
  for (const openEnd of opens) {
    const closeIdx = findMatchingCloseDiv(content, openEnd)
    if (closeIdx !== -1) replacements.push(closeIdx)
  }

  replacements.sort((a, b) => b - a)
  for (const closeIdx of replacements) {
    content = content.slice(0, closeIdx) + '</StaggerGrid>' + content.slice(closeIdx + '</div>'.length)
  }

  return content
}

const files = walk(APP_DIR)
let fixed = 0
for (const file of files) {
  const original = fs.readFileSync(file, 'utf8')
  const updated = fixFile(original)
  if (updated !== original) {
    fs.writeFileSync(file, updated, 'utf8')
    fixed++
  }
}
console.log(`Fixed ${fixed} files.`)
