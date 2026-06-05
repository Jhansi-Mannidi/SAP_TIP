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
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
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
  ArrowRight,
  CheckCircle,
  Loader2,
  UserPlus,
  Users,
} from 'lucide-react'
import { 
  MOCK_DEFECTS,
  type DefectSeverity,
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

const USERS = [
  { id: 'u_1', name: 'P.Sharma', email: 'p.sharma@starcement.com' },
  { id: 'u_2', name: 'J.Rao', email: 'j.rao@starcement.com' },
  { id: 'u_3', name: 'M.Reddy', email: 'm.reddy@starcement.com' },
  { id: 'u_4', name: 'S.Kumar', email: 's.kumar@starcement.com' },
  { id: 'u_5', name: 'K.Iyer', email: 'k.iyer@starcement.com' },
]

const TEAMS = [
  'SD Functional',
  'MM Functional',
  'FI Functional',
  'ABAP Development',
  'Basis/Technical',
]

function BulkAssignContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const ids = searchParams.get('ids')?.split(',') || []

  const [assignee, setAssignee] = React.useState<string>('')
  const [team, setTeam] = React.useState<string>('')
  const [rationale, setRationale] = React.useState('')
  const [showConfirmation, setShowConfirmation] = React.useState(false)
  const [submitting, setSubmitting] = React.useState(false)

  // Get selected defects
  const selectedDefects = MOCK_DEFECTS.filter(d => ids.includes(d.id))
  const selectedUser = USERS.find(u => u.id === assignee)

  const handleApply = () => {
    setShowConfirmation(true)
  }

  const handleConfirm = () => {
    if (submitting) return
    setSubmitting(true)
    // Simulate async apply, then redirect to the defects list
    window.setTimeout(() => {
      const count = selectedDefects.length
      const targetLabel = selectedUser?.name ?? team ?? 'team'
      toast.success(
        `${count} defect${count === 1 ? '' : 's'} assigned`,
        { description: `Routed to ${targetLabel}.` },
      )
      setShowConfirmation(false)
      setSubmitting(false)
      router.push('/defect-manager')
    }, 500)
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
          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <UserPlus className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="page-title">Bulk Assign</h1>
            <p className="page-description">
              Assign {selectedDefects.length} selected defects to a user or team
            </p>
          </div>
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

        {/* Assignment Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Assignment</CardTitle>
            <CardDescription>Select assignee and/or team for the selected defects</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Assignee</Label>
                <Select value={assignee} onValueChange={setAssignee}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    {USERS.map(user => (
                      <SelectItem key={user.id} value={user.id}>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-5 w-5">
                            <AvatarFallback className="text-[10px]">
                              {user.name.split('.').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          {user.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Team</Label>
                <Select value={team} onValueChange={setTeam}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select team" />
                  </SelectTrigger>
                  <SelectContent>
                    {TEAMS.map(t => (
                      <SelectItem key={t} value={t}>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          {t}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Rationale</Label>
              <Textarea 
                placeholder="Explain the reason for this assignment..."
                value={rationale}
                onChange={(e) => setRationale(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" asChild>
              <Link href="/defect-manager">Cancel</Link>
            </Button>
            <Button onClick={handleApply} disabled={!assignee && !team}>
              Apply Assignment
            </Button>
          </CardFooter>
        </Card>

        {/* Confirmation Dialog */}
        <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Confirm Bulk Assignment</DialogTitle>
              <DialogDescription>
                Review the assignment changes before applying
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              {selectedUser && (
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <Avatar>
                    <AvatarFallback>{selectedUser.name.split('.').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{selectedUser.name}</p>
                    <p className="page-description">{selectedUser.email}</p>
                  </div>
                </div>
              )}
              
              {team && (
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{team}</p>
                    <p className="page-description">Team assignment</p>
                  </div>
                </div>
              )}
            </div>

            <div className="max-h-[300px] overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Defect</TableHead>
                    <TableHead>Current Assignee</TableHead>
                    <TableHead></TableHead>
                    <TableHead>New Assignee</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedDefects.map(defect => (
                    <TableRow key={defect.id}>
                      <TableCell className="font-mono text-sm">{defect.code}</TableCell>
                      <TableCell>
                        {defect.assignee ? defect.assignee.name : <span className="text-muted-foreground">Unassigned</span>}
                      </TableCell>
                      <TableCell>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </TableCell>
                      <TableCell>
                        {selectedUser?.name || <span className="text-muted-foreground">-</span>}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmation(false)}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button onClick={handleConfirm} disabled={submitting} className="min-w-[148px]">
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Applying…
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Confirm &amp; Apply
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

export default function BulkAssignPage() {
  return (
    <Suspense fallback={
      <AppShell currentApp="defect-manager">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AppShell>
    }>
      <BulkAssignContent />
    </Suspense>
  )
}
