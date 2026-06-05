'use client'

import * as React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { 
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  CheckCircle2,
  Circle,
  Clock,
  AlertTriangle,
  Users,
  Bot,
  Copy,
  ExternalLink,
  Edit,
  History,
} from 'lucide-react'

import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

// Sample runbook data
const SAMPLE_RUNBOOK = {
  id: 'rb_1',
  title: 'Star Cement Month-End Close Runbook',
  description: 'Step-by-step guide for executing month-end closing activities in S/4HANA.',
  version: 'v2.1',
  author: 'P.Sharma',
  created_at: '2026-02-15T10:00:00+05:30',
  updated_at: '2026-05-01T14:30:00+05:30',
  estimated_duration: '4 hours',
  tags: ['month-end', 'finance', 'closing'],
  steps: [
    {
      id: 's1',
      title: 'Pre-Close Validation',
      description: 'Verify all prerequisite conditions are met before starting close.',
      assignee_class: 'human',
      estimated_mins: 30,
      status: 'completed',
      substeps: [
        { id: 's1.1', title: 'Check open purchase orders', status: 'completed' },
        { id: 's1.2', title: 'Verify pending goods receipts', status: 'completed' },
        { id: 's1.3', title: 'Confirm billing documents posted', status: 'completed' },
      ],
    },
    {
      id: 's2',
      title: 'Execute Material Ledger Close',
      description: 'Run material ledger closing for all company codes.',
      assignee_class: 'agent',
      transaction: 'CKMLCP',
      estimated_mins: 45,
      status: 'in_progress',
      substeps: [
        { id: 's2.1', title: 'Run CKMLCP for plant 1000', status: 'completed' },
        { id: 's2.2', title: 'Run CKMLCP for plant 2000', status: 'in_progress' },
        { id: 's2.3', title: 'Verify ML documents created', status: 'pending' },
      ],
    },
    {
      id: 's3',
      title: 'Post Depreciation Run',
      description: 'Execute asset depreciation posting for the period.',
      assignee_class: 'agent',
      transaction: 'AFAB',
      estimated_mins: 30,
      status: 'pending',
    },
    {
      id: 's4',
      title: 'Execute FI Period Close',
      description: 'Close FI posting periods and run balance carryforward.',
      assignee_class: 'human',
      transaction: 'OB52',
      estimated_mins: 20,
      status: 'pending',
    },
    {
      id: 's5',
      title: 'Generate Financial Reports',
      description: 'Generate P&L and Balance Sheet reports for review.',
      assignee_class: 'agent',
      estimated_mins: 15,
      status: 'pending',
    },
    {
      id: 's6',
      title: 'Management Sign-Off',
      description: 'Obtain sign-off from Finance Manager on closing results.',
      assignee_class: 'human',
      estimated_mins: 60,
      status: 'pending',
    },
  ],
}

export default function RunbookDetailPage() {
  const params = useParams()
  const [isExecuting, setIsExecuting] = React.useState(false)
  
  const runbook = SAMPLE_RUNBOOK
  
  const completedSteps = runbook.steps.filter(s => s.status === 'completed').length
  const progress = (completedSteps / runbook.steps.length) * 100
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="h-5 w-5 text-emerald-500" />
      case 'in_progress': return <Clock className="h-5 w-5 text-blue-500 animate-pulse" />
      case 'failed': return <AlertTriangle className="h-5 w-5 text-rose-500" />
      default: return <Circle className="h-5 w-5 text-muted-foreground" />
    }
  }
  
  return (
    <AppShell currentApp="knowledge-center">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="p-4 md:p-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
              <Link href="/knowledge-center/org" className="hover:text-foreground">Org KB</Link>
              <ChevronRight className="h-4 w-4" />
              <Link href="/knowledge-center/org" className="hover:text-foreground">Runbooks</Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground truncate">{runbook.title}</span>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <Link href="/knowledge-center/org">
                  <Button variant="ghost" size="icon" className="shrink-0">
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </Link>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="page-title">{runbook.title}</h1>
                    <Badge variant="outline">{runbook.version}</Badge>
                  </div>
                  <p className="page-description mt-1">{runbook.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Est. {runbook.estimated_duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {runbook.author}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <History className="h-4 w-4" />
                  History
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
                {isExecuting ? (
                  <Button size="sm" variant="destructive" className="gap-2" onClick={() => setIsExecuting(false)}>
                    <Pause className="h-4 w-4" />
                    Pause
                  </Button>
                ) : (
                  <Button size="sm" className="gap-2" onClick={() => setIsExecuting(true)}>
                    <Play className="h-4 w-4" />
                    Execute
                  </Button>
                )}
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">{completedSteps} of {runbook.steps.length} steps completed</span>
                <span className="font-medium">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-auto p-4 md:p-6">
          <div className="max-w-3xl mx-auto space-y-4">
            {runbook.steps.map((step, index) => (
              <Card 
                key={step.id}
                className={cn(
                  'transition-all',
                  step.status === 'in_progress' && 'border-blue-500 bg-blue-500/5',
                  step.status === 'completed' && 'opacity-75'
                )}
              >
                <CardContent>
                  <div className="flex items-start gap-4">
                    {/* Step Number & Status */}
                    <div className="flex flex-col items-center gap-2">
                      <div className={cn(
                        'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                        step.status === 'completed' && 'bg-emerald-500 text-white',
                        step.status === 'in_progress' && 'bg-blue-500 text-white',
                        step.status === 'pending' && 'bg-muted text-muted-foreground'
                      )}>
                        {index + 1}
                      </div>
                      {index < runbook.steps.length - 1 && (
                        <div className={cn(
                          'w-0.5 h-8',
                          step.status === 'completed' ? 'bg-emerald-500' : 'bg-border'
                        )} />
                      )}
                    </div>
                    
                    {/* Step Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{step.title}</h3>
                            {step.assignee_class === 'agent' ? (
                              <Badge variant="outline" className="gap-1 text-xs">
                                <Bot className="h-3 w-3" />
                                Agent
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="gap-1 text-xs">
                                <Users className="h-3 w-3" />
                                Human
                              </Badge>
                            )}
                          </div>
                          <p className="page-description mt-1">{step.description}</p>
                        </div>
                        {getStatusIcon(step.status)}
                      </div>
                      
                      {/* Transaction Code */}
                      {step.transaction && (
                        <div className="mt-2">
                          <Badge variant="secondary" className="font-mono">
                            T-Code: {step.transaction}
                          </Badge>
                        </div>
                      )}
                      
                      {/* Substeps */}
                      {step.substeps && step.substeps.length > 0 && (
                        <div className="mt-3 pl-4 border-l-2 border-muted space-y-2">
                          {step.substeps.map(substep => (
                            <div key={substep.id} className="flex items-center gap-2 text-sm">
                              {substep.status === 'completed' ? (
                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                              ) : substep.status === 'in_progress' ? (
                                <Clock className="h-4 w-4 text-blue-500" />
                              ) : (
                                <Circle className="h-4 w-4 text-muted-foreground" />
                              )}
                              <span className={cn(
                                substep.status === 'completed' && 'text-muted-foreground line-through'
                              )}>
                                {substep.title}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* Estimated Time */}
                      <div className="mt-3 text-xs text-muted-foreground">
                        Estimated: {step.estimated_mins} minutes
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  )
}
