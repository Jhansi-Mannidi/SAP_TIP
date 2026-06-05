'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { 
  ChevronDown, 
  ChevronRight, 
  Save, 
  X, 
  Pencil,
  Lightbulb,
  HelpCircle
} from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

export type StepType = 
  | 'navigate' 
  | 'set_field' 
  | 'click' 
  | 'select_option' 
  | 'press_key' 
  | 'assert_field' 
  | 'assert_message' 
  | 'wait' 
  | 'call_function' 
  | 'custom'

export interface StepParameter {
  name: string
  type: 'string' | 'number' | 'boolean' | 'selector' | 'key'
  value: string | number | boolean
  required?: boolean
  description?: string
}

export interface HealingHint {
  id: string
  type: 'alternate_selector' | 'fallback_action' | 'retry_config' | 'context_hint'
  value: string
  description?: string
}

export interface IRStep {
  id: string
  sequence: number
  stepType: StepType
  description: string
  parameters: StepParameter[]
  isAssertion: boolean
  healingHints: HealingHint[]
  expectedOutcome?: string
}

interface IRStepInspectorProps {
  step: IRStep
  mode: 'read' | 'edit'
  onModeChange?: (mode: 'read' | 'edit') => void
  onSave?: (step: IRStep) => void
  onCancel?: () => void
  className?: string
}

const stepTypeConfig: Record<StepType, { label: string; description: string; icon: string }> = {
  navigate: { label: 'Navigate', description: 'Navigate to a screen or transaction', icon: '🔗' },
  set_field: { label: 'Set Field', description: 'Set value in an input field', icon: '✏️' },
  click: { label: 'Click', description: 'Click a button or element', icon: '👆' },
  select_option: { label: 'Select Option', description: 'Select from dropdown or list', icon: '📋' },
  press_key: { label: 'Press Key', description: 'Press a keyboard key or shortcut', icon: '⌨️' },
  assert_field: { label: 'Assert Field', description: 'Verify field value', icon: '✓' },
  assert_message: { label: 'Assert Message', description: 'Verify message or status', icon: '💬' },
  wait: { label: 'Wait', description: 'Wait for condition or timeout', icon: '⏱️' },
  call_function: { label: 'Call Function', description: 'Call SAP function module', icon: '⚡' },
  custom: { label: 'Custom', description: 'Custom step type', icon: '🔧' },
}

const FALLBACK_STEP_TYPE_CONFIG = {
  label: 'Step',
  description: 'Test step',
  icon: '•',
} as const

