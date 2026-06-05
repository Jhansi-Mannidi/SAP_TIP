'use client'

import * as React from 'react'
import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Sparkles, 
  Clock,
  CheckCircle,
  XCircle,
  Zap,
  Library,
  TrendingUp,
} from 'lucide-react'
import { cn, formatRelativeTime } from '@/lib/utils'
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { MOCK_HEALING_KPIS, MOCK_FAILURE_CLASS_DATA, MOCK_TOP_HEALING_PATTERNS } from '@/lib/reports-mock-data'

export default function HealingEffectivenessPage() {
  const kpis = MOCK_HEALING_KPIS
  const failureData = MOCK_FAILURE_CLASS_DATA
  const patterns = MOCK_TOP_HEALING_PATTERNS

  return (
    <AppShell currentApp="analytics">
              <PageHeader title="Healing Effectiveness" description="How well the platform self-heals test failures, by failure class and over time." />

        {/* KPI Strip */}
        <StaggerGrid columns="grid-cols-2 md:grid-cols-3 lg:grid-cols-6" className="gap-4" fast>
          <Card>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10">
                  <Sparkles className="h-4 w-4 text-emerald-500" />
                </div>
                <div>
                  <p className="stat-value">{kpis.healingRate}%</p>
                  <p className="caption-text">Healing Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Clock className="h-4 w-4 text-blue-500" />
                </div>
                <div>
                  <p className="stat-value">{kpis.mtth}m</p>
                  <p className="caption-text">Mean Time to Heal</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                </div>
                <div>
                  <p className="stat-value">{kpis.repairedSuccessfully}</p>
                  <p className="caption-text">Repaired Successfully</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-500/10">
                  <XCircle className="h-4 w-4 text-red-500" />
                </div>
                <div>
                  <p className="stat-value">{kpis.repairFailed}</p>
                  <p className="caption-text">Repair Failed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-violet-500/10">
                  <TrendingUp className="h-4 w-4 text-violet-500" />
                </div>
                <div>
                  <p className="stat-value">{kpis.patternsPromoted}</p>
                  <p className="caption-text">Patterns Promoted</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-cyan-500/10">
                  <Library className="h-4 w-4 text-cyan-500" />
                </div>
                <div>
                  <p className="stat-value">{kpis.patternsActive}</p>
                  <p className="caption-text">Active in Library</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </StaggerGrid>

        {/* Pareto Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Failure Class Distribution</CardTitle>
            <CardDescription>Pareto chart showing failure frequency by class with repair outcomes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {failureData.map((item, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-medium">{item.failureClass}</span>
                      <Badge variant="secondary">{item.percentage}%</Badge>
                      <span className="text-xs text-muted-foreground">{item.frequency} occurrences</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{item.healRate}% heal rate</span>
                    </div>
                  </div>
                  <div className="flex h-6 rounded-lg overflow-hidden bg-muted">
                    <div 
                      className="bg-emerald-500 flex items-center justify-center text-[10px] font-medium text-white"
                      style={{ width: `${(item.repaired / item.frequency) * 100}%` }}
                    >
                      {item.repaired > 10 && item.repaired}
                    </div>
                    <div 
                      className="bg-red-500 flex items-center justify-center text-[10px] font-medium text-white"
                      style={{ width: `${(item.failed / item.frequency) * 100}%` }}
                    >
                      {item.failed > 5 && item.failed}
                    </div>
                    <div 
                      className="bg-amber-500 flex items-center justify-center text-[10px] font-medium text-white"
                      style={{ width: `${(item.deferred / item.frequency) * 100}%` }}
                    >
                      {item.deferred > 5 && item.deferred}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Legend */}
              <div className="flex items-center gap-6 mt-4 pt-4 border-t">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-emerald-500" />
                  <span className="text-xs text-muted-foreground">Repaired</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-red-500" />
                  <span className="text-xs text-muted-foreground">Failed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-amber-500" />
                  <span className="text-xs text-muted-foreground">Deferred</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Healing Patterns */}
        <Card>
          <CardHeader>
            <CardTitle>Top Healing Patterns</CardTitle>
            <CardDescription>Most effective healing patterns with promotion status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {patterns.map((pattern, idx) => (
                <div key={pattern.id} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                      {idx + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-mono text-sm">{pattern.signature}</p>
                        {pattern.promoted && (
                          <Badge className="bg-emerald-500/20 text-emerald-700">In Library</Badge>
                        )}
                      </div>
                      <p className="caption-text">
                        {pattern.occurrences} occurrences - Last seen {formatRelativeTime(pattern.lastSeen)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-lg font-semibold">{pattern.successRate}%</p>
                      <p className="caption-text">Success Rate</p>
                    </div>
                    {!pattern.promoted && (
                      <Button variant="outline" size="sm">
                        <Zap className="h-4 w-4 mr-2" />
                        Promote
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
    </AppShell>
  )
}
