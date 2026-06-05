'use client'

import * as React from 'react'
import Link from 'next/link'
import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn, formatRelativeTime } from '@/lib/utils'
import { 
  Play,
  Sparkles,
  AlertTriangle,
  Code,
  AlertCircle,
  Pencil,
  ChevronRight,
} from 'lucide-react'
import { 
  MOCK_DEFECTS,
  DEFECT_SOURCE_LABELS,
  type Defect,
  type DefectSourceKind,
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

interface SourceSegmentProps {
  source: DefectSourceKind
  defects: Defect[]
  icon: React.ReactNode
  color: string
}

function SourceSegment({ source, defects, icon, color }: SourceSegmentProps) {
  const recentDefects = defects.slice(0, 5)
  const openCount = defects.filter(d => d.state !== 'Closed' && d.state !== 'Rejected').length
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center', color)}>
              {icon}
            </div>
            <div>
              <CardTitle className="text-base">{DEFECT_SOURCE_LABELS[source]}</CardTitle>
              <p className="page-description">{openCount} open of {defects.length} total</p>
            </div>
          </div>
          <Badge variant="secondary" className="text-lg px-3 py-1">{defects.length}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        {recentDefects.length > 0 ? (
          <div className="space-y-2">
            <p className="caption-text mb-3">Recent defects</p>
            {recentDefects.map(defect => (
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
            {defects.length > 5 && (
              <Button variant="ghost" size="sm" className="w-full mt-2" asChild>
                <Link href={`/defect-manager?source=${source}`}>
                  View all {defects.length} defects
                </Link>
              </Button>
            )}
          </div>
        ) : (
          <p className="page-description py-4 text-center">No defects from this source</p>
        )}
      </CardContent>
    </Card>
  )
}

export default function BySourcePage() {
  const sources: { source: DefectSourceKind; icon: React.ReactNode; color: string }[] = [
    { source: 'test_failure', icon: <Play className="h-5 w-5 text-white" />, color: 'bg-blue-500' },
    { source: 'healing_failure', icon: <Sparkles className="h-5 w-5 text-white" />, color: 'bg-amber-500' },
    { source: 'si_item', icon: <AlertTriangle className="h-5 w-5 text-white" />, color: 'bg-orange-500' },
    { source: 'abap_finding', icon: <Code className="h-5 w-5 text-white" />, color: 'bg-violet-500' },
    { source: 'bp_violation', icon: <AlertCircle className="h-5 w-5 text-white" />, color: 'bg-red-500' },
    { source: 'manual', icon: <Pencil className="h-5 w-5 text-white" />, color: 'bg-slate-500' },
  ]
  
  const defectsBySource = React.useMemo(() => {
    const grouped: Record<DefectSourceKind, Defect[]> = {
      test_failure: [],
      healing_failure: [],
      si_item: [],
      abap_finding: [],
      bp_violation: [],
      manual: [],
    }
    MOCK_DEFECTS.forEach(d => {
      grouped[d.source_kind].push(d)
    })
    // Sort each by opened_at desc
    Object.keys(grouped).forEach(key => {
      grouped[key as DefectSourceKind].sort((a, b) => new Date(b.opened_at).getTime() - new Date(a.opened_at).getTime())
    })
    return grouped
  }, [])

  return (
    <AppShell currentApp="defect-manager">
              {/* Header */}
        <div>
          <h1 className="page-title">Defects by Source</h1>
          <p className="page-description">
            View defects grouped by their originating source
          </p>
        </div>

        {/* Source Segments */}
        <div className="grid gap-4">
          {sources.map(({ source, icon, color }) => (
            <SourceSegment
              key={source}
              source={source}
              defects={defectsBySource[source]}
              icon={icon}
              color={color}
            />
          ))}
        </div>
    </AppShell>
  )
}
