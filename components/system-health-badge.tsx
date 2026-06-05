'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

export type SystemHealthStatus = 'healthy' | 'degraded' | 'unhealthy' | 'unknown'

interface SystemHealthBadgeProps {
  systemName: string
  status: SystemHealthStatus
  lastCheckTime?: string
  issues?: string[]
  className?: string
}

export function SystemHealthBadge({ 
  systemName, 
  status, 
  lastCheckTime,
  issues,
  className 
}: SystemHealthBadgeProps) {
  const statusColors = {
    healthy: 'bg-emerald-500',
    degraded: 'bg-amber-500',
    unhealthy: 'bg-red-500',
    unknown: 'bg-slate-400',
  }
  
  const statusLabels = {
    healthy: 'Healthy',
    degraded: 'Degraded',
    unhealthy: 'Unhealthy',
    unknown: 'Unknown',
  }
  
  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <div className={cn(
            'inline-flex items-center gap-2 px-2 py-1 rounded-md',
            'bg-slate-50 border border-slate-200',
            'text-sm font-medium cursor-default',
            className
          )}>
            <span className={cn(
              'h-2 w-2 rounded-full flex-shrink-0',
              statusColors[status],
              status === 'degraded' && 'animate-pulse'
            )} />
            <span className="font-mono text-slate-700">{systemName}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-4">
              <span className="font-medium">{systemName}</span>
              <span className={cn(
                'text-xs px-1.5 py-0.5 rounded',
                status === 'healthy' && 'bg-emerald-100 text-emerald-700',
                status === 'degraded' && 'bg-amber-100 text-amber-700',
                status === 'unhealthy' && 'bg-red-100 text-red-700',
                status === 'unknown' && 'bg-slate-100 text-slate-600'
              )}>
                {statusLabels[status]}
              </span>
            </div>
            
            {lastCheckTime && (
              <p className="caption-text">
                Last checked: {new Date(lastCheckTime).toLocaleString()}
              </p>
            )}
            
            {issues && issues.length > 0 && (
              <div className="pt-1 border-t space-y-1">
                <p className="text-xs font-medium text-red-600">Recent Issues:</p>
                <ul className="text-xs text-muted-foreground space-y-0.5">
                  {issues.slice(0, 3).map((issue, idx) => (
                    <li key={idx} className="flex items-start gap-1">
                      <span className="text-red-400">•</span>
                      <span>{issue}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
