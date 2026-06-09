'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { IRStep } from '@/lib/mock-data'
import {
  Braces,
  Check,
  Code2,
  Copy,
  FileCode2,
  Layers,
  Terminal,
} from 'lucide-react'

export type IRExecutorCodeMeta = {
  id: string
  name: string
  version: string
  tcode: string
  test_case_name: string
}

export function generateExecutorCode(meta: IRExecutorCodeMeta, steps: IRStep[]): string {
  const sorted = [...steps].sort((a, b) => a.order - b.order)

  const stepLines = sorted
    .map((step) => {
      switch (step.step_type) {
        case 'open_transaction':
          return `  // Step ${step.order}: ${step.description}
  await executor.openTransaction('${step.parameters.tcode}');`
        case 'set_field':
          return `  // Step ${step.order}: ${step.description}
  await executor.setField('${step.parameters.field}', '${step.parameters.value || '${params.value}'}');`
        case 'press_enter':
          return `  // Step ${step.order}: ${step.description}
  await executor.pressEnter();`
        case 'press_button':
          return `  // Step ${step.order}: ${step.description}
  await executor.pressButton('${step.parameters.button}');`
        case 'assert_statusbar':
          return `  // Step ${step.order}: ${step.description}
  await executor.assertStatusBar({ contains: '${step.parameters.contains}', type: '${step.parameters.message_type || 'S'}' });`
        case 'capture_field':
          return `  // Step ${step.order}: ${step.description}
  const ${step.parameters.variable} = await executor.captureField('${step.parameters.field}');`
        case 'assert_field':
          return `  // Step ${step.order}: ${step.description}
  await executor.assert(${step.parameters.variable}${step.parameters.not_empty ? ' !== ""' : ''});`
        default:
          return `  // Step ${step.order}: ${step.description}
  // ${step.step_type}(${JSON.stringify(step.parameters)});`
      }
    })
    .join('\n\n')

  return `// Auto-generated from IR: ${meta.id} v${meta.version}
// Test Case: ${meta.test_case_name}

import { SAPExecutor, Session } from '@voltus/sap-executor';

export async function execute(session: Session, params: InputParams) {
  const executor = new SAPExecutor(session);

${stepLines}

  return { success: true, created_order_number };
}`
}

const TS_KEYWORDS = new Set([
  'import',
  'from',
  'export',
  'async',
  'function',
  'const',
  'await',
  'return',
  'new',
  'type',
  'interface',
])

