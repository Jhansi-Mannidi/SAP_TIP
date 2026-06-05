'use client'

import * as React from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { 
  ArrowLeft,
  FileCode2,
  ClipboardCheck,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Play,
  ChevronRight,
  Plus,
  Minus,
  Edit3,
  RotateCcw,
  AlertCircle,
  TrendingUp,
  Sparkles,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { AgentTaskIndicator } from '@/components/agent-task-indicator'

// Sample promotion detail with diff data
const SAMPLE_PROMOTION = {
  id: 'hp_6',
  title: 'Add close_modal step before set_field RM06E-ZTERM',
  target_ir: { 
    id: 'ir_otc_vendor_quote', 
    name: 'OTC_VENDOR_CREATE_VENDOR_QUOTE', 
    version: 'v4.2.0',
    next_version: 'v4.3.0'
  },
  failure_class: 'extra_modal',
  occurrence_count: 7,
  occurrence_window_days: 14,
  total_runs: 14,
  repair_strategy: 'add_step',
  repair_description: 'Add close_modal step to dismiss vendor terms confirmation dialog that appears intermittently when setting payment terms field.',
  confidence: 'high' as const,
  confidence_score: 88,
  impacted_test_cases: 12,
  impacted_scenarios: 4,
  originating_suite: 'Star Cement Cutover Validation Suite',
  proposed_at: '2026-05-06T14:30:00+05:30',
  proposed_by: 'agent' as const,
  last_occurrence: '2026-05-07T08:15:00+05:30',
  
  // Diff data
  current_step: {
    order: 8,
    step_type: 'set_field',
    description: 'Set Payment Terms to Z001',
    parameters: {
      field: 'RM06E-ZTERM',
      value: 'Z001',
      label: 'Payment Terms',
    },
    healing_hints: ['Payment terms field may trigger validation'],
  },
  proposed_changes: {
    type: 'insert_before' as const,
    new_step: {
      order: 8,
      step_type: 'close_modal',
      description: 'Dismiss vendor terms confirmation dialog if present',
      parameters: {
        modal_type: 'confirmation',
        button: 'Continue',
        wait_ms: 500,
        optional: true,
      },
      healing_hints: ['Modal appears intermittently after S/4 2025 FPS01', 'Safe to skip if not present'],
    },
    modified_step: {
      order: 9, // Reordered
      step_type: 'set_field',
      description: 'Set Payment Terms to Z001',
      parameters: {
        field: 'RM06E-ZTERM',
        value: 'Z001',
        label: 'Payment Terms',
      },
      healing_hints: ['Payment terms field may trigger validation'],
    },
  },
  
  // Originating failures
  originating_failures: [
    { id: 'hf_1', execution_id: 'exec_101', occurred_at: '2026-05-07T08:15:00+05:30', test_case: 'TC_OTC_001', step_number: 8, error_message: 'Unexpected modal dialog blocked field access' },
    { id: 'hf_2', execution_id: 'exec_098', occurred_at: '2026-05-06T16:30:00+05:30', test_case: 'TC_OTC_003', step_number: 8, error_message: 'Unexpected modal dialog blocked field access' },
    { id: 'hf_3', execution_id: 'exec_095', occurred_at: '2026-05-06T10:45:00+05:30', test_case: 'TC_OTC_001', step_number: 8, error_message: 'Unexpected modal dialog blocked field access' },
    { id: 'hf_4', execution_id: 'exec_092', occurred_at: '2026-05-05T14:20:00+05:30', test_case: 'TC_OTC_005', step_number: 8, error_message: 'Unexpected modal dialog blocked field access' },
    { id: 'hf_5', execution_id: 'exec_089', occurred_at: '2026-05-05T09:00:00+05:30', test_case: 'TC_OTC_002', step_number: 8, error_message: 'Unexpected modal dialog blocked field access' },
    { id: 'hf_6', execution_id: 'exec_085', occurred_at: '2026-05-04T15:30:00+05:30', test_case: 'TC_OTC_001', step_number: 8, error_message: 'Unexpected modal dialog blocked field access' },
    { id: 'hf_7', execution_id: 'exec_082', occurred_at: '2026-05-04T11:15:00+05:30', test_case: 'TC_OTC_004', step_number: 8, error_message: 'Unexpected modal dialog blocked field access' },
  ],
  
  // Success rate of this repair
  repair_success_rate: {
    total_applied: 7,
    successful: 7,
    failed: 0,
    rate: 100,
  },
  
  // Affected test cases
  affected_cases: [
    { id: 'tc_1', code: 'TC_OTC_001', name: 'Create Standard Vendor Quote', scenario: 'OTC Happy Path Domestic', last_run_status: 'failed' },
    { id: 'tc_2', code: 'TC_OTC_002', name: 'Create Vendor Quote with Discount', scenario: 'OTC Happy Path Domestic', last_run_status: 'failed' },
    { id: 'tc_3', code: 'TC_OTC_003', name: 'Create Vendor Quote with Credit Check', scenario: 'OTC with Credit Hold', last_run_status: 'failed' },
    { id: 'tc_4', code: 'TC_OTC_004', name: 'Create Vendor Quote International', scenario: 'OTC Export with LC', last_run_status: 'passed' },
    { id: 'tc_5', code: 'TC_OTC_005', name: 'Create Vendor Quote Rush Order', scenario: 'OTC Happy Path Domestic', last_run_status: 'failed' },
    { id: 'tc_6', code: 'TC_OTC_006', name: 'Modify Vendor Quote Terms', scenario: 'OTC Modifications', last_run_status: 'passed' },
    { id: 'tc_7', code: 'TC_OTC_007', name: 'Cancel Vendor Quote', scenario: 'OTC Cancellations', last_run_status: 'passed' },
    { id: 'tc_8', code: 'TC_OTC_008', name: 'Copy Vendor Quote', scenario: 'OTC Modifications', last_run_status: 'passed' },
    { id: 'tc_9', code: 'TC_OTC_009', name: 'Create Quote with Multiple Items', scenario: 'OTC Happy Path Domestic', last_run_status: 'failed' },
    { id: 'tc_10', code: 'TC_OTC_010', name: 'Create Quote from RFQ', scenario: 'OTC with Sourcing', last_run_status: 'passed' },
    { id: 'tc_11', code: 'TC_OTC_011', name: 'Approve Vendor Quote', scenario: 'OTC Approvals', last_run_status: 'passed' },
    { id: 'tc_12', code: 'TC_OTC_012', name: 'Reject Vendor Quote', scenario: 'OTC Approvals', last_run_status: 'passed' },
  ],
}

const STEP_TYPE_ICONS: Record<string, { icon: React.ElementType; color: string }> = {
  set_field: { icon: Edit3, color: 'bg-blue-500' },
  close_modal: { icon: XCircle, color: 'bg-amber-500' },
  press_button: { icon: Play, color: 'bg-emerald-500' },
  assert_field: { icon: CheckCircle2, color: 'bg-violet-500' },
}

type ReviewDecision = 'approve' | 'approve_with_mods' | 'reject' | 'request_changes'

export default function HealingPromotionReviewPage() {
  const params = useParams()
  const router = useRouter()
  const [decision, setDecision] = React.useState<ReviewDecision | null>(null)
  const [rationale, setRationale] = React.useState('')
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  
  const promotion = SAMPLE_PROMOTION
  
  const handleSubmitReview = () => {
    if (decision === 'approve' || decision === 'approve_with_mods') {
      setShowConfirmDialog(true)
    } else {
      submitReview()
    }
  }
  
  const submitReview = async () => {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setShowConfirmDialog(false)
    router.push('/defect-manager/healing-promotions')
  }
  
  const isFormValid = decision !== null && (decision !== 'reject' || rationale.trim().length > 0)

  return (
    <AppShell currentApp="defect-manager">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="p-4 md:p-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Link href="/defect-manager/healing-promotions" className="hover:text-foreground flex items-center gap-1">
                <ArrowLeft className="h-4 w-4" />
                Healing Promotions
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground">Review</span>
            </div>
            
            {/* Title Section */}
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="page-title">{promotion.title}</h1>
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800">
                    Pending Review
                  </Badge>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <FileCode2 className="h-4 w-4" />
                    <span>Target IR:</span>
                    <Link href={`/test-repository/ir/${promotion.target_ir.id}`} className="text-foreground hover:underline font-medium">
                      {promotion.target_ir.name}
                    </Link>
                    <Badge variant="outline" className="text-xs">{promotion.target_ir.version}</Badge>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ClipboardCheck className="h-4 w-4" />
                    <span>{promotion.impacted_test_cases} Test Cases impacted</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    <span>Proposed {formatDistanceToNow(new Date(promotion.proposed_at), { addSuffix: true })}</span>
                  </div>
                  <AgentTaskIndicator agentKind="healing" confidence={promotion.confidence_score} />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="flex flex-col lg:flex-row h-full">
            {/* Left: Diff View */}
            <div className="flex-1 p-4 md:p-6 border-r overflow-auto">
              {/* Diff Header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="section-title">Proposed Changes</h2>
                <div className="flex items-center gap-2 text-sm">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-emerald-500" />
                    Addition
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-amber-500" />
                    Modification
                  </span>
                </div>
              </div>
              
              {/* HealingPromotionDiff Component */}
              <Card padding="flush" className="mb-6">
                <CardContent>
                  {/* Side by side diff */}
                  <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x">
                    {/* Current State */}
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-4">
                        <Badge variant="outline" className="bg-muted">Current</Badge>
                        <span className="text-sm text-muted-foreground">Step {promotion.current_step.order}</span>
                      </div>
                      <StepCard step={promotion.current_step} variant="current" />
                    </div>
                    
                    {/* Proposed State */}
                    <div className="p-4 bg-emerald-50/30 dark:bg-emerald-950/20">
                      <div className="flex items-center gap-2 mb-4">
                        <Badge variant="outline" className="bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900 dark:text-emerald-400 dark:border-emerald-800">Proposed</Badge>
                        <span className="text-sm text-muted-foreground">Steps {promotion.proposed_changes.new_step.order} - {promotion.proposed_changes.modified_step.order}</span>
                      </div>
                      
                      {/* New step */}
                      <div className="relative mb-3">
                        <div className="absolute -left-2 top-0 bottom-0 w-1 bg-emerald-500 rounded-full" />
                        <div className="flex items-center gap-2 mb-2">
                          <Plus className="h-4 w-4 text-emerald-600" />
                          <span className="text-xs font-medium text-emerald-600 uppercase">New Step</span>
                        </div>
                        <StepCard step={promotion.proposed_changes.new_step} variant="addition" />
                      </div>
                      
                      {/* Modified step */}
                      <div className="relative">
                        <div className="absolute -left-2 top-0 bottom-0 w-1 bg-amber-500 rounded-full" />
                        <div className="flex items-center gap-2 mb-2">
                          <Edit3 className="h-4 w-4 text-amber-600" />
                          <span className="text-xs font-medium text-amber-600 uppercase">Reordered</span>
                        </div>
                        <StepCard step={promotion.proposed_changes.modified_step} variant="modification" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Repair Description */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-base">Repair Strategy</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900">
                      <Sparkles className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <p className="font-medium mb-1">Add Step (close_modal)</p>
                      <p className="page-description">{promotion.repair_description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Tabs for additional info */}
              <Tabs defaultValue="failures" className="w-full">
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="failures">Originating Failures ({promotion.originating_failures.length})</TabsTrigger>
                  <TabsTrigger value="success">Success Rate</TabsTrigger>
                  <TabsTrigger value="affected">Affected Cases ({promotion.affected_cases.length})</TabsTrigger>
                </TabsList>
                
                <TabsContent value="failures" className="mt-4">
                  <Card padding="flush">
                    <CardContent>
                      <div className="divide-y">
                        {promotion.originating_failures.map((failure) => (
                          <div key={failure.id} className="p-4 flex items-center justify-between hover:bg-muted/50">
                            <div className="flex items-center gap-4">
                              <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900">
                                <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{failure.test_case}</span>
                                  <Badge variant="outline" className="text-xs">Step {failure.step_number}</Badge>
                                </div>
                                <p className="page-description">{failure.error_message}</p>
                                <p className="caption-text mt-1">
                                  {formatDistanceToNow(new Date(failure.occurred_at), { addSuffix: true })}
                                </p>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm" className="gap-1">
                              View Failure
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="success" className="mt-4">
                  <Card>
                    <CardContent>
                      <StaggerGrid columns="grid-cols-1 md:grid-cols-3" className="gap-6" fast>
                        <div className="text-center p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/30">
                          <div className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">{promotion.repair_success_rate.rate}%</div>
                          <div className="text-sm text-muted-foreground mt-1">Success Rate</div>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-muted">
                          <div className="text-4xl font-bold">{promotion.repair_success_rate.total_applied}</div>
                          <div className="text-sm text-muted-foreground mt-1">Times Applied</div>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-muted">
                          <div className="flex items-center justify-center gap-4">
                            <div>
                              <div className="stat-value text-emerald-600">{promotion.repair_success_rate.successful}</div>
                              <div className="text-xs text-muted-foreground">Succeeded</div>
                            </div>
                            <Separator orientation="vertical" className="h-12" />
                            <div>
                              <div className="stat-value text-red-600">{promotion.repair_success_rate.failed}</div>
                              <div className="text-xs text-muted-foreground">Failed</div>
                            </div>
                          </div>
                        </div>
                      </StaggerGrid>
                      
                      <div className="mt-6">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="h-4 w-4 text-emerald-600" />
                          <span className="font-medium">Repair Effectiveness</span>
                        </div>
                        <p className="page-description">
                          This repair has been automatically applied {promotion.repair_success_rate.total_applied} times during runtime healing. 
                          All {promotion.repair_success_rate.successful} applications successfully resolved the failure, 
                          demonstrating high reliability for permanent integration.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="affected" className="mt-4">
                  <Card padding="flush">
                    <CardContent>
                      <div className="divide-y">
                        {promotion.affected_cases.map((tc) => (
                          <div key={tc.id} className="p-4 flex items-center justify-between hover:bg-muted/50">
                            <div className="flex items-center gap-4">
                              <div className={cn(
                                "p-2 rounded-lg",
                                tc.last_run_status === 'passed' ? 'bg-emerald-100 dark:bg-emerald-900' : 'bg-red-100 dark:bg-red-900'
                              )}>
                                {tc.last_run_status === 'passed' ? (
                                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                ) : (
                                  <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                                )}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-sm">{tc.code}</span>
                                  <span className="font-medium">{tc.name}</span>
                                </div>
                                <p className="page-description">{tc.scenario}</p>
                              </div>
                            </div>
                            <Badge variant={tc.last_run_status === 'passed' ? 'outline' : 'destructive'}>
                              {tc.last_run_status === 'passed' ? 'Last Run Passed' : 'Last Run Failed'}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Right: Approval Form */}
            <div className="w-full lg:w-96 p-4 md:p-6 bg-muted/30">
              <Card>
                <CardHeader>
                  <CardTitle>Review Decision</CardTitle>
                  <CardDescription>Submit your review for this healing promotion</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Reviewer */}
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Reviewer</Label>
                    <div className="flex items-center gap-3 p-3 rounded-lg border bg-background">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-sm font-medium text-indigo-600 dark:text-indigo-400">
                        PS
                      </div>
                      <div>
                        <div className="font-medium text-sm">Pradeep Sharma</div>
                        <div className="text-xs text-muted-foreground">Test Engineering Lead</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Decision */}
                  <div className="space-y-3">
                    <Label>Decision</Label>
                    <RadioGroup value={decision || ''} onValueChange={(v) => setDecision(v as ReviewDecision)}>
                      <div className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer">
                        <RadioGroupItem value="approve" id="approve" className="mt-0.5" />
                        <div className="flex-1">
                          <Label htmlFor="approve" className="font-medium cursor-pointer">Approve and Merge</Label>
                          <p className="caption-text">Accept this promotion and update the IR</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer">
                        <RadioGroupItem value="approve_with_mods" id="approve_with_mods" className="mt-0.5" />
                        <div className="flex-1">
                          <Label htmlFor="approve_with_mods" className="font-medium cursor-pointer">Approve with Modifications</Label>
                          <p className="caption-text">Accept with manual adjustments</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer">
                        <RadioGroupItem value="reject" id="reject" className="mt-0.5" />
                        <div className="flex-1">
                          <Label htmlFor="reject" className="font-medium cursor-pointer">Reject</Label>
                          <p className="caption-text">Decline this promotion permanently</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer">
                        <RadioGroupItem value="request_changes" id="request_changes" className="mt-0.5" />
                        <div className="flex-1">
                          <Label htmlFor="request_changes" className="font-medium cursor-pointer">Request Changes</Label>
                          <p className="caption-text">Ask for modifications before approval</p>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  {/* Rationale */}
                  <div className="space-y-2">
                    <Label htmlFor="rationale">
                      Rationale {decision === 'reject' && <span className="text-red-500">*</span>}
                    </Label>
                    <Textarea 
                      id="rationale"
                      placeholder={decision === 'reject' ? 'Required: Explain why this promotion is being rejected...' : 'Optional: Add notes about your decision...'}
                      value={rationale}
                      onChange={(e) => setRationale(e.target.value)}
                      rows={4}
                    />
                    {decision === 'reject' && rationale.trim().length === 0 && (
                      <p className="text-xs text-red-500">Rationale is required when rejecting a promotion</p>
                    )}
                  </div>
                  
                  {/* Validation Banner */}
                  {(decision === 'approve' || decision === 'approve_with_mods') && (
                    <Alert variant="default" className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30">
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                      <AlertTitle className="text-amber-800 dark:text-amber-400">Version Impact</AlertTitle>
                      <AlertDescription className="text-amber-700 dark:text-amber-300 text-sm">
                        Approving will increment IR version {promotion.target_ir.version} → {promotion.target_ir.next_version}. 
                        Affects {promotion.impacted_scenarios} published Scenarios.
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {/* Submit */}
                  <Button 
                    className="w-full" 
                    onClick={handleSubmitReview}
                    disabled={!isFormValid || isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <RotateCcw className="h-4 w-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Review'
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Approval</DialogTitle>
            <DialogDescription>
              You are about to approve this healing promotion. This action will:
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3 py-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5" />
              <div>
                <p className="font-medium">Update IR Version</p>
                <p className="page-description">
                  {promotion.target_ir.name} will be updated from {promotion.target_ir.version} to {promotion.target_ir.next_version}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
              <div>
                <p className="font-medium">Affect {promotion.impacted_test_cases} Test Cases</p>
                <p className="page-description">
                  Across {promotion.impacted_scenarios} published Scenarios
                </p>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button onClick={submitReview} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <RotateCcw className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                'Confirm Approval'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  )
}

// Step Card Component
interface StepCardProps {
  step: {
    order: number
    step_type: string
    description: string
    parameters: Record<string, unknown>
    healing_hints?: string[]
  }
  variant: 'current' | 'addition' | 'modification'
}

function StepCard({ step, variant }: StepCardProps) {
  const stepConfig = STEP_TYPE_ICONS[step.step_type] || { icon: FileCode2, color: 'bg-gray-500' }
  const Icon = stepConfig.icon
  
  return (
    <div className={cn(
      "p-4 rounded-lg border",
      variant === 'addition' && 'border-emerald-300 bg-emerald-50/50 dark:border-emerald-700 dark:bg-emerald-950/30',
      variant === 'modification' && 'border-amber-300 bg-amber-50/50 dark:border-amber-700 dark:bg-amber-950/30',
      variant === 'current' && 'bg-muted/50'
    )}>
      <div className="flex items-start gap-3">
        <div className={cn("p-2 rounded-lg text-white", stepConfig.color)}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-muted-foreground">Step {step.order}</span>
            <Badge variant="outline" className="text-xs">{step.step_type}</Badge>
          </div>
          <p className="font-medium text-sm mb-2">{step.description}</p>
          
          {/* Parameters */}
          <div className="text-xs space-y-1 font-mono bg-muted/50 dark:bg-muted/30 p-2 rounded">
            {Object.entries(step.parameters).map(([key, value]) => (
              <div key={key} className="flex items-start gap-2">
                <span className="text-muted-foreground">{key}:</span>
                <span className={cn(
                  variant === 'addition' && 'text-emerald-700 dark:text-emerald-400',
                  variant === 'modification' && 'text-amber-700 dark:text-amber-400'
                )}>
                  {typeof value === 'boolean' ? (value ? 'true' : 'false') : String(value)}
                </span>
              </div>
            ))}
          </div>
          
          {/* Healing Hints */}
          {step.healing_hints && step.healing_hints.length > 0 && (
            <div className="mt-2 text-xs text-muted-foreground">
              <span className="font-medium">Hints:</span>
              <ul className="list-disc list-inside mt-1">
                {step.healing_hints.map((hint, i) => (
                  <li key={i}>{hint}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
