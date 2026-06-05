'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Layers, Target, Play } from 'lucide-react'

import { AppShell } from '@/components/app-shell'
import { ProcessMiningLayout } from '@/components/process-mining/process-mining-layout'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Progress } from '@/components/ui/progress'
import { PipelineWalkthrough } from '@/components/pipeline-walkthrough'
import { EntityCodeLink } from '@/components/entity-code-link'
import { staggerItem } from '@/lib/animations'

const discoveredProcesses = [
  {
    id: 'PROC-001',
    name: 'Order to Cash - Standard',
    variant: 'Happy Path',
    frequency: 4521,
    avgDuration: '4.2 days',
    conformance: 94,
    testCoverage: 87,
    status: 'Covered',
  },
  {
    id: 'PROC-002',
    name: 'Order to Cash - Credit Block',
    variant: 'Credit Hold',
    frequency: 892,
    avgDuration: '7.8 days',
    conformance: 78,
    testCoverage: 62,
    status: 'Partial',
  },
  {
    id: 'PROC-003',
    name: 'Order to Cash - Returns',
    variant: 'Return Flow',
    frequency: 456,
    avgDuration: '6.1 days',
    conformance: 85,
    testCoverage: 45,
    status: 'Gap',
  },
  {
    id: 'PROC-004',
    name: 'Procure to Pay - Standard',
    variant: '3-Way Match',
    frequency: 3245,
    avgDuration: '5.5 days',
    conformance: 91,
    testCoverage: 92,
    status: 'Covered',
  },
  {
    id: 'PROC-005',
    name: 'Procure to Pay - Direct',
    variant: 'No PO',
    frequency: 567,
    avgDuration: '2.1 days',
    conformance: 72,
    testCoverage: 38,
    status: 'Gap',
  },
]

const suggestedTests = [
  {
    id: 'SUG-001',
    process: 'Order to Cash - Returns',
    scenario: 'Full return with credit memo',
    priority: 'High',
    confidence: 89,
    steps: 12,
    status: 'Ready',
  },
  {
    id: 'SUG-002',
    process: 'Procure to Pay - Direct',
    scenario: 'Non-PO invoice processing',
    priority: 'High',
    confidence: 85,
    steps: 8,
    status: 'Ready',
  },
  {
    id: 'SUG-003',
    process: 'Order to Cash - Credit Block',
    scenario: 'Credit limit exceeded path',
    priority: 'Medium',
    confidence: 78,
    steps: 15,
    status: 'Draft',
  },
]

function statusBadge(status: string) {
  if (status === 'Covered') return 'pill pill-success'
  if (status === 'Partial') return 'pill pill-warning'
  return 'pill pill-danger'
}

export default function ProcessMiningPage() {
  return (
    <AppShell currentApp="process-mining">
      <ProcessMiningLayout>
        <div className="space-y-4 sm:space-y-5">
          <motion.div
            className="rounded-xl border border-border bg-card shadow-[var(--shadow-xs)] overflow-hidden"
            variants={staggerItem}
            initial="hidden"
            animate="visible"
          >
            <div className="p-4 sm:p-5 border-b border-border/60">
              <h2 className="section-title">Discovered Processes</h2>
              <p className="section-description mt-0.5">
                Processes mined from SAP production event logs
              </p>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Process</TableHead>
                    <TableHead className="hidden md:table-cell">Variant</TableHead>
                    <TableHead className="text-right">Frequency</TableHead>
                    <TableHead className="hidden lg:table-cell">Avg Duration</TableHead>
                    <TableHead className="hidden sm:table-cell">Conformance</TableHead>
                    <TableHead>Test Coverage</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-10" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {discoveredProcesses.map((process) => (
                    <TableRow key={process.id}>
                      <TableCell>
                        <EntityCodeLink kind="Scenario" code={process.id} name={process.name} />
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="outline" className="text-xs">
                          {process.variant}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium tabular-nums">
                        {process.frequency.toLocaleString()}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-muted-foreground text-sm">
                        {process.avgDuration}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="flex items-center gap-2">
                          <Progress value={process.conformance} className="h-1.5 w-14" />
                          <span className="text-xs tabular-nums">{process.conformance}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 min-w-[5rem]">
                          <Progress value={process.testCoverage} className="h-1.5 flex-1 min-w-[2.5rem]" />
                          <span className="text-xs tabular-nums w-8 text-right">{process.testCoverage}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusBadge(process.status)}>{process.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </motion.div>

          <motion.div
            className="rounded-xl border border-border bg-card shadow-[var(--shadow-xs)] overflow-hidden"
            variants={staggerItem}
            initial="hidden"
            animate="visible"
          >
            <div className="p-4 sm:p-5 border-b border-border/60">
              <h2 className="section-title">Order to Cash — Standard Path</h2>
              <p className="section-description mt-0.5">
                Most frequent O2C process flow discovered from production
              </p>
            </div>
            <div className="p-4 sm:p-5">
              <PipelineWalkthrough
                transportId="O2C-FLOW-001"
                stages={[
                  {
                    id: '1',
                    name: 'Sales Order Created',
                    state: 'done',
                    inputSummary: 'Customer request',
                    outputSummary: 'SO document',
                  },
                  {
                    id: '2',
                    name: 'Credit Check',
                    state: 'done',
                    inputSummary: 'Customer credit data',
                    outputSummary: 'Approved',
                  },
                  {
                    id: '3',
                    name: 'Delivery Created',
                    state: 'done',
                    inputSummary: 'SO reference',
                    outputSummary: 'Delivery note',
                  },
                  {
                    id: '4',
                    name: 'Goods Issue',
                    state: 'done',
                    inputSummary: 'Delivery ref',
                    outputSummary: 'Stock movement',
                  },
                  {
                    id: '5',
                    name: 'Billing',
                    state: 'in_progress',
                    inputSummary: 'Delivery ref',
                    outputSummary: 'Invoice',
                  },
                  { id: '6', name: 'Payment Received', state: 'pending' },
                ]}
              />
            </div>
          </motion.div>

          <motion.div
            className="rounded-xl border border-border bg-card shadow-[var(--shadow-xs)] overflow-hidden lg:hidden"
            variants={staggerItem}
            initial="hidden"
            animate="visible"
          >
            <div className="p-4 border-b border-border/60 flex items-center justify-between">
              <div>
                <h2 className="section-title">AI Suggestions</h2>
                <p className="section-description mt-0.5">{suggestedTests.length} pending</p>
              </div>
              <Badge variant="secondary">{suggestedTests.length}</Badge>
            </div>
            <div className="p-4 space-y-3">
              {suggestedTests.slice(0, 2).map((suggestion) => (
                <div
                  key={suggestion.id}
                  className="flex items-start justify-between gap-3 p-3 rounded-lg border border-border/60 bg-muted/10"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{suggestion.scenario}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{suggestion.process}</p>
                    <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground">
                      <Layers className="h-3 w-3" />
                      {suggestion.steps} steps
                      <Target className="h-3 w-3 ml-1" />
                      {suggestion.confidence}%
                    </div>
                  </div>
                  <Button size="sm" className="h-8 shrink-0">
                    <Play className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </ProcessMiningLayout>
    </AppShell>
  )
}
