'use client'

import * as React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { 
  ChevronRight,
  Clock,
  Calendar,
  FileText,
  Download,
  MoreHorizontal,
  Play,
  TrendingUp,
  TrendingDown,
  Target,
  AlertTriangle,
  Bug,
  Sparkles,
  CheckCircle2,
  Layers,
  Activity,
  Zap,
  Users,
  FileCode2,
  ArrowUpRight,
} from 'lucide-react'

import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

import { MOCK_MIGRATIONS, MOCK_MIGRATION_ACTIVITIES, type MigrationPhase } from '@/lib/migration-mock-data'

const PHASE_ORDER: MigrationPhase[] = ['Initiation', 'Design', 'Realization', 'Test_Prep', 'Cutover', 'Hypercare', 'Closed']

function KPITile({ 
  label, 
  value, 
  unit = '', 
  delta, 
  trend,
  variant = 'default'
}: { 
  label: string
  value: number | string
  unit?: string
  delta?: number
  trend?: 'up' | 'down' | 'neutral'
  variant?: 'default' | 'success' | 'warning' | 'danger'
}) {
  const variantStyles = {
    default: 'bg-card',
    success: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800',
    warning: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800',
    danger: 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800',
  }
  
  return (
    <div className={cn('p-4 rounded-lg border', variantStyles[variant])}>
      <div className="text-xs text-muted-foreground mb-1">{label}</div>
      <div className="flex items-end justify-between">
        <div className="stat-value">
          {value}{unit}
        </div>
        {delta !== undefined && (
          <div className={cn(
            'flex items-center text-xs font-medium',
            trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-red-600' : 'text-muted-foreground'
          )}>
            {trend === 'up' ? <TrendingUp className="h-3 w-3 mr-1" /> : trend === 'down' ? <TrendingDown className="h-3 w-3 mr-1" /> : null}
            {delta > 0 ? '+' : ''}{delta}{unit}
          </div>
        )}
      </div>
      {/* Mini sparkline placeholder */}
      <div className="mt-2 h-6 flex items-end gap-0.5">
        {[40, 45, 42, 50, 48, 55, 60, 58, 65, 70, 68, 75].map((h, i) => (
          <div key={i} className="flex-1 bg-primary/20 rounded-sm" style={{ height: `${h}%` }} />
        ))}
      </div>
    </div>
  )
}

