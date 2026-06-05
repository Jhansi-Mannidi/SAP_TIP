'use client'

import * as React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { 
  Play, 
  Pause,
  RefreshCw,
  Clock,
  CheckCircle2,
  XCircle,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  SkipForward,
  SkipBack,
  Monitor,
  Image as ImageIcon,
  Terminal,
  Zap,
  Bug,
  History,
  AlertTriangle,
  Navigation,
  MousePointer,
  Type,
  List,
  Eye,
  Server,
  Bot,
} from 'lucide-react'

import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Slider } from '@/components/ui/slider'
import { Separator } from '@/components/ui/separator'
import { AgentTaskIndicator } from '@/components/agent-task-indicator'
import { cn } from '@/lib/utils'

import { 
  MOCK_REPLAY_STEPS, 
  MOCK_STATUS_BAR, 
  MOCK_ACTION_LOG,
  MOCK_RUN_HEALINGS,
  type ReplayStep 
} from '@/lib/execution-mock-data'

const STEP_TYPE_ICONS: Record<string, React.ElementType> = {
  navigate: Navigation,
  click: MousePointer,
  input: Type,
  select: List,
  assert: CheckCircle2,
  wait: Clock,
  scroll: ChevronDown,
  screenshot: ImageIcon,
  api_call: Server,
}

function getStepStateColor(state: string) {
  switch (state) {
    case 'passed': return 'text-emerald-500 bg-emerald-500'
    case 'healed': return 'text-amber-500 bg-amber-500'
    case 'failed': return 'text-red-500 bg-red-500'
    default: return 'text-muted-foreground bg-muted-foreground'
  }
}

