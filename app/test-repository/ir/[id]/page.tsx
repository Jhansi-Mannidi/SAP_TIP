'use client'

import * as React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { AppShell } from '@/components/app-shell'
import { PageHeader } from '@/components/design-system'
import { PageBreadcrumb } from '@/components/page-breadcrumb'
import { staggerItem } from '@/lib/animations'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { IRExecutorCodePreviewDialog } from '@/components/test-repository/ir-executor-code-preview-dialog'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Play,
  Code2,
  GripVertical,
  Plus,
  MoreHorizontal,
  Trash2,
  Copy,
  ChevronDown,
  ChevronRight,
  Lightbulb,
  Terminal,
  FormInput,
  MousePointer,
  Keyboard,
  Timer,
  MessageSquare,
  Camera,
  Database,
  ArrowUpDown,
  Import,
  XCircle,
  Info,
} from 'lucide-react'
import { MOCK_IR_STEPS_VA01, type IRStep, type IRStepType } from '@/lib/mock-data'

// Step type configuration
const stepTypeConfig: Record<IRStepType, { 
  label: string
  description: string
  icon: React.ElementType
  color: string
  requiredParams: string[]
}> = {
  open_transaction: { 
    label: 'Open Transaction', 
    description: 'Open an SAP transaction code',
    icon: Terminal, 
    color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 ring-1 ring-inset ring-blue-500/20',
    requiredParams: ['tcode'],
  },
  set_field: { 
    label: 'Set Field', 
    description: 'Set value in an input field',
    icon: FormInput, 
    color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-inset ring-emerald-500/20',
    requiredParams: ['field', 'value'],
  },
  press_button: { 
    label: 'Press Button', 
    description: 'Click a button element',
    icon: MousePointer, 
    color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-1 ring-inset ring-amber-500/20',
    requiredParams: ['button'],
  },
  press_enter: { 
    label: 'Press Enter', 
    description: 'Press the Enter key',
    icon: Keyboard, 
    color: 'bg-muted text-muted-foreground ring-1 ring-inset ring-border',
    requiredParams: [],
  },
  select_row: { 
    label: 'Select Row', 
    description: 'Select a row in a table',
    icon: Database, 
    color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 ring-1 ring-inset ring-purple-500/20',
    requiredParams: ['row_index'],
  },
  click_menu: { 
    label: 'Click Menu', 
    description: 'Click a menu item',
    icon: MousePointer, 
    color: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 ring-1 ring-inset ring-pink-500/20',
    requiredParams: ['menu_path'],
  },
  assert_statusbar: { 
    label: 'Assert Status Bar', 
    description: 'Verify status bar message',
    icon: MessageSquare, 
    color: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 ring-1 ring-inset ring-violet-500/20',
    requiredParams: ['contains'],
  },
  assert_field: { 
    label: 'Assert Field', 
    description: 'Verify field value',
    icon: CheckCircle2, 
    color: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 ring-1 ring-inset ring-teal-500/20',
    requiredParams: ['variable'],
  },
  capture_field: { 
    label: 'Capture Field', 
    description: 'Capture field value to variable',
    icon: Camera, 
    color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 ring-1 ring-inset ring-indigo-500/20',
    requiredParams: ['field', 'variable'],
  },
  wait: { 
    label: 'Wait', 
    description: 'Wait for a condition or timeout',
    icon: Timer, 
    color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 ring-1 ring-inset ring-orange-500/20',
    requiredParams: ['duration_ms'],
  },
}

// Validation types
interface ValidationIssue {
  type: 'error' | 'warning' | 'info'
  stepId: string
  stepOrder: number
  message: string
  field?: string
}

