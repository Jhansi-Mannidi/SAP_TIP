'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Progress } from '@/components/ui/progress'
import { StatusBadge } from '@/components/status-badge'
import { 
  Clock, 
  Play, 
  Users, 
  Bug, 
  FileText, 
  Activity, 
  Maximize2, 
  CheckCircle2,
  AlertTriangle,
  Timer,
  ListChecks
} from 'lucide-react'

export type CutoverKind = 'dress_rehearsal' | 'live_cutover' | 'hypercare'

export interface CutoverWindow {
  id: string
  name: string
  kind: CutoverKind
  plannedStart: string
  plannedEnd: string
  actualStart?: string
  actualEnd?: string
  status: 'pending' | 'active' | 'completed' | 'aborted'
}

export interface SuiteExecution {
  id: string
  name: string
  state: string
  progress: number
  passCount: number
  failCount: number
  healCount: number
}

export interface Participant {
  id: string
  name: string
  role: string
  avatar?: string
  signedInAt: string
}

export interface DecisionLogEntry {
  id: string
  kind: string
  title: string
  createdAt: string
  status: 'pending' | 'approved' | 'rejected'
}

export interface EventFeedItem {
  id: string
  type: 'state_change' | 'healing' | 'sign_off' | 'decision' | 'defect'
  message: string
  timestamp: string
}

export interface CutoverPlan {
  totalSteps: number
  completedSteps: number
  currentStep?: string
}

export interface WarRoomData {
  window: CutoverWindow
  suiteExecutions: SuiteExecution[]
  defectHistogram: { critical: number; high: number; medium: number; low: number }
  openSIItems: { total: number; deferred: number }
  cutoverPlan: CutoverPlan
  participants: Participant[]
  decisionLog: DecisionLogEntry[]
  eventFeed: EventFeedItem[]
}

interface WarRoomGridProps {
  data: WarRoomData
  className?: string
  projectorMode?: boolean
  cioMode?: boolean
}