export default function ReplaySurfacePage() {
  const params = useParams()
  const runId = params.id as string
  const caseId = params.caseId as string

  const steps = MOCK_REPLAY_STEPS
  const statusBar = MOCK_STATUS_BAR
  const actionLog = MOCK_ACTION_LOG
  const healings = MOCK_RUN_HEALINGS.slice(0, 1) // Just the first healing for this case

  const [currentStep, setCurrentStep] = React.useState(0)
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [viewMode, setViewMode] = React.useState<'video' | 'screenshots'>('screenshots')

  const currentStepData = steps[currentStep]

  // Playback effect
  React.useEffect(() => {
    if (!isPlaying) return
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= steps.length - 1) {
          setIsPlaying(false)
          return prev
        }
        return prev + 1
      })
    }, 1500)
    return () => clearInterval(interval)
  }, [isPlaying, steps.length])

  const getStatusTypeColor = (type: string) => {
    switch (type) {
      case 'S': return 'text-emerald-500'
      case 'W': return 'text-amber-500'
      case 'E': return 'text-red-500'
      case 'A': return 'text-blue-500'
      default: return 'text-muted-foreground'
    }
  }

  return (
    <AppShell currentApp="execution-console">
      <div className="flex flex-col h-full bg-zinc-950">
        {/* Header Strip */}
        <div className="border-b border-zinc-800 bg-zinc-900 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <Link href={`/execution-console/runs/${runId}`} className="hover:text-zinc-200">
                  <ChevronLeft className="h-4 w-4" />
                </Link>
                <span>Run Detail</span>
                <ChevronRight className="h-4 w-4" />
                <span className="text-zinc-200">Case Replay</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-200">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          </div>

          {/* Case Info */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-3">
              <h1 className="page-title text-zinc-100">Create Sales Order via VA01</h1>
              <Badge variant="outline" className="border-zinc-700 text-zinc-300">VA01_CREATE</Badge>
              <Badge className="bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Sparkles className="h-3 w-3 mr-1" />
                Healed
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-zinc-400">
              <AgentTaskIndicator agentName="Executor Agent" status="completed" size="sm" />
              <code className="text-xs bg-zinc-800 px-2 py-0.5 rounded">runner_1</code>
              <span>09:00:01 - 09:03:38</span>
              <span>3m 37s</span>
              <span>Retry: 0</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left: Video/Screenshot Area */}
          <div className="flex-1 flex flex-col lg:w-2/3">
            {/* View Mode Toggle */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-900">
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'video' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('video')}
                  className={viewMode === 'video' ? 'bg-zinc-700' : 'text-zinc-400 hover:text-zinc-200'}
                >
                  <Monitor className="h-4 w-4 mr-1" />
                  Video
                </Button>
                <Button
                  variant={viewMode === 'screenshots' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('screenshots')}
                  className={viewMode === 'screenshots' ? 'bg-zinc-700' : 'text-zinc-400 hover:text-zinc-200'}
                >
                  <ImageIcon className="h-4 w-4 mr-1" />
                  Screenshots
                </Button>
              </div>
              <span className="text-sm text-zinc-400">
                Step {currentStep + 1} of {steps.length}
              </span>
            </div>

            {/* Screenshot/Video Display */}
            <div className="flex-1 flex items-center justify-center p-4 bg-zinc-950">
              <div className="w-full max-w-3xl aspect-video bg-zinc-900 rounded-lg border border-zinc-800 flex items-center justify-center relative">
                <div className="text-center">
                  <div className="text-6xl font-bold text-zinc-700 mb-2">VA01</div>
                  <div className="text-zinc-500">
                    {currentStepData?.description || 'Loading...'}
                  </div>
                  <div className="text-sm text-zinc-600 mt-2">
                    Step {currentStep + 1} of {steps.length}
                  </div>
                </div>
                {/* Healing indicator */}
                {currentStepData?.healing_event && (
                  <div className="absolute top-4 right-4 bg-amber-500/20 border border-amber-500/30 rounded-lg px-3 py-2">
                    <div className="flex items-center gap-2 text-amber-400">
                      <Sparkles className="h-4 w-4" />
                      <span className="text-sm font-medium">Healing Applied</span>
                    </div>
                    <p className="text-xs text-amber-300/70 mt-1">
                      {currentStepData.healing_event.repair_strategy} ({Math.round(currentStepData.healing_event.confidence * 100)}% confidence)
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Playback Controls */}
            <div className="px-4 py-3 border-t border-zinc-800 bg-zinc-900">
              {/* Timeline */}
              <div className="mb-3">
                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden flex">
                  {steps.map((step, idx) => {
                    const stateColor = getStepStateColor(step.state)
                    return (
                      <div
                        key={idx}
                        className={cn(
                          "h-full cursor-pointer transition-opacity hover:opacity-80",
                          idx <= currentStep ? stateColor.split(' ')[1] : 'bg-zinc-700',
                          step.healing_event && "ring-2 ring-amber-500"
                        )}
                        style={{ width: `${100 / steps.length}%` }}
                        onClick={() => setCurrentStep(idx)}
                      />
                    )
                  })}
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCurrentStep(0)}
                  className="text-zinc-400 hover:text-zinc-200"
                >
                  <SkipBack className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                  className="text-zinc-400 hover:text-zinc-200"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="h-10 w-10 bg-zinc-700 hover:bg-zinc-600"
                >
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                  className="text-zinc-400 hover:text-zinc-200"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCurrentStep(steps.length - 1)}
                  className="text-zinc-400 hover:text-zinc-200"
                >
                  <SkipForward className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Status Bar History */}
            <div className="h-32 border-t border-zinc-800 bg-zinc-900 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-2 font-mono text-xs space-y-0.5">
                  {statusBar.slice(0, currentStep + 3).map((entry, idx) => (
                    <div key={idx} className="flex gap-2">
                      <span className="text-zinc-500">[{entry.timestamp}]</span>
                      <span className={cn("font-medium", getStatusTypeColor(entry.type))}>
                        [{entry.type}]
                      </span>
                      <span className="text-zinc-300">{entry.message}</span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>

          {/* Right: Steps Panel */}
          <div className="w-80 lg:w-96 border-l border-zinc-800 flex flex-col bg-zinc-900">
            {/* Steps List */}
            <div className="flex-1 overflow-auto">
              <div className="p-2 space-y-1">
                {steps.map((step, idx) => {
                  const StepIcon = STEP_TYPE_ICONS[step.step_type] || Terminal
                  const stateColor = getStepStateColor(step.state)
                  const isActive = idx === currentStep

                  return (
                    <div
                      key={idx}
                      className={cn(
                        "flex items-start gap-2 p-2 rounded cursor-pointer transition-colors",
                        isActive ? "bg-zinc-800 ring-1 ring-zinc-700" : "hover:bg-zinc-800/50"
                      )}
                      onClick={() => setCurrentStep(idx)}
                    >
                      <div className={cn(
                        "w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                        step.state === 'passed' && "bg-emerald-500/20",
                        step.state === 'healed' && "bg-amber-500/20",
                        step.state === 'failed' && "bg-red-500/20",
                        step.state === 'pending' && "bg-zinc-700"
                      )}>
                        <span className={cn("text-xs font-medium", stateColor.split(' ')[0])}>
                          {step.order}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <StepIcon className="h-3.5 w-3.5 text-zinc-400" />
                          <span className="text-xs text-zinc-400">{step.step_type}</span>
                          {step.healing_event && (
                            <Sparkles className="h-3 w-3 text-amber-500" />
                          )}
                        </div>
                        <p className="text-sm text-zinc-200 truncate">{step.description}</p>
                        <p className="text-xs text-zinc-500">{step.duration_ms}ms</p>
                      </div>
                      <div className={cn(
                        "w-2 h-2 rounded-full shrink-0 mt-2",
                        stateColor.split(' ')[1]
                      )} />
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Tabs */}
        <div className="border-t border-zinc-800">
          <Tabs defaultValue="action-log" className="bg-zinc-900">
            <TabsList className="w-full justify-start rounded-none border-b border-zinc-800 bg-transparent h-10 px-2">
              <TabsTrigger value="action-log" className="data-[state=active]:bg-zinc-800 rounded text-zinc-400 data-[state=active]:text-zinc-200">
                <Terminal className="h-4 w-4 mr-1" />
                Action Log
              </TabsTrigger>
              <TabsTrigger value="healings" className="data-[state=active]:bg-zinc-800 rounded text-zinc-400 data-[state=active]:text-zinc-200">
                <Sparkles className="h-4 w-4 mr-1" />
                Healing Events
                {healings.length > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 px-1.5 bg-amber-500/20 text-amber-400">
                    {healings.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="api-trace" className="data-[state=active]:bg-zinc-800 rounded text-zinc-400 data-[state=active]:text-zinc-200">
                <Server className="h-4 w-4 mr-1" />
                API Trace
              </TabsTrigger>
              <TabsTrigger value="defects" className="data-[state=active]:bg-zinc-800 rounded text-zinc-400 data-[state=active]:text-zinc-200">
                <Bug className="h-4 w-4 mr-1" />
                Defects
              </TabsTrigger>
              <TabsTrigger value="audit" className="data-[state=active]:bg-zinc-800 rounded text-zinc-400 data-[state=active]:text-zinc-200">
                <History className="h-4 w-4 mr-1" />
                Audit
              </TabsTrigger>
            </TabsList>

            <TabsContent value="action-log" className="h-48 overflow-auto mt-0">
              <div className="p-2 font-mono text-xs space-y-0.5">
                {actionLog.map((entry, idx) => (
                  <div key={idx} className="flex gap-2">
                    <span className="text-zinc-500 w-24 shrink-0">{entry.timestamp}</span>
                    <span className="text-blue-400">{entry.action}</span>
                    <span className="text-zinc-400">(</span>
                    <span className="text-amber-400">{entry.arguments.join(', ')}</span>
                    <span className="text-zinc-400">)</span>
                    {entry.result && (
                      <>
                        <span className="text-zinc-500">=&gt;</span>
                        <span className={entry.result.includes('healed') ? 'text-amber-400' : 'text-emerald-400'}>
                          {entry.result}
                        </span>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="healings" className="h-48 overflow-auto mt-0 p-4">
              {healings.length > 0 ? (
                <div className="space-y-3">
                  {healings.map((healing) => (
                    <Card key={healing.id} className="bg-zinc-800 border-zinc-700">
                      <CardContent>
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                                {healing.failure_class}
                              </Badge>
                              <Badge variant="outline" className="border-zinc-600 text-zinc-300">
                                {healing.repair_strategy}
                              </Badge>
                            </div>
                            <p className="text-sm text-zinc-300 mt-2">
                              Confidence: {Math.round(healing.confidence * 100)}%
                            </p>
                            <p className="text-xs text-zinc-500 mt-1">
                              {healing.outcome}
                            </p>
                          </div>
                          <AgentTaskIndicator agentName={healing.agent.name} status="completed" size="sm" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-zinc-500 text-center py-8">No healing events for this case</p>
              )}
            </TabsContent>

            <TabsContent value="api-trace" className="h-48 overflow-auto mt-0 p-4">
              <p className="text-zinc-500 text-center py-8">No API trace for GUI-mode cases</p>
            </TabsContent>

            <TabsContent value="defects" className="h-48 overflow-auto mt-0 p-4">
              <p className="text-zinc-500 text-center py-8">No defects linked to this case</p>
            </TabsContent>

            <TabsContent value="audit" className="h-48 overflow-auto mt-0 p-4">
              <p className="text-zinc-500 text-center py-8">Audit trail will be shown here</p>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppShell>
  )
}