function highlightTypeScriptLine(line: string): React.ReactNode[] {
  if (/^\s*\/\//.test(line)) {
    return [<span key="comment" className="text-muted-foreground/80 italic">{line}</span>]
  }

  const nodes: React.ReactNode[] = []
  const pattern =
    /('(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|\b\d+\b|\b[a-zA-Z_$][\w$]*\b|[^\s'"]+)/g

  let match: RegExpExecArray | null
  let index = 0

  while ((match = pattern.exec(line)) !== null) {
    const token = match[0]
    const start = match.index

    if (start > index) {
      nodes.push(<span key={`ws-${start}`}>{line.slice(index, start)}</span>)
    }

    let className = 'text-foreground/90'
    if (token === 'true' || token === 'false' || token === 'null') {
      className = 'text-amber-600 dark:text-amber-400'
    } else if (/^['"]/.test(token)) {
      className = 'text-emerald-600 dark:text-emerald-400'
    } else if (/^\d+$/.test(token)) {
      className = 'text-amber-600 dark:text-amber-400'
    } else if (TS_KEYWORDS.has(token)) {
      className = 'text-violet-600 dark:text-violet-400 font-medium'
    } else if (token === 'SAPExecutor' || token === 'Session' || token === 'InputParams') {
      className = 'text-sky-600 dark:text-sky-400'
    } else if (/^[A-Z]/.test(token)) {
      className = 'text-sky-600 dark:text-sky-400'
    } else if (token.includes('(') || token.includes(')') || token.includes('{') || token.includes('}')) {
      className = 'text-muted-foreground'
    } else if (token === 'executor') {
      className = 'text-foreground'
    } else if (/^await\s/.test(line.slice(start)) && token === 'await') {
      className = 'text-violet-600 dark:text-violet-400 font-medium'
    }

    nodes.push(
      <span key={`tok-${start}`} className={className}>
        {token}
      </span>,
    )
    index = start + token.length
  }

  if (index < line.length) {
    nodes.push(<span key={`tail-${index}`}>{line.slice(index)}</span>)
  }

  return nodes.length > 0 ? nodes : [line]
}

function HighlightedCode({ code }: { code: string }) {
  const lines = code.split('\n')

  return (
    <div className="w-max min-w-full font-mono text-[11px] leading-[1.65] sm:text-xs sm:leading-[1.7]">
      {lines.map((line, lineIndex) => (
        <div key={lineIndex} className="flex w-max min-w-full">
          <span
            className="w-9 shrink-0 select-none pr-3 text-right tabular-nums text-muted-foreground/45 sm:w-10"
            aria-hidden
          >
            {lineIndex + 1}
          </span>
          <code className="shrink-0 whitespace-pre">{highlightTypeScriptLine(line)}</code>
        </div>
      ))}
    </div>
  )
}

type IRExecutorCodePreviewDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  metadata: IRExecutorCodeMeta
  steps: IRStep[]
}

export function IRExecutorCodePreviewDialog({
  open,
  onOpenChange,
  metadata,
  steps,
}: IRExecutorCodePreviewDialogProps) {
  const [copied, setCopied] = React.useState(false)

  const code = React.useMemo(
    () => generateExecutorCode(metadata, steps),
    [metadata, steps],
  )
  const lineCount = code.split('\n').length
  const sortedSteps = React.useMemo(
    () => [...steps].sort((a, b) => a.order - b.order),
    [steps],
  )

  React.useEffect(() => {
    if (!open) setCopied(false)
  }, [open])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      const { toast } = await import('sonner')
      toast.success('Executor code copied to clipboard')
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      const { toast } = await import('sonner')
      toast.error('Could not copy to clipboard')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          'flex max-h-[min(92dvh,880px)] w-[calc(100%-1rem)] max-w-4xl flex-col gap-0 overflow-hidden p-0',
          'sm:w-[calc(100%-2rem)]',
          '[&>button.absolute]:right-3 [&>button.absolute]:top-3 sm:[&>button.absolute]:right-4 sm:[&>button.absolute]:top-4',
        )}
      >
        <div className="relative shrink-0 border-b border-border bg-gradient-to-br from-brand/[0.08] via-background to-background px-4 pb-4 pt-5 sm:px-6 sm:pb-5 sm:pt-6">
          <div className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full bg-brand/10 blur-3xl" />
          <div className="flex items-start gap-3 pr-8">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand text-brand-foreground shadow-sm">
              <Code2 className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <DialogHeader className="space-y-1.5 text-left">
                <DialogTitle className="text-base font-semibold tracking-tight sm:text-lg">
                  Generated Executor Code
                </DialogTitle>
                <DialogDescription className="text-xs leading-relaxed sm:text-sm">
                  Preview of executor-ready TypeScript generated from this IR. Copy and adapt for
                  your automation pipeline.
                </DialogDescription>
              </DialogHeader>

              <div className="mt-3 flex flex-wrap items-center gap-1.5 sm:gap-2">
                <Badge variant="outline" className="h-6 gap-1 font-mono text-[10px] sm:text-[11px]">
                  <Terminal className="h-3 w-3" />
                  {metadata.tcode}
                </Badge>
                <Badge variant="outline" className="h-6 font-mono text-[10px] sm:text-[11px]">
                  v{metadata.version}
                </Badge>
                <Badge variant="secondary" className="h-6 gap-1 text-[10px] sm:text-[11px]">
                  <Layers className="h-3 w-3" />
                  {sortedSteps.length} steps
                </Badge>
                <Badge variant="secondary" className="hidden h-6 gap-1 text-[10px] sm:inline-flex sm:text-[11px]">
                  <Braces className="h-3 w-3" />
                  TypeScript
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col px-3 py-3 sm:px-5 sm:py-4">
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border/80 bg-card shadow-[var(--shadow-sm)]">
            <div className="flex shrink-0 items-center justify-between gap-2 border-b border-border/80 bg-muted/30 px-3 py-2 sm:px-4">
              <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                <div className="hidden items-center gap-1 sm:flex" aria-hidden>
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                </div>
                <div className="flex min-w-0 items-center gap-1.5 rounded-md border border-border/70 bg-background/80 px-2 py-1">
                  <FileCode2 className="h-3.5 w-3.5 shrink-0 text-brand" />
                  <span className="truncate font-mono text-[11px] text-foreground sm:text-xs">
                    {metadata.id}.executor.ts
                  </span>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <span className="hidden text-[10px] tabular-nums text-muted-foreground sm:inline">
                  {lineCount} lines
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 gap-1.5 px-2 text-xs sm:h-8"
                  onClick={handleCopy}
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-success" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                  <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
                </Button>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-auto overscroll-contain max-h-[min(52dvh,520px)]">
              <div className="w-max min-w-full bg-muted/20 p-3 sm:p-4 dark:bg-muted/10">
                <HighlightedCode code={code} />
              </div>
            </div>
          </div>

          <p className="mt-2.5 px-0.5 text-[10px] leading-relaxed text-muted-foreground sm:text-[11px]">
            Generated from{' '}
            <span className="font-medium text-foreground">{metadata.name}</span>
            {' · '}
            {metadata.test_case_name}
          </p>
        </div>

        <DialogFooter className="shrink-0 gap-2 border-t border-border bg-muted/20 px-4 py-3 sm:px-6 sm:py-4">
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
          <Button
            type="button"
            className="w-full gap-2 bg-brand text-brand-foreground hover:bg-brand/90 sm:w-auto"
            onClick={handleCopy}
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copied to Clipboard' : 'Copy to Clipboard'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
