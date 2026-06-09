"use client"

import * as React from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Play,
  Pencil,
  MoreHorizontal,
  Video,
  Sparkles,
  Archive,
  CheckCircle2,
  XCircle,
  Database,
  FileSignature,
  Send,
  Settings2,
  Camera,
  ExternalLink,
  Bot,
  User,
  AlertTriangle,
  Clock,
  Layers,
  RefreshCw,
  Eye,
  Bug,
  FileCode2,
  MessageSquare,
  History,
  ChevronRight,
  Copy,
  Keyboard,
  MousePointer,
  FormInput,
  SquareCheck,
  Timer,
  Variable,
  Loader2,
  Check,
} from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { StatusBadge } from '@/components/status-badge'
import { EntityCodeLink } from '@/components/entity-code-link'
import { TestCaseAuditPanel } from '@/components/test-repository/test-case-audit-panel'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { 
  MOCK_TEST_CASE_DETAIL, 
  MOCK_TEST_CASES,
  MOCK_TEST_SCENARIOS,
  type IRStep,
  type IRStepType,
} from '@/lib/mock-data'

// IR Step type icons
const irStepTypeConfig: Record<IRStepType, { icon: React.ElementType; label: string; color: string }> = {
  open_transaction: { icon: Play, label: 'Open Transaction', color: 'bg-blue-100 text-blue-700' },
  set_field: { icon: FormInput, label: 'Set Field', color: 'bg-slate-100 text-slate-700' },
  press_button: { icon: MousePointer, label: 'Press Button', color: 'bg-amber-100 text-amber-700' },
  press_enter: { icon: Keyboard, label: 'Press Enter', color: 'bg-slate-100 text-slate-600' },
  select_row: { icon: SquareCheck, label: 'Select Row', color: 'bg-purple-100 text-purple-700' },
  click_menu: { icon: MoreHorizontal, label: 'Click Menu', color: 'bg-indigo-100 text-indigo-700' },
  assert_statusbar: { icon: CheckCircle2, label: 'Assert Status Bar', color: 'bg-emerald-100 text-emerald-700' },
  assert_field: { icon: CheckCircle2, label: 'Assert Field', color: 'bg-emerald-100 text-emerald-700' },
  capture_field: { icon: Variable, label: 'Capture Field', color: 'bg-cyan-100 text-cyan-700' },
  wait: { icon: Timer, label: 'Wait', color: 'bg-slate-100 text-slate-500' },
}

// Task type icons
const taskTypeConfig: Record<string, { icon: React.ElementType; label: string; color: string }> = {
  run_transaction: { icon: Play, label: 'Run Transaction', color: 'bg-blue-100 text-blue-700' },
  verify_master_data_exists: { icon: Database, label: 'Verify Master Data', color: 'bg-slate-100 text-slate-700' },
  assert_data_state: { icon: CheckCircle2, label: 'Assert Data State', color: 'bg-emerald-100 text-emerald-700' },
  release_document: { icon: Send, label: 'Release Document', color: 'bg-amber-100 text-amber-700' },
  sign_off_scenario: { icon: FileSignature, label: 'Sign Off', color: 'bg-purple-100 text-purple-700' },
  capture_evidence: { icon: Camera, label: 'Capture Evidence', color: 'bg-pink-100 text-pink-700' },
  set_test_data: { icon: Settings2, label: 'Set Test Data', color: 'bg-indigo-100 text-indigo-700' },
  call_api: { icon: ExternalLink, label: 'Call API', color: 'bg-cyan-100 text-cyan-700' },
  propose_ir_update: { icon: Sparkles, label: 'Propose IR Update', color: 'bg-amber-100 text-amber-700' },
}

