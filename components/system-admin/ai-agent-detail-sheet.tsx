'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  Activity,
  Bot,
  Copy,
  Fingerprint,
  Gauge,
  Settings,
  Shield,
  Sparkles,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import type { AgentKind, AIAgent, AgentStatus } from '@/lib/config-mock-data'

const AGENT_KIND_COLORS: Record<AgentKind, string> = {
  Classification: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/25',
  'Impact Analysis': 'bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-500/25',
  'Test Generation': 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/25',
  'Test Execution': 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-500/25',
  'Test Data': 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/25',
  Healing: 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/25',
  'Defect Triage': 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/25',
  Reporting: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/25',
  'Audit Pack Composer': 'bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-500/25',
  'KB Curation': 'bg-teal-500/10 text-teal-700 dark:text-teal-400 border-teal-500/25',
}

const STATUS_STYLES: Record<AgentStatus, string> = {
  Active: 'border-emerald-500/35 text-emerald-700 dark:text-emerald-400 bg-emerald-500/[0.06]',
  Disabled: 'text-muted-foreground border-border bg-muted/30',
  Maintenance: 'border-amber-500/35 text-amber-700 dark:text-amber-400 bg-amber-500/[0.06]',
}

function getThresholds(agent: AIAgent) {
  const base = [
    { task_type: `${agent.agent_kind.toLowerCase().replace(/\s+/g, '_')}_confidence`, threshold: 0.85 },
    { task_type: 'auto_promote_threshold', threshold: 0.9 },
  ]
  if (agent.agent_kind === 'Classification') {
    return [
      { task_type: 'defect_classification', threshold: 0.85 },
      { task_type: 'failure_classification', threshold: 0.8 },
      { task_type: 'severity_prediction', threshold: 0.9 },
    ]
  }
  return base.slice(0, agent.threshold_count)
}

function groupScopes(scopes: string[]) {
  return scopes.reduce<Record<string, string[]>>((groups, scope) => {
    const [domain] = scope.split('.')
    if (!groups[domain]) groups[domain] = []
    groups[domain].push(scope)
    return groups
  }, {})
}

export function AiAgentDetailSheet({
  agent,
  open,
  onOpenChange,
}: {
  agent: AIAgent | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    if (!open) setCopied(false)
  }, [open])

  if (!agent) return null

  const thresholds = getThresholds(agent)
  const scopeGroups = groupScopes(agent.capability_scopes)

  const handleCopyDid = async () => {
    await navigator.clipboard.writeText(agent.did)
    setCopied(true)
    const { toast } = await import('sonner')
    toast.success('DID copied to clipboard')
    window.setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md p-0 flex flex-col gap-0 [&>button.absolute]:hidden"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>AI Agent Details</SheetTitle>
          <SheetDescription>Configure thresholds and view agent identity</SheetDescription>
        </SheetHeader>

        <div className="flex h-full flex-col min-h-0">
          <div className="relative shrink-0 border-b border-border bg-gradient-to-br from-violet-500/[0.08] via-background to-background px-5 sm:px-6 pt-5 pb-4">
            <div className="pointer-events-none absolute -right-6 -top-8 h-24 w-24 rounded-full bg-violet-500/10 blur-2xl" />
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-500 text-white shadow-sm">
                <Bot className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-base leading-tight">{agent.display_name}</h3>
                <Badge
                  variant="outline"
                  className={cn('mt-2 h-6 text-[10px] border', AGENT_KIND_COLORS[agent.agent_kind])}
                >
                  {agent.agent_kind}
                </Badge>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <Badge
                    variant="outline"
                    className={cn('h-6 text-[10px] border', STATUS_STYLES[agent.status])}
                  >
                    {agent.status}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-4">
              {[
                { label: 'Tasks (24h)', value: agent.recent_tasks_24h },
                { label: 'Thresholds', value: agent.threshold_count },
                { label: 'Scopes', value: agent.capability_scopes.length },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-lg border border-border/70 bg-card/80 px-3 py-2 text-center"
                >
                  <p className="text-lg font-semibold tabular-nums leading-none">{stat.value}</p>
                  <p className="caption-text mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 space-y-5">
            <section className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                <Gauge className="h-3.5 w-3.5 text-brand" />
                Confidence Thresholds
              </h4>
              <div className="space-y-2">
                {thresholds.map((threshold) => (
                  <div
                    key={threshold.task_type}
                    className="rounded-xl border border-border bg-card p-3 shadow-[var(--shadow-xs)]"
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <code className="text-[11px] font-mono text-foreground truncate">
                        {threshold.task_type}
                      </code>
                      <Badge variant="outline" className="font-mono h-5 text-[10px] tabular-nums shrink-0">
                        {(threshold.threshold * 100).toFixed(0)}%
                      </Badge>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-brand transition-all"
                        style={{ width: `${threshold.threshold * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-muted-foreground" />
                Capability Scopes
              </h4>
              <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-3">
                {Object.entries(scopeGroups).map(([domain, scopes]) => (
                  <div key={domain}>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                      {domain}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {scopes.map((scope) => (
                        <Badge
                          key={scope}
                          variant="outline"
                          className="font-mono text-[10px] h-6 bg-background"
                        >
                          {scope}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-muted-foreground" />
                Assignable Roles
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {agent.assignable_roles.map((role) => (
                  <Badge key={role} variant="secondary" className="font-mono text-[10px] h-6" asChild>
                    <Link href="/system-admin/roles">{role}</Link>
                  </Badge>
                ))}
              </div>
            </section>

            <section className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  <Fingerprint className="h-3.5 w-3.5 text-muted-foreground" />
                  DID (Verifiable Identity)
                </h4>
                <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs" onClick={handleCopyDid}>
                  <Copy className="h-3 w-3" />
                  {copied ? 'Copied' : 'Copy'}
                </Button>
              </div>
              <div className="rounded-xl border border-border bg-muted/30 p-3 overflow-x-auto">
                <code className="text-[11px] font-mono text-foreground whitespace-nowrap">
                  {agent.did}
                </code>
              </div>
            </section>
          </div>

          <div className="shrink-0 border-t border-border bg-muted/20 px-5 sm:px-6 py-4 flex flex-col sm:flex-row gap-2">
            <Button variant="outline" className="flex-1 gap-2">
              <Activity className="h-4 w-4" />
              View Activity
            </Button>
            <Button className="flex-1 gap-2 bg-brand text-brand-foreground hover:bg-brand/90">
              <Settings className="h-4 w-4" />
              Configure Thresholds
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export { AGENT_KIND_COLORS, STATUS_STYLES }
