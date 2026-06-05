'use client'

import * as React from 'react'
import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { 
  HeartPulse,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  Target,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  RefreshCw,
} from 'lucide-react'

// Mock health dimensions
const MOCK_HEALTH_DIMENSIONS = [
  { name: 'Test Coverage', score: 87, trend: 'up', change: 3, target: 90, status: 'warning' },
  { name: 'Pass Rate', score: 96, trend: 'up', change: 2, target: 95, status: 'good' },
  { name: 'Automation Rate', score: 82, trend: 'up', change: 5, target: 85, status: 'warning' },
  { name: 'Defect Resolution', score: 78, trend: 'down', change: -4, target: 80, status: 'critical' },
  { name: 'SLA Compliance', score: 94, trend: 'stable', change: 0, target: 95, status: 'warning' },
  { name: 'Healing Success', score: 91, trend: 'up', change: 8, target: 85, status: 'good' },
]

const MOCK_RISKS = [
  { id: 'r1', title: 'Defect Resolution Velocity Declining', severity: 'high', impact: 'May delay UAT completion by 1 week', mitigation: 'Add 2 additional resources to defect triage' },
  { id: 'r2', title: 'Test Coverage Gap in RTR Module', severity: 'medium', impact: 'Potential undetected issues in month-end close', mitigation: 'Generate additional test cases for GL posting scenarios' },
  { id: 'r3', title: 'Runner Pool Capacity Near Limit', severity: 'low', impact: 'Execution delays during peak periods', mitigation: 'Scale runner pool before cutover rehearsal' },
]

const MOCK_ACTIONS = [
  { id: 'a1', action: 'Review and reassign open defects', owner: 'J.Rao', due: '2026-05-09', status: 'overdue' },
  { id: 'a2', action: 'Complete RTR test case generation', owner: 'M.Reddy', due: '2026-05-12', status: 'in-progress' },
  { id: 'a3', action: 'Scale runner pool to 8 workers', owner: 'S.Kumar', due: '2026-05-15', status: 'pending' },
]

export default function ProgramHealthPage() {
  const overallScore = Math.round(MOCK_HEALTH_DIMENSIONS.reduce((sum, d) => sum + d.score, 0) / MOCK_HEALTH_DIMENSIONS.length)

  return (
    <AppShell currentApp="analytics">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="page-title">Program Health Report</h1>
            <p className="page-description">Composite health score with risk matrix and action items</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Overall Health Score */}
        <Card>
          <CardContent>
            <div className="flex flex-col items-center justify-center gap-4 py-6">
              <div className={cn(
                'w-32 h-32 rounded-full border-8 flex items-center justify-center',
                overallScore >= 90 ? 'border-green-500' : overallScore >= 75 ? 'border-amber-500' : 'border-red-500'
              )}>
                <div className="text-center">
                  <p className="text-4xl font-bold">{overallScore}</p>
                  <p className="page-description">/ 100</p>
                </div>
              </div>
              <div className="text-center">
                <p className="text-lg font-medium">Overall Program Health</p>
                <Badge className={cn(
                  overallScore >= 90 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                  overallScore >= 75 ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' :
                  'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                )}>
                  {overallScore >= 90 ? 'Healthy' : overallScore >= 75 ? 'Needs Attention' : 'Critical'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Health Dimensions */}
        <Card>
          <CardHeader>
            <CardTitle>Health Dimensions</CardTitle>
            <CardDescription>Breakdown by category with targets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {MOCK_HEALTH_DIMENSIONS.map((dim) => (
                <div key={dim.name} className="p-4 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{dim.name}</span>
                    <div className={cn(
                      'flex items-center gap-1 text-sm',
                      dim.trend === 'up' ? 'text-green-600' : dim.trend === 'down' ? 'text-red-600' : 'text-muted-foreground'
                    )}>
                      {dim.trend === 'up' && <ArrowUpRight className="h-3 w-3" />}
                      {dim.trend === 'down' && <ArrowDownRight className="h-3 w-3" />}
                      {dim.change !== 0 && `${dim.change > 0 ? '+' : ''}${dim.change}%`}
                    </div>
                  </div>
                  <div className="flex items-end gap-2 mb-2">
                    <span className="stat-value">{dim.score}%</span>
                    <span className="text-sm text-muted-foreground mb-1">/ {dim.target}% target</span>
                  </div>
                  <Progress 
                    value={dim.score} 
                    className={cn(
                      dim.status === 'good' ? '[&>div]:bg-green-500' :
                      dim.status === 'warning' ? '[&>div]:bg-amber-500' :
                      '[&>div]:bg-red-500'
                    )}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Risk Matrix */}
          <Card>
            <CardHeader>
              <CardTitle>Risk Matrix</CardTitle>
              <CardDescription>Current risks requiring attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {MOCK_RISKS.map((risk) => (
                  <div key={risk.id} className="p-4 rounded-lg border">
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        'p-2 rounded-lg',
                        risk.severity === 'high' ? 'bg-red-100 dark:bg-red-900/30' :
                        risk.severity === 'medium' ? 'bg-amber-100 dark:bg-amber-900/30' :
                        'bg-blue-100 dark:bg-blue-900/30'
                      )}>
                        <AlertTriangle className={cn(
                          'h-4 w-4',
                          risk.severity === 'high' ? 'text-red-600 dark:text-red-400' :
                          risk.severity === 'medium' ? 'text-amber-600 dark:text-amber-400' :
                          'text-blue-600 dark:text-blue-400'
                        )} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{risk.title}</p>
                          <Badge variant="outline" className={cn(
                            risk.severity === 'high' ? 'text-red-600 border-red-300' :
                            risk.severity === 'medium' ? 'text-amber-600 border-amber-300' :
                            'text-blue-600 border-blue-300'
                          )}>
                            {risk.severity}
                          </Badge>
                        </div>
                        <p className="page-description mt-1">{risk.impact}</p>
                        <p className="text-sm mt-2"><span className="font-medium">Mitigation:</span> {risk.mitigation}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Items */}
          <Card>
            <CardHeader>
              <CardTitle>Action Items</CardTitle>
              <CardDescription>Tasks to improve program health</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {MOCK_ACTIONS.map((action) => (
                  <div key={action.id} className="flex items-start gap-3 p-4 rounded-lg border">
                    <div className={cn(
                      'p-2 rounded-lg',
                      action.status === 'overdue' ? 'bg-red-100 dark:bg-red-900/30' :
                      action.status === 'in-progress' ? 'bg-blue-100 dark:bg-blue-900/30' :
                      'bg-muted'
                    )}>
                      {action.status === 'overdue' ? <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" /> :
                       action.status === 'in-progress' ? <Activity className="h-4 w-4 text-blue-600 dark:text-blue-400" /> :
                       <Clock className="h-4 w-4 text-muted-foreground" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{action.action}</p>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <span>Owner: {action.owner}</span>
                        <span>Due: {action.due}</span>
                      </div>
                    </div>
                    <Badge variant={action.status === 'overdue' ? 'destructive' : 'outline'}>
                      {action.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  )
}