export default function MigrationOverviewPage() {
  const params = useParams()
  const migration = MOCK_MIGRATIONS.find(m => m.id === params.id) || MOCK_MIGRATIONS[0]
  
  const currentPhaseIndex = PHASE_ORDER.indexOf(migration.current_phase)

  return (
    <AppShell currentApp="migration-cockpit">
      <div className="flex flex-col h-full overflow-auto">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
          <div className="p-4 md:p-6">
            {/* Breadcrumb */}
            <div className="flex items-center text-sm text-muted-foreground mb-2">
              <Link href="/migration-cockpit" className="hover:text-foreground">Migrations</Link>
              <ChevronRight className="h-4 w-4 mx-1" />
              <span className="text-foreground">{migration.name}</span>
            </div>
            
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <code className="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">{migration.code}</code>
                  <Badge variant="outline" className="text-sm">{migration.current_phase.replace('_', ' ')}</Badge>
                  <Badge className={cn(
                    'text-sm',
                    migration.days_to_cutover > 60 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' :
                    migration.days_to_cutover > 14 ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' :
                    'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                  )}>
                    <Clock className="h-3 w-3 mr-1" />
                    {migration.days_to_cutover} days to cutover
                  </Badge>
                </div>
                <h1 className="page-title">{migration.name}</h1>
              </div>
              
              <div className="flex items-center gap-2 flex-wrap">
                <Button variant="outline" size="sm" className="gap-2">
                  <Calendar className="h-4 w-4" />
                  Schedule Phase Transition
                </Button>
                <Link href={`/migration-cockpit/${migration.id}/cutover`}>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Play className="h-4 w-4" />
                    Open Cutover Plan
                  </Button>
                </Link>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="h-4 w-4" />
                  Export PDF
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit Migration</DropdownMenuItem>
                    <DropdownMenuItem>View Audit Log</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">Archive Migration</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>

        {/* Scorecard Content */}
        <div className="flex-1 p-4 md:p-6 space-y-6">
          {/* Phase Progression Strip */}
          <Card>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Phase Progression</h3>
                <div className="text-sm text-muted-foreground">
                  Started: {new Date(migration.planned_start_date).toLocaleDateString()} | 
                  Target Cutover: {new Date(migration.planned_cutover_date).toLocaleDateString()}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {PHASE_ORDER.map((phase, index) => {
                  const phaseData = migration.phases.find(p => p.phase === phase)
                  const isCompleted = phaseData?.state === 'Completed'
                  const isCurrent = phase === migration.current_phase
                  const isPending = index > currentPhaseIndex
                  
                  return (
                    <React.Fragment key={phase}>
                      <div className="flex-1">
                        <div className={cn(
                          'h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-colors',
                          isCompleted && 'bg-emerald-500 text-white',
                          isCurrent && 'bg-primary text-primary-foreground',
                          isPending && 'bg-muted text-muted-foreground'
                        )}>
                          {phase.replace('_', ' ')}
                        </div>
                        {phaseData && (
                          <div className="text-[10px] text-muted-foreground text-center mt-1">
                            {phaseData.actual_start ? new Date(phaseData.actual_start).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 
                             new Date(phaseData.planned_start).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </div>
                        )}
                      </div>
                      {index < PHASE_ORDER.length - 1 && (
                        <div className={cn(
                          'w-4 h-1 rounded',
                          index < currentPhaseIndex ? 'bg-emerald-500' : 'bg-muted'
                        )} />
                      )}
                    </React.Fragment>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* KPI Grid */}
          <StaggerGrid columns="grid-cols-2 md:grid-cols-4" className="gap-4" fast>
            {/* Row 1 */}
            <KPITile 
              label="BP Coverage" 
              value={migration.scorecard.bp_coverage_pct} 
              unit="%" 
              delta={3} 
              trend="up"
              variant={migration.scorecard.bp_coverage_pct >= 80 ? 'success' : 'warning'}
            />
            <KPITile 
              label="SI Items Closed" 
              value={migration.scorecard.si_closed_pct} 
              unit="%" 
              delta={5} 
              trend="up"
            />
            <KPITile 
              label="ABAP Findings Closed" 
              value={migration.scorecard.abap_closed_pct} 
              unit="%" 
              delta={8} 
              trend="up"
            />
            <KPITile 
              label="Regression Pass Rate" 
              value={migration.scorecard.regression_pass_rate} 
              unit="%" 
              delta={1.2} 
              trend="up"
              variant="success"
            />
            
            {/* Row 2 */}
            <KPITile 
              label="Test Healing Rate" 
              value={migration.scorecard.test_healing_rate} 
              unit="%" 
              delta={2} 
              trend="up"
            />
            <KPITile 
              label="Open Critical Defects" 
              value={migration.scorecard.open_critical_defects} 
              delta={-2} 
              trend="down"
              variant={migration.scorecard.open_critical_defects === 0 ? 'success' : 'danger'}
            />
            <KPITile 
              label="Cutover Readiness" 
              value={migration.scorecard.cutover_readiness_score} 
              unit="%" 
              delta={5} 
              trend="up"
              variant={migration.scorecard.cutover_readiness_score >= 80 ? 'success' : 'warning'}
            />
            <KPITile 
              label="Days to Cutover" 
              value={migration.days_to_cutover} 
              variant={migration.days_to_cutover > 60 ? 'success' : migration.days_to_cutover > 14 ? 'warning' : 'danger'}
            />
            
            {/* Row 3 */}
            <KPITile 
              label="Test Pack Coverage" 
              value={migration.scorecard.test_pack_coverage} 
              unit="%" 
              delta={2} 
              trend="up"
            />
            <KPITile 
              label="Active Suites Today" 
              value={migration.scorecard.active_suites_today}
            />
            <KPITile 
              label="Healed Cases (7d)" 
              value={migration.scorecard.healed_cases_7d} 
              delta={4} 
              trend="up"
            />
            <KPITile 
              label="Defect Resolution (days)" 
              value={migration.scorecard.defect_resolution_time_days} 
              delta={-0.5} 
              trend="down"
              variant="success"
            />
          </StaggerGrid>

          {/* Trend Section and Activity Feed */}
          <StaggerGrid columns="grid-cols-1 lg:grid-cols-3" className="gap-6" fast>
            {/* Burndown Chart Placeholder */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">SI/ABAP Burndown & Pass Rate Trend</CardTitle>
                <CardDescription>Last 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center border rounded-lg bg-muted/30">
                  <div className="text-center text-muted-foreground">
                    <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Burndown & Trend Charts</p>
                    <p className="text-xs">SI Items: 96 → 31 remaining</p>
                    <p className="text-xs">ABAP: 503 → 276 remaining</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Activity Feed */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Latest Activity</CardTitle>
                  <Link href={`/migration-cockpit/${migration.id}/activity`}>
                    <Button variant="ghost" size="sm" className="text-xs">
                      View All <ArrowUpRight className="h-3 w-3 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {MOCK_MIGRATION_ACTIVITIES.slice(0, 8).map(event => (
                  <div key={event.id} className="flex items-start gap-3 text-sm">
                    <div className={cn(
                      'p-1.5 rounded',
                      event.event_class === 'Test_Execution' && 'bg-emerald-100 dark:bg-emerald-900/30',
                      event.event_class === 'Cutover' && 'bg-red-100 dark:bg-red-900/30',
                      event.event_class === 'Approval' && 'bg-blue-100 dark:bg-blue-900/30',
                      event.event_class === 'Defect' && 'bg-amber-100 dark:bg-amber-900/30',
                      event.event_class === 'SI_Item' && 'bg-violet-100 dark:bg-violet-900/30',
                      event.event_class === 'ABAP_Finding' && 'bg-cyan-100 dark:bg-cyan-900/30',
                      event.event_class === 'BP_Violation' && 'bg-rose-100 dark:bg-rose-900/30',
                      !['Test_Execution', 'Cutover', 'Approval', 'Defect', 'SI_Item', 'ABAP_Finding', 'BP_Violation'].includes(event.event_class) && 'bg-muted'
                    )}>
                      {event.event_class === 'Test_Execution' && <Layers className="h-3 w-3" />}
                      {event.event_class === 'Cutover' && <Play className="h-3 w-3" />}
                      {event.event_class === 'Approval' && <CheckCircle2 className="h-3 w-3" />}
                      {event.event_class === 'Defect' && <Bug className="h-3 w-3" />}
                      {event.event_class === 'SI_Item' && <AlertTriangle className="h-3 w-3" />}
                      {event.event_class === 'ABAP_Finding' && <FileCode2 className="h-3 w-3" />}
                      {event.event_class === 'BP_Violation' && <Target className="h-3 w-3" />}
                      {event.event_class === 'Transport' && <Activity className="h-3 w-3" />}
                      {event.event_class === 'Decision_Log' && <FileText className="h-3 w-3" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs truncate">{event.description}</p>
                      <p className="page-description text-[10px]">
                        {event.actor.name} · {new Date(event.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    {event.signed && (
                      <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0" />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </StaggerGrid>

          {/* Quick Links */}
          <StaggerGrid columns="grid-cols-2 md:grid-cols-4 lg:grid-cols-6" className="gap-3" fast>
            <Link href={`/migration-cockpit/phases`}>
              <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-medium">Phases</span>
                </div>
              </Card>
            </Link>
            <Link href={`/migration-cockpit/scope`}>
              <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-medium">Scope</span>
                </div>
              </Card>
            </Link>
            <Link href={`/migration-cockpit/si-items`}>
              <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-medium">SI Items</span>
                  <Badge variant="secondary" className="ml-auto text-xs">12</Badge>
                </div>
              </Card>
            </Link>
            <Link href={`/migration-cockpit/abap`}>
              <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                <div className="flex items-center gap-2">
                  <FileCode2 className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-medium">ABAP</span>
                  <Badge variant="secondary" className="ml-auto text-xs">18</Badge>
                </div>
              </Card>
            </Link>
            <Link href={`/migration-cockpit/cutover`}>
              <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                <div className="flex items-center gap-2">
                  <Play className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-medium">Cutover</span>
                </div>
              </Card>
            </Link>
            <Link href={`/migration-cockpit/signoff`}>
              <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-medium">Sign-Off</span>
                </div>
              </Card>
            </Link>
          </StaggerGrid>
        </div>
      </div>
    </AppShell>
  )
}
