#!/usr/bin/env node
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')

const FLUSH_ONLY = [
  'app/test-repository/suites/page.tsx',
  'app/test-repository/scenarios/page.tsx',
  'app/analytics/migrations/page.tsx',
  'app/analytics/evidence/page.tsx',
  'app/knowledge-center/admin/audit/page.tsx',
  'app/defect-manager/healing-promotions/[id]/page.tsx',
]

const BLEED = [
  'app/test-repository/scenarios/[id]/page.tsx',
  'app/evidence-portal/audit/page.tsx',
  'app/execution-console/runs/[id]/page.tsx',
  'app/knowledge-center/org/zobjects/[id]/page.tsx',
]

for (const rel of FLUSH_ONLY) {
  const filePath = path.join(ROOT, rel)
  let content = fs.readFileSync(filePath, 'utf8')
  content = content.replace(
    /<CardContent className="p-0"\s*>/g,
    '<CardContent>',
  )
  content = content.replace(
    /<Card>\s*\n(\s*)<CardContent>/g,
    '<Card padding="flush">\n$1<CardContent>',
  )
  fs.writeFileSync(filePath, content)
  console.log('flush:', rel)
}

for (const rel of BLEED) {
  const filePath = path.join(ROOT, rel)
  let content = fs.readFileSync(filePath, 'utf8')
  content = content.replace(
    /<CardContent className="p-0"\s*>/g,
    '<CardContent className="card-bleed-x card-bleed-b">',
  )
  fs.writeFileSync(filePath, content)
  console.log('bleed:', rel)
}

console.log('done')
