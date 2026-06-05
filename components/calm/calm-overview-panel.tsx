'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle2,
  AlertTriangle,
  Link2,
  Bug,
  Inbox,
  Shield,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { staggerItem } from '@/lib/animations'
import {
  MOCK_OUTBOX,
  MOCK_SYNC_LOG,
  MOCK_SCENARIO_BINDINGS,
  MOCK_DEFECT_PROJECTIONS,
} from '@/lib/calm-mock-data'

const PHASES = [
  {
    phase: 'Phase 1 — Inbound',
    direction: 'CALM → SATIP',
    icon: ArrowDownLeft,
    tone: 'border-l-blue-500 bg-gradient-to-br from-card via-card to-blue-500/[0.06]',
    description:
      'SAP Cloud ALM calls the Test Automation API. Results flow back via GET /testcases/executionhistory pull.',
    capabilities: [
      'Test creation & execution orchestration',
      'Authoritative pass/fail write-back',
      'Certified provider integration',
    ],
    active: true,
  },
  {
    phase: 'Phase 2 — Outbound',
    direction: 'SATIP → CALM',
    icon: ArrowUpRight,
    tone: 'border-l-brand bg-gradient-to-br from-card via-card to-brand/[0.07]',
    description:
      'SATIP enriches CALM via tenant APIs — defect raising, status patches, and prompt visibility for SATIP-initiated runs.',
    capabilities: [
      'Raise & link defects on failed bound runs',
      'Patch requirement / task status',
      'Transactional outbox with idempotency',
    ],
    active: true,
  },
]

export function CalmOverviewPanel() {
  const pendingOutbox = MOCK_OUTBOX.filter((e) => e.state === 'NEW' || e.state === 'FAILED').length
  const recentFailures = MOCK_SYNC_LOG.filter((e) => e.status === 'FAILED').length
  const staleBindings = MOCK_SCENARIO_BINDINGS.filter((b) => b.binding_state === 'STALE').length

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {PHASES.map((p) => {
          const Icon = p.icon
          return (
            <motion.article
              key={p.phase}
              variants={staggerItem}
              initial="hidden"
              animate="visible"
              className={cn(
                'rounded-xl border border-border border-l-[3px] p-4 sm:p-5 shadow-[var(--shadow-xs)]',
                p.tone,
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-lg bg-muted/60 flex items-center justify-center shrink-0">
                    <Icon className="h-4 w-4 text-foreground" />
                  </div>
                  <div>
                    <h2 className="section-title">{p.phase}</h2>
                    <p className="caption-text font-mono">{p.direction}</p>
                  </div>
                </div>
                <Badge className="pill pill-success h-6 text-[10px] border-0 gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Active
                </Badge>
              </div>
              <p className="page-description mt-3 text-sm leading-relaxed">{p.description}</p>
              <ul className="mt-3 space-y-1.5">
                {p.capabilities.map((cap) => (
                  <li key={cap} className="flex items-start gap-2 text-xs sm:text-sm text-muted-foreground">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    {cap}
                  </li>
                ))}
              </ul>
            </motion.article>
          )
        })}
      </div>

      <motion.div
        variants={staggerItem}
        initial="hidden"
        animate="visible"
        className="rounded-xl border border-border bg-card shadow-[var(--shadow-xs)] p-4 sm:p-5"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div>
            <h2 className="section-title">Integration Health</h2>
            <p className="section-description mt-0.5">
              Operational signals from bindings, outbox, and sync log
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="h-8" asChild>
              <Link href="/system-admin/calm/outbox">View Outbox</Link>
            </Button>
            <Button variant="outline" size="sm" className="h-8" asChild>
              <Link href="/system-admin/calm/sync-log">Sync Log</Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <HealthTile
            icon={Inbox}
            label="Outbox attention"
            value={pendingOutbox}
            hint="NEW or FAILED entries"
            tone="warning"
            href="/system-admin/calm/outbox"
          />
          <HealthTile
            icon={Link2}
            label="Stale bindings"
            value={staleBindings}
            hint="Require reconciliation"
            tone="warning"
            href="/system-admin/calm/bindings"
          />
          <HealthTile
            icon={Bug}
            label="Open CALM defects"
            value={MOCK_DEFECT_PROJECTIONS.filter((d) => d.status !== 'CLOSED').length}
            hint="Raised by Phase 2"
            tone="info"
            href="/system-admin/calm/projections"
          />
        </div>

        {recentFailures > 0 && (
          <div className="mt-4 flex items-start gap-2 rounded-lg border border-amber-500/25 bg-amber-500/[0.06] px-3 py-2.5 text-xs sm:text-sm text-amber-900 dark:text-amber-200">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>
              {recentFailures} outbound sync failure{recentFailures !== 1 ? 's' : ''} in the last 24h.
              Check OAuth scopes and tenant rate limits.
            </span>
          </div>
        )}
      </motion.div>

      <motion.div
        variants={staggerItem}
        initial="hidden"
        animate="visible"
        className="rounded-xl border border-border bg-card shadow-[var(--shadow-xs)] p-4 sm:p-5"
      >
        <div className="flex items-center gap-2 mb-3">
          <Shield className="h-4 w-4 text-brand" />
          <h2 className="section-title">Design Principles</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
          <Principle text="CALM remains the system of record for traceability and compliance." />
          <Principle text="SATIP enriches CALM — it never forks traceability data." />
          <Principle text="Pass/fail verdicts flow via Phase 1 executionhistory pull only." />
          <Principle text="Outbound mutations use transactional outbox with idempotency keys." />
        </div>
      </motion.div>
    </div>
  )
}

function HealthTile({
  icon: Icon,
  label,
  value,
  hint,
  tone,
  href,
}: {
  icon: React.ElementType
  label: string
  value: number
  hint: string
  tone: 'warning' | 'info' | 'success'
  href: string
}) {
  const tones = {
    warning: 'border-amber-500/20 bg-amber-500/[0.04]',
    info: 'border-blue-500/20 bg-blue-500/[0.04]',
    success: 'border-emerald-500/20 bg-emerald-500/[0.04]',
  }

  return (
    <Link
      href={href}
      className={cn(
        'flex flex-col rounded-lg border p-3 transition-colors hover:bg-muted/30',
        tones[tone],
      )}
    >
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <span className="micro-label">{label}</span>
      </div>
      <p className="kpi-value mt-2">{value}</p>
      <p className="caption-text mt-1">{hint}</p>
    </Link>
  )
}

function Principle({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2">
      <CheckCircle2 className="h-3.5 w-3.5 text-brand shrink-0 mt-0.5" />
      <span>{text}</span>
    </div>
  )
}
