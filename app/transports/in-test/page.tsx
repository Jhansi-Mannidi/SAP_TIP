'use client'

import * as React from 'react'
import Link from 'next/link'
import { Play, Search, Eye, MoreHorizontal, Activity } from 'lucide-react'

import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
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

export default function InTestPage() {
  const [searchQuery, setSearchQuery] = React.useState('')

  const inTestTransports = MOCK_TRANSPORTS
    .filter(t => t.state === 'In_Test')
    .filter(t => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        return t.tr_number.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
      }
      return true
    })

  return (
    <AppShell currentApp="transport-intelligence">
      <div className="flex flex-col h-full">
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <h1 className="page-title flex items-center gap-2">
                  <Play className="h-6 w-6 text-cyan-500" />
                  In Test
                </h1>
                <p className="page-description mt-1">
                  Transports currently undergoing test execution.
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/transports/released-qas">Released to QAS</Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/transports/released-prod">Released to PROD</Link>
                </Button>
              </div>
            </div>

            <StaggerGrid columns="grid-cols-2" className="gap-3 mt-4 max-w-md" fast>
              <Card className="bg-cyan-50 dark:bg-cyan-950/30 border-cyan-200 dark:border-cyan-900">
                <CardContent>
                  <div className="stat-value text-cyan-700 dark:text-cyan-400">{inTestTransports.length}</div>
                  <div className="text-xs text-cyan-600 dark:text-cyan-500">In Test</div>
                </CardContent>
              </Card>
              <Card className="bg-muted/50">
                <CardContent>
                  <div className="stat-value">{inTestTransports.reduce((sum, t) => sum + t.linked_tests_count, 0)}</div>
                  <div className="text-xs text-muted-foreground">Total Tests Running</div>
                </CardContent>
              </Card>
            </StaggerGrid>
          </div>

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

        <div className="flex-1 overflow-auto">
          {inTestTransports.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Play className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="font-semibold text-lg">No transports in test</h3>
              <p className="page-description mt-1">All transports have completed testing</p>
            </div>
          ) : (
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10">
                <TableRow>
                  <TableHead className="w-[140px]">TR Number</TableHead>
                  <TableHead className="min-w-[200px]">Description</TableHead>
                  <TableHead className="w-[100px]">Owner</TableHead>
                  <TableHead className="w-[150px]">Test Progress</TableHead>
                  <TableHead className="w-[100px]">Started</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inTestTransports.map(transport => {
                  const progress = Math.floor(Math.random() * 40) + 40 // Simulated progress
                  return (
                    <TableRow key={transport.id}>
                      <TableCell>
                        <Link href={`/transports/${transport.id}`} className="font-mono font-semibold text-primary hover:underline">
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
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Progress value={progress} className="h-2 flex-1" />
                            <span className="text-xs text-muted-foreground w-8">{progress}%</span>
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <Activity className="h-3 w-3" />
                            {Math.floor(transport.linked_tests_count * progress / 100)}/{transport.linked_tests_count} cases
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {transport.in_test_at ? formatRelativeTime(transport.in_test_at) : '-'}
                      </TableCell>
                      <TableCell>
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
                            <DropdownMenuItem asChild>
                              <Link href={`/transports/${transport.id}/pipeline`}>
                                <Activity className="h-4 w-4 mr-2" />
                                Pipeline View
                              </Link>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </AppShell>
  )
}
