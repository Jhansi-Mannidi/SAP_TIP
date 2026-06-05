'use client'

import * as React from 'react'
import Link from 'next/link'
import { 
  ClipboardCheck,
  Search,
  Eye,
  MoreHorizontal,
  FileText,
} from 'lucide-react'

import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { MOCK_TRANSPORTS } from '@/lib/transport-mock-data'

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString()
}

export default function PendingApprovalPage() {
  const [searchQuery, setSearchQuery] = React.useState('')

  const pendingApprovalTransports = MOCK_TRANSPORTS
    .filter(t => t.state === 'Test_Plan_Ready')
    .filter(t => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        return t.tr_number.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
      }
      return true
    })
    .sort((a, b) => b.risk_score - a.risk_score)

  return (
    <AppShell currentApp="transport-intelligence">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <h1 className="page-title flex items-center gap-2">
                  <ClipboardCheck className="h-6 w-6 text-amber-500" />
                  Pending Test Plan Approval
                </h1>
                <p className="page-description mt-1">
                  Transports with regeneration verdicts awaiting Test Engineer review.
                </p>
              </div>
            </div>

            {/* Stats */}
            <StaggerGrid columns="grid-cols-2" className="gap-3 mt-4 max-w-md" fast>
              <Card className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900">
                <CardContent>
                  <div className="stat-value text-amber-700 dark:text-amber-400">{pendingApprovalTransports.length}</div>
                  <div className="text-xs text-amber-600 dark:text-amber-500">Awaiting Review</div>
                </CardContent>
              </Card>
              <Card className="bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900">
                <CardContent>
                  <div className="stat-value text-red-700 dark:text-red-400">
                    {pendingApprovalTransports.filter(t => t.risk_band === 'high' || t.risk_band === 'critical').length}
                  </div>
                  <div className="text-xs text-red-600 dark:text-red-500">High Risk</div>
                </CardContent>
              </Card>
            </StaggerGrid>
          </div>

          {/* Search */}
          <div className="px-4 md:px-6 pb-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search TR number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          {pendingApprovalTransports.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <ClipboardCheck className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="font-semibold text-lg">No pending approvals</h3>
              <p className="page-description mt-1">
                All test plans have been reviewed
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10">
                <TableRow>
                  <TableHead className="w-[140px]">TR Number</TableHead>
                  <TableHead className="min-w-[200px]">Description</TableHead>
                  <TableHead className="w-[100px]">Owner</TableHead>
                  <TableHead className="w-[100px]">Risk Score</TableHead>
                  <TableHead className="w-[100px]">Linked Tests</TableHead>
                  <TableHead className="w-[120px]">Plan Ready</TableHead>
                  <TableHead className="w-[150px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingApprovalTransports.map(transport => (
                  <TableRow key={transport.id} className="group">
                    <TableCell>
                      <Link 
                        href={`/transports/${transport.id}`}
                        className="font-mono font-semibold text-primary hover:underline"
                      >
                        {transport.tr_number}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[250px] truncate">{transport.description}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">{transport.owner.avatar_initials}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{transport.owner.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={transport.risk_band === 'critical' ? 'destructive' : transport.risk_band === 'high' ? 'default' : 'secondary'}>
                        {(transport.risk_score * 100).toFixed(0)}%
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{transport.linked_tests_count}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {transport.test_plan_ready_at ? formatRelativeTime(transport.test_plan_ready_at) : '-'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button size="sm" className="gap-1" asChild>
                          <Link href={`/transports/${transport.id}/impact-analysis`}>
                            <FileText className="h-3 w-3" />
                            Review Plan
                          </Link>
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/transports/${transport.id}`}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </Link>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </AppShell>
  )
}
