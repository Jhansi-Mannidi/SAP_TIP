'use client'

import * as React from 'react'
import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  TrendingUp, 
  TrendingDown,
  ArrowUpDown,
  Calendar,
  AlertTriangle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { MOCK_MIGRATION_SCORECARDS } from '@/lib/reports-mock-data'

function getPhaseColor(phase: string): string {
  switch (phase.toLowerCase()) {
    case 'discover': return 'bg-blue-500/20 text-blue-700'
    case 'prepare': return 'bg-violet-500/20 text-violet-700'
    case 'explore': return 'bg-amber-500/20 text-amber-700'
    case 'realize': return 'bg-emerald-500/20 text-emerald-700'
    case 'deploy': return 'bg-cyan-500/20 text-cyan-700'
    case 'run': return 'bg-green-500/20 text-green-700'
    default: return 'bg-muted text-muted-foreground'
  }
}

function DeltaBadge({ value, inverse = false }: { value: number; inverse?: boolean }) {
  const isPositive = inverse ? value < 0 : value > 0
  return (
    <span className={cn(
      'inline-flex items-center text-xs font-medium',
      isPositive ? 'text-emerald-600' : value === 0 ? 'text-muted-foreground' : 'text-red-600'
    )}>
      {isPositive ? <TrendingUp className="h-3 w-3 mr-0.5" /> : value < 0 ? <TrendingDown className="h-3 w-3 mr-0.5" /> : null}
      {value > 0 ? '+' : ''}{value}
    </span>
  )
}

