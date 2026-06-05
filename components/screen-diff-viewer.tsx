'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Plus, Minus, Pencil, ArrowRight } from 'lucide-react'

export interface ScreenField {
  id: string
  name: string
  label: string
  type: 'input' | 'dropdown' | 'checkbox' | 'button' | 'table' | 'text'
  required?: boolean
  length?: number
  f4Help?: string
  value?: string
  row?: number
  col?: number
}

export interface ScreenModel {
  screenId: string
  title: string
  tcode?: string
  fields: ScreenField[]
}

interface ScreenDiffViewerProps {
  beforeModel: ScreenModel
  afterModel: ScreenModel
  className?: string
}

type DiffType = 'added' | 'removed' | 'changed' | 'unchanged'

interface FieldDiff {
  field: ScreenField
  diffType: DiffType
  changes?: { property: string; oldValue: string; newValue: string }[]
}

function computeDiffs(before: ScreenModel, after: ScreenModel): { beforeDiffs: FieldDiff[]; afterDiffs: FieldDiff[] } {
  const beforeFieldMap = new Map(before.fields.map(f => [f.id, f]))
  const afterFieldMap = new Map(after.fields.map(f => [f.id, f]))
  
  const beforeDiffs: FieldDiff[] = before.fields.map(field => {
    const afterField = afterFieldMap.get(field.id)
    if (!afterField) {
      return { field, diffType: 'removed' as DiffType }
    }
    
    const changes: { property: string; oldValue: string; newValue: string }[] = []
    if (field.label !== afterField.label) {
      changes.push({ property: 'label', oldValue: field.label, newValue: afterField.label })
    }
    if (field.required !== afterField.required) {
      changes.push({ property: 'required', oldValue: String(field.required), newValue: String(afterField.required) })
    }
    if (field.length !== afterField.length) {
      changes.push({ property: 'length', oldValue: String(field.length), newValue: String(afterField.length) })
    }
    
    if (changes.length > 0) {
      return { field, diffType: 'changed' as DiffType, changes }
    }
    
    return { field, diffType: 'unchanged' as DiffType }
  })
  
  const afterDiffs: FieldDiff[] = after.fields.map(field => {
    const beforeField = beforeFieldMap.get(field.id)
    if (!beforeField) {
      return { field, diffType: 'added' as DiffType }
    }
    
    const changes: { property: string; oldValue: string; newValue: string }[] = []
    if (beforeField.label !== field.label) {
      changes.push({ property: 'label', oldValue: beforeField.label, newValue: field.label })
    }
    if (beforeField.required !== field.required) {
      changes.push({ property: 'required', oldValue: String(beforeField.required), newValue: String(field.required) })
    }
    if (beforeField.length !== field.length) {
      changes.push({ property: 'length', oldValue: String(beforeField.length), newValue: String(field.length) })
    }
    
    if (changes.length > 0) {
      return { field, diffType: 'changed' as DiffType, changes }
    }
    
    return { field, diffType: 'unchanged' as DiffType }
  })
  
  return { beforeDiffs, afterDiffs }
}

export function ScreenDiffViewer({ beforeModel, afterModel, className }: ScreenDiffViewerProps) {
  const { beforeDiffs, afterDiffs } = computeDiffs(beforeModel, afterModel)
  
  return (
    <div className={cn('grid grid-cols-2 gap-4', className)}>
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <span>Before</span>
          {beforeModel.tcode && (
            <span className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded">
              {beforeModel.tcode}
            </span>
          )}
        </div>
        <ScreenModelRenderer 
          model={beforeModel} 
          diffs={beforeDiffs}
          side="before"
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <span>After</span>
          {afterModel.tcode && (
            <span className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded">
              {afterModel.tcode}
            </span>
          )}
        </div>
        <ScreenModelRenderer 
          model={afterModel} 
          diffs={afterDiffs}
          side="after"
        />
      </div>
    </div>
  )
}

function ScreenModelRenderer({ 
  model, 
  diffs,
  side
}: { 
  model: ScreenModel
  diffs: FieldDiff[]
  side: 'before' | 'after'
}) {
  return (
    <div className="border border-slate-200 rounded-lg bg-slate-50 overflow-hidden">
      {/* SAP-style title bar */}
      <div className="bg-slate-700 text-white px-3 py-1.5 text-sm font-medium flex items-center justify-between">
        <span>{model.title}</span>
        <span className="text-xs text-slate-300">{model.screenId}</span>
      </div>
      
      {/* Field grid */}
      <div className="p-3 space-y-2">
        {diffs.map((diff) => (
          <FieldRenderer 
            key={diff.field.id} 
            fieldDiff={diff}
            side={side}
          />
        ))}
      </div>
    </div>
  )
}

