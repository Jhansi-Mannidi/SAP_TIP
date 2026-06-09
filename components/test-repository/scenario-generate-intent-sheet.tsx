'use client'

import * as React from 'react'
import {
  Sparkles,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Bot,
  Layers,
  ListChecks,
  Database,
  FileEdit,
} from 'lucide-react'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

const EXAMPLE_INTENTS = [
  'Sales order with credit hold and manual release for vendor in Germany',
  'Standard PO with three-way match and goods receipt in WM',
  'Period-end close with accrual postings and tax reconciliation',
]

const GENERATION_STAGES = [
  'Analyzing business intent…',
  'Mapping SAP transactions and modules…',
  'Drafting test tasks and dependencies…',
  'Suggesting data fixtures…',
  'Finalizing scenario draft…',
]

const AGENT_STEPS = [
  { icon: Layers, text: 'Identify relevant SAP transactions and business process' },
  { icon: ListChecks, text: 'Generate test tasks with predecessor dependencies' },
  { icon: FileEdit, text: 'Create scenario in Draft state for your review' },
  { icon: Database, text: 'Suggest test data sets from your configuration' },
]

interface ScenarioGenerateIntentSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ScenarioGenerateIntentSheet({
  open,
  onOpenChange,
}: ScenarioGenerateIntentSheetProps) {
  const [intent, setIntent] = React.useState('')
  const [status, setStatus] = React.useState<'idle' | 'generating' | 'completed'>('idle')
  const [progress, setProgress] = React.useState(0)
  const [stageIndex, setStageIndex] = React.useState(0)

  React.useEffect(() => {
    if (!open) {
      const timer = setTimeout(() => {
        setStatus('idle')
        setIntent('')
        setProgress(0)
        setStageIndex(0)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [open])

  const handleGenerate = () => {
    if (!intent.trim() || status === 'generating') return
    setStatus('generating')
    setProgress(0)
    setStageIndex(0)

    let tick = 0
    const interval = setInterval(() => {
      tick += 4
      const pct = Math.min(100, tick)
      setProgress(pct)
      setStageIndex(Math.min(GENERATION_STAGES.length - 1, Math.floor((pct / 100) * GENERATION_STAGES.length)))
      if (pct >= 100) {
        clearInterval(interval)
        setStatus('completed')
      }
    }, 90)
  }

  const handleClose = () => onOpenChange(false)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md p-0 flex flex-col gap-0 border-l border-border/80 [&>button.absolute]:hidden"
      >
        <SheetHeader className="shrink-0 border-b border-border bg-gradient-to-br from-brand/[0.07] via-card to-card px-5 py-4 space-y-3 text-left">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-brand text-brand-foreground flex items-center justify-center shadow-sm shrink-0">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <SheetTitle className="text-base font-semibold">Generate Scenario from Intent</SheetTitle>
              <SheetDescription className="text-xs mt-1 leading-relaxed">
                Describe what you want to test in natural language. Voltus AI Agent will generate a
                complete test scenario draft for your review.
              </SheetDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="pill pill-brand h-6 border-0 gap-1">
              <Bot className="h-3 w-3" />
              Voltus AI Agent
            </Badge>
            <Badge variant="outline" className="h-6 text-[10px]">
              Output: Draft scenario
            </Badge>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
          {status === 'completed' ? (
            <div className="space-y-4">
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/[0.06] p-4 flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-200">
                    Scenario draft ready
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    Generated <span className="font-mono font-medium">AI_OTC_CREDIT_HOLD</span> with
                    8 tasks across SD and FI. Review and publish when ready.
                  </p>
                </div>
              </div>
              <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-2 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Business process</span>
                  <span className="font-medium">OTC</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Modules</span>
                  <span className="font-mono text-xs">SD, FI</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Tasks generated</span>
                  <span className="font-medium">8</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Confidence</span>
                  <span className="font-medium text-brand">91%</span>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="scenario-intent" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Test intent
                </Label>
                <Textarea
                  id="scenario-intent"
                  placeholder="e.g. Sales order with credit hold and manual release for vendor in Germany"
                  value={intent}
                  onChange={(e) => setIntent(e.target.value)}
                  disabled={status === 'generating'}
                  className="min-h-[140px] resize-none text-sm bg-background"
                />
                <p className="caption-text">
                  Be specific about business process, master data, and edge cases.
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Try an example</p>
                <div className="flex flex-col gap-2">
                  {EXAMPLE_INTENTS.map((example) => (
                    <button
                      key={example}
                      type="button"
                      disabled={status === 'generating'}
                      onClick={() => setIntent(example)}
                      className={cn(
                        'text-left rounded-lg border border-border/60 bg-card px-3 py-2.5 text-xs text-muted-foreground',
                        'hover:border-brand/30 hover:bg-brand/[0.04] hover:text-foreground transition-colors',
                        intent === example && 'border-brand/40 bg-brand/[0.06] text-foreground ring-1 ring-brand/15',
                      )}
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>

              <section className="rounded-xl border border-border/70 bg-card shadow-[var(--shadow-xs)] overflow-hidden">
                <div className="flex items-center gap-2.5 px-4 py-3 border-b border-border/50 bg-muted/20">
                  <div className="h-7 w-7 rounded-lg bg-brand/10 ring-1 ring-inset ring-brand/15 flex items-center justify-center shrink-0">
                    <Bot className="h-3.5 w-3.5 text-brand" />
                  </div>
                  <p className="text-sm font-semibold">What the agent will do</p>
                </div>
                <ul className="p-4 space-y-3">
                  {AGENT_STEPS.map((step) => {
                    const Icon = step.icon
                    return (
                      <li key={step.text} className="flex items-start gap-2.5 text-xs text-muted-foreground">
                        <Icon className="h-3.5 w-3.5 text-brand shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{step.text}</span>
                      </li>
                    )
                  })}
                </ul>
              </section>

              {status === 'generating' && (
                <div className="rounded-xl border border-brand/25 bg-brand/[0.05] p-4 space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Loader2 className="h-4 w-4 animate-spin text-brand" />
                    {GENERATION_STAGES[stageIndex]}
                  </div>
                  <Progress value={progress} className="h-2" />
                  <p className="caption-text tabular-nums">{progress}% complete</p>
                </div>
              )}

              <div className="flex items-start gap-2 rounded-lg border border-brand/25 bg-brand/[0.05] px-3 py-2.5">
                <AlertCircle className="h-3.5 w-3.5 text-brand mt-0.5 shrink-0" />
                <p className="text-[11px] text-foreground/80 leading-relaxed">
                  <span className="font-semibold text-foreground">Draft only.</span> Generated
                  scenarios require review and approval before publishing.
                </p>
              </div>
            </>
          )}
        </div>

        <div className="shrink-0 border-t border-border bg-card/95 backdrop-blur-sm px-5 py-3.5 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2">
          <Button variant="outline" size="sm" className="h-9" onClick={handleClose}>
            {status === 'completed' ? 'Close' : 'Cancel'}
          </Button>
          {status === 'completed' ? (
            <Button
              size="sm"
              className="h-9 bg-brand text-brand-foreground hover:bg-brand/90 gap-1.5"
              onClick={handleClose}
            >
              <FileEdit className="h-3.5 w-3.5" />
              Review draft
            </Button>
          ) : (
            <Button
              size="sm"
              className="h-9 bg-brand text-brand-foreground hover:bg-brand/90 gap-1.5 min-w-[9rem]"
              onClick={handleGenerate}
              disabled={!intent.trim() || status === 'generating'}
            >
              {status === 'generating' ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Generating…
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5" />
                  Generate scenario
                </>
              )}
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