// Format duration
function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000)
  if (seconds < 60) return `${seconds}s`
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}m ${remainingSeconds}s`
}

// Format relative time
function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  return `${diffDays}d ago`
}

// IR Step Row Component
function IRStepRow({ step, isReadOnly = true }: { step: IRStep; isReadOnly?: boolean }) {
  const config = irStepTypeConfig[step.step_type]
  const StepIcon = config?.icon || Play
  
  return (
    <div className={cn(
      'flex items-start gap-4 p-4 border rounded-lg transition-colors',
      step.is_assertion && 'border-emerald-200 bg-emerald-50/30',
      !step.is_assertion && 'hover:bg-muted/30'
    )}>
      {/* Order Number */}
      <Badge variant="outline" className="font-mono text-xs shrink-0 w-8 justify-center mt-1">
        {step.order}
      </Badge>
      
      {/* Step Type Icon */}
      <div className={cn(
        'p-2 rounded-md shrink-0',
        config?.color || 'bg-slate-100 text-slate-700'
      )}>
        <StepIcon className="h-4 w-4" />
      </div>
      
      {/* Step Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">{step.description}</span>
          {step.is_assertion && (
            <Badge variant="outline" className="text-xs border-emerald-300 text-emerald-700">
              Assertion
            </Badge>
          )}
          {step.confidence && step.confidence < 100 && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="outline" className={cn(
                    'text-xs',
                    step.confidence >= 95 && 'border-emerald-300 text-emerald-700',
                    step.confidence >= 85 && step.confidence < 95 && 'border-amber-300 text-amber-700',
                    step.confidence < 85 && 'border-red-300 text-red-700'
                  )}>
                    {step.confidence}%
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>Confidence score</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        
        {/* Parameters */}
        <div className="mt-2 flex flex-wrap gap-2">
          {Object.entries(step.parameters).map(([key, value]) => (
            <code 
              key={key} 
              className="text-xs bg-muted px-2 py-1 rounded font-mono"
            >
              {key}={typeof value === 'object' ? JSON.stringify(value) : String(value)}
            </code>
          ))}
        </div>
        
        {/* Healing Hints */}
        {step.healing_hints && step.healing_hints.length > 0 && (
          <div className="mt-2 flex items-start gap-2 text-xs text-muted-foreground">
            <Sparkles className="h-3 w-3 mt-0.5 text-amber-500" />
            <span>{step.healing_hints.join(' | ')}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default function TestCaseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(true)
  const [activeTab, setActiveTab] = React.useState('overview')
  const [isGenerateIROpen, setIsGenerateIROpen] = React.useState(false)
  const [isRecordOpen, setIsRecordOpen] = React.useState(false)
  const [generateIntent, setGenerateIntent] = React.useState('')
  const [generateStatus, setGenerateStatus] = React.useState<'idle' | 'generating' | 'completed'>('idle')
  const [generateProgress, setGenerateProgress] = React.useState(0)
  const [generatedStepCount, setGeneratedStepCount] = React.useState(0)
  
  const generationStages = React.useMemo(
    () => [
      'Analyzing intent…',
      'Mapping SAP transactions…',
      'Drafting IR steps…',
      'Validating parameters…',
      'Finalizing test case…',
    ],
    []
  )
  const [generateStageIndex, setGenerateStageIndex] = React.useState(0)
  
  const handleGenerateIR = React.useCallback(() => {
    if (!generateIntent.trim() || generateStatus === 'generating') return
    setGenerateStatus('generating')
    setGenerateProgress(0)
    setGenerateStageIndex(0)
    setGeneratedStepCount(0)
    
    // Simulated generation flow — replace with real API call.
    const totalDurationMs = 4500
    const tickMs = 80
    const totalTicks = totalDurationMs / tickMs
    let tick = 0
    const interval = setInterval(() => {
      tick += 1
      const pct = Math.min(100, Math.round((tick / totalTicks) * 100))
      setGenerateProgress(pct)
      setGenerateStageIndex(
        Math.min(
          generationStages.length - 1,
          Math.floor((pct / 100) * generationStages.length)
        )
      )
      setGeneratedStepCount(Math.min(14, Math.floor((pct / 100) * 14)))
      if (pct >= 100) {
        clearInterval(interval)
        setGenerateStatus('completed')
      }
    }, tickMs)
  }, [generateIntent, generateStatus, generationStages.length])
  
  const resetGenerateDialog = React.useCallback(() => {
    setIsGenerateIROpen(false)
    // Defer reset so close animation doesn't flicker the loader
    setTimeout(() => {
      setGenerateStatus('idle')
      setGenerateIntent('')
      setGenerateProgress(0)
      setGenerateStageIndex(0)
      setGeneratedStepCount(0)
    }, 250)
  }, [])
  
  // Simulated loading
  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600)
    return () => clearTimeout(timer)
  }, [])
  
  // Use mock data
  const testCase = MOCK_TEST_CASE_DETAIL
  const typeConfig = taskTypeConfig[testCase.task_type]
  const TypeIcon = typeConfig?.icon || Play
  
  // Get scenarios that use this test case
  const usedInScenarios = MOCK_TEST_SCENARIOS.filter(s => 
    testCase.used_in_scenarios.includes(s.id)
  )
  
  if (isLoading) {
    return (
      <AppShell currentApp="test-repository">
        <div className="flex-1 p-6 space-y-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
          <Skeleton className="h-12 w-full" />
          <div className="grid gap-6 md:grid-cols-2">
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>
        </div>
      </AppShell>
    )
  }
  
  return (
    <AppShell currentApp="test-repository">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b bg-background px-6 py-4">
          {/* Breadcrumb */}
          <div className="page-breadcrumb mb-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="gap-1 -ml-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <ChevronRight className="h-4 w-4" />
            <Link href="/test-repository/tasks" className="hover:text-foreground">
              Test Cases
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground font-mono">{testCase.code}</span>
          </div>
          
          {/* Title Row */}
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className={cn(
                'p-3 rounded-lg',
                typeConfig?.color || 'bg-slate-100 text-slate-700'
              )}>
                <TypeIcon className="h-6 w-6" />
              </div>
              
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="page-title">{testCase.name}</h1>
                  <span className="text-lg font-mono text-muted-foreground">
                    {testCase.code}
                  </span>
                </div>
                
                <div className="flex items-center gap-3 mt-2">
                  {/* Task Type Badge */}
                  <Badge variant="outline" className="gap-1">
                    <TypeIcon className="h-3 w-3" />
                    {typeConfig?.label}
                  </Badge>
                  
                  {/* Criticality Dot */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className={cn('w-3 h-3 rounded-full', {
                          'bg-red-500': testCase.criticality === 'critical',
                          'bg-amber-500': testCase.criticality === 'high',
                          'bg-blue-500': testCase.criticality === 'medium',
                          'bg-slate-400': testCase.criticality === 'low',
                        })} />
                      </TooltipTrigger>
                      <TooltipContent className="capitalize">
                        {testCase.criticality} criticality
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  {/* State Badge */}
                  <StatusBadge status={testCase.state} />
                  
                  {/* Version */}
                  <Badge variant="secondary" className="font-mono text-xs">
                    v{testCase.version}
                  </Badge>
                  
                  {/* T-Code */}
                  {testCase.tcode && (
                    <Badge variant="outline" className="font-mono text-xs">
                      {testCase.tcode}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-1">
                <Pencil className="h-4 w-4" />
                Edit
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-1"
                onClick={() => setIsRecordOpen(true)}
              >
                <Video className="h-4 w-4" />
                Re-record IR
              </Button>
              
              <Button 
                variant="secondary" 
                size="sm" 
                className="gap-1"
                onClick={() => setIsGenerateIROpen(true)}
              >
                <Sparkles className="h-4 w-4" />
                Generate IR from Intent
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Export IR
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-amber-600">
                    <Archive className="h-4 w-4 mr-2" />
                    Mark Deprecated
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
          <div className="border-b px-4 sm:px-6 bg-muted/30">
            <TabsList className="h-auto bg-transparent p-0 gap-1 sm:gap-1.5 flex-wrap">
              {[
                { value: 'overview', label: 'Overview' },
                { value: 'ir-steps', label: 'IR Steps', count: testCase.ir_steps.length },
                { value: 'used-in', label: 'Used In', count: usedInScenarios.length },
                { value: 'history', label: 'Execution History' },
                { value: 'comments', label: 'Comments' },
                { value: 'audit', label: 'Audit' },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className={cn(
                    'group relative h-10 px-3.5 sm:px-4 rounded-lg gap-2 text-sm font-medium',
                    'text-muted-foreground transition-all duration-200',
                    'hover:text-foreground hover:bg-background hover:shadow-xs',
                    'data-[state=active]:bg-background data-[state=active]:text-foreground',
                    'data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-border',
                    'data-[state=active]:font-semibold',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2'
                  )}
                >
                  {tab.label}
                  {typeof tab.count === 'number' && (
                    <span
                      className={cn(
                        'inline-flex items-center justify-center rounded-full px-1.5 h-5 min-w-5 text-[10px] font-semibold tabular-nums transition-colors',
                        'bg-muted text-muted-foreground',
                        'group-data-[state=active]:bg-brand-soft group-data-[state=active]:text-brand-soft-foreground'
                      )}
                    >
                      {tab.count}
                    </span>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          
          <ScrollArea className="flex-1">
            {/* Overview Tab */}
            <TabsContent value="overview" className="p-6 m-0">
              <div className="grid gap-6 lg:grid-cols-3">
                {/* Left Column - Main Info */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Description */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="page-description whitespace-pre-line">
                        {testCase.description}
                      </p>
                    </CardContent>
                  </Card>
                  
                  {/* Assignment & Evidence */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Assignment & Evidence</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-1">
                          <p className="caption-text">Default Assignee</p>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={cn(
                              testCase.default_assignee_class === 'agent' 
                                ? 'border-primary/30 bg-primary/5 text-primary' 
                                : ''
                            )}>
                              {testCase.default_assignee_class === 'agent' ? (
                                <Bot className="h-3 w-3 mr-1" />
                              ) : (
                                <User className="h-3 w-3 mr-1" />
                              )}
                              {testCase.default_assignee_class === 'agent' ? 'Agent' : 'Human'}
                            </Badge>
                            {testCase.default_service_role && (
                              <span className="text-sm">{testCase.default_service_role}</span>
                            )}
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <p className="caption-text">Evidence Profile</p>
                          <Badge variant="outline" className={cn(
                            'text-sm',
                            testCase.evidence_profile === 'full' && 'border-emerald-300 bg-emerald-50 text-emerald-700',
                            testCase.evidence_profile === 'minimal' && 'border-slate-300 bg-slate-50'
                          )}>
                            <Camera className="h-3 w-3 mr-1" />
                            {testCase.evidence_profile}
                          </Badge>
                        </div>
                        
                        <div className="space-y-1">
                          <p className="caption-text">Retry Policy</p>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">
                              <RefreshCw className="h-3 w-3 mr-1" />
                              {testCase.retry_policy.max_attempts} attempts
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {testCase.retry_policy.backoff_ms}ms backoff
                            </span>
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <p className="caption-text">Healing</p>
                          <div className="flex items-center gap-2">
                            {testCase.healing_enabled ? (
                              <Badge variant="outline" className="border-amber-300 bg-amber-50 text-amber-700">
                                <Sparkles className="h-3 w-3 mr-1" />
                                Enabled
                              </Badge>
                            ) : (
                              <Badge variant="outline">Disabled</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Inputs Schema */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Inputs Schema</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <pre className="text-xs bg-muted p-4 rounded-lg overflow-auto font-mono">
                        {JSON.stringify(testCase.inputs_schema, null, 2)}
                      </pre>
                    </CardContent>
                  </Card>
                  
                  {/* Expected Outcome */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Expected Outcome</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{testCase.expected_outcome}</p>
                    </CardContent>
                  </Card>
                  
                  {/* BP Scope Items */}
                  {testCase.bp_scope_items.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">BP Scope Items Covered</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {testCase.bp_scope_items.map(item => (
                            <Badge key={item} variant="outline" className="font-mono">
                              {item}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
                
                {/* Right Column - Quick Stats & Tags */}
                <div className="space-y-6">
                  {/* Quick Stats */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Quick Stats</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Used in Scenarios</span>
                        <span className="font-semibold">{testCase.quick_stats.used_in_scenarios}</span>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Total Executions</span>
                        <span className="font-semibold">{testCase.quick_stats.total_executions}</span>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Last 7 Days</span>
                        <span className="font-semibold">{testCase.quick_stats.last_7_days_executions}</span>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Avg Duration</span>
                        <span className="font-semibold">{formatDuration(testCase.quick_stats.avg_duration_ms)}</span>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Last Pass Rate</span>
                        <div className="flex items-center gap-2">
                          <Progress value={testCase.last_pass_rate_pct} className="w-16 h-2" />
                          <span className="font-semibold">{testCase.last_pass_rate_pct}%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Tags */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Tags</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {testCase.tags.map(tag => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Customer Scope */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Scope</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Badge 
                        variant="outline" 
                        className={cn(
                          testCase.customer_scope === 'Global' && 'border-indigo-300 bg-indigo-50 text-indigo-700'
                        )}
                      >
                        {testCase.customer_scope}
                      </Badge>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            {/* IR Steps Tab */}
            <TabsContent value="ir-steps" className="p-6 m-0">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">IR Steps</h3>
                  <p className="page-description">
                    {testCase.ir_steps.length} steps in this test case IR
                  </p>
                </div>
                <Button className="gap-1">
                  <Pencil className="h-4 w-4" />
                  Edit IR
                </Button>
              </div>
              
              <div className="space-y-2">
                {testCase.ir_steps.map(step => (
                  <IRStepRow key={step.id} step={step} isReadOnly />
                ))}
              </div>
            </TabsContent>
            
            {/* Used In Tab */}
            <TabsContent value="used-in" className="p-4 sm:p-6 m-0">
              <div className="mb-4">
                <h3 className="text-lg font-semibold tracking-tight">Used In Scenarios</h3>
                <p className="page-description">
                  This test case is used in {usedInScenarios.length} scenarios
                </p>
              </div>
              
              <div className="rounded-xl border border-border bg-card overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-b border-border bg-muted/40">
                      <TableHead className="font-semibold text-foreground/80">Code</TableHead>
                      <TableHead className="font-semibold text-foreground/80">Name</TableHead>
                      <TableHead className="font-semibold text-foreground/80">Business Process</TableHead>
                      <TableHead className="font-semibold text-foreground/80">Last Pass Rate</TableHead>
                      <TableHead />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {usedInScenarios.map(scenario => (
                      <TableRow key={scenario.id} className="group transition-colors hover:bg-muted/40">
                        <TableCell>
                          <Link
                            href={`/test-repository/scenarios/${scenario.id}`}
                            className="inline-flex items-center gap-1.5 font-mono text-[13px] font-semibold tracking-tight text-foreground hover:text-brand transition-colors"
                          >
                            <FileCode2 className="h-3.5 w-3.5 text-muted-foreground group-hover:text-brand transition-colors" />
                            {scenario.code}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Link
                            href={`/test-repository/scenarios/${scenario.id}`}
                            className="font-medium text-foreground hover:underline underline-offset-4 decoration-brand/40"
                          >
                            {scenario.name}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-mono text-[11px]">
                            {scenario.business_process}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2.5">
                            <Progress value={scenario.last_pass_rate_pct} className="w-20 h-1.5" />
                            <span className="text-sm font-mono tabular-nums font-semibold text-foreground min-w-[2.5rem]">
                              {scenario.last_pass_rate_pct}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" asChild className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Link href={`/test-repository/scenarios/${scenario.id}`} aria-label={`View ${scenario.name}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            {/* Execution History Tab */}
            <TabsContent value="history" className="p-4 sm:p-6 m-0">
              <div className="mb-4">
                <h3 className="text-lg font-semibold tracking-tight">Execution History</h3>
                <p className="page-description">
                  Recent executions of this test case
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent border-b border-border bg-muted/40">
                        <TableHead className="font-semibold text-foreground/80">Execution ID</TableHead>
                        <TableHead className="font-semibold text-foreground/80">Suite / Scenario</TableHead>
                        <TableHead className="font-semibold text-foreground/80">Started</TableHead>
                        <TableHead className="font-semibold text-foreground/80">Duration</TableHead>
                        <TableHead className="font-semibold text-foreground/80">State</TableHead>
                        <TableHead className="font-semibold text-foreground/80">Outcome</TableHead>
                        <TableHead className="font-semibold text-foreground/80">Healing</TableHead>
                        <TableHead className="font-semibold text-foreground/80">Defect</TableHead>
                        <TableHead />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {testCase.execution_history.map(exec => (
                        <TableRow key={exec.id} className="transition-colors hover:bg-muted/40">
                          <TableCell className="font-mono text-xs font-semibold text-foreground">
                            {exec.id}
                          </TableCell>
                          <TableCell>
                            <div className="text-sm flex items-center gap-1 flex-wrap">
                              <span className="font-mono text-xs text-muted-foreground">
                                {exec.suite_context}
                              </span>
                              <span className="text-muted-foreground/60">/</span>
                              <span className="font-mono text-xs text-foreground">
                                {exec.scenario_context}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger className="text-sm text-foreground">
                                  {formatRelativeTime(exec.started_at)}
                                </TooltipTrigger>
                                <TooltipContent>
                                  {new Date(exec.started_at).toLocaleString()}
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </TableCell>
                          <TableCell className="text-sm font-mono tabular-nums text-foreground">
                            {formatDuration(exec.duration_ms)}
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={exec.state} />
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-foreground/90 truncate max-w-[220px] block">
                              {exec.outcome_message}
                            </span>
                          </TableCell>
                          <TableCell>
                            {exec.healing_events > 0 ? (
                              <span className="pill pill-brand">
                                <Sparkles className="h-3 w-3" />
                                {exec.healing_events}
                              </span>
                            ) : (
                              <span className="text-xs text-muted-foreground">—</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {exec.defect_id ? (
                              <Link
                                href={`/defect-manager/${exec.defect_id}`}
                                className="text-sm font-mono font-semibold text-destructive hover:underline"
                              >
                                {exec.defect_id}
                              </Link>
                            ) : (
                              <span className="text-xs text-muted-foreground">—</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" className="gap-1 text-foreground hover:text-brand">
                              <Eye className="h-4 w-4" />
                              Replay
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>
            
            {/* Comments Tab */}
            <TabsContent value="comments" className="p-4 sm:p-6 m-0">
              <div className="max-w-3xl">
                <div className="section-card">
                  <div className="px-4 sm:px-5 py-4 border-b border-border">
                    <h3 className="text-base font-semibold tracking-tight">Comments</h3>
                    <p className="caption-text mt-0.5">
                      Discussion about this test case
                    </p>
                  </div>
                  <div className="p-4 sm:p-5">
                    <ul className="space-y-4">
                      <li className="flex gap-3">
                        <Avatar className="h-9 w-9 shrink-0 ring-1 ring-border">
                          <AvatarFallback className="bg-muted text-foreground text-xs font-semibold">
                            PS
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                            <span className="font-semibold text-sm text-foreground">P.Sharma</span>
                            <span className="text-[11px] text-muted-foreground">2 days ago</span>
                          </div>
                          <div className="mt-1.5 rounded-lg border border-border bg-muted/40 px-3 py-2.5">
                            <p className="text-sm text-foreground leading-relaxed">
                              Updated the VA01 IR steps to handle the new S/4HANA field IDs. The MATNR field selector has changed.
                            </p>
                          </div>
                        </div>
                      </li>

                      <li className="flex gap-3">
                        <Avatar className="h-9 w-9 shrink-0 ring-1 ring-brand/30">
                          <AvatarFallback className="bg-brand text-brand-foreground text-xs font-semibold">
                            <Sparkles className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                            <span className="font-semibold text-sm text-foreground">Voltus AI</span>
                            <span className="pill pill-brand text-[10px] px-1.5 py-0">AI</span>
                            <span className="text-[11px] text-muted-foreground">1 day ago</span>
                          </div>
                          <div className="mt-1.5 rounded-lg border border-brand/20 bg-brand-soft/40 px-3 py-2.5">
                            <p className="text-sm text-foreground leading-relaxed">
                              Auto-healed step 8: Updated field selector from{' '}
                              <code className="font-mono text-[12px] px-1 py-0.5 rounded bg-card text-foreground border border-border">
                                #MATERIAL
                              </code>{' '}
                              to{' '}
                              <code className="font-mono text-[12px] px-1 py-0.5 rounded bg-card text-foreground border border-border">
                                #MATNR
                              </code>
                              . Confidence:{' '}
                              <span className="font-mono tabular-nums font-semibold text-brand">92%</span>.
                            </p>
                          </div>
                        </div>
                      </li>
                    </ul>

                    <div className="mt-6 pt-5 border-t border-border">
                      <Label
                        htmlFor="new-comment"
                        className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block"
                      >
                        Add a comment
                      </Label>
                      <Textarea
                        id="new-comment"
                        placeholder="Share an update, link a defect, or mention a teammate…"
                        className="min-h-[90px] text-sm resize-none focus-visible:ring-brand/40"
                      />
                      <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-2 mt-3">
                        <p className="page-description text-[11px]">
                          Markdown supported. Use <code className="font-mono">@</code> to mention a user.
                        </p>
                        <Button size="sm" className="gap-1.5 bg-brand text-brand-foreground hover:bg-brand/90 self-end sm:self-auto">
                          Post Comment
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Audit Tab */}
            <TabsContent value="audit" className="p-6 m-0 overflow-auto">
              <TestCaseAuditPanel
                testCaseId={testCase.id}
                testCaseCode={testCase.code}
                testCaseName={testCase.name}
              />
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </div>
      
      {/* Generate IR from Intent Dialog */}
      <Dialog
        open={isGenerateIROpen}
        onOpenChange={(open) => {
          if (!open) resetGenerateDialog()
          else setIsGenerateIROpen(true)
        }}
      >
        <DialogContent className="max-w-lg p-0 overflow-hidden gap-0">
          {/* Decorative gradient header */}
          <div className="relative px-6 pt-6 pb-5 border-b border-border bg-gradient-to-br from-brand-soft/60 via-background to-background">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-brand-foreground shadow-sm shrink-0">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <DialogHeader className="space-y-1">
                  <DialogTitle className="text-base font-semibold tracking-tight">
                    {generateStatus === 'completed'
                      ? 'IR Steps Generated'
                      : generateStatus === 'generating'
                      ? 'Generating IR Steps…'
                      : 'Generate IR from Intent'}
                  </DialogTitle>
                  <DialogDescription className="text-xs leading-relaxed">
                    {generateStatus === 'completed'
                      ? `${generatedStepCount} steps ready for review. You can edit them before saving.`
                      : generateStatus === 'generating'
                      ? 'Voltus AI Agent is drafting your IR steps. This usually takes a few seconds.'
                      : 'Describe what you want this test case to do and Voltus AI will generate the IR steps.'}
                  </DialogDescription>
                </DialogHeader>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-5 space-y-4">
            {generateStatus === 'idle' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="generate-intent" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Test intent
                  </Label>
                  <Textarea
                    id="generate-intent"
                    placeholder="e.g., Create a sales order with order type OR for customer 1000234, add two line items with materials FG-001234 and FG-001235, quantity 100 each, then save and capture the order number"
                    value={generateIntent}
                    onChange={(e) => setGenerateIntent(e.target.value)}
                    className="min-h-[140px] text-sm resize-none focus-visible:ring-brand/40"
                  />
                  <p className="page-description text-[11px]">
                    Tip: be specific about transaction codes, field values, and expected outcomes.
                  </p>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-lg border border-border bg-muted/40">
                  <Sparkles className="h-4 w-4 text-brand mt-0.5 shrink-0" />
                  <p className="caption-text">
                    Voltus AI Agent will generate the IR steps based on your description. You can review and edit the generated steps before saving.
                  </p>
                </div>
              </>
            )}

            {generateStatus === 'generating' && (
              <div className="space-y-4">
                {/* Live progress */}
                <div className="rounded-xl border border-border bg-card p-4">
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 text-brand animate-spin" />
                      <span className="text-sm font-medium text-foreground">
                        {generationStages[generateStageIndex]}
                      </span>
                    </div>
                    <span className="text-sm font-mono tabular-nums font-semibold text-brand">
                      {generateProgress}%
                    </span>
                  </div>
                  <Progress value={generateProgress} className="h-1.5" />
                  <div className="flex items-center justify-between mt-3 text-[11px] text-muted-foreground">
                    <span>Drafted <span className="font-mono tabular-nums font-semibold text-foreground">{generatedStepCount}</span> steps</span>
                    <span>ETA · a few seconds</span>
                  </div>
                </div>

                {/* Stage checklist */}
                <ul className="space-y-1.5">
                  {generationStages.map((stage, idx) => {
                    const isDone = idx < generateStageIndex
                    const isActive = idx === generateStageIndex
                    return (
                      <li
                        key={stage}
                        className={cn(
                          'flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-colors',
                          isActive && 'bg-brand-soft/50 text-brand-soft-foreground',
                          isDone && 'text-muted-foreground',
                          !isActive && !isDone && 'text-muted-foreground/60'
                        )}
                      >
                        {isDone ? (
                          <Check className="h-3.5 w-3.5 text-success shrink-0" />
                        ) : isActive ? (
                          <Loader2 className="h-3.5 w-3.5 text-brand animate-spin shrink-0" />
                        ) : (
                          <div className="h-3.5 w-3.5 rounded-full border border-current shrink-0 opacity-50" />
                        )}
                        <span className={cn('font-medium', isDone && 'line-through opacity-70')}>{stage}</span>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}

            {generateStatus === 'completed' && (
              <div className="space-y-3">
                <div className="rounded-xl border border-success/30 bg-success-soft/40 p-4">
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-success text-success-foreground">
                      <Check className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-sm font-semibold text-success-soft-foreground">
                      Generation complete
                    </span>
                  </div>
                  <p className="text-xs text-success-soft-foreground/80 leading-relaxed pl-8.5">
                    Voltus AI produced <span className="font-mono tabular-nums font-semibold">{generatedStepCount}</span> IR steps based on your intent. Review and edit before publishing.
                  </p>
                </div>
                <div className="flex items-start gap-2.5 p-3 rounded-lg border border-border bg-muted/40">
                  <Sparkles className="h-4 w-4 text-brand mt-0.5 shrink-0" />
                  <p className="caption-text">
                    Generated steps appear under the <span className="font-medium text-foreground">IR Steps</span> tab. Re-run generation any time by re-opening this dialog.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <DialogFooter className="px-6 py-4 border-t border-border bg-muted/30 gap-2 sm:gap-2">
            {generateStatus === 'idle' && (
              <>
                <Button variant="outline" onClick={resetGenerateDialog}>
                  Cancel
                </Button>
                <Button
                  className="gap-1.5 bg-brand text-brand-foreground hover:bg-brand/90"
                  disabled={!generateIntent.trim()}
                  onClick={handleGenerateIR}
                >
                  <Sparkles className="h-4 w-4" />
                  Generate IR
                </Button>
              </>
            )}
            {generateStatus === 'generating' && (
              <Button variant="outline" disabled className="gap-1.5 cursor-not-allowed">
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating…
              </Button>
            )}
            {generateStatus === 'completed' && (
              <>
                <Button variant="outline" onClick={() => {
                  setGenerateStatus('idle')
                  setGenerateProgress(0)
                  setGenerateStageIndex(0)
                  setGeneratedStepCount(0)
                }}>
                  Generate Again
                </Button>
                <Button
                  className="gap-1.5 bg-brand text-brand-foreground hover:bg-brand/90"
                  onClick={() => {
                    setActiveTab('ir-steps')
                    resetGenerateDialog()
                  }}
                >
                  <Check className="h-4 w-4" />
                  Review Steps
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Re-record IR Dialog */}
      <Dialog open={isRecordOpen} onOpenChange={setIsRecordOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              Re-record IR
            </DialogTitle>
            <DialogDescription>
              Start a new recording session to replace the current IR steps.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="flex items-start gap-3 p-4 border border-amber-200 bg-amber-50 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
              <div>
                <p className="text-sm font-medium text-amber-800">
                  This will replace existing IR
                </p>
                <p className="text-xs text-amber-700 mt-1">
                  The current {testCase.ir_steps.length} IR steps will be replaced with the new recording.
                </p>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRecordOpen(false)}>
              Cancel
            </Button>
            <Button className="gap-1">
              <Video className="h-4 w-4" />
              Start Recording
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  )
}