function FieldRenderer({ fieldDiff, side }: { fieldDiff: FieldDiff; side: 'before' | 'after' }) {
  const { field, diffType, changes } = fieldDiff
  
  const borderColor = {
    added: 'border-emerald-500 bg-emerald-50',
    removed: 'border-red-500 bg-red-50',
    changed: 'border-amber-500 bg-amber-50',
    unchanged: 'border-transparent bg-white',
  }[diffType]
  
  const DiffIcon = {
    added: Plus,
    removed: Minus,
    changed: Pencil,
    unchanged: null,
  }[diffType]
  
  const content = (
    <div className={cn(
      'flex items-center gap-3 p-2 rounded border-2 transition-colors',
      borderColor,
      diffType === 'removed' && side === 'before' && 'line-through opacity-70'
    )}>
      {/* Label */}
      <div className="flex-shrink-0 w-28">
        <span className={cn(
          'text-xs font-medium',
          field.required && 'text-red-600'
        )}>
          {field.label}
          {field.required && <span className="text-red-500 ml-0.5">*</span>}
        </span>
      </div>
      
      {/* Field input representation */}
      <div className="flex-1">
        {field.type === 'input' && (
          <div className="h-6 bg-white border border-slate-300 rounded px-2 flex items-center">
            <span className="text-xs text-slate-400">{field.value || '___'}</span>
          </div>
        )}
        {field.type === 'dropdown' && (
          <div className="h-6 bg-white border border-slate-300 rounded px-2 flex items-center justify-between">
            <span className="text-xs text-slate-400">{field.value || 'Select...'}</span>
            <ArrowRight className="h-3 w-3 text-slate-400 rotate-90" />
          </div>
        )}
        {field.type === 'checkbox' && (
          <div className="h-4 w-4 border border-slate-300 rounded bg-white" />
        )}
        {field.type === 'button' && (
          <div className="h-6 bg-slate-200 border border-slate-300 rounded px-3 flex items-center justify-center">
            <span className="text-xs font-medium">{field.label}</span>
          </div>
        )}
      </div>
      
      {/* Diff badge */}
      {DiffIcon && (
        <div className={cn(
          'flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center',
          diffType === 'added' && 'bg-emerald-500 text-white',
          diffType === 'removed' && 'bg-red-500 text-white',
          diffType === 'changed' && 'bg-amber-500 text-white'
        )}>
          <DiffIcon className="h-3 w-3" />
        </div>
      )}
    </div>
  )
  
  if (diffType === 'changed' && changes && changes.length > 0) {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={200}>
          <TooltipTrigger asChild>
            {content}
          </TooltipTrigger>
          <TooltipContent side="right" className="max-w-xs">
            <div className="space-y-1">
              <p className="font-medium text-xs">Property Changes:</p>
              {changes.map((change, idx) => (
                <div key={idx} className="text-xs">
                  <span className="text-muted-foreground">{change.property}:</span>{' '}
                  <span className="text-red-600 line-through">{change.oldValue}</span>{' '}
                  <ArrowRight className="inline h-3 w-3" />{' '}
                  <span className="text-emerald-600">{change.newValue}</span>
                </div>
              ))}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }
  
  if ((diffType === 'added' || diffType === 'removed' || diffType === 'unchanged') && (field.f4Help || field.length)) {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={200}>
          <TooltipTrigger asChild>
            {content}
          </TooltipTrigger>
          <TooltipContent side="right" className="max-w-xs">
            <div className="space-y-1 text-xs">
              <div><span className="text-muted-foreground">Type:</span> {field.type}</div>
              {field.required !== undefined && (
                <div><span className="text-muted-foreground">Required:</span> {field.required ? 'Yes' : 'No'}</div>
              )}
              {field.length && (
                <div><span className="text-muted-foreground">Length:</span> {field.length}</div>
              )}
              {field.f4Help && (
                <div><span className="text-muted-foreground">F4 Help:</span> {field.f4Help}</div>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }
  
  return content
}
