'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Server, Activity, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react'

export type RunnerHealth = 'healthy' | 'degraded' | 'unhealthy' | 'offline'
export type LeaseState = 'idle' | 'leased' | 'reserved' | 'maintenance'

export interface Runner {
  id: string
  name: string
  health: RunnerHealth
  leaseState: LeaseState
  currentTask?: string
  lastHeartbeat: string
  cpuPercent?: number
  memoryPercent?: number
}

export interface RunnerPool {
  id: string
  name: string
  capacity: number
  runners: Runner[]
}

interface RunnerPoolStatusPanelProps {
  pool: RunnerPool
  className?: string
  compact?: boolean
}

export function RunnerPoolStatusPanel({ pool, className, compact = false }: RunnerPoolStatusPanelProps) {
  const activeRunners = pool.runners.filter(r => r.leaseState === 'leased').length
  const healthyRunners = pool.runners.filter(r => r.health === 'healthy' || r.health === 'degraded').length
  const utilizationPercent = Math.round((activeRunners / pool.capacity) * 100)
  
  return (
    <Card className={className}>
      <CardHeader className={cn(compact && 'pb-2')}>
        <div className="flex items-center justify-between">
          <CardTitle className={cn('flex items-center gap-2', compact && 'text-base')}>
            <Server className="h-5 w-5 text-muted-foreground" />
            {pool.name}
          </CardTitle>
          <Badge variant={utilizationPercent > 80 ? 'destructive' : utilizationPercent > 50 ? 'outline' : 'secondary'}>
            {utilizationPercent}% utilized
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className={cn(compact && 'pt-0', 'space-y-4')}>
        {/* Capacity bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Capacity</span>
            <span className="font-medium">{activeRunners} / {pool.capacity} active</span>
          </div>
          <div className="h-3 bg-slate-100 rounded-full overflow-hidden flex">
            {pool.runners.map((runner, idx) => (
              <div
                key={runner.id}
                className={cn(
                  'h-full transition-all',
                  runner.leaseState === 'leased' && 'bg-indigo-500',
                  runner.leaseState === 'idle' && 'bg-slate-300',
                  runner.leaseState === 'reserved' && 'bg-amber-400',
                  runner.leaseState === 'maintenance' && 'bg-red-400'
                )}
                style={{ width: `${100 / pool.capacity}%` }}
              />
            ))}
          </div>
        </div>
        
        {/* Health summary */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span className="text-sm">{healthyRunners} healthy</span>
          </div>
          {pool.runners.filter(r => r.health === 'degraded').length > 0 && (
            <div className="flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <span className="text-sm">
                {pool.runners.filter(r => r.health === 'degraded').length} degraded
              </span>
            </div>
          )}
          {pool.runners.filter(r => r.health === 'unhealthy' || r.health === 'offline').length > 0 && (
            <div className="flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <span className="text-sm">
                {pool.runners.filter(r => r.health === 'unhealthy' || r.health === 'offline').length} offline
              </span>
            </div>
          )}
        </div>
        
        {/* Runner list */}
        {!compact && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Runners</h4>
            <div className="grid gap-2">
              {pool.runners.map(runner => (
                <RunnerRow key={runner.id} runner={runner} />
              ))}
            </div>
          </div>
        )}
        
        {/* Legend */}
        <div className="flex items-center gap-4 pt-2 border-t text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-indigo-500" />
            <span>Leased</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-slate-300" />
            <span>Idle</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-amber-400" />
            <span>Reserved</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-red-400" />
            <span>Maintenance</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function RunnerRow({ runner }: { runner: Runner }) {
  const healthColors = {
    healthy: 'bg-emerald-500',
    degraded: 'bg-amber-500',
    unhealthy: 'bg-red-500',
    offline: 'bg-slate-400',
  }
  
  const leaseLabels = {
    idle: 'Idle',
    leased: 'Leased',
    reserved: 'Reserved',
    maintenance: 'Maintenance',
  }
  
  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
            <div className={cn('w-2 h-2 rounded-full flex-shrink-0', healthColors[runner.health])} />
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-medium truncate">{runner.name}</span>
                <Badge variant="outline" className="text-[10px] h-5">
                  {leaseLabels[runner.leaseState]}
                </Badge>
              </div>
              {runner.currentTask && (
                <p className="caption-text truncate mt-0.5">
                  Running: {runner.currentTask}
                </p>
              )}
            </div>
            
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {new Date(runner.lastHeartbeat).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="left" className="max-w-xs">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium">{runner.name}</span>
              <Badge variant="secondary" className="capitalize">{runner.health}</Badge>
            </div>
            <div className="text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Last Heartbeat:</span>
                <span>{new Date(runner.lastHeartbeat).toLocaleString()}</span>
              </div>
              {runner.cpuPercent !== undefined && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">CPU:</span>
                  <span>{runner.cpuPercent}%</span>
                </div>
              )}
              {runner.memoryPercent !== undefined && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Memory:</span>
                  <span>{runner.memoryPercent}%</span>
                </div>
              )}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