// Validate steps
function validateSteps(steps: IRStep[]): ValidationIssue[] {
  const issues: ValidationIssue[] = []
  
  steps.forEach(step => {
    const config = stepTypeConfig[step.step_type]
    
    // Check required parameters
    config.requiredParams.forEach(param => {
      if (step.parameters[param] === undefined || step.parameters[param] === '') {
        issues.push({
          type: 'error',
          stepId: step.id,
          stepOrder: step.order,
          message: `Missing required parameter: ${param}`,
          field: param,
        })
      }
    })
    
    // Check healing hints on high-risk steps
    const highRiskStepTypes: IRStepType[] = ['set_field', 'press_button', 'select_row', 'click_menu']
    if (highRiskStepTypes.includes(step.step_type) && (!step.healing_hints || step.healing_hints.length === 0)) {
      issues.push({
        type: 'warning',
        stepId: step.id,
        stepOrder: step.order,
        message: `No healing hints configured for high-risk step type`,
      })
    }
    
    // Check confidence on set_field steps
    if (step.step_type === 'set_field' && step.confidence !== undefined && step.confidence < 90) {
      issues.push({
        type: 'warning',
        stepId: step.id,
        stepOrder: step.order,
        message: `Low confidence (${step.confidence}%) - consider adding more healing hints`,
      })
    }
  })
  
  // Check for order gaps
  const orders = steps.map(s => s.order).sort((a, b) => a - b)
  for (let i = 1; i < orders.length; i++) {
    if (orders[i] !== orders[i-1] + 1) {
      issues.push({
        type: 'info',
        stepId: '',
        stepOrder: orders[i-1],
        message: `Gap in step ordering between step ${orders[i-1]} and ${orders[i]}`,
      })
    }
  }
  
  return issues
}

function reorderSteps(steps: IRStep[], sourceId: string, targetId: string): IRStep[] {
  const sorted = [...steps].sort((a, b) => a.order - b.order)
  const fromIndex = sorted.findIndex((s) => s.id === sourceId)
  const toIndex = sorted.findIndex((s) => s.id === targetId)
  if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return steps

  const next = [...sorted]
  const [moved] = next.splice(fromIndex, 1)
  next.splice(toIndex, 0, moved)
  return next.map((step, index) => ({ ...step, order: index + 1 }))
}

function InspectorSection({
  title,
  description,
  icon: Icon,
  children,
  className,
}: {
  title: string
  description?: string
  icon?: React.ElementType
  children: React.ReactNode
  className?: string
}) {
  return (
    <section
      className={cn(
        'rounded-xl border border-border/70 bg-card shadow-[var(--shadow-xs)] overflow-hidden mb-4 last:mb-0',
        className,
      )}
    >
      <div className="flex items-start gap-2.5 px-4 py-3 border-b border-border/50 bg-muted/20">
        {Icon && (
          <div className="h-7 w-7 rounded-lg bg-brand/10 ring-1 ring-inset ring-brand/15 flex items-center justify-center shrink-0">
            <Icon className="h-3.5 w-3.5 text-brand" />
          </div>
        )}
        <div className="min-w-0">
          <h4 className="text-sm font-semibold leading-tight">{title}</h4>
          {description && <p className="caption-text mt-0.5">{description}</p>}
        </div>
      </div>
      <div className="p-4">{children}</div>
    </section>
  )
}

