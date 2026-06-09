'use client'

import * as React from 'react'
import Link from 'next/link'
import { 
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Play,
  Calendar,
  Users,
} from 'lucide-react'

import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { cn } from '@/lib/utils'

import { MOCK_MIGRATIONS, type MigrationPhase, type MigrationPhaseData } from '@/lib/migration-mock-data'

const PHASE_ORDER: MigrationPhase[] = ['Initiation', 'Design', 'Realization', 'Test_Prep', 'Cutover', 'Hypercare', 'Closed']

const migration = MOCK_MIGRATIONS[0]

// Add gate criteria to phases for demo
const PHASES_WITH_GATES: (MigrationPhaseData & { kind: 'Pre-Cutover' | 'Cutover' | 'Hypercare' | 'Standard' })[] = [
  { ...migration.phases[0], kind: 'Standard' },
  { ...migration.phases[1], kind: 'Standard' },
  { 
    ...migration.phases[2], 
    kind: 'Pre-Cutover',
    gate_criteria: [
      { id: 'gc_1', kpi_code: 'BP_COVERAGE', label: 'BP Coverage', comparator: '>=', threshold: 80, current_value: 73, unit: '%', passed: false },
      { id: 'gc_2', kpi_code: 'SI_CLOSED', label: 'SI Items Closed', comparator: '>=', threshold: 60, current_value: 68, unit: '%', passed: true },
      { id: 'gc_3', kpi_code: 'ABAP_CLOSED', label: 'ABAP Findings Closed', comparator: '>=', threshold: 40, current_value: 45, unit: '%', passed: true },
      { id: 'gc_4', kpi_code: 'REG_PASS', label: 'Regression Pass Rate', comparator: '>=', threshold: 90, current_value: 94.2, unit: '%', passed: true },
    ]
  },
  { ...migration.phases[3], kind: 'Pre-Cutover' },
  { ...migration.phases[4], kind: 'Cutover' },
  { ...migration.phases[5], kind: 'Hypercare' },
  { ...migration.phases[6], kind: 'Standard' },
]

