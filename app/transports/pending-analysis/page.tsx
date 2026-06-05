'use client'

import * as React from 'react'
import Link from 'next/link'
import { 
  Clock,
  Search,
  Play,
  Eye,
  MoreHorizontal,
  CheckCircle2,
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
import { cn } from '@/lib/utils'

import { MOCK_TRANSPORTS, type Transport } from '@/lib/transport-mock-data'

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString()
}

export default function PendingAnalysisPage() {
  const [searchQuery, setSearchQuery] = React.useState('')

  const pendingTransports = MOCK_TRANSPORTS
    .filter(t => ['Captured', 'Classified'].includes(t.state))
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
                  <Clock className="h-6 w-6 text-amber-500" />
                  Pending Analysis
                </h1>
                <p className="page-description mt-1">
                  Transports awaiting impact analysis. An empty backlog here is healthy.
                </p>
              </div>
              <Button className="gap-2">
                <Play className="h-4 w-4" />
                Analyze All Pending
              </Button>
            </div>

            {/* Stats */}
            <StaggerGrid columns="grid-cols-2 md:grid-cols-3" className="gap-3 mt-4" fast>
              <Card className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900">
                <CardContent>
                  <div className="stat-value text-amber-700 dark:text-amber-400">{pendingTransports.length}</div>
                  <div className="text-xs text-amber-600 dark:text-amber-500">Pending Analysis</div>
                </CardContent>
              </Card>
              <Card className="bg-slate-50 dark:bg-slate-950/30">
                <CardContent>
                  <div className="stat-value">{pendingTransports.filter(t => t.state === 'Captured').length}</div>
                  <div className="text-xs text-muted-foreground">Just Captured</div>
                </CardContent>
              </Card>
              <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900">
                <CardContent>
                  <div className="stat-value text-blue-700 dark:text-blue-400">{pendingTransports.filter(t => t.state === 'Classified').length}</div>
                  <div className="text-xs text-blue-600 dark:text-blue-500">Classified Only</div>
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

        {/* Content */}
        <div className="flex-1 overflow-auto">
          {pendingTransports.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="rounded-full bg-green-100 dark:bg-green-950/50 p-4 mb-4">
                <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold text-lg">No pending analysis</h3>
              <p className="page-description mt-1">
                All transports have been analyzed. Great job!
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10">
                <TableRow>
                  <TableHead className="w-[140px]">TR Number</TableHead>
                  <TableHead className="min-w-[200px]">Description</TableHead>
                  <TableHead className="w-[100px]">State</TableHead>
                  <TableHead className="w-[100px]">Owner</TableHead>
                  <TableHead className="w-[100px]">Risk Score</TableHead>
                  <TableHead className="w-[100px]">Captured</TableHead>
                  <TableHead className="w-[150px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingTransports.map(transport => (
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
                      <Badge variant="secondary" className={cn(
                        'text-white',
                        transport.state === 'Captured' ? 'bg-slate-500' : 'bg-blue-500'
                      )}>
                        {transport.state}
                      </Badge>
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
                      <span className={cn(
                        'font-medium',
                        transport.risk_score >= 0.7 ? 'text-red-600' : transport.risk_score >= 0.5 ? 'text-orange-600' : 'text-amber-600'
                      )}>
                        {(transport.risk_score * 100).toFixed(0)}%
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatRelativeTime(transport.captured_at)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button size="sm" className="gap-1">
                          <Play className="h-3 w-3" />
                          Analyze Now
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
