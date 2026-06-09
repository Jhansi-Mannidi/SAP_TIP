'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { StatusBadge } from '@/components/status-badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Image as ImageIcon,
  Video,
  Clock,
  User,
  RotateCcw,
  FileText,
  HeartPulse,
  Code,
  Bug,
  ClipboardList
} from 'lucide-react'
import type { TaskState, Assignee } from '@/lib/types'

export interface TestStep {
  id: string
  sequence: number
  action: string
  description: string
  expectedResult: string
  actualResult?: string
  state: TaskState
  screenshot?: string
  startTime?: string
  endTime?: string
}

export interface CaseExecution {
  id: string
  name: string
  state: TaskState
  assignee?: Assignee
  runner: string
  startedAt: string
  completedAt?: string
  retryCount: number
  steps: TestStep[]
}

interface ReplaySurfaceProps {
  caseExecution: CaseExecution
  className?: string
}

export function ReplaySurface({ caseExecution, className }: ReplaySurfaceProps) {
  const [currentStepIndex, setCurrentStepIndex] = React.useState(0)
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [viewMode, setViewMode] = React.useState<'video' | 'screenshots'>('screenshots')
  
  const currentStep = caseExecution.steps[currentStepIndex]
  const previousStep = currentStepIndex > 0 ? caseExecution.steps[currentStepIndex - 1] : null
  
  // Auto-advance when playing
  React.useEffect(() => {
    if (!isPlaying) return
    
    const timer = setInterval(() => {
      setCurrentStepIndex(prev => {
        if (prev >= caseExecution.steps.length - 1) {
          setIsPlaying(false)
          return prev
        }
        return prev + 1
      })
    }, 2000)
    
    return () => clearInterval(timer)
  }, [isPlaying, caseExecution.steps.length])
  
  return (
    <div className={cn('flex flex-col h-full bg-background', className)}>
      {/* Top strip - Case meta */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
        <div className="flex items-center gap-4">
          <div>
            <h2 className="section-title">{caseExecution.name}</h2>
            <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
              <span className="font-mono">{caseExecution.id}</span>
              <StatusBadge status={caseExecution.state} />
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {caseExecution.assignee && (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <Avatar className="h-6 w-6">
                <AvatarImage src={caseExecution.assignee.avatar} />
                <AvatarFallback className="text-[10px]">
                  {caseExecution.assignee.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm">{caseExecution.assignee.name}</span>
            </div>
          )}
          
          <div className="page-breadcrumb">
            <Clock className="h-4 w-4" />
            <span>{new Date(caseExecution.startedAt).toLocaleString()}</span>
          </div>
          
          {caseExecution.retryCount > 0 && (
            <Badge variant="outline" className="gap-1">
              <RotateCcw className="h-3 w-3" />
              Retry {caseExecution.retryCount}
            </Badge>
          )}
        </div>
      </div>
      
      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left center main - Video/Screenshot viewer */}
        <div className="flex-1 flex flex-col">
          {/* View mode toggle */}
          <div className="flex items-center justify-between px-4 py-2 border-b">
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'screenshots' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('screenshots')}
              >
                <ImageIcon className="h-4 w-4 mr-1" />
                Screenshots
              </Button>
              <Button
                variant={viewMode === 'video' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('video')}
              >
                <Video className="h-4 w-4 mr-1" />
                Video
              </Button>
            </div>
            
            <div className="page-breadcrumb">
              Step {currentStepIndex + 1} of {caseExecution.steps.length}
            </div>
          </div>
          
          {/* Viewer area */}
          <div className="flex-1 bg-slate-900 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl aspect-video bg-slate-800 rounded-lg flex items-center justify-center border border-slate-700">
              <div className="text-center text-slate-400">
                <ImageIcon className="h-16 w-16 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Screenshot for Step {currentStepIndex + 1}</p>
                <p className="text-xs mt-1 font-mono">{currentStep?.action}</p>
              </div>
            </div>
          </div>
          
          {/* Playback controls */}
          <div className="px-4 py-3 border-t bg-muted/30">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setCurrentStepIndex(0)}
                  disabled={currentStepIndex === 0}
                >
                  <SkipBack className="h-4 w-4" />
                </Button>
                <Button 
                  variant="default" 
                  size="icon"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setCurrentStepIndex(caseExecution.steps.length - 1)}
                  disabled={currentStepIndex === caseExecution.steps.length - 1}
                >
                  <SkipForward className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex-1">
                <Slider
                  value={[currentStepIndex]}
                  min={0}
                  max={caseExecution.steps.length - 1}
                  step={1}
                  onValueChange={([value]) => setCurrentStepIndex(value)}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Right pane - Step list */}
        <div className="w-80 border-l flex flex-col">
          <div className="px-4 py-2 border-b font-medium text-sm">
            Test Steps
          </div>
          
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {caseExecution.steps.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => setCurrentStepIndex(index)}
                  className={cn(
                    'w-full text-left p-2 rounded-lg transition-colors',
                    'hover:bg-muted/50',
                    index === currentStepIndex && 'bg-indigo-50 border border-indigo-200'
                  )}
                >
                  <div className="flex items-start gap-2">
                    <span className={cn(
                      'flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium',
                      step.state === 'Pass' && 'bg-emerald-100 text-emerald-700',
                      step.state === 'Fail' && 'bg-red-100 text-red-700',
                      step.state === 'Healed' && 'bg-amber-100 text-amber-700',
                      step.state === 'InProgress' && 'bg-blue-100 text-blue-700',
                      step.state === 'ToDo' && 'bg-slate-100 text-slate-600'
                    )}>
                      {step.sequence}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{step.action}</p>
                      <p className="caption-text truncate">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
          
          {/* Current step detail */}
          {currentStep && (
            <div className="p-3 border-t space-y-2">
              <div className="text-xs font-medium text-muted-foreground uppercase">
                Current Step Details
              </div>
              <div className="text-sm">
                <p className="font-medium">{currentStep.action}</p>
                <p className="page-description mt-1">{currentStep.description}</p>
              </div>
              {currentStep.expectedResult && (
                <div className="text-xs">
                  <span className="text-muted-foreground">Expected: </span>
                  {currentStep.expectedResult}
                </div>
              )}
              {currentStep.actualResult && (
                <div className="text-xs">
                  <span className="text-muted-foreground">Actual: </span>
                  <span className={currentStep.state === 'Fail' ? 'text-red-600' : ''}>
                    {currentStep.actualResult}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Footer tabs */}
      <div className="border-t">
        <Tabs defaultValue="action_log" className="w-full">
          <TabsList className="w-full justify-start rounded-none border-b bg-transparent h-auto p-0">
            <TabsTrigger value="action_log" className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-500 px-4 py-2">
              <FileText className="h-4 w-4 mr-2" />
              Action Log
            </TabsTrigger>
            <TabsTrigger value="healing" className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-500 px-4 py-2">
              <HeartPulse className="h-4 w-4 mr-2" />
              Healing Events
            </TabsTrigger>
            <TabsTrigger value="api_trace" className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-500 px-4 py-2">
              <Code className="h-4 w-4 mr-2" />
              API Trace
            </TabsTrigger>
            <TabsTrigger value="defects" className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-500 px-4 py-2">
              <Bug className="h-4 w-4 mr-2" />
              Defects
            </TabsTrigger>
            <TabsTrigger value="audit" className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-500 px-4 py-2">
              <ClipboardList className="h-4 w-4 mr-2" />
              Audit
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="action_log" className="p-4 max-h-48 overflow-auto">
            <div className="font-mono text-xs space-y-1 text-muted-foreground">
              {caseExecution.steps.map((step, idx) => (
                <div key={step.id} className="flex gap-2">
                  <span className="text-slate-500">[{String(idx + 1).padStart(2, '0')}]</span>
                  <span className={cn(
                    step.state === 'Pass' && 'text-emerald-600',
                    step.state === 'Fail' && 'text-red-600',
                    step.state === 'Healed' && 'text-amber-600'
                  )}>
                    {step.action}
                  </span>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="healing" className="p-4 max-h-48">
            <p className="page-description">No healing events recorded</p>
          </TabsContent>
          
          <TabsContent value="api_trace" className="p-4 max-h-48">
            <p className="page-description">API trace data not available</p>
          </TabsContent>
          
          <TabsContent value="defects" className="p-4 max-h-48">
            <p className="page-description">No linked defects</p>
          </TabsContent>
          
          <TabsContent value="audit" className="p-4 max-h-48">
            <p className="page-description">Audit trail loading...</p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
