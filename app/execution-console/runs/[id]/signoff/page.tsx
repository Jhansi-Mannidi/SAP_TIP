'use client'

import * as React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { 
  ChevronRight,
  ChevronLeft,
  ClipboardCheck,
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  User,
  Lock,
  Sparkles,
  Bug,
} from 'lucide-react'

import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

import { MOCK_SUITE_EXECUTION, MOCK_SIGNOFF_APPROVERS, type SignOffApprover } from '@/lib/execution-mock-data'

export default function SignOffPage() {
  const params = useParams()
  const runId = params.id as string
  
  const execution = MOCK_SUITE_EXECUTION
  const approvers = MOCK_SIGNOFF_APPROVERS
  const [rationale, setRationale] = React.useState('')
  
  const signedCount = approvers.filter(a => a.state === 'signed').length
  const totalCount = approvers.length
  const allSigned = signedCount === totalCount
  const hasCriticalDefect = false // Mock - would check real defects

  return (
    <AppShell currentApp="execution-console">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="p-4 md:p-6">
            <div className="page-breadcrumb mb-2">
              <Link href={`/execution-console/runs/${runId}`} className="hover:underline flex items-center gap-1">
                <ChevronLeft className="h-4 w-4" />
                Run Detail
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span>Sign-Off</span>
            </div>
            <h1 className="page-title flex items-center gap-2">
              <ClipboardCheck className="h-6 w-6" />
              Suite Sign-Off
            </h1>
            <p className="page-description mt-1">
              Approval required from {totalCount} stakeholders
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 md:p-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Execution Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Suite Execution Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="page-description">Suite</p>
                    <p className="font-medium">{execution.suite.name}</p>
                    <Badge variant="outline" className="mt-1">{execution.suite.code}</Badge>
                  </div>
                  <div>
                    <p className="page-description">Target System</p>
                    <Badge variant="secondary" className="font-mono">
                      {execution.target_system.sid}:{execution.target_system.client}
                    </Badge>
                  </div>
                  <div>
                    <p className="page-description">Pass Rate</p>
                    <p className="stat-value text-emerald-600">{execution.pass_rate}%</p>
                  </div>
                  <div>
                    <p className="page-description">Results</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1 text-emerald-600">
                        <CheckCircle2 className="h-4 w-4" />
                        {execution.case_counts.pass}
                      </span>
                      <span className="flex items-center gap-1 text-amber-600">
                        <Sparkles className="h-4 w-4" />
                        {execution.case_counts.healed}
                      </span>
                      <span className="flex items-center gap-1 text-red-600">
                        <XCircle className="h-4 w-4" />
                        {execution.case_counts.fail}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Critical Defect Warning */}
            {hasCriticalDefect && (
              <Alert variant="destructive">
                <Bug className="h-4 w-4" />
                <AlertTitle>Critical Defect Open</AlertTitle>
                <AlertDescription>
                  Cannot sign off while critical defects are open. Please resolve DEF-001 before proceeding.
                </AlertDescription>
              </Alert>
            )}

            {/* Approvers List */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>Required Approvals</span>
                  <Badge variant="secondary">
                    {signedCount} / {totalCount} signed
                  </Badge>
                </CardTitle>
                <Progress value={(signedCount / totalCount) * 100} className="h-2" />
              </CardHeader>
              <CardContent className="space-y-3">
                {approvers.map((approver) => (
                  <div
                    key={approver.id}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-lg border",
                      approver.state === 'signed' && "bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          {approver.name.split('.').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{approver.name}</p>
                        <p className="page-description">{approver.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {approver.state === 'signed' ? (
                        <>
                          <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Signed
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {approver.signed_at && new Date(approver.signed_at).toLocaleTimeString()}
                          </span>
                        </>
                      ) : approver.state === 'rejected' ? (
                        <Badge variant="destructive">
                          <XCircle className="h-3 w-3 mr-1" />
                          Rejected
                        </Badge>
                      ) : (
                        <>
                          <Badge variant="outline">
                            <Clock className="h-3 w-3 mr-1" />
                            Pending
                          </Badge>
                          <Button size="sm">
                            Sign
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Rationale and Sign Off */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Sign-Off</CardTitle>
                <CardDescription>
                  Add any notes or rationale for your approval
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="rationale">Rationale (Optional)</Label>
                  <Textarea
                    id="rationale"
                    placeholder="Add any notes about this sign-off..."
                    value={rationale}
                    onChange={(e) => setRationale(e.target.value)}
                    rows={4}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    {!allSigned && (
                      <span className="flex items-center gap-1">
                        <Lock className="h-3.5 w-3.5" />
                        Waiting for {totalCount - signedCount} more signature(s)
                      </span>
                    )}
                  </div>
                  <Button 
                    size="lg"
                    disabled={hasCriticalDefect}
                    className="gap-2"
                  >
                    <ClipboardCheck className="h-4 w-4" />
                    Sign Off
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