function PhaseCard({ phase, index }: { phase: typeof PHASES_WITH_GATES[0], index: number }) {
  const [isOpen, setIsOpen] = React.useState(phase.state === 'In_Progress')
  const allGatesPassed = phase.gate_criteria.every(g => g.passed)
  const failedGates = phase.gate_criteria.filter(g => !g.passed)

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className={cn(
        'transition-all',
        phase.state === 'In_Progress' && 'border-primary',
        phase.state === 'Completed' && 'border-emerald-500/50 bg-emerald-50/30 dark:bg-emerald-950/10'
      )}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={cn(
                  'h-10 w-10 rounded-full flex items-center justify-center font-bold',
                  phase.state === 'Completed' && 'bg-emerald-500 text-white',
                  phase.state === 'In_Progress' && 'bg-primary text-primary-foreground',
                  phase.state === 'Pending' && 'bg-muted text-muted-foreground'
                )}>
                  {phase.state === 'Completed' ? <CheckCircle2 className="h-5 w-5" /> : index + 1}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{phase.phase.replace('_', ' ')}</CardTitle>
                    <Badge variant={
                      phase.state === 'Completed' ? 'default' :
                      phase.state === 'In_Progress' ? 'secondary' :
                      'outline'
                    } className={cn(
                      phase.state === 'Completed' && 'bg-emerald-500'
                    )}>
                      {phase.state.replace('_', ' ')}
                    </Badge>
                    <Badge variant="outline" className="text-xs">{phase.kind}</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Planned: {new Date(phase.planned_start).toLocaleDateString()} - {new Date(phase.planned_end).toLocaleDateString()}
                    {phase.actual_start && (
                      <span className="ml-2">
                        | Actual: {new Date(phase.actual_start).toLocaleDateString()}
                        {phase.actual_end && ` - ${new Date(phase.actual_end).toLocaleDateString()}`}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {phase.gate_criteria.length > 0 && (
                  <div className="flex items-center gap-1">
                    {phase.gate_criteria.map((gate, i) => (
                      <div key={i} className={cn(
                        'h-2 w-2 rounded-full',
                        gate.passed ? 'bg-emerald-500' : 'bg-red-500'
                      )} />
                    ))}
                  </div>
                )}
                <ChevronDown className={cn(
                  'h-5 w-5 text-muted-foreground transition-transform',
                  isOpen && 'rotate-180'
                )} />
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="space-y-4">
            {/* Gate Criteria */}
            {phase.gate_criteria.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Gate Criteria</h4>
                <StaggerGrid columns="grid-cols-1 md:grid-cols-2" className="gap-3" fast>
                  {phase.gate_criteria.map(gate => (
                    <div key={gate.id} className={cn(
                      'p-3 rounded-lg border flex items-center justify-between',
                      gate.passed ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800' :
                      'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800'
                    )}>
                      <div className="flex items-center gap-2">
                        {gate.passed ? 
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" /> :
                          <XCircle className="h-4 w-4 text-red-600" />
                        }
                        <span className="text-sm font-medium">{gate.label}</span>
                      </div>
                      <div className="text-sm">
                        <span className={cn(
                          'font-bold',
                          gate.passed ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'
                        )}>
                          {gate.current_value}{gate.unit}
                        </span>
                        <span className="text-muted-foreground"> {gate.comparator} {gate.threshold}{gate.unit}</span>
                      </div>
                    </div>
                  ))}
                </StaggerGrid>
              </div>
            )}

            {/* Phase Transition Action */}
            {phase.state === 'In_Progress' && (
              <div className="pt-2">
                {!allGatesPassed && failedGates.length > 0 && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Cannot transition</AlertTitle>
                    <AlertDescription>
                      {failedGates.map(g => `${g.label} ${g.current_value}${g.unit} below threshold ${g.threshold}${g.unit}`).join(', ')}
                    </AlertDescription>
                  </Alert>
                )}
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button disabled={!allGatesPassed} className="w-full sm:w-auto">
                      <Play className="h-4 w-4 mr-2" />
                      Initiate Phase Transition
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Phase Transition Approval</DialogTitle>
                      <DialogDescription>
                        Transition from {phase.phase.replace('_', ' ')} to {PHASE_ORDER[PHASE_ORDER.indexOf(phase.phase) + 1]?.replace('_', ' ')}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Required Cosigners</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-3 p-2 rounded-lg border">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <div className="font-medium text-sm">Migration Manager</div>
                              <div className="text-xs text-muted-foreground">P.Sharma</div>
                            </div>
                            <Badge variant="outline" className="ml-auto">Pending</Badge>
                          </div>
                          <div className="flex items-center gap-3 p-2 rounded-lg border">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <div className="font-medium text-sm">Solution Architect</div>
                              <div className="text-xs text-muted-foreground">R.Kumar</div>
                            </div>
                            <Badge variant="outline" className="ml-auto">Pending</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline">Cancel</Button>
                      <Button>Request Approval</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  )
}

export default function PhasesViewPage() {
  return (
    <AppShell currentApp="migration-cockpit">
      <div className="flex flex-col h-full overflow-auto">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
          <div className="p-4 md:p-6">
            <div className="page-breadcrumb mb-2">
              <Link href="/migration-cockpit" className="hover:text-foreground">Migrations</Link>
              <ChevronRight className="h-4 w-4 mx-1" />
              <Link href={`/migration-cockpit/${migration.id}`} className="hover:text-foreground">{migration.name}</Link>
              <ChevronRight className="h-4 w-4 mx-1" />
              <span className="text-foreground">Phases</span>
            </div>
            <h1 className="page-title">Phases View</h1>
            <p className="page-description mt-1">
              Migration phases timeline with gate criteria evaluation
            </p>
          </div>
        </div>

        {/* Timeline Gantt */}
        <div className="p-4 md:p-6 border-b">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Timeline Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                {/* Timeline bar */}
                <div className="flex items-center gap-1 mb-4">
                  {PHASES_WITH_GATES.map((phase, index) => {
                    const totalDays = PHASES_WITH_GATES.reduce((acc, p) => {
                      const start = new Date(p.planned_start)
                      const end = new Date(p.planned_end)
                      return acc + (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
                    }, 0)
                    const phaseDays = (new Date(phase.planned_end).getTime() - new Date(phase.planned_start).getTime()) / (1000 * 60 * 60 * 24)
                    const width = (phaseDays / totalDays) * 100
                    
                    return (
                      <div key={phase.id} style={{ width: `${width}%` }} className="relative">
                        <div className={cn(
                          'h-8 rounded flex items-center justify-center text-xs font-medium',
                          phase.state === 'Completed' && 'bg-emerald-500 text-white',
                          phase.state === 'In_Progress' && 'bg-primary text-primary-foreground',
                          phase.state === 'Pending' && 'bg-muted text-muted-foreground'
                        )}>
                          {phase.phase.replace('_', ' ')}
                        </div>
                        {/* Actual vs Planned indicator */}
                        {phase.actual_end && phase.planned_end !== phase.actual_end && (
                          <div className="absolute -bottom-2 left-0 right-0 h-1 bg-amber-500 rounded" />
                        )}
                      </div>
                    )
                  })}
                </div>
                
                {/* Date labels */}
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{new Date(migration.planned_start_date).toLocaleDateString()}</span>
                  <span>{new Date(migration.planned_cutover_date).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Phase Cards */}
        <div className="flex-1 p-4 md:p-6">
          <div className="space-y-4 max-w-4xl">
            {PHASES_WITH_GATES.map((phase, index) => (
              <PhaseCard key={phase.id} phase={phase} index={index} />
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  )
}
