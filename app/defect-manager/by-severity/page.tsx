'use client'

import * as React from 'react'
import Link from 'next/link'
import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn, formatRelativeTime } from '@/lib/utils'
import { 
  MOCK_DEFECTS,
  type Defect,
  type DefectSeverity,
  type DefectState,
} from '@/lib/defect-mock-data'

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

interface DefectCardProps {
  defect: Defect
  onDragStart: (e: React.DragEvent, defect: Defect) => void
}

function DefectCard({ defect, onDragStart }: DefectCardProps) {
  const age = Math.floor((Date.now() - new Date(defect.opened_at).getTime()) / (1000 * 60 * 60 * 24))
  
  return (
    <Link href={`/defect-manager/defects/${defect.id}`}>
      <Card 
        className="cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
        draggable
        onDragStart={(e) => onDragStart(e, defect)}
      >
        <CardContent className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <span className="font-mono text-xs text-primary">{defect.code}</span>
            <StateBadge state={defect.state} />
          </div>
          <p className="text-sm font-medium line-clamp-2">{defect.title}</p>
          <div className="flex items-center justify-between">
            {defect.assignee ? (
              <Avatar className="h-5 w-5">
                <AvatarFallback className="text-[10px]">
                  {defect.assignee.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            ) : (
              <span className="text-xs text-muted-foreground">Unassigned</span>
            )}
            <span className="text-xs text-muted-foreground">{age}d ago</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

interface KanbanColumnProps {
  severity: DefectSeverity
  defects: Defect[]
  onDragStart: (e: React.DragEvent, defect: Defect) => void
  onDragOver: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent, severity: DefectSeverity) => void
}

function KanbanColumn({ severity, defects, onDragStart, onDragOver, onDrop }: KanbanColumnProps) {
  const headerColors = {
    Critical: 'border-t-red-500',
    High: 'border-t-orange-500',
    Medium: 'border-t-amber-500',
    Low: 'border-t-slate-400',
  }
  
  return (
    <div 
      className={cn(
        'flex flex-col min-w-[280px] bg-muted/30 rounded-lg border-t-4',
        headerColors[severity]
      )}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, severity)}
    >
      <div className="p-3 border-b">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{severity}</h3>
          <Badge variant="secondary">{defects.length}</Badge>
        </div>
      </div>
      <div className="p-2 flex-1 space-y-2 min-h-[200px]">
        {defects.map(defect => (
          <DefectCard 
            key={defect.id} 
            defect={defect} 
            onDragStart={onDragStart}
          />
        ))}
      </div>
    </div>
  )
}

export default function BySeverityPage() {
  const [defects, setDefects] = React.useState(MOCK_DEFECTS.filter(d => d.state !== 'Closed' && d.state !== 'Rejected'))
  const [draggedDefect, setDraggedDefect] = React.useState<Defect | null>(null)
  
  const severities: DefectSeverity[] = ['Critical', 'High', 'Medium', 'Low']
  
  const defectsBySeverity = React.useMemo(() => {
    const grouped: Record<DefectSeverity, Defect[]> = {
      Critical: [],
      High: [],
      Medium: [],
      Low: [],
    }
    defects.forEach(d => {
      grouped[d.severity].push(d)
    })
    return grouped
  }, [defects])
  
  const handleDragStart = (e: React.DragEvent, defect: Defect) => {
    setDraggedDefect(defect)
    e.dataTransfer.effectAllowed = 'move'
  }
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }
  
  const handleDrop = (e: React.DragEvent, newSeverity: DefectSeverity) => {
    e.preventDefault()
    if (draggedDefect && draggedDefect.severity !== newSeverity) {
      setDefects(prev => prev.map(d => 
        d.id === draggedDefect.id ? { ...d, severity: newSeverity } : d
      ))
    }
    setDraggedDefect(null)
  }

  return (
    <AppShell currentApp="defect-manager">
              {/* Header */}
        <div>
          <h1 className="page-title">Defects by Severity</h1>
          <p className="page-description">
            Drag and drop cards between columns to change severity
          </p>
        </div>

        {/* Kanban Board */}
        <div className="flex gap-4 overflow-x-auto pb-4">
          {severities.map(severity => (
            <KanbanColumn
              key={severity}
              severity={severity}
              defects={defectsBySeverity[severity]}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            />
          ))}
        </div>
    </AppShell>
  )
}
