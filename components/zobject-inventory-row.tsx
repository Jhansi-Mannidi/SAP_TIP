'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Code2, AlertTriangle, FlaskConical, Calendar, ChevronRight } from 'lucide-react'

export type ZObjectKind = 'ZPROG' | 'ZTABL' | 'ZCLAS' | 'ZFUGR' | 'ZFUNC' | 'ZINC'

export interface ZObject {
  id: string
  name: string
  kind: ZObjectKind
  namespace: string
  description?: string
  abapFindingsCount: number
  testsCount: number
  lastModified: string
}

interface ZObjectInventoryRowProps {
  zobject: ZObject
  className?: string
  onViewFindings?: () => void
  onViewTests?: () => void
  onClick?: () => void
}

const kindConfig: Record<ZObjectKind, { label: string; color: string }> = {
  ZPROG: { label: 'Program', color: 'bg-blue-100 text-blue-700' },
  ZTABL: { label: 'Table', color: 'bg-amber-100 text-amber-700' },
  ZCLAS: { label: 'Class', color: 'bg-violet-100 text-violet-700' },
  ZFUGR: { label: 'Function Group', color: 'bg-emerald-100 text-emerald-700' },
  ZFUNC: { label: 'Function', color: 'bg-teal-100 text-teal-700' },
  ZINC: { label: 'Include', color: 'bg-slate-100 text-slate-700' },
}

export function ZObjectInventoryRow({ 
  zobject, 
  className,
  onViewFindings,
  onViewTests,
  onClick
}: ZObjectInventoryRowProps) {
  const config = kindConfig[zobject.kind]
  
  return (
    <div 
      className={cn(
        'flex items-center gap-4 p-3 rounded-lg border border-border',
        'bg-background hover:bg-muted/30 transition-colors',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {/* Icon */}
      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
        <Code2 className="h-5 w-5 text-slate-600" />
      </div>
      
      {/* Main info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="font-mono text-sm font-medium text-foreground">
            {zobject.name}
          </span>
          <Badge variant="secondary" className={cn('text-[10px]', config.color)}>
            {config.label}
          </Badge>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="font-mono">{zobject.namespace}</span>
          {zobject.description && (
            <>
              <span className="text-border">|</span>
              <span className="truncate">{zobject.description}</span>
            </>
          )}
        </div>
      </div>
      
      {/* Stats */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            'h-8 gap-1.5',
            zobject.abapFindingsCount > 0 && 'text-amber-600 hover:text-amber-700 hover:bg-amber-50'
          )}
          onClick={(e) => {
            e.stopPropagation()
            onViewFindings?.()
          }}
        >
          <AlertTriangle className="h-3.5 w-3.5" />
          <span className="font-mono text-xs">{zobject.abapFindingsCount}</span>
          <span className="text-xs text-muted-foreground">findings</span>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            'h-8 gap-1.5',
            zobject.testsCount > 0 && 'text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50'
          )}
          onClick={(e) => {
            e.stopPropagation()
            onViewTests?.()
          }}
        >
          <FlaskConical className="h-3.5 w-3.5" />
          <span className="font-mono text-xs">{zobject.testsCount}</span>
          <span className="text-xs text-muted-foreground">tests</span>
        </Button>
        
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          <span>{new Date(zobject.lastModified).toLocaleDateString()}</span>
        </div>
        
        {onClick && (
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        )}
      </div>
    </div>
  )
}