function StepProgressTimeline({
  steps,
  selectedStepId,
  validationIssues,
  onSelect,
  onReorder,
}: {
  steps: IRStep[]
  selectedStepId: string | null
  validationIssues: ValidationIssue[]
  onSelect: (id: string) => void
  onReorder: (sourceId: string, targetId: string) => void
}) {
  const sorted = [...steps].sort((a, b) => a.order - b.order)
  const selectedIndex = sorted.findIndex((s) => s.id === selectedStepId)
  const [draggedId, setDraggedId] = React.useState<string | null>(null)
  const [dragOverId, setDragOverId] = React.useState<string | null>(null)

  const handleDragStart = (e: React.DragEvent, stepId: string) => {
    e.dataTransfer.setData('text/plain', stepId)
    e.dataTransfer.effectAllowed = 'move'
    setDraggedId(stepId)
  }

  const handleDragEnd = () => {
    setDraggedId(null)
    setDragOverId(null)
  }

  const handleDragOver = (e: React.DragEvent, stepId: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (dragOverId !== stepId) setDragOverId(stepId)
  }

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault()
    const sourceId = e.dataTransfer.getData('text/plain')
    if (sourceId && sourceId !== targetId) {
      onReorder(sourceId, targetId)
    }
    setDraggedId(null)
    setDragOverId(null)
  }

  return (
    <div className="py-1">
      {sorted.map((step, index) => {
        const config = stepTypeConfig[step.step_type]
        const StepIcon = config.icon
        const isSelected = step.id === selectedStepId
        const isLast = index === sorted.length - 1
        const isPast = selectedIndex >= 0 && index < selectedIndex
        const stepErrors = validationIssues.filter(
          (i) => i.stepId === step.id && i.type === 'error',
        )
        const stepWarnings = validationIssues.filter(
          (i) => i.stepId === step.id && i.type === 'warning',
        )
        const hasError = stepErrors.length > 0
        const hasWarning = stepWarnings.length > 0

        const isDragging = draggedId === step.id
        const isDragOver = dragOverId === step.id && draggedId !== step.id

        return (
          <div
            key={step.id}
            className={cn('flex gap-3 transition-opacity', isDragging && 'opacity-40')}
            onDragOver={(e) => handleDragOver(e, step.id)}
            onDrop={(e) => handleDrop(e, step.id)}
          >
            <div className="flex w-10 shrink-0 flex-col items-center pt-3">
              <motion.button
                type="button"
                onClick={() => onSelect(step.id)}
                whileTap={{ scale: 0.94 }}
                className={cn(
                  'relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 font-mono text-xs font-bold transition-all',
                  isSelected &&
                    'border-brand bg-brand text-brand-foreground shadow-[0_0_0_4px_rgba(184,134,46,0.18)]',
                  !isSelected &&
                    isPast &&
                    !hasError &&
                    'border-brand/40 bg-brand/10 text-brand',
                  !isSelected &&
                    hasError &&
                    'border-red-500 bg-red-500 text-white shadow-[0_0_0_4px_rgba(220,38,38,0.12)]',
                  !isSelected &&
                    hasWarning &&
                    !hasError &&
                    'border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-400',
                  !isSelected &&
                    !isPast &&
                    !hasError &&
                    !hasWarning &&
                    'border-border bg-card text-muted-foreground hover:border-brand/30',
                )}
              >
                {step.order}
              </motion.button>
              {!isLast && (
                <div
                  className={cn(
                    'w-[2px] flex-1 min-h-[1.5rem] my-1.5 rounded-full',
                    hasError && !isPast && !isSelected
                      ? 'bg-gradient-to-b from-red-400/70 to-border'
                      : isPast || isSelected
                        ? 'bg-brand/55'
                        : 'bg-border',
                  )}
                />
              )}
            </div>

            <motion.div
              role="button"
              tabIndex={0}
              onClick={() => onSelect(step.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onSelect(step.id)
                }
              }}
              variants={staggerItem}
              className={cn(
                'group flex-1 mb-2.5 text-left rounded-xl border p-3.5 transition-all min-w-0 cursor-pointer',
                isLast && 'mb-0',
                isDragOver && 'border-brand ring-2 ring-brand/25 bg-brand/[0.04]',
                isSelected &&
                  'border-brand/45 bg-brand/[0.06] shadow-[var(--shadow-sm)] ring-1 ring-brand/15',
                !isSelected &&
                  !isDragOver &&
                  'border-border/70 bg-card hover:border-brand/25 hover:bg-muted/25',
                hasError && !isSelected && 'border-red-500/35 bg-red-500/[0.04]',
                hasWarning && !hasError && !isSelected && 'border-amber-500/30 bg-amber-500/[0.03]',
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg mt-0.5',
                    config.color,
                  )}
                >
                  <StepIcon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-snug text-foreground break-words">
                    {step.description}
                  </p>
                  <p className="caption-text mt-1">{config.label}</p>
                </div>
                <div
                  draggable
                  title="Drag to reorder"
                  onDragStart={(e) => {
                    e.stopPropagation()
                    handleDragStart(e, step.id)
                  }}
                  onDragEnd={handleDragEnd}
                  onClick={(e) => e.stopPropagation()}
                  className={cn(
                    'flex h-8 w-6 shrink-0 items-center justify-center rounded-md mt-0.5',
                    'cursor-grab active:cursor-grabbing text-muted-foreground/50',
                    'hover:bg-muted/60 hover:text-muted-foreground',
                    'opacity-60 group-hover:opacity-100 transition-opacity',
                  )}
                >
                  <GripVertical className="h-4 w-4" />
                </div>
              </div>

              {(step.is_assertion ||
                hasError ||
                hasWarning ||
                step.confidence !== undefined) && (
                <div className="flex flex-wrap items-center gap-1.5 mt-2.5 ml-11">
                  {step.is_assertion && (
                    <Badge className="pill pill-warning text-[10px] h-5 px-1.5">Assert</Badge>
                  )}
                  {hasError && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-red-600">
                      <AlertCircle className="h-3 w-3" /> Error
                    </span>
                  )}
                  {hasWarning && !hasError && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-600">
                      <AlertTriangle className="h-3 w-3" /> Warning
                    </span>
                  )}
                  {step.confidence !== undefined && (
                    <span
                      className={cn(
                        'text-[10px] font-semibold tabular-nums px-1.5 py-0.5 rounded-md',
                        step.confidence >= 95 && 'bg-emerald-500/10 text-emerald-600',
                        step.confidence >= 90 &&
                          step.confidence < 95 &&
                          'bg-amber-500/10 text-amber-600',
                        step.confidence < 90 && 'bg-red-500/10 text-red-600',
                      )}
                    >
                      {step.confidence}%
                    </span>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        )
      })}
    </div>
  )
}

