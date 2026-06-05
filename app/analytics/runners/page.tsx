'use client'

import * as React from 'react'
import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Activity, 
  Server,
  AlertTriangle,
  Info,
  Clock,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { MOCK_RUNNER_POOLS, MOCK_HOURLY_UTILIZATION, MOCK_CAPACITY_RECOMMENDATIONS } from '@/lib/reports-mock-data'

const hours = Array.from({ length: 24 }, (_, i) => i)
const pools = ['Star Cement DEV', 'Star Cement QAS', 'Star Cement PROD', 'Shared Regression']

function getUtilizationColor(util: number): string {
  if (util >= 90) return 'bg-red-500'
  if (util >= 70) return 'bg-amber-500'
  if (util >= 40) return 'bg-emerald-500'
  return 'bg-blue-500'
}

function getUtilizationTextColor(util: number): string {
  if (util >= 90) return 'text-red-600'
  if (util >= 70) return 'text-amber-600'
  return 'text-emerald-600'
}

export default function RunnerUtilizationPage() {
  const runnerPools = MOCK_RUNNER_POOLS
  const hourlyData = MOCK_HOURLY_UTILIZATION
  const recommendations = MOCK_CAPACITY_RECOMMENDATIONS

  const getHourlyUtil = (pool: string, hour: number): number => {
    const entry = hourlyData.find(d => d.pool === pool && d.hour === hour)
    return entry?.utilization || 0
  }

  return (
    <AppShell currentApp="analytics">
              <PageHeader title="Runner Utilization" description="Pool-level utilization patterns and capacity recommendations." />

        {/* Pool Utilization Gauges */}
        <StaggerGrid columns="grid-cols-2 md:grid-cols-4" className="gap-4" fast>
          {runnerPools.map(pool => (
            <Card key={pool.id}>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{pool.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {pool.activeWorkers}/{pool.capacity}
                    </Badge>
                  </div>
                  <div className="relative">
                    <Progress value={pool.currentUtilization} className="h-3" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className={cn('text-xs font-semibold', getUtilizationTextColor(pool.currentUtilization))}>
                        {pool.currentUtilization}%
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Queue: {pool.queueDepth}</span>
                    <span className={getUtilizationTextColor(pool.currentUtilization)}>
                      {pool.currentUtilization >= 90 ? 'Critical' : pool.currentUtilization >= 70 ? 'High' : 'Normal'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </StaggerGrid>

        {/* Hour-of-Day Heatmap */}
        <Card>
          <CardHeader>
            <CardTitle>Utilization Heatmap</CardTitle>
            <CardDescription>Average utilization by hour of day (7-day window, IST)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="p-2 text-left text-xs font-medium text-muted-foreground sticky left-0 bg-background">Pool</th>
                    {hours.map(hour => (
                      <th key={hour} className="p-1 text-center text-xs font-medium text-muted-foreground min-w-[32px]">
                        {String(hour).padStart(2, '0')}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pools.map(pool => (
                    <tr key={pool}>
                      <td className="p-2 text-xs font-medium sticky left-0 bg-background whitespace-nowrap">{pool}</td>
                      {hours.map(hour => {
                        const util = getHourlyUtil(pool, hour)
                        return (
                          <td key={hour} className="p-1">
                            <div 
                              className={cn(
                                'w-full h-6 rounded-sm flex items-center justify-center text-[10px] font-medium text-white',
                                getUtilizationColor(util)
                              )}
                              title={`${pool} @ ${String(hour).padStart(2, '0')}:00 - ${util}%`}
                            >
                              {util >= 80 && util}
                            </div>
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Legend */}
            <div className="flex items-center gap-6 mt-4 pt-4 border-t">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-blue-500" />
                <span className="text-xs text-muted-foreground">{'<'}40%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-emerald-500" />
                <span className="text-xs text-muted-foreground">40-70%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-amber-500" />
                <span className="text-xs text-muted-foreground">70-90%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-red-500" />
                <span className="text-xs text-muted-foreground">{'>'}90%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Capacity Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle>Capacity Recommendations</CardTitle>
            <CardDescription>Scheduling conflicts and optimization suggestions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recommendations.map((rec, idx) => (
                <div 
                  key={idx} 
                  className={cn(
                    'flex items-start gap-3 p-4 rounded-lg border',
                    rec.severity === 'warning' ? 'bg-amber-500/10 border-amber-500/30' : 'bg-blue-500/10 border-blue-500/30'
                  )}
                >
                  {rec.severity === 'warning' ? (
                    <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  ) : (
                    <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="font-medium text-sm">{rec.pool}</p>
                    <p className="page-description">{rec.message}</p>
                  </div>
                </div>
              ))}
              
              {/* Forecast Warnings */}
              <div className="flex items-start gap-3 p-4 rounded-lg border bg-violet-500/10 border-violet-500/30">
                <Clock className="h-5 w-5 text-violet-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Scheduling Conflict Forecast (Next 7 days)</p>
                  <p className="page-description">
                    May 10, 2026 @ 10:00 IST: 3 large suites scheduled simultaneously on Star Cement QAS. 
                    Consider staggering start times or adding temporary capacity.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
    </AppShell>
  )
}