export function WarRoomGrid({ data, className, projectorMode = false, cioMode = false }: WarRoomGridProps) {
  const [isFullscreen, setIsFullscreen] = React.useState(false)
  
  // Calculate elapsed time
  const elapsed = React.useMemo(() => {
    if (!data.window.actualStart) return null
    const start = new Date(data.window.actualStart).getTime()
    const now = Date.now()
    const diff = now - start
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}m`
  }, [data.window.actualStart])
  
  // Calculate ETA
  const eta = React.useMemo(() => {
    if (!data.window.plannedEnd) return null
    const end = new Date(data.window.plannedEnd)
    const now = new Date()
    const diff = end.getTime() - now.getTime()
    if (diff < 0) return 'Overdue'
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}m`
  }, [data.window.plannedEnd])
  
  const gridCols = cioMode ? 'grid-cols-2 lg:grid-cols-3' : 'grid-cols-3 lg:grid-cols-4'
  
  return (
    <div className={cn(
      'h-full bg-slate-950 text-white p-4 overflow-auto',
      projectorMode && 'text-lg',
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className={cn('font-bold', cioMode ? 'text-3xl' : 'text-2xl')}>
            {data.window.name}
          </h1>
          <div className="flex items-center gap-4 mt-2">
            <Badge variant="secondary" className="bg-indigo-600 text-white capitalize">
              {data.window.kind.replace('_', ' ')}
            </Badge>
            <Badge variant="outline" className="border-emerald-500 text-emerald-400">
              {data.window.status}
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            className="border-slate-600 text-slate-300"
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            <Maximize2 className="h-4 w-4 mr-2" />
            {isFullscreen ? 'Exit Fullscreen' : 'Projector Mode'}
          </Button>
        </div>
      </div>
      
      {/* Grid */}
      <div className={cn('grid gap-4', gridCols)}>
        {/* Cutover Window Meta */}
        <Card className="bg-slate-900 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-indigo-400" />
              Window Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-slate-400">Planned</span>
                <p className="text-sm font-mono">
                  {new Date(data.window.plannedStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  {' - '}
                  {new Date(data.window.plannedEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <div>
                <span className="text-xs text-slate-400">Actual</span>
                <p className="text-sm font-mono">
                  {data.window.actualStart 
                    ? new Date(data.window.actualStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : '--:--'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-2 border-t border-slate-700">
              <div>
                <span className="text-xs text-slate-400">Elapsed</span>
                <p className={cn('text-xl font-bold', cioMode && 'text-3xl')}>
                  {elapsed || '--'}
                </p>
              </div>
              <div>
                <span className="text-xs text-slate-400">ETA</span>
                <p className={cn(
                  'text-xl font-bold',
                  cioMode && 'text-3xl',
                  eta === 'Overdue' && 'text-red-400'
                )}>
                  {eta || '--'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Active Suite Executions */}
        <Card className="bg-slate-900 border-slate-700 col-span-1">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2 text-sm">
              <Play className="h-4 w-4 text-emerald-400" />
              Suite Executions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.suiteExecutions.slice(0, cioMode ? 3 : 5).map(suite => (
              <div key={suite.id} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm truncate">{suite.name}</span>
                  <span className="text-xs text-slate-400">{suite.progress}%</span>
                </div>
                <Progress value={suite.progress} className="h-2" />
                <div className="flex gap-2 text-[10px]">
                  <span className="text-emerald-400">{suite.passCount} pass</span>
                  <span className="text-red-400">{suite.failCount} fail</span>
                  <span className="text-amber-400">{suite.healCount} heal</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        
        {/* Open Defects Histogram */}
        <Card className="bg-slate-900 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2 text-sm">
              <Bug className="h-4 w-4 text-red-400" />
              Open Defects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <DefectBar label="Critical" count={data.defectHistogram.critical} color="bg-rose-500" total={10} />
              <DefectBar label="High" count={data.defectHistogram.high} color="bg-red-500" total={10} />
              <DefectBar label="Medium" count={data.defectHistogram.medium} color="bg-amber-500" total={20} />
              <DefectBar label="Low" count={data.defectHistogram.low} color="bg-slate-500" total={20} />
            </div>
          </CardContent>
        </Card>
        
        {/* Open SI Items */}
        <Card className="bg-slate-900 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2 text-sm">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              SI Items in Scope
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <p className={cn('font-bold', cioMode ? 'text-5xl' : 'text-4xl')}>
                {data.openSIItems.total}
              </p>
              <p className="text-sm text-slate-400 mt-1">Open items</p>
              {data.openSIItems.deferred > 0 && (
                <Badge variant="outline" className="mt-2 border-violet-500 text-violet-400">
                  {data.openSIItems.deferred} Deferred
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Cutover Plan Progress */}
        <Card className="bg-slate-900 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2 text-sm">
              <ListChecks className="h-4 w-4 text-indigo-400" />
              Cutover Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={cn('font-bold', cioMode ? 'text-4xl' : 'text-3xl')}>
                  {data.cutoverPlan.completedSteps}/{data.cutoverPlan.totalSteps}
                </span>
                <CheckCircle2 className="h-8 w-8 text-emerald-400" />
              </div>
              <Progress 
                value={(data.cutoverPlan.completedSteps / data.cutoverPlan.totalSteps) * 100} 
                className="h-3"
              />
              {data.cutoverPlan.currentStep && (
                <p className="text-xs text-slate-400 truncate">
                  Current: {data.cutoverPlan.currentStep}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Active Participants */}
        <Card className="bg-slate-900 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-blue-400" />
              Participants ({data.participants.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {data.participants.slice(0, 8).map(p => (
                <Avatar key={p.id} className="h-8 w-8 border-2 border-slate-700">
                  <AvatarImage src={p.avatar} />
                  <AvatarFallback className="bg-indigo-600 text-white text-xs">
                    {p.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              ))}
              {data.participants.length > 8 && (
                <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center text-xs">
                  +{data.participants.length - 8}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Decision Log */}
        <Card className="bg-slate-900 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2 text-sm">
              <FileText className="h-4 w-4 text-violet-400" />
              Decision Log
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-32">
              <div className="space-y-2">
                {data.decisionLog.slice(0, 10).map(entry => (
                  <div key={entry.id} className="flex items-center gap-2 text-xs">
                    <Badge 
                      variant="outline" 
                      className={cn(
                        'text-[10px]',
                        entry.status === 'approved' && 'border-emerald-500 text-emerald-400',
                        entry.status === 'rejected' && 'border-red-500 text-red-400',
                        entry.status === 'pending' && 'border-amber-500 text-amber-400'
                      )}
                    >
                      {entry.status}
                    </Badge>
                    <span className="truncate text-slate-300">{entry.title}</span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
        
        {/* Live Event Feed */}
        <Card className="bg-slate-900 border-slate-700 col-span-1">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2 text-sm">
              <Activity className="h-4 w-4 text-emerald-400 animate-pulse" />
              Live Feed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-32">
              <div className="space-y-2">
                {data.eventFeed.slice(0, 15).map(event => (
                  <div key={event.id} className="flex items-start gap-2 text-xs">
                    <span className="text-slate-500 flex-shrink-0">
                      {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                    <span className="text-slate-300">{event.message}</span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function DefectBar({ label, count, color, total }: { label: string; count: number; color: string; total: number }) {
  const width = Math.min((count / total) * 100, 100)
  
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-slate-400 w-14">{label}</span>
      <div className="flex-1 h-4 bg-slate-800 rounded overflow-hidden">
        <div className={cn('h-full transition-all', color)} style={{ width: `${width}%` }} />
      </div>
      <span className="text-sm font-mono w-6 text-right">{count}</span>
    </div>
  )
}
