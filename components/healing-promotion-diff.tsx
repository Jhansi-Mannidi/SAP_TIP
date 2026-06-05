'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { StatusBadge } from '@/components/status-badge'
import { 
  GitCompare, 
  Plus, 
  Minus, 
  ArrowRight, 
  ExternalLink,
  HeartPulse,
  Check,
  X
} from 'lucide-react'

export interface HealingEvent {
  id: string
  timestamp: string
  failureReason: string
  healingAction: string
  confidence: number
  caseExecutionId: string
  stepSequence: number
}

export interface IRStepSnapshot {
  id: string
  sequence: number
  stepType: string
  description: string
  parameters: Record<string, string>
}

export interface HealingPromotion {
  id: string
  status: 'pending' | 'approved' | 'rejected'
  currentStep: IRStepSnapshot
  proposedStep: IRStepSnapshot
  healingEvents: HealingEvent[]
  createdAt: string
  approvedBy?: string
}

interface HealingPromotionDiffProps {
  promotion: HealingPromotion
  onApprove?: () => void
  onReject?: () => void
  onViewFailure?: (eventId: string) => void
  className?: string
}

export function HealingPromotionDiff({ 
  promotion, 
  onApprove,
  onReject,
  onViewFailure,
  className 
}: HealingPromotionDiffProps) {
  const paramDiffs = React.useMemo(() => {
    const allKeys = new Set([
      ...Object.keys(promotion.currentStep.parameters),
      ...Object.keys(promotion.proposedStep.parameters)
    ])
    
    return Array.from(allKeys).map(key => {
      const currentValue = promotion.currentStep.parameters[key]
      const proposedValue = promotion.proposedStep.parameters[key]
      
      let diffType: 'added' | 'removed' | 'changed' | 'unchanged' = 'unchanged'
      if (!currentValue && proposedValue) diffType = 'added'
      else if (currentValue && !proposedValue) diffType = 'removed'
      else if (currentValue !== proposedValue) diffType = 'changed'
      
      return { key, currentValue, proposedValue, diffType }
    })
  }, [promotion])
  
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GitCompare className="h-5 w-5 text-indigo-500" />
            <CardTitle className="text-lg">Healing Promotion</CardTitle>
            <Badge 
              variant="secondary"
              className={cn(
                promotion.status === 'pending' && 'bg-amber-100 text-amber-700',
                promotion.status === 'approved' && 'bg-emerald-100 text-emerald-700',
                promotion.status === 'rejected' && 'bg-red-100 text-red-700'
              )}
            >
              {promotion.status}
            </Badge>
          </div>
          
          {promotion.status === 'pending' && (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={onReject}>
                <X className="h-4 w-4 mr-1" />
                Reject
              </Button>
              <Button size="sm" onClick={onApprove}>
                <Check className="h-4 w-4 mr-1" />
                Approve
              </Button>
            </div>
          )}
        </div>
        <p className="page-description">
          Step {promotion.currentStep.sequence}: {promotion.currentStep.stepType}
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Side-by-side diff view */}
        <div className="grid grid-cols-2 gap-4">
          {/* Current (Left) */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Minus className="h-4 w-4 text-red-500" />
              Current
            </div>
            <div className="p-4 bg-red-50/50 rounded-lg border border-red-200 space-y-3">
              <div>
                <span className="text-xs text-muted-foreground">Step Type</span>
                <p className="font-mono text-sm">{promotion.currentStep.stepType}</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Description</span>
                <p className="text-sm">{promotion.currentStep.description}</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Parameters</span>
                <div className="space-y-1 mt-1">
                  {paramDiffs.map(({ key, currentValue, diffType }) => (
                    <div 
                      key={key} 
                      className={cn(
                        'flex items-center gap-2 text-xs font-mono p-1 rounded',
                        diffType === 'removed' && 'bg-red-100 line-through',
                        diffType === 'changed' && 'bg-amber-100'
                      )}
                    >
                      <span className="text-muted-foreground">{key}:</span>
                      <span>{currentValue || '(empty)'}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Proposed (Right) */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Plus className="h-4 w-4 text-emerald-500" />
              Proposed
            </div>
            <div className="p-4 bg-emerald-50/50 rounded-lg border border-emerald-200 space-y-3">
              <div>
                <span className="text-xs text-muted-foreground">Step Type</span>
                <p className="font-mono text-sm">{promotion.proposedStep.stepType}</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Description</span>
                <p className="text-sm">{promotion.proposedStep.description}</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Parameters</span>
                <div className="space-y-1 mt-1">
                  {paramDiffs.map(({ key, proposedValue, diffType }) => (
                    <div 
                      key={key} 
                      className={cn(
                        'flex items-center gap-2 text-xs font-mono p-1 rounded',
                        diffType === 'added' && 'bg-emerald-100',
                        diffType === 'changed' && 'bg-amber-100'
                      )}
                    >
                      <span className="text-muted-foreground">{key}:</span>
                      <span>{proposedValue || '(empty)'}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Change summary */}
        <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg text-sm">
          <span className="text-muted-foreground">Changes:</span>
          {paramDiffs.filter(d => d.diffType === 'added').length > 0 && (
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
              +{paramDiffs.filter(d => d.diffType === 'added').length} added
            </Badge>
          )}
          {paramDiffs.filter(d => d.diffType === 'removed').length > 0 && (
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
              -{paramDiffs.filter(d => d.diffType === 'removed').length} removed
            </Badge>
          )}
          {paramDiffs.filter(d => d.diffType === 'changed').length > 0 && (
            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
              ~{paramDiffs.filter(d => d.diffType === 'changed').length} changed
            </Badge>
          )}
        </div>
        
        {/* Originating Healing Events */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm flex items-center gap-2">
            <HeartPulse className="h-4 w-4 text-amber-500" />
            Originating Healing Events ({promotion.healingEvents.length})
          </h4>
          
          <ScrollArea className="h-48">
            <div className="space-y-2">
              {promotion.healingEvents.map(event => (
                <div 
                  key={event.id}
                  className="p-3 rounded-lg border bg-card hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {new Date(event.timestamp).toLocaleString()}
                        </span>
                        <Badge variant="outline" className="text-[10px]">
                          Step {event.stepSequence}
                        </Badge>
                        <Badge 
                          variant="secondary" 
                          className={cn(
                            'text-[10px]',
                            event.confidence >= 90 && 'bg-emerald-100 text-emerald-700',
                            event.confidence >= 70 && event.confidence < 90 && 'bg-amber-100 text-amber-700',
                            event.confidence < 70 && 'bg-red-100 text-red-700'
                          )}
                        >
                          {event.confidence}% confidence
                        </Badge>
                      </div>
                      <p className="text-sm">
                        <span className="text-muted-foreground">Failure: </span>
                        {event.failureReason}
                      </p>
                      <p className="text-sm">
                        <span className="text-muted-foreground">Healing: </span>
                        {event.healingAction}
                      </p>
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onViewFailure?.(event.id)}
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      View Failure
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  )
}
