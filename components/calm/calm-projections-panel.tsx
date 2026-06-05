'use client'

import { motion } from 'framer-motion'
import { Play, CheckCircle2, Bug } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { staggerItem } from '@/lib/animations'
import {
  MOCK_RUN_PROJECTIONS,
  MOCK_EXECUTION_PROJECTIONS,
  MOCK_DEFECT_PROJECTIONS,
  SYNC_STATE_PILLS,
  type SyncState,
} from '@/lib/calm-mock-data'
import { formatRelativeTime } from '@/lib/utils'

const VERDICT_PILLS: Record<string, string> = {
  PASS: 'pill pill-success',
  FAIL: 'pill pill-danger',
  BLOCKED: 'pill pill-warning',
  SKIP: 'pill pill-neutral',
}

const DEFECT_STATUS: Record<string, string> = {
  OPEN: 'pill pill-danger',
  IN_PROGRESS: 'pill pill-warning',
  CLOSED: 'pill pill-success',
}

export function CalmProjectionsPanel() {
  return (
    <motion.div
      variants={staggerItem}
      initial="hidden"
      animate="visible"
      className="rounded-xl border border-border bg-card shadow-[var(--shadow-xs)] overflow-hidden"
    >
      <div className="p-4 sm:p-5 border-b border-border/60">
        <h2 className="section-title">Projection & Sync State</h2>
        <p className="section-description mt-0.5">
          Tracks what SATIP exposed to CALM and acknowledgement state — not a second copy of CALM
          verdicts
        </p>
      </div>

      <Tabs defaultValue="runs" className="p-4 sm:p-5 pt-0">
        <TabsList className="w-full sm:w-auto h-auto flex-wrap justify-start gap-1 bg-muted/30 p-1 mt-4">
          <TabsTrigger value="runs" className="text-xs sm:text-sm gap-1.5">
            <Play className="h-3.5 w-3.5" />
            Run Projections
          </TabsTrigger>
          <TabsTrigger value="executions" className="text-xs sm:text-sm gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Executions
          </TabsTrigger>
          <TabsTrigger value="defects" className="text-xs sm:text-sm gap-1.5">
            <Bug className="h-3.5 w-3.5" />
            Defects (Phase 2)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="runs" className="mt-4 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Run ID</TableHead>
                <TableHead className="hidden md:table-cell">Scenario</TableHead>
                <TableHead>Tenant</TableHead>
                <TableHead>Sync</TableHead>
                <TableHead className="hidden sm:table-cell">Outcome</TableHead>
                <TableHead className="hidden lg:table-cell">Last Pull</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_RUN_PROJECTIONS.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-mono text-xs">{r.run_id}</TableCell>
                  <TableCell className="hidden md:table-cell text-sm">{r.scenario_name}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{r.tenant_name}</TableCell>
                  <TableCell>
                    <SyncBadge state={r.sync_state} />
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {r.outcome ? (
                      <Badge className={cn('h-5 text-[10px] border-0', VERDICT_PILLS[r.outcome])}>
                        {r.outcome}
                      </Badge>
                    ) : (
                      '—'
                    )}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell caption-text">
                    {r.last_pull_at ? formatRelativeTime(r.last_pull_at) : '—'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent value="executions" className="mt-4 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Execution</TableHead>
                <TableHead className="hidden md:table-cell">Scenario</TableHead>
                <TableHead>CALM Verdict</TableHead>
                <TableHead>Sync</TableHead>
                <TableHead className="text-right">Evidence</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_EXECUTION_PROJECTIONS.map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="font-mono text-xs">{e.execution_id}</TableCell>
                  <TableCell className="hidden md:table-cell text-sm">{e.scenario_name}</TableCell>
                  <TableCell>
                    <Badge className={cn('h-5 text-[10px] border-0', VERDICT_PILLS[e.calm_verdict])}>
                      {e.calm_verdict}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <SyncBadge state={e.sync_state} />
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-sm">
                    {e.evidence_refs}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent value="defects" className="mt-4 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SATIP Defect</TableHead>
                <TableHead className="hidden md:table-cell">CALM Defect</TableHead>
                <TableHead>Run</TableHead>
                <TableHead className="hidden sm:table-cell">Requirement</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden lg:table-cell">Raised</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_DEFECT_PROJECTIONS.map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="font-mono text-xs">{d.defect_id}</TableCell>
                  <TableCell className="hidden md:table-cell font-mono text-xs">
                    {d.calm_defect_id}
                  </TableCell>
                  <TableCell className="font-mono text-[10px]">{d.run_id}</TableCell>
                  <TableCell className="hidden sm:table-cell font-mono text-xs">
                    {d.requirement_ref}
                  </TableCell>
                  <TableCell>
                    <Badge className={cn('h-5 text-[10px] border-0', DEFECT_STATUS[d.status])}>
                      {d.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell caption-text">
                    {formatRelativeTime(d.raised_at)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}

function SyncBadge({ state }: { state: SyncState }) {
  return (
    <Badge className={cn('h-5 text-[10px] border-0', SYNC_STATE_PILLS[state])}>
      {state.replace('_', ' ')}
    </Badge>
  )
}
