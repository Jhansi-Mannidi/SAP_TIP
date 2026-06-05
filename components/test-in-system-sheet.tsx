'use client'

import * as React from 'react'
import { toast } from 'sonner'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  Play,
  CheckCircle2,
  XCircle,
  Loader2,
  Activity,
  RefreshCw,
  AlertTriangle,
  Database,
} from 'lucide-react'
import type { DataFixture } from '@/lib/mock-data'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  fixture: DataFixture | null
}

type Check = {
  id: string
  label: string
  detail: string
  status: 'pending' | 'running' | 'pass' | 'fail'
  durationMs?: number
}

const SYSTEMS = [
  { value: 'sta', label: 'STA/100 — Development' },
  { value: 'stq', label: 'STQ/200 — Quality' },
  { value: 's4h', label: 'S4H/100 — S/4HANA Target' },
]

export function TestInSystemSheet({ open, onOpenChange, fixture }: Props) {
  const [system, setSystem] = React.useState('stq')
  const [running, setRunning] = React.useState(false)
  const [checks, setChecks] = React.useState<Check[]>([])

  React.useEffect(() => {
    if (!open) return
    setRunning(false)
    setSystem('stq')
    setChecks(buildInitialChecks(fixture))
  }, [open, fixture])

  const handleRun = async () => {
    if (!fixture || running) return
    setRunning(true)
    const fresh = buildInitialChecks(fixture)
    setChecks(fresh)

    for (let i = 0; i < fresh.length; i++) {
      // mark running
      setChecks(prev => {
        const next = [...prev]
        next[i] = { ...next[i], status: 'running' }
        return next
      })
      const ms = 320 + Math.floor(Math.random() * 480)
      await new Promise(r => setTimeout(r, ms))

      // deterministic outcome — schema check passes; PII check warns if level >= medium
      const outcome: 'pass' | 'fail' =
        fresh[i].id === 'pii' && (fixture.has_pii === 'medium' || fixture.has_pii === 'high')
          ? 'fail'
          : 'pass'

      setChecks(prev => {
        const next = [...prev]
        next[i] = { ...next[i], status: outcome, durationMs: ms }
        return next
      })
    }

    setRunning(false)
    toast.success('Connectivity check finished', {
      description: `${fixture.code} validated against ${SYSTEMS.find(s => s.value === system)?.label ?? system}`,
    })
  }

  const passCount = checks.filter(c => c.status === 'pass').length
  const failCount = checks.filter(c => c.status === 'fail').length
  const total = checks.length

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-lg p-0 flex flex-col gap-0"
      >
        {/* Header */}
        <SheetHeader className="border-b border-border px-5 sm:px-6 py-4 space-y-1.5 text-left">
          <SheetTitle className="flex items-center gap-2.5 text-base font-semibold">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-brand-foreground shadow-sm shrink-0">
              <Play className="h-4 w-4" />
            </span>
            Test in System
          </SheetTitle>
          <SheetDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {fixture
              ? `Run a connectivity and integrity check for ${fixture.code} against a live SAP system.`
              : 'Run a connectivity and integrity check against a live SAP system.'}
          </SheetDescription>
        </SheetHeader>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 space-y-5">
          {/* Target system */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Activity className="h-3.5 w-3.5 text-muted-foreground" />
              <p className="micro-label">
                Target System
              </p>
            </div>
            <Select value={system} onValueChange={setSystem} disabled={running}>
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SYSTEMS.map(s => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Fixture summary */}
          {fixture && (
            <div className="rounded-lg border border-border bg-muted/30 p-3 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center rounded-md bg-muted border border-border px-1.5 py-0.5 font-mono text-[10px] text-foreground">
                  {fixture.code}
                </span>
                <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                  v{fixture.version}
                </span>
              </div>
              <p className="text-sm font-semibold text-foreground leading-tight">
                {fixture.name}
              </p>
              <div className="grid grid-cols-3 gap-1.5">
                <Mini label="Object" value={fixture.sap_object_type} mono />
                <Mini label="Rows" value={fixture.record_count.toLocaleString()} mono />
                <Mini label="PII" value={fixture.has_pii} />
              </div>
            </div>
          )}

          {/* Result summary */}
          <div className="rounded-lg border border-border bg-background p-3.5">
            <div className="flex items-center justify-between gap-2">
              <p className="page-description text-[11px]">
                Check Result
              </p>
              <ResultPill total={total} pass={passCount} fail={failCount} running={running} />
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={cn(
                  'h-full transition-all duration-300',
                  failCount > 0 && !running
                    ? 'bg-destructive'
                    : running
                      ? 'bg-brand'
                      : 'bg-emerald-500',
                )}
                style={{
                  width: `${total ? Math.round(((passCount + failCount) / total) * 100) : 0}%`,
                }}
              />
            </div>
          </div>

          {/* Check list */}
          <div className="space-y-1.5">
            {checks.map(c => (
              <div
                key={c.id}
                className="flex items-start gap-3 rounded-lg border border-border bg-background px-3 py-2.5"
              >
                <CheckIcon status={c.status} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold text-foreground truncate">{c.label}</p>
                    {c.durationMs ? (
                      <span className="text-[10px] text-muted-foreground tabular-nums shrink-0">
                        {c.durationMs}ms
                      </span>
                    ) : null}
                  </div>
                  <p className="section-description text-[11px] mt-0.5">
                    {c.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* PII warning */}
          {fixture && (fixture.has_pii === 'medium' || fixture.has_pii === 'high') && (
            <div className="flex items-start gap-2 rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2.5">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
              <p className="text-[11px] text-foreground/80 leading-relaxed">
                <span className="font-semibold text-foreground">Heads up.</span>{' '}
                This fixture contains{' '}
                <span className="font-semibold text-foreground">{fixture.has_pii}</span> PII —
                connectivity checks will run with masked payloads.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border px-5 sm:px-6 py-3.5 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2 bg-background">
          <Button
            variant="outline"
            size="sm"
            className="h-9"
            onClick={() => onOpenChange(false)}
            disabled={running}
          >
            Close
          </Button>
          <Button
            size="sm"
            className="h-9 gap-1.5"
            onClick={handleRun}
            disabled={running || !fixture}
          >
            {running ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Running…
              </>
            ) : (
              <>
                <RefreshCw className="h-3.5 w-3.5" />
                {checks.some(c => c.status !== 'pending') ? 'Re-run' : 'Run Test'}
              </>
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

function buildInitialChecks(fixture: DataFixture | null): Check[] {
  if (!fixture) return []
  return [
    {
      id: 'connect',
      label: 'iHub connectivity',
      detail: `Open RFC connection · auth probe`,
      status: 'pending',
    },
    {
      id: 'schema',
      label: 'Schema lookup',
      detail: `Resolve ${fixture.sap_object_type} structure and key fields`,
      status: 'pending',
    },
    {
      id: 'count',
      label: 'Record count',
      detail: `Verify ${fixture.record_count.toLocaleString()} matching rows exist`,
      status: 'pending',
    },
    {
      id: 'pii',
      label: 'PII scan',
      detail: `Detect sensitive columns · respect masking strategy`,
      status: 'pending',
    },
    {
      id: 'integrity',
      label: 'Referential integrity',
      detail: `Resolve foreign keys against companion fixtures`,
      status: 'pending',
    },
  ]
}

function CheckIcon({ status }: { status: Check['status'] }) {
  if (status === 'running') {
    return (
      <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand-soft text-brand shrink-0">
        <Loader2 className="h-3 w-3 animate-spin" />
      </span>
    )
  }
  if (status === 'pass') {
    return (
      <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-inset ring-emerald-500/20 shrink-0">
        <CheckCircle2 className="h-3 w-3" />
      </span>
    )
  }
  if (status === 'fail') {
    return (
      <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-destructive/10 text-destructive ring-1 ring-inset ring-destructive/20 shrink-0">
        <XCircle className="h-3 w-3" />
      </span>
    )
  }
  return (
    <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-muted text-muted-foreground ring-1 ring-inset ring-border shrink-0">
      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />
    </span>
  )
}

function ResultPill({
  total,
  pass,
  fail,
  running,
}: {
  total: number
  pass: number
  fail: number
  running: boolean
}) {
  if (running) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-brand-soft text-brand ring-1 ring-inset ring-brand/30 px-2 py-0.5 text-[10px] font-semibold">
        <Loader2 className="h-2.5 w-2.5 animate-spin" />
        Running
      </span>
    )
  }
  if (fail > 0) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 text-destructive ring-1 ring-inset ring-destructive/20 px-2 py-0.5 text-[10px] font-semibold tabular-nums">
        {fail} failed
      </span>
    )
  }
  if (pass === total && total > 0) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-inset ring-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold tabular-nums">
        {pass}/{total} passed
      </span>
    )
  }
  return (
    <span className="inline-flex items-center rounded-full bg-muted text-muted-foreground ring-1 ring-inset ring-border px-2 py-0.5 text-[10px] font-semibold">
      Idle
    </span>
  )
}

function Mini({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="rounded-md border border-border bg-background px-2 py-1.5">
      <p className="page-description text-[9px]">
        {label}
      </p>
      <p
        className={cn(
          'text-[11px] font-semibold text-foreground mt-0.5 truncate capitalize',
          mono && 'font-mono normal-case',
        )}
      >
        {value}
      </p>
    </div>
  )
}

// quiet unused warning
void Database