export default function MigrationScorecardPage() {
  const [phaseFilter, setPhaseFilter] = React.useState('all')
  const [kindFilter, setKindFilter] = React.useState('all')
  const [sortBy, setSortBy] = React.useState('daysToCutover')
  const [sortDir, setSortDir] = React.useState<'asc' | 'desc'>('asc')

  // Apply filters first
  const filteredScorecards = MOCK_MIGRATION_SCORECARDS.filter(sc => {
    // Phase filter
    if (phaseFilter !== 'all' && sc.phase.toLowerCase() !== phaseFilter.toLowerCase()) {
      return false
    }
    // Kind filter
    if (kindFilter !== 'all') {
      const kindLower = sc.kind.toLowerCase()
      if (kindFilter === 'greenfield' && !kindLower.includes('greenfield')) return false
      if (kindFilter === 'conversion' && !kindLower.includes('conversion')) return false
      if (kindFilter === 'sdt' && !kindLower.includes('selective')) return false
    }
    return true
  })

  // Then sort
  const scorecards = [...filteredScorecards].sort((a, b) => {
    const aVal = a[sortBy as keyof typeof a]
    const bVal = b[sortBy as keyof typeof b]
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortDir === 'asc' ? aVal - bVal : bVal - aVal
    }
    return 0
  })

  const toggleSort = (column: string) => {
    if (sortBy === column) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortDir('asc')
    }
  }

  return (
    <AppShell currentApp="analytics">
              <PageHeader title="Multi-Migration Scorecard" description="Comparative view across active Migrations." />

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Phase:</span>
            <Select value={phaseFilter} onValueChange={setPhaseFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Phases</SelectItem>
                <SelectItem value="discover">Discover</SelectItem>
                <SelectItem value="prepare">Prepare</SelectItem>
                <SelectItem value="explore">Explore</SelectItem>
                <SelectItem value="realize">Realize</SelectItem>
                <SelectItem value="deploy">Deploy</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Kind:</span>
            <Select value={kindFilter} onValueChange={setKindFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Kinds</SelectItem>
                <SelectItem value="greenfield">Greenfield</SelectItem>
                <SelectItem value="conversion">System Conversion</SelectItem>
                <SelectItem value="sdt">Selective Data Transition</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Scorecard Table */}
        <Card padding="flush">
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th className="p-4 text-left text-sm font-medium text-muted-foreground">Migration</th>
                    <th className="p-4 text-left text-sm font-medium text-muted-foreground">Kind</th>
                    <th className="p-4 text-left text-sm font-medium text-muted-foreground">Phase</th>
                    <th className="p-4 text-center text-sm font-medium text-muted-foreground">
                      <button onClick={() => toggleSort('daysToCutover')} className="inline-flex items-center gap-1 hover:text-foreground">
                        Days to Cutover
                        <ArrowUpDown className="h-3 w-3" />
                      </button>
                    </th>
                    <th className="p-4 text-center text-sm font-medium text-muted-foreground">BP Coverage</th>
                    <th className="p-4 text-center text-sm font-medium text-muted-foreground">SI Closed</th>
                    <th className="p-4 text-center text-sm font-medium text-muted-foreground">ABAP Closed</th>
                    <th className="p-4 text-center text-sm font-medium text-muted-foreground">Pass Rate</th>
                    <th className="p-4 text-center text-sm font-medium text-muted-foreground">Healing Rate</th>
                    <th className="p-4 text-center text-sm font-medium text-muted-foreground">Critical Defects</th>
                    <th className="p-4 text-center text-sm font-medium text-muted-foreground">Readiness</th>
                  </tr>
                </thead>
                <tbody>
                  {scorecards.map(sc => (
                    <tr key={sc.id} className="border-b hover:bg-muted/30 transition-colors">
                      <td className="p-4">
                        <span className="font-medium">{sc.name}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-muted-foreground">{sc.kind}</span>
                      </td>
                      <td className="p-4">
                        <Badge className={getPhaseColor(sc.phase)}>{sc.phase}</Badge>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="font-semibold">{sc.daysToCutover}</span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex flex-col items-center">
                          <span className="font-semibold">{sc.bpCoverage}%</span>
                          <DeltaBadge value={sc.bpCoverageDelta} />
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex flex-col items-center">
                          <span className="font-semibold">{sc.siClosed}%</span>
                          <DeltaBadge value={sc.siClosedDelta} />
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex flex-col items-center">
                          <span className="font-semibold">{sc.abapClosed}%</span>
                          <DeltaBadge value={sc.abapClosedDelta} />
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex flex-col items-center">
                          <span className="font-semibold">{sc.passRate}%</span>
                          <DeltaBadge value={sc.passRateDelta} />
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex flex-col items-center">
                          <span className="font-semibold">{sc.healingRate}%</span>
                          <DeltaBadge value={sc.healingRateDelta} />
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {sc.openCriticalDefects > 0 && <AlertTriangle className="h-4 w-4 text-red-500" />}
                          <span className={cn('font-semibold', sc.openCriticalDefects > 0 && 'text-red-600')}>
                            {sc.openCriticalDefects}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex flex-col items-center">
                          <span className={cn(
                            'text-lg font-bold',
                            sc.readinessScore >= 80 ? 'text-emerald-600' : sc.readinessScore >= 60 ? 'text-amber-600' : 'text-red-600'
                          )}>
                            {sc.readinessScore}
                          </span>
                          <DeltaBadge value={sc.readinessScoreDelta} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* No Results */}
        {scorecards.length === 0 && (
          <Card>
            <CardContent className="text-center">
              <p className="page-description">No migrations match the selected filters.</p>
              <Button 
                variant="link" 
                onClick={() => { setPhaseFilter('all'); setKindFilter('all'); }}
                className="mt-2"
              >
                Clear filters
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Results count and Legend */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Showing {scorecards.length} of {MOCK_MIGRATION_SCORECARDS.length} migrations
            {(phaseFilter !== 'all' || kindFilter !== 'all') && (
              <Button 
                variant="link" 
                size="sm" 
                onClick={() => { setPhaseFilter('all'); setKindFilter('all'); }}
                className="ml-2 h-auto p-0 text-xs"
              >
                Clear filters
              </Button>
            )}
          </span>
          <span>Delta values shown are vs last week.</span>
        </div>
    </AppShell>
  )
}
