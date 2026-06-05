'use client'

import * as React from 'react'
import Link from 'next/link'
import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { cn, formatRelativeTime } from '@/lib/utils'
import { 
  Rocket,
  ChevronDown,
  ChevronRight,
  TrendingDown,
  TrendingUp,
} from 'lucide-react'
import { 
  MOCK_DEFECTS,
  type Defect,
  type DefectSeverity,
  type DefectState,
} from '@/lib/defect-mock-data'

function SeverityBadge({ severity }: { severity: DefectSeverity }) {
  const config = {
    Critical: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    High: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    Medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    Low: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400',
  }
  return <Badge variant="secondary" className={cn('text-xs', config[severity])}>{severity}</Badge>
}

function StateBadge({ state }: { state: DefectState }) {
  const config: Record<DefectState, string> = {
    Open: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    Triaged: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    Assigned: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'In Fix': 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
    'Retest Pending': 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
    'Retest In Progress': 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
    Closed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    Rejected: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400',
  }
  return <Badge variant="secondary" className={cn('text-xs', config[state])}>{state}</Badge>
}

// Mini burndown sparkline (simplified visual)
function MiniBurndown({ opened, closed }: { opened: number; closed: number }) {
  const trend = closed >= opened ? 'down' : 'up'
  const ratio = opened > 0 ? Math.round((closed / opened) * 100) : 100
  
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        {trend === 'down' ? (
          <TrendingDown className="h-4 w-4 text-emerald-500" />
        ) : (
          <TrendingUp className="h-4 w-4 text-red-500" />
        )}
        <span className={cn('text-sm font-medium', trend === 'down' ? 'text-emerald-600' : 'text-red-600')}>
          {ratio}% resolved
        </span>
      </div>
      <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className={cn('h-full rounded-full', trend === 'down' ? 'bg-emerald-500' : 'bg-amber-500')}
          style={{ width: `${ratio}%` }}
        />
      </div>
    </div>
  )
}

interface MigrationGroupProps {
  migrationId: string
  migrationName: string
  defects: Defect[]
}

function MigrationGroup({ migrationId, migrationName, defects }: MigrationGroupProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  
  const openCount = defects.filter(d => d.state !== 'Closed' && d.state !== 'Rejected').length
  const closedCount = defects.filter(d => d.state === 'Closed' || d.state === 'Rejected').length
  const criticalCount = defects.filter(d => d.severity === 'Critical' && d.state !== 'Closed').length
  const highCount = defects.filter(d => d.severity === 'High' && d.state !== 'Closed').length
  
  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Rocket className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    {migrationName}
                    {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </CardTitle>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-sm text-muted-foreground">{defects.length} total</span>
                    <span className="text-sm text-red-600">{openCount} open</span>
                    {criticalCount > 0 && (
                      <Badge variant="destructive" className="text-xs">{criticalCount} Critical</Badge>
                    )}
                    {highCount > 0 && (
                      <Badge variant="outline" className="text-xs border-orange-500 text-orange-600">{highCount} High</Badge>
                    )}
                  </div>
                </div>
              </div>
              <MiniBurndown opened={defects.length} closed={closedCount} />
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="border-t">
            <div className="space-y-2 pt-4">
              {defects.map(defect => (
                <Link 
                  key={defect.id} 
                  href={`/defect-manager/defects/${defect.id}`}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-mono text-xs text-primary">{defect.code}</span>
                    <span className="text-sm truncate">{defect.title}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <SeverityBadge severity={defect.severity} />
                    <StateBadge state={defect.state} />
                    <span className="text-xs text-muted-foreground">{formatRelativeTime(defect.opened_at)}</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}

export default function ByMigrationPage() {
  // Group defects by migration
  const defectsByMigration = React.useMemo(() => {
    const grouped: Record<string, { name: string; defects: Defect[] }> = {}
    const unlinked: Defect[] = []
    
    MOCK_DEFECTS.forEach(d => {
      if (d.migration) {
        if (!grouped[d.migration.id]) {
          grouped[d.migration.id] = { name: d.migration.name, defects: [] }
        }
        grouped[d.migration.id].defects.push(d)
      } else {
        unlinked.push(d)
      }
    })
    
    // Sort defects by opened_at desc within each group
    Object.values(grouped).forEach(g => {
      g.defects.sort((a, b) => new Date(b.opened_at).getTime() - new Date(a.opened_at).getTime())
    })
    
    return { grouped, unlinked }
  }, [])

  return (
    <AppShell currentApp="defect-manager">
              {/* Header */}
        <div>
          <h1 className="page-title">Defects by Migration</h1>
          <p className="page-description">
            View defects grouped by their associated migration project
          </p>
        </div>

        {/* Migration Groups */}
        <div className="space-y-4">
          {Object.entries(defectsByMigration.grouped).map(([id, { name, defects }]) => (
            <MigrationGroup
              key={id}
              migrationId={id}
              migrationName={name}
              defects={defects}
            />
          ))}
          
          {defectsByMigration.unlinked.length > 0 && (
            <MigrationGroup
              migrationId="unlinked"
              migrationName="Not Linked to Migration"
              defects={defectsByMigration.unlinked}
            />
          )}
        </div>
    </AppShell>
  )
}
