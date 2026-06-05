'use client'

import * as React from 'react'
import Link from 'next/link'
import { Rocket, Search, Eye, MoreHorizontal, CheckCircle2 } from 'lucide-react'

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

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function ReleasedPRODPage() {
  const [searchQuery, setSearchQuery] = React.useState('')

  const releasedTransports = MOCK_TRANSPORTS
    .filter(t => t.state === 'Released_to_PROD' || t.state === 'Closed')
    .filter(t => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        return t.tr_number.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
      }
      return true
    })
    .sort((a, b) => {
      const aDate = a.released_to_prod_at || a.captured_at
      const bDate = b.released_to_prod_at || b.captured_at
      return new Date(bDate).getTime() - new Date(aDate).getTime()
    })

  return (
    <AppShell currentApp="transport-intelligence">
      <div className="flex flex-col h-full">
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <h1 className="page-title flex items-center gap-2">
                  <Rocket className="h-6 w-6 text-green-600" />
                  Released to PROD
                </h1>
                <p className="page-description mt-1">
                  Transports successfully deployed to Production.
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/transports/in-test">In Test</Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/transports/released-qas">Released to QAS</Link>
                </Button>
              </div>
            </div>

            <StaggerGrid columns="grid-cols-2" className="gap-3 mt-4 max-w-md" fast>
              <Card className="bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900">
                <CardContent>
                  <div className="stat-value text-green-700 dark:text-green-400">{releasedTransports.length}</div>
                  <div className="text-xs text-green-600 dark:text-green-500">In PROD</div>
                </CardContent>
              </Card>
              <Card className="bg-muted/50">
                <CardContent>
                  <div className="stat-value">{releasedTransports.filter(t => t.state === 'Closed').length}</div>
                  <div className="text-xs text-muted-foreground">Closed</div>
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
              <Rocket className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="font-semibold text-lg">No transports in PROD</h3>
              <p className="page-description mt-1">Transports will appear here after PROD release</p>
            </div>
          ) : (
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10">
                <TableRow>
                  <TableHead className="w-[140px]">TR Number</TableHead>
                  <TableHead className="min-w-[200px]">Description</TableHead>
                  <TableHead className="w-[100px]">Owner</TableHead>
                  <TableHead className="w-[100px]">Outcome</TableHead>
                  <TableHead className="w-[160px]">Released to PROD</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
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
                      <div className="flex items-center gap-1.5 text-green-600">
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="text-sm font-medium">Success</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm font-medium">
                      {transport.released_to_prod_at ? formatDate(transport.released_to_prod_at) : '-'}
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
                            <Link href={`/transports/${transport.id}/audit`}>
                              <Eye className="h-4 w-4 mr-2" />
                              Audit Trail
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
