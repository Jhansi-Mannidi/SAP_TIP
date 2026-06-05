'use client'

import * as React from 'react'
import { Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { 
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
  Loader2,
  XCircle,
  Shield,
} from 'lucide-react'
import { 
  MOCK_DEFECTS,
  type Defect,
  type DefectSeverity,
  type DefectState,
} from '@/lib/defect-mock-data'

function SeverityBadge({ severity }: { severity: DefectSeverity }) {
  const config = {
    Critical: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    High: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    Medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    Low: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400',
  }
  return <Badge variant="secondary" className={cn('text-xs', config[severity])}>{severity}</Badge>
}

function StateBadge({ state }: { state: DefectState }) {
  const config: Record<DefectState, string> = {
    Open: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    Triaged: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    Assigned: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'In Fix': 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
    'Retest Pending': 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
    'Retest In Progress': 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
    Closed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    Rejected: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400',
  }
  return <Badge variant="secondary" className={cn('text-xs', config[state])}>{state}</Badge>
}

const CLOSE_REASONS = [
  { value: 'fixed', label: 'Fixed - Issue has been resolved' },
  { value: 'duplicate', label: 'Duplicate - Already reported elsewhere' },
  { value: 'not_reproducible', label: 'Not Reproducible - Cannot recreate issue' },
  { value: 'wont_fix', label: 'Will Not Fix - Out of scope or by design' },
  { value: 'invalid', label: 'Invalid - Not a valid defect' },
]

function BulkCloseContent() {
  const searchParams = useSearchParams()
  const ids = searchParams.get('ids')?.split(',') || []
  
  const [closeReason, setCloseReason] = React.useState<string>('')
  const [rationale, setRationale] = React.useState('')
  const [showConfirmation, setShowConfirmation] = React.useState(false)
  
  // Get selected defects
  const selectedDefects = MOCK_DEFECTS.filter(d => ids.includes(d.id))
  const openDefects = selectedDefects.filter(d => d.state !== 'Closed' && d.state !== 'Rejected')
  const requiresApproval = openDefects.length > 50
  const hasCritical = openDefects.some(d => d.severity === 'Critical')

  const handleApply = () => {
    setShowConfirmation(true)
  }

  const handleConfirm = () => {
    setShowConfirmation(false)
  }

  return (
    <AppShell currentApp="defect-manager">
      <div className="flex flex-col gap-6 p-6 max-w-4xl mx-auto">
        {/* Back link */}
        <Link href="/defect-manager" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground w-fit">
          <ArrowLeft className="h-4 w-4" />
          Back to Defects
        </Link>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <XCircle className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h1 className="page-title">Bulk Close</h1>
            <p className="page-description">
              Close {openDefects.length} selected defects
            </p>
          </div>
        </div>

        {/* Warning Banner */}
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Warning: Bulk Close Operation</AlertTitle>
          <AlertDescription>
            You are about to close {openDefects.length} defects. This action should only be performed after proper review and verification. All defects will be marked as closed and cannot be easily undone.
          </AlertDescription>
        </Alert>

        {hasCritical && (
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertTitle>Critical Defects Included</AlertTitle>
            <AlertDescription>
              {openDefects.filter(d => d.severity === 'Critical').length} Critical severity defects are included in this selection. Please ensure appropriate sign-off.
            </AlertDescription>
          </Alert>
        )}

        {/* Selected Defects Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Defects to Close ({openDefects.length})</CardTitle>
            <CardDescription>
              {selectedDefects.length - openDefects.length > 0 && (
                <span className="text-amber-600">
                  {selectedDefects.length - openDefects.length} already closed/rejected defects will be skipped
                </span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {openDefects.map(d => (
                <Badge key={d.id} variant="outline" className="gap-1">
                  <span className="font-mono">{d.code}</span>
                  <SeverityBadge severity={d.severity} />
                  <StateBadge state={d.state} />
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Close Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Close Details</CardTitle>
            <CardDescription>Provide reason and rationale for closing these defects</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Close Reason <span className="text-red-500">*</span></Label>
              <Select value={closeReason} onValueChange={setCloseReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Select close reason" />
                </SelectTrigger>
                <SelectContent>
                  {CLOSE_REASONS.map(reason => (
                    <SelectItem key={reason.value} value={reason.value}>
                      {reason.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Rationale <span className="text-red-500">*</span></Label>
              <Textarea 
                placeholder="Provide detailed rationale for closing these defects. This is mandatory for audit trail."
                value={rationale}
                onChange={(e) => setRationale(e.target.value)}
                className="min-h-[120px]"
              />
              <p className="caption-text">Minimum 20 characters required</p>
            </div>

            {requiresApproval && (
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertTitle>Multi-Approval Required</AlertTitle>
                <AlertDescription>
                  Closing more than 50 defects requires multi-approval co-signature. This request will be sent for approval before execution.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" asChild>
              <Link href="/defect-manager">Cancel</Link>
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleApply} 
              disabled={!closeReason || rationale.length < 20}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Close {openDefects.length} Defects
            </Button>
          </CardFooter>
        </Card>

        {/* Confirmation Dialog */}
        <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                Confirm Bulk Close
              </DialogTitle>
              <DialogDescription>
                This will close {openDefects.length} defects with reason: {CLOSE_REASONS.find(r => r.value === closeReason)?.label}
              </DialogDescription>
            </DialogHeader>
            
            <div className="max-h-[300px] overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Defect</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Current State</TableHead>
                    <TableHead>New State</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {openDefects.map(defect => (
                    <TableRow key={defect.id}>
                      <TableCell className="font-mono text-sm">{defect.code}</TableCell>
                      <TableCell><SeverityBadge severity={defect.severity} /></TableCell>
                      <TableCell><StateBadge state={defect.state} /></TableCell>
                      <TableCell>
                        <Badge className="bg-emerald-100 text-emerald-700">Closed</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="bg-muted p-3 rounded-lg">
              <p className="text-sm font-medium">Rationale:</p>
              <p className="page-description">{rationale}</p>
            </div>

            {requiresApproval && (
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertTitle>Approval Workflow</AlertTitle>
                <AlertDescription>
                  This action will be submitted for multi-approval before execution.
                </AlertDescription>
              </Alert>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowConfirmation(false)}>Cancel</Button>
              <Button variant="destructive" onClick={handleConfirm}>
                <CheckCircle className="h-4 w-4 mr-2" />
                {requiresApproval ? 'Submit for Approval' : 'Confirm & Close All'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  )
}

export default function BulkClosePage() {
  return (
    <Suspense fallback={
      <AppShell currentApp="defect-manager">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AppShell>
    }>
      <BulkCloseContent />
    </Suspense>
  )
}
