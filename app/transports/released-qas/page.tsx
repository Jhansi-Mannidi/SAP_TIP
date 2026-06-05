'use client'

import * as React from 'react'
import Link from 'next/link'
import { CheckCircle, Search, Eye, MoreHorizontal, Rocket, ArrowRight } from 'lucide-react'

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

export default function ReleasedQASPage() {
  const [searchQuery, setSearchQuery] = React.useState('')

  const releasedTransports = MOCK_TRANSPORTS
    .filter(t => t.state === 'Released_to_QAS')
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
                  <CheckCircle className="h-6 w-6 text-emerald-500" />
                  Released to QAS
                </h1>
                <p className="page-description mt-1">
                  Transports released to Quality Assurance system.
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/transports/in-test">In Test</Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/transports/released-prod">Released to PROD</Link>
                </Button>
              </div>
            </div>

            <StaggerGrid columns="grid-cols-2" className="gap-3 mt-4 max-w-md" fast>
              <Card className="bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900">
                <CardContent>
                  <div className="stat-value text-emerald-700 dark:text-emerald-400">{releasedTransports.length}</div>
                  <div className="text-xs text-emerald-600 dark:text-emerald-500">In QAS</div>
                </CardContent>
              </Card>
              <Card className="bg-muted/50">
                <CardContent>
                  <div className="stat-value">{releasedTransports.filter(t => t.risk_band === 'low').length}</div>
                  <div className="text-xs text-muted-foreground">Ready for PROD</div>
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
          {releasedTransports.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <CheckCircle className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="font-semibold text-lg">No transports in QAS</h3>
              <p className="page-description mt-1">All transports have progressed to PROD</p>
            </div>
          ) : (
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10">
                <TableRow>
                  <TableHead className="w-[140px]">TR Number</TableHead>
                  <TableHead className="min-w-[200px]">Description</TableHead>
                  <TableHead className="w-[100px]">Owner</TableHead>
                  <TableHead className="w-[100px]">Risk</TableHead>
                  <TableHead className="w-[120px]">Released to QAS</TableHead>
                  <TableHead className="w-[150px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {releasedTransports.map(transport => (
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
                      <Badge variant={transport.risk_band === 'low' ? 'secondary' : 'default'}>
                        {transport.risk_band}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {transport.released_to_qas_at ? formatRelativeTime(transport.released_to_qas_at) : '-'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" className="gap-1">
                          <Rocket className="h-3 w-3" />
                          Promote to PROD
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