export function IRStepInspector({ 
  step, 
  mode, 
  onModeChange, 
  onSave, 
  onCancel,
  className 
}: IRStepInspectorProps) {
  // Defensive: tolerate missing/partial step data instead of crashing the page.
  const safeStep: IRStep = React.useMemo(() => ({
    id: step?.id ?? 'unknown',
    sequence: step?.sequence ?? 0,
    stepType: step?.stepType ?? 'custom',
    description: step?.description ?? '',
    parameters: Array.isArray(step?.parameters) ? step!.parameters : [],
    isAssertion: Boolean(step?.isAssertion),
    healingHints: Array.isArray(step?.healingHints) ? step!.healingHints : [],
    expectedOutcome: step?.expectedOutcome,
  }), [step])
  
  const [editedStep, setEditedStep] = React.useState<IRStep>(safeStep)
  const [hintsOpen, setHintsOpen] = React.useState(false)
  
  React.useEffect(() => {
    setEditedStep(safeStep)
  }, [safeStep])
  
  const handleParameterChange = (index: number, value: string | number | boolean) => {
    setEditedStep(prev => ({
      ...prev,
      parameters: prev.parameters.map((p, i) => 
        i === index ? { ...p, value } : p
      )
    }))
  }
  
  const handleSave = () => {
    onSave?.(editedStep)
    onModeChange?.('read')
  }
  
  const handleCancel = () => {
    setEditedStep(step)
    onCancel?.()
    onModeChange?.('read')
  }
  
  const isEditing = mode === 'edit'
  
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="font-mono">
              Step {safeStep.sequence}
            </Badge>
            <CardTitle className="text-base">
              {stepTypeConfig[safeStep.stepType]?.label || safeStep.stepType}
            </CardTitle>
            {safeStep.isAssertion && (
              <Badge variant="secondary" className="bg-violet-100 text-violet-700">
                Assertion
              </Badge>
            )}
          </div>
          
          {!isEditing && onModeChange && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onModeChange('edit')}
            >
              <Pencil className="h-4 w-4 mr-1" />
              Edit
            </Button>
          )}
          
          {isEditing && (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleCancel}>
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave}>
                <Save className="h-4 w-4 mr-1" />
                Save
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Step Type Selector */}
        <div className="space-y-2">
          <Label>Step Type</Label>
          {isEditing ? (
            <Select 
              value={editedStep.stepType} 
              onValueChange={(v) => setEditedStep(prev => ({ ...prev, stepType: v as StepType }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(stepTypeConfig).map(([type, config]) => (
                  <SelectItem key={type} value={type}>
                    <div className="flex items-center gap-2">
                      <span>{config.icon}</span>
                      <div>
                        <p className="font-medium">{config.label}</p>
                        <p className="caption-text">{config.description}</p>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
              <span>{(stepTypeConfig[safeStep.stepType] ?? FALLBACK_STEP_TYPE_CONFIG).icon}</span>
              <span className="font-medium">{(stepTypeConfig[safeStep.stepType] ?? FALLBACK_STEP_TYPE_CONFIG).label}</span>
              <span className="text-sm text-muted-foreground">
                — {(stepTypeConfig[safeStep.stepType] ?? FALLBACK_STEP_TYPE_CONFIG).description}
              </span>
            </div>
          )}
        </div>
        
        {/* Description */}
        <div className="space-y-2">
          <Label>Description</Label>
          {isEditing ? (
            <Textarea
              value={editedStep.description}
              onChange={(e) => setEditedStep(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe what this step does..."
              rows={2}
            />
          ) : (
            <p className="page-description p-2 bg-muted/50 rounded-lg">
              {safeStep.description || 'No description'}
            </p>
          )}
        </div>
        
        {/* Parameters */}
        <div className="space-y-2">
          <Label>Parameters</Label>
          <div className="space-y-2">
            {(isEditing ? editedStep.parameters : safeStep.parameters).map((param, index) => (
              <div key={param.name} className="flex items-center gap-3">
                <div className="w-32 flex items-center gap-1">
                  <span className="text-sm font-medium">{param.name}</span>
                  {param.required && <span className="text-red-500">*</span>}
                  {param.description && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-3 w-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>{param.description}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
                
                {isEditing ? (
                  param.type === 'boolean' ? (
                    <Switch
                      checked={param.value as boolean}
                      onCheckedChange={(v) => handleParameterChange(index, v)}
                    />
                  ) : (
                    <Input
                      value={String(param.value)}
                      onChange={(e) => handleParameterChange(index, e.target.value)}
                      type={param.type === 'number' ? 'number' : 'text'}
                      className="flex-1"
                    />
                  )
                ) : (
                  <code className="flex-1 text-sm bg-muted px-2 py-1 rounded">
                    {String(param.value)}
                  </code>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Is Assertion Toggle */}
        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
          <div className="space-y-0.5">
            <Label>Assertion Step</Label>
            <p className="caption-text">
              Mark this step as a verification/assertion
            </p>
          </div>
          {isEditing ? (
            <Switch
              checked={editedStep.isAssertion}
              onCheckedChange={(v) => setEditedStep(prev => ({ ...prev, isAssertion: v }))}
            />
          ) : (
            <Badge variant={safeStep.isAssertion ? 'default' : 'secondary'}>
              {safeStep.isAssertion ? 'Yes' : 'No'}
            </Badge>
          )}
        </div>
        
        {/* Healing Hints Panel */}
        <Collapsible open={hintsOpen} onOpenChange={setHintsOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-3 h-auto">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-amber-500" />
                <span className="font-medium">Healing Hints</span>
                <Badge variant="outline" className="ml-2">
                  {safeStep.healingHints.length}
                </Badge>
              </div>
              {hintsOpen ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2">
            <div className="space-y-2 p-3 bg-amber-50/50 rounded-lg border border-amber-200">
              {safeStep.healingHints.length === 0 ? (
                <p className="page-description">No healing hints configured</p>
              ) : (
                safeStep.healingHints.map(hint => (
                  <div key={hint.id} className="flex items-start gap-2 text-sm">
                    <Badge variant="outline" className="text-[10px] flex-shrink-0">
                      {hint.type.replace('_', ' ')}
                    </Badge>
                    <div>
                      <code className="text-xs bg-white px-1 py-0.5 rounded">
                        {hint.value}
                      </code>
                      {hint.description && (
                        <p className="caption-text mt-0.5">
                          {hint.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
              
              {isEditing && (
                <Button variant="outline" size="sm" className="w-full mt-2">
                  Add Healing Hint
                </Button>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  )
}
