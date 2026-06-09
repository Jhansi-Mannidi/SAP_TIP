'use client'

import * as React from 'react'
import { Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
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
  ArrowRight,
  CheckCircle,
  Loader2,
  Shield,
} from 'lucide-react'
import { 
  MOCK_DEFECTS,
  type Defect,
  type DefectSeverity,
  type DefectPriority,
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

function BulkTriageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const ids = searchParams.get('ids')?.split(',') || []

  const [severity, setSeverity] = React.useState<string>('')
  const [priority, setPriority] = React.useState<string>('')
  const [assignee, setAssignee] = React.useState<string>('')
  const [team, setTeam] = React.useState<string>('')
  const [rationale, setRationale] = React.useState('')
  const [showConfirmation, setShowConfirmation] = React.useState(false)
  const [submitting, setSubmitting] = React.useState(false)

  // Get selected defects
  const selectedDefects = MOCK_DEFECTS.filter(d => ids.includes(d.id))
  const requiresApproval = selectedDefects.length > 50

  const handleApply = () => {
    setShowConfirmation(true)
  }

  const handleConfirm = () => {
    if (submitting) return
    setSubmitting(true)
    window.setTimeout(() => {
      const count = selectedDefects.length
      if (requiresApproval) {
        toast.success('Submitted for approval', {
          description: `Bulk triage on ${count} defect${count === 1 ? '' : 's'} sent for review.`,
        })
      } else {
        toast.success(
          `${count} defect${count === 1 ? '' : 's'} triaged`,
          { description: 'Severity, priority, and routing applied.' },
        )
      }
      setShowConfirmation(false)
      setSubmitting(false)
      router.push('/defect-manager')
    }, 500)
  }

  return (
    <AppShell currentApp="defect-manager">
      <div className="flex flex-col gap-6 p-6 max-w-4xl mx-auto">
        {/* Back link */}
        <Link href="/defect-manager" className="page-breadcrumb hover:text-foreground w-fit">
          <ArrowLeft className="h-4 w-4" />
          Back to Defects
        </Link>

        {/* Header */}
        <div>
          <h1 className="page-title">Bulk Triage</h1>
          <p className="page-description">
            Apply triage changes to {selectedDefects.length} selected defects
          </p>
        </div>

        {/* Selected Defects Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Selected Defects ({selectedDefects.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {selectedDefects.map(d => (
                <Badge key={d.id} variant="outline" className="gap-1">
                  <span className="font-mono">{d.code}</span>
                  <SeverityBadge severity={d.severity} />
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Triage Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Triage Settings</CardTitle>
            <CardDescription>Set values to apply to all selected defects. Leave blank to keep existing values.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Severity</Label>
                <Select value={severity} onValueChange={setSeverity}>
                  <SelectTrigger>
                    <SelectValue placeholder="Keep existing" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="keep">Keep existing</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger>
                    <SelectValue placeholder="Keep existing" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="keep">Keep existing</SelectItem>
                    <SelectItem value="P1">P1</SelectItem>
                    <SelectItem value="P2">P2</SelectItem>
                    <SelectItem value="P3">P3</SelectItem>
                    <SelectItem value="P4">P4</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Assignee</Label>
                <Select value={assignee} onValueChange={setAssignee}>
                  <SelectTrigger>
                    <SelectValue placeholder="Keep existing" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="keep">Keep existing</SelectItem>
                    <SelectItem value="u_1">P.Sharma</SelectItem>
                    <SelectItem value="u_2">J.Rao</SelectItem>
                    <SelectItem value="u_3">M.Reddy</SelectItem>
                    <SelectItem value="u_4">S.Kumar</SelectItem>
                    <SelectItem value="u_5">K.Iyer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Team</Label>
                <Select value={team} onValueChange={setTeam}>
                  <SelectTrigger>
                    <SelectValue placeholder="Keep existing" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="keep">Keep existing</SelectItem>
                    <SelectItem value="SD Functional">SD Functional</SelectItem>
                    <SelectItem value="MM Functional">MM Functional</SelectItem>
                    <SelectItem value="FI Functional">FI Functional</SelectItem>
                    <SelectItem value="ABAP Development">ABAP Development</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Rationale</Label>
              <Textarea 
                placeholder="Explain the reason for this bulk triage action..."
                value={rationale}
                onChange={(e) => setRationale(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            {requiresApproval && (
              <Alert variant="destructive">
                <Shield className="h-4 w-4" />
                <AlertTitle>Approval Required</AlertTitle>
                <AlertDescription>
                  Bulk operations on more than 50 defects require approval co-signature before execution.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" asChild>
              <Link href="/defect-manager">Cancel</Link>
            </Button>
            <Button onClick={handleApply} disabled={!severity && !priority && !assignee && !team}>
              Apply to Selected
            </Button>
          </CardFooter>
        </Card>

        {/* Confirmation Dialog */}
        <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Confirm Bulk Triage</DialogTitle>
              <DialogDescription>
                Review the changes before applying to {selectedDefects.length} defects
              </DialogDescription>
            </DialogHeader>
            
            <div className="max-h-[400px] overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Defect</TableHead>
                    <TableHead>Current</TableHead>
                    <TableHead></TableHead>
                    <TableHead>New</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedDefects.map(defect => (
                    <TableRow key={defect.id}>
                      <TableCell className="font-mono text-sm">{defect.code}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <SeverityBadge severity={defect.severity} />
                          <Badge variant="outline" className="text-xs ml-1">{defect.priority}</Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {severity && severity !== 'keep' ? (
                            <SeverityBadge severity={severity as DefectSeverity} />
                          ) : (
                            <SeverityBadge severity={defect.severity} />
                          )}
                          {priority && priority !== 'keep' ? (
                            <Badge variant="outline" className="text-xs ml-1">{priority}</Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs ml-1">{defect.priority}</Badge>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {requiresApproval && (
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertTitle>Co-signature Required</AlertTitle>
                <AlertDescription>
                  This action will be submitted for approval before execution.
                </AlertDescription>
              </Alert>
            )}

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmation(false)}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button onClick={handleConfirm} disabled={submitting} className="min-w-[180px]">
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {requiresApproval ? 'Submitting…' : 'Applying…'}
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {requiresApproval ? 'Submit for Approval' : 'Confirm \u0026 Apply'}
                    </>
                  )}
                </Button>
              </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  )
}

export default function BulkTriagePage() {
  return (
    <Suspense fallback={
      <AppShell currentApp="defect-manager">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AppShell>
    }>
      <BulkTriageContent />
    </Suspense>
  )
}
