'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import type { SAPModule } from '@/lib/types'

export type CoverageState = 'covered_passing' | 'covered_healing' | 'covered_failing' | 'not_covered' | 'out_of_scope'

export interface ScopeItem {
  id: string
  code: string
  name: string
  module: SAPModule
  coverageState: CoverageState
  scenarioCount: number
  scenarios?: {
    id: string
    name: string
    state: string
  }[]
}

export interface BPScope {
  id: string
  name: string
  items: ScopeItem[]
}

interface BPCoverageMatrixProps {
  scope: BPScope
  className?: string
}

const stateConfig: Record<CoverageState, { label: string; bg: string; border: string; text: string }> = {
  covered_passing: {
    label: 'Covered & Passing',
    bg: 'bg-emerald-500/15 dark:bg-emerald-500/20',
    border: 'border-emerald-500/35',
    text: 'text-emerald-800 dark:text-emerald-300',
  },
  covered_healing: {
    label: 'Covered & Healing',
    bg: 'bg-amber-500/15 dark:bg-amber-500/20',
    border: 'border-amber-500/35',
    text: 'text-amber-800 dark:text-amber-300',
  },
  covered_failing: {
    label: 'Covered & Failing',
    bg: 'bg-red-500/15 dark:bg-red-500/20',
    border: 'border-red-500/35',
    text: 'text-red-800 dark:text-red-300',
  },
  not_covered: {
    label: 'Not Covered',
    bg: 'bg-muted/60',
    border: 'border-border',
    text: 'text-muted-foreground',
  },
  out_of_scope: {
    label: 'Out of Scope',
    bg: 'bg-background',
    border: 'border-border/80',
    text: 'text-muted-foreground',
  },
}

const moduleGroups: SAPModule[] = ['SD', 'MM', 'FI', 'CO', 'PP', 'WM', 'HCM', 'PM', 'QM', 'PS']

export function BPCoverageMatrix({ scope, className }: BPCoverageMatrixProps) {
  const [selectedItem, setSelectedItem] = React.useState<ScopeItem | null>(null)
  
  // Group items by module
  const itemsByModule = React.useMemo(() => {
    const grouped = new Map<SAPModule, ScopeItem[]>()
    moduleGroups.forEach(m => grouped.set(m, []))
    
    scope.items.forEach(item => {
      const moduleItems = grouped.get(item.module) || []
      moduleItems.push(item)
      grouped.set(item.module, moduleItems)
    })
    
    return grouped
  }, [scope.items])
  
  // Calculate stats
  const stats = React.useMemo(() => {
    const total = scope.items.length
    const covered = scope.items.filter(i => i.coverageState !== 'not_covered' && i.coverageState !== 'out_of_scope').length
    const passing = scope.items.filter(i => i.coverageState === 'covered_passing').length
    const failing = scope.items.filter(i => i.coverageState === 'covered_failing').length
    const healing = scope.items.filter(i => i.coverageState === 'covered_healing').length
    
    return { total, covered, passing, failing, healing, coveragePercent: Math.round((covered / total) * 100) }
  }, [scope.items])
  
  return (
    <div className={cn('space-y-4', className)}>
      {/* Header with stats */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h3 className="font-semibold text-base sm:text-lg">{scope.name}</h3>
          <p className="page-description">
            {stats.covered} of {stats.total} scope items covered ({stats.coveragePercent}%)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 sm:justify-end sm:max-w-md">
          {Object.entries(stateConfig).map(([state, config]) => (
            <div key={state} className="flex items-center gap-1.5">
              <div className={cn('w-3.5 h-3.5 sm:w-4 sm:h-4 rounded border shrink-0', config.bg, config.border)} />
              <span className="text-[10px] sm:text-xs text-muted-foreground whitespace-nowrap">
                {config.label}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Matrix */}
      <ScrollArea className="w-full">
        <div className="space-y-4 min-w-max">
          {moduleGroups.map(module => {
            const items = itemsByModule.get(module) || []
            if (items.length === 0) return null
            
            return (
              <div key={module} className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-mono">
                    {module}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {items.length} items
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {items.map(item => (
                    <CoverageCell 
                      key={item.id} 
                      item={item} 
                      onClick={() => setSelectedItem(item)}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      
      {/* Detail sheet */}
      <Sheet open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <SheetContent className="w-[400px] sm:w-[540px]">
          {selectedItem && (
            <>
              <SheetHeader>
                <SheetTitle className="font-mono">{selectedItem.code}</SheetTitle>
                <SheetDescription>{selectedItem.name}</SheetDescription>
              </SheetHeader>
              
              <div className="mt-6 space-y-6">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">Module:</span>
                  <Badge variant="outline">{selectedItem.module}</Badge>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">Coverage Status:</span>
                  <Badge 
                    variant="secondary" 
                    className={cn(
                      stateConfig[selectedItem.coverageState].bg,
                      'border',
                      stateConfig[selectedItem.coverageState].border
                    )}
                  >
                    {stateConfig[selectedItem.coverageState].label}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">
                    Linked Scenarios ({selectedItem.scenarioCount})
                  </h4>
                  
                  {selectedItem.scenarios && selectedItem.scenarios.length > 0 ? (
                    <div className="space-y-2">
                      {selectedItem.scenarios.map(scenario => (
                        <div 
                          key={scenario.id}
                          className="p-3 rounded-lg border bg-muted/30"
                        >
                          <p className="font-medium text-sm">{scenario.name}</p>
                          <p className="caption-text">
                            {scenario.id}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="page-description">
                      No scenarios linked to this scope item
                    </p>
                  )}
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}

function CoverageCell({ item, onClick }: { item: ScopeItem; onClick: () => void }) {
  const config = stateConfig[item.coverageState]
  
  return (
    <TooltipProvider>
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>
          <button
            onClick={onClick}
            className={cn(
              'w-8 h-8 sm:w-9 sm:h-9 rounded border-2 text-xs font-mono font-medium',
              'transition-all hover:scale-105 hover:shadow-md',
              'focus:outline-none focus:ring-2 focus:ring-brand/40 focus:ring-offset-1 focus:ring-offset-background',
              config.bg,
              config.border,
              config.text,
            )}
          >
            {item.scenarioCount > 0 && (
              <span className="text-[10px]">{item.scenarioCount}</span>
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <div className="space-y-1">
            <p className="font-mono font-medium">{item.code}</p>
            <p className="text-xs">{item.name}</p>
            <p className="caption-text">
              {item.scenarioCount} scenario{item.scenarioCount !== 1 ? 's' : ''}
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