// Step Inspector Panel
function StepInspectorPanel({
  step,
  issues,
  onChange,
}: {
  step: IRStep
  issues: ValidationIssue[]
  onChange: (step: IRStep) => void
}) {
  const config = stepTypeConfig[step.step_type]
  const StepIcon = config.icon
  const [hintsOpen, setHintsOpen] = React.useState(true)
  
  const stepIssues = issues.filter(i => i.stepId === step.id)
  
  const handleParamChange = (key: string, value: any) => {
    onChange({
      ...step,
      parameters: { ...step.parameters, [key]: value }
    })
  }
  
  const handleHintAdd = () => {
    onChange({
      ...step,
      healing_hints: [...(step.healing_hints || []), '']
    })
  }
  
  const handleHintChange = (index: number, value: string) => {
    const newHints = [...(step.healing_hints || [])]
    newHints[index] = value
    onChange({ ...step, healing_hints: newHints })
  }
  
  const handleHintRemove = (index: number) => {
    const newHints = [...(step.healing_hints || [])]
    newHints.splice(index, 1)
    onChange({ ...step, healing_hints: newHints })
  }
  
  return (
    <div className="h-full min-h-0 flex flex-col bg-background">
      <div className="shrink-0 px-5 sm:px-6 py-4 border-b border-border bg-gradient-to-r from-brand/[0.04] via-muted/15 to-transparent">
        <div className="flex items-start gap-4 max-w-3xl">
          <div className={cn('flex h-12 w-12 shrink-0 items-center justify-center rounded-xl', config.color)}>
            <StepIcon className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="font-mono text-[11px] h-5">
                Step {step.order}
              </Badge>
              <h3 className="section-title">{config.label}</h3>
            </div>
            <p className="section-description mt-1">{config.description}</p>
            <p className="body-text mt-2 text-foreground/90 break-words">{step.description}</p>
          </div>
        </div>

        {stepIssues.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2 max-w-3xl">
            {stepIssues.map((issue, i) => (
              <div
                key={i}
                className={cn(
                  'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
                  issue.type === 'error' && 'bg-red-500/10 text-red-700 dark:text-red-400',
                  issue.type === 'warning' && 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
                  issue.type === 'info' && 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
                )}
              >
                {issue.type === 'error' && <AlertCircle className="h-3 w-3" />}
                {issue.type === 'warning' && <AlertTriangle className="h-3 w-3" />}
                {issue.type === 'info' && <Info className="h-3 w-3" />}
                {issue.message}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
        <div className="px-4 sm:px-6 py-4 max-w-3xl mx-auto w-full">
          <InspectorSection title="Step definition" description="Type and narrative" icon={FormInput}>
          <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label className="text-sm font-medium">Step Type</Label>
            <Select 
              value={step.step_type}
              onValueChange={(v) => onChange({ ...step, step_type: v as IRStepType })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(stepTypeConfig).map(([type, cfg]) => {
                  const Icon = cfg.icon
                  return (
                    <SelectItem key={type} value={type}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        <span>{cfg.label}</span>
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2 sm:col-span-2">
            <Label className="text-sm font-medium">Description</Label>
            <Textarea
              value={step.description}
              onChange={(e) => onChange({ ...step, description: e.target.value })}
              placeholder="Describe what this step does..."
              rows={2}
              className="resize-none bg-background min-h-[4.5rem]"
            />
          </div>
          </div>
          </InspectorSection>

          <InspectorSection title="Parameters" description="Executor bindings" icon={Terminal}>
          <div className="space-y-4">
            
            {/* Common parameters for each step type */}
            {step.step_type === 'open_transaction' && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs">Transaction Code <span className="text-red-500">*</span></Label>
                  <Input
                    value={step.parameters.tcode || ''}
                    onChange={(e) => handleParamChange('tcode', e.target.value)}
                    placeholder="VA01"
                    className={cn(
                      'font-mono',
                      stepIssues.some(i => i.field === 'tcode') && 'border-red-300 focus-visible:ring-red-500'
                    )}
                  />
                </div>
              </div>
            )}
            
            {step.step_type === 'set_field' && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Field ID <span className="text-red-500">*</span></Label>
                  <Input
                    value={step.parameters.field || ''}
                    onChange={(e) => handleParamChange('field', e.target.value)}
                    placeholder="VBAK-AUART"
                    className={cn(
                      'font-mono h-10 bg-background',
                      stepIssues.some(i => i.field === 'field') && 'border-red-300 focus-visible:ring-red-500'
                    )}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Value <span className="text-red-500">*</span></Label>
                  <Input
                    value={step.parameters.value || ''}
                    onChange={(e) => handleParamChange('value', e.target.value)}
                    placeholder="OR"
                    className={cn(
                      'h-10 bg-background',
                      stepIssues.some(i => i.field === 'value') && 'border-red-300 focus-visible:ring-red-500'
                    )}
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label className="text-xs font-medium">Label (optional)</Label>
                  <Input
                    value={step.parameters.label || ''}
                    onChange={(e) => handleParamChange('label', e.target.value)}
                    placeholder="Order Type"
                    className="h-10 bg-background"
                  />
                </div>
              </div>
            )}
            
            {step.step_type === 'press_button' && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs">Button ID <span className="text-red-500">*</span></Label>
                  <Input
                    value={step.parameters.button || ''}
                    onChange={(e) => handleParamChange('button', e.target.value)}
                    placeholder="btn[11]"
                    className="font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Label</Label>
                  <Input
                    value={step.parameters.label || ''}
                    onChange={(e) => handleParamChange('label', e.target.value)}
                    placeholder="Save"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Icon</Label>
                  <Input
                    value={step.parameters.icon || ''}
                    onChange={(e) => handleParamChange('icon', e.target.value)}
                    placeholder="SAVE"
                  />
                </div>
              </div>
            )}
            
            {step.step_type === 'press_enter' && (
              <p className="page-description p-3 bg-muted/50 rounded-lg">
                No parameters required for press_enter step.
              </p>
            )}
            
            {step.step_type === 'assert_statusbar' && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs">Contains Text <span className="text-red-500">*</span></Label>
                  <Input
                    value={step.parameters.contains || ''}
                    onChange={(e) => handleParamChange('contains', e.target.value)}
                    placeholder="saved"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Message Type</Label>
                  <Select 
                    value={step.parameters.message_type || 'S'}
                    onValueChange={(v) => handleParamChange('message_type', v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="S">Success (S)</SelectItem>
                      <SelectItem value="W">Warning (W)</SelectItem>
                      <SelectItem value="E">Error (E)</SelectItem>
                      <SelectItem value="I">Info (I)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            
            {step.step_type === 'capture_field' && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs">Field ID <span className="text-red-500">*</span></Label>
                  <Input
                    value={step.parameters.field || ''}
                    onChange={(e) => handleParamChange('field', e.target.value)}
                    placeholder="VBELN"
                    className="font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Variable Name <span className="text-red-500">*</span></Label>
                  <Input
                    value={step.parameters.variable || ''}
                    onChange={(e) => handleParamChange('variable', e.target.value)}
                    placeholder="created_order_number"
                    className="font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Pattern (Regex)</Label>
                  <Input
                    value={step.parameters.pattern || ''}
                    onChange={(e) => handleParamChange('pattern', e.target.value)}
                    placeholder="\\d{10}"
                    className="font-mono"
                  />
                </div>
              </div>
            )}
            
            {step.step_type === 'assert_field' && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs">Variable <span className="text-red-500">*</span></Label>
                  <Input
                    value={step.parameters.variable || ''}
                    onChange={(e) => handleParamChange('variable', e.target.value)}
                    placeholder="created_order_number"
                    className="font-mono"
                  />
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <Switch
                    checked={step.parameters.not_empty || false}
                    onCheckedChange={(v) => handleParamChange('not_empty', v)}
                  />
                  <div className="space-y-0.5">
                    <Label className="text-xs">Not Empty</Label>
                    <p className="caption-text">Assert variable is not empty</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          </InspectorSection>

          <InspectorSection title="Options" description="Assertion and confidence" icon={CheckCircle2}>
          <div className="flex items-center justify-between gap-4 py-1">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium">Assertion Step</Label>
              <p className="caption-text">Mark as a verification/assertion step</p>
            </div>
            <Switch
              checked={step.is_assertion}
              onCheckedChange={(v) => onChange({ ...step, is_assertion: v })}
            />
          </div>

          {step.confidence !== undefined && (
            <div className="mt-5 space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">AI Confidence</Label>
                <span className="text-sm font-semibold tabular-nums text-emerald-600">{step.confidence}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className={cn(
                    'h-full rounded-full',
                    step.confidence >= 95 && 'bg-gradient-to-r from-emerald-500 to-emerald-400',
                    step.confidence >= 90 && step.confidence < 95 && 'bg-gradient-to-r from-amber-500 to-amber-400',
                    step.confidence < 90 && 'bg-gradient-to-r from-red-500 to-red-400',
                  )}
                  initial={{ width: 0 }}
                  animate={{ width: `${step.confidence}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />
              </div>
            </div>
          )}
          </InspectorSection>

          <InspectorSection title="Healing Hints" description="AI recovery guidance" icon={Lightbulb}>
          <Collapsible open={hintsOpen} onOpenChange={setHintsOpen}>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-between h-auto py-2 px-0 hover:bg-transparent text-muted-foreground hover:text-foreground"
              >
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-amber-500" />
                  <span className="text-sm">
                    {step.healing_hints?.length || 0} hint{(step.healing_hints?.length || 0) !== 1 ? 's' : ''} configured
                  </span>
                </div>
                {hintsOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2">
              <div className="space-y-2 rounded-lg border border-amber-500/20 bg-amber-500/[0.04] p-4">
                {(!step.healing_hints || step.healing_hints.length === 0) ? (
                  <p className="body-text text-amber-800/80 dark:text-amber-300/80">
                    No healing hints configured. Add hints to help the AI agent recover from failures.
                  </p>
                ) : (
                  step.healing_hints.map((hint, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={hint}
                        onChange={(e) => handleHintChange(index, e.target.value)}
                        placeholder="Enter healing hint..."
                        className="flex-1 text-sm bg-background"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0"
                        onClick={() => handleHintRemove(index)}
                      >
                        <XCircle className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  ))
                )}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-2"
                  onClick={handleHintAdd}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Healing Hint
                </Button>
              </div>
            </CollapsibleContent>
          </Collapsible>
          </InspectorSection>
        </div>
      </div>
    </div>
  )
}

export default function IREditorPage() {
  const params = useParams()
  const router = useRouter()
  const irId = params.id as string
  
  // State
  const [isLoading, setIsLoading] = React.useState(true)
  const [steps, setSteps] = React.useState<IRStep[]>([])
  const [selectedStepId, setSelectedStepId] = React.useState<string | null>(null)
  const [isDirty, setIsDirty] = React.useState(false)
  const [isStepPickerOpen, setIsStepPickerOpen] = React.useState(false)
  const [isCodePreviewOpen, setIsCodePreviewOpen] = React.useState(false)
  
  // IR metadata
  const irMetadata = {
    id: 'ir_va01_create',
    name: 'Create Sales Order VA01',
    version: '2.3.0',
    tcode: 'VA01',
    test_case_id: 'tc_1',
    test_case_name: 'Create Sales Order via VA01',
  }
  
  // Load data
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setSteps(MOCK_IR_STEPS_VA01)
      setSelectedStepId(MOCK_IR_STEPS_VA01[0]?.id || null)
      setIsLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])
  
  // Validation
  const validationIssues = React.useMemo(() => validateSteps(steps), [steps])
  const errorCount = validationIssues.filter(i => i.type === 'error').length
  const warningCount = validationIssues.filter(i => i.type === 'warning').length
  
  const selectedStep = steps.find(s => s.id === selectedStepId)
  
  const handleStepChange = (updatedStep: IRStep) => {
    setSteps(prev => prev.map(s => s.id === updatedStep.id ? updatedStep : s))
    setIsDirty(true)
  }

  const handleReorderSteps = (sourceId: string, targetId: string) => {
    setSteps((prev) => reorderSteps(prev, sourceId, targetId))
    setIsDirty(true)
  }
  
  const handleSave = () => {
    // Would save and increment version
    setIsDirty(false)
    // Show toast
  }
  
  const handleAddStep = (stepType: IRStepType) => {
    const maxOrder = Math.max(...steps.map(s => s.order), 0)
    const newStep: IRStep = {
      id: `ir_step_${Date.now()}`,
      order: maxOrder + 1,
      step_type: stepType,
      description: '',
      parameters: {},
      is_assertion: stepType.startsWith('assert'),
      healing_hints: [],
    }
    setSteps(prev => [...prev, newStep])
    setSelectedStepId(newStep.id)
    setIsDirty(true)
    setIsStepPickerOpen(false)
  }
  
  if (isLoading) {
    return (
      <AppShell currentApp="test-repository">
        <div className="-m-4 sm:-m-6 lg:-m-8 h-[calc(100dvh-3.5rem)] max-h-[calc(100dvh-3.5rem)] overflow-hidden flex flex-col bg-muted/30 p-4 gap-4">
          <div className="rounded-xl border border-border bg-card p-6 space-y-3">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-8 w-72" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="flex-1 flex gap-4 min-h-0">
            <div className="w-96 rounded-xl border border-border bg-card p-4 space-y-2 shrink-0">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="h-14 w-full rounded-xl" />
              ))}
            </div>
            <div className="flex-1 rounded-xl border border-border bg-card p-6">
              <Skeleton className="h-full w-full rounded-lg" />
            </div>
          </div>
        </div>
      </AppShell>
    )
  }
  
  return (
    <AppShell currentApp="test-repository">
      <div className="-m-4 sm:-m-6 lg:-m-8 flex flex-col h-[calc(100dvh-3.5rem)] max-h-[calc(100dvh-3.5rem)] overflow-hidden">
        <div className="shrink-0 border-b border-border bg-card/95 backdrop-blur-md z-20 shadow-[var(--shadow-xs)]">
          <div className="relative overflow-hidden">
            <div
              className="absolute inset-0 bg-gradient-to-r from-brand/[0.06] via-transparent to-transparent pointer-events-none"
              aria-hidden
            />
            <div className="relative px-4 sm:px-6 lg:px-8 py-4 space-y-3">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 h-8 w-8 -ml-1"
                  onClick={() => router.push('/test-repository/ir')}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <PageBreadcrumb
                  items={[
                    { label: 'IR Browser', href: '/test-repository/ir' },
                    { label: irMetadata.id },
                  ]}
                />
              </div>

            <PageHeader
              title={irMetadata.name}
              badge={
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="font-mono text-[11px] h-6">
                    v{irMetadata.version}
                  </Badge>
                  <Badge variant="outline" className="font-mono text-[11px] h-6 gap-1">
                    <Terminal className="h-3 w-3" />
                    {irMetadata.tcode}
                  </Badge>
                  {isDirty && (
                    <Badge className="pill pill-warning h-6">Unsaved changes</Badge>
                  )}
                </div>
              }
              description={`Linked to ${irMetadata.test_case_name}`}
              actions={
                <div className="flex flex-wrap items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setIsCodePreviewOpen(true)} className="gap-2">
                    <Code2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Code Preview</span>
                  </Button>
                  <Button variant="outline" size="sm" disabled={errorCount > 0} className="gap-2">
                    <Play className="h-4 w-4" />
                    Validate
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSave}
                    disabled={!isDirty || errorCount > 0}
                    className="gap-2 bg-brand text-brand-foreground hover:bg-brand/90"
                  >
                    <Save className="h-4 w-4" />
                    Save as v2.4.0
                  </Button>
                </div>
              }
            />
            </div>
          </div>
        </div>

        <div className="flex-1 flex min-h-0 overflow-hidden bg-muted/25 p-3 sm:p-4 gap-3 sm:gap-4">
          <div className="w-full max-w-[28rem] sm:w-[26rem] lg:w-[28rem] xl:w-[30rem] shrink-0 flex flex-col min-h-0 rounded-xl border border-border/80 bg-card shadow-[var(--shadow-sm)] overflow-hidden">
            <div className="shrink-0 px-4 py-3 border-b border-border flex items-center justify-between bg-gradient-to-r from-muted/30 to-transparent">
              <div className="flex items-center gap-2">
                <h3 className="section-title text-base">Steps</h3>
                <Badge variant="secondary" className="h-5 text-[10px] tabular-nums">
                  {steps.length}
                </Badge>
              </div>
              
              <div className="flex items-center gap-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => setIsStepPickerOpen(true)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Add Step</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <ArrowUpDown className="h-4 w-4 mr-2" />
                      Bulk Reorder
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Import className="h-4 w-4 mr-2" />
                      Import from Step Library
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy All Steps
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {selectedStep && (
              <div className="shrink-0 px-4 py-3 border-b border-border bg-brand/[0.03]">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                  <span>
                    Step {selectedStep.order} of {steps.length}
                  </span>
                  <span className="tabular-nums font-medium">
                    {Math.round((selectedStep.order / steps.length) * 100)}%
                  </span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-brand rounded-full"
                    initial={false}
                    animate={{ width: `${(selectedStep.order / steps.length) * 100}%` }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                  />
                </div>
              </div>
            )}

            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-3 py-3">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.03 } } }}
              >
                <StepProgressTimeline
                  steps={steps}
                  selectedStepId={selectedStepId}
                  validationIssues={validationIssues}
                  onSelect={setSelectedStepId}
                  onReorder={handleReorderSteps}
                />
              </motion.div>
            </div>

            <div className="border-t border-border bg-card shrink-0">
              <div className="px-4 py-3">
                <div
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium',
                    errorCount === 0 && warningCount === 0
                      ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                      : 'bg-amber-500/10 text-amber-800 dark:text-amber-300',
                  )}
                >
                  {errorCount === 0 && warningCount === 0 ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 shrink-0" />
                      All validations passed
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-4 w-4 shrink-0" />
                      {errorCount} error{errorCount !== 1 ? 's' : ''}, {warningCount} warning
                      {warningCount !== 1 ? 's' : ''}
                    </>
                  )}
                </div>
              </div>

              {validationIssues.length > 0 && (
                <div className="max-h-36 overflow-y-auto overscroll-contain border-t border-border">
                  <div className="p-2 space-y-1">
                    {validationIssues.map((issue, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => issue.stepId && setSelectedStepId(issue.stepId)}
                        className={cn(
                          'w-full text-left flex items-start gap-2 p-2 rounded-lg text-xs transition-colors',
                          'hover:bg-muted/60',
                          issue.type === 'error' && 'text-red-700 dark:text-red-400',
                          issue.type === 'warning' && 'text-amber-700 dark:text-amber-400',
                          issue.type === 'info' && 'text-blue-700 dark:text-blue-400',
                        )}
                      >
                        {issue.type === 'error' && <AlertCircle className="h-3 w-3 mt-0.5 shrink-0" />}
                        {issue.type === 'warning' && <AlertTriangle className="h-3 w-3 mt-0.5 shrink-0" />}
                        {issue.type === 'info' && <Info className="h-3 w-3 mt-0.5 shrink-0" />}
                        <span>
                          {issue.stepOrder > 0 && <span className="font-mono">Step {issue.stepOrder}: </span>}
                          {issue.message}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 min-w-0 min-h-0 rounded-xl border border-border/80 bg-card shadow-[var(--shadow-sm)] overflow-hidden flex flex-col">
            <AnimatePresence mode="wait">
              {selectedStep ? (
                <motion.div
                  key={selectedStep.id}
                  className="h-full min-h-0 flex flex-col"
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <StepInspectorPanel
                    step={selectedStep}
                    issues={validationIssues}
                    onChange={handleStepChange}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  className="h-full flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="text-center max-w-xs px-6">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/60 ring-1 ring-border">
                      <FormInput className="h-7 w-7 text-muted-foreground/60" />
                    </div>
                    <p className="section-title text-base">Select a step</p>
                    <p className="section-description mt-1">
                      Choose a step from the list to edit its parameters and healing hints.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      
      {/* Add Step Picker Sheet */}
      <Sheet open={isStepPickerOpen} onOpenChange={setIsStepPickerOpen}>
        <SheetContent side="right" className="w-[400px] sm:max-w-md p-0 flex flex-col">
          <SheetHeader className="px-6 pt-6 pb-4 border-b border-border text-left">
            <SheetTitle className="page-title text-xl">Add Step</SheetTitle>
            <SheetDescription className="page-description">
              Select a step type to add to the IR
            </SheetDescription>
          </SheetHeader>

          <ScrollArea className="flex-1 px-4 py-4">
            <div className="space-y-2">
              {Object.entries(stepTypeConfig).map(([type, config]) => {
                const Icon = config.icon
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleAddStep(type as IRStepType)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl border border-border bg-card hover:bg-muted/40 hover:border-brand/30 hover:shadow-[var(--shadow-xs)] transition-all text-left"
                  >
                    <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-lg', config.color)}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-foreground">{config.label}</p>
                      <p className="caption-text">{config.description}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  </button>
                )
              })}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
      
      <IRExecutorCodePreviewDialog
        open={isCodePreviewOpen}
        onOpenChange={setIsCodePreviewOpen}
        metadata={irMetadata}
        steps={steps}
      />
    </AppShell>
  )
}
