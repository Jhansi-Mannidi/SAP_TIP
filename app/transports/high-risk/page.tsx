'use client'

import * as React from 'react'
import Link from 'next/link'
import { AlertTriangle, Search, Eye, MoreHorizontal } from 'lucide-react'

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

import { MOCK_TRANSPORTS, type TransportState } from '@/lib/transport-mock-data'

function getStateColor(state: TransportState): string {
  switch (state) {
    case 'Captured': return 'bg-slate-500'
    case 'Classified': return 'bg-blue-500'
    case 'Analyzed': return 'bg-indigo-500'
    case 'Test_Plan_Ready': return 'bg-amber-500'
    case 'Test_Plan_Approved': return 'bg-lime-500'
    case 'In_Test': return 'bg-cyan-500'
    case 'Released_to_QAS': return 'bg-emerald-500'
    case 'Released_to_PROD': return 'bg-green-600'
    case 'Closed': return 'bg-gray-400'
    default: return 'bg-gray-500'
  }
}

export default function HighRiskPage() {
  const [searchQuery, setSearchQuery] = React.useState('')

  const highRiskTransports = MOCK_TRANSPORTS
    .filter(t => t.risk_band === 'high' || t.risk_band === 'critical')
    .filter(t => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        return t.tr_number.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
      }
      return true
    })
    .sort((a, b) => b.risk_score - a.risk_score)

  const criticalCount = highRiskTransports.filter(t => t.risk_band === 'critical').length
  const highCount = highRiskTransports.filter(t => t.risk_band === 'high').length

  return (
    <AppShell currentApp="transport-intelligence">
      <div className="flex flex-col h-full">
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <h1 className="page-title flex items-center gap-2">
                  <AlertTriangle className="h-6 w-6 text-red-500" />
                  High Risk Transports
                </h1>
                <p className="page-description mt-1">
                  Transports with critical or high risk scores requiring extra attention.
                </p>
              </div>
            </div>

            <StaggerGrid columns="grid-cols-2" className="gap-3 mt-4 max-w-md" fast>
              <Card className="bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900">
                <CardContent>
                  <div className="stat-value text-red-700 dark:text-red-400">{criticalCount}</div>
                  <div className="text-xs text-red-600 dark:text-red-500">Critical Risk</div>
                </CardContent>
              </Card>
              <Card className="bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-900">
                <CardContent>
                  <div className="stat-value text-orange-700 dark:text-orange-400">{highCount}</div>
                  <div className="text-xs text-orange-600 dark:text-orange-500">High Risk</div>
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
          {highRiskTransports.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <AlertTriangle className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="font-semibold text-lg">No high-risk transports</h3>
              <p className="page-description mt-1">All transports have acceptable risk levels</p>
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
                  <TableHead className="w-[200px]">Top Risk Factor</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {highRiskTransports.map(transport => (
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
                      <Badge variant="secondary" className={cn('text-white', getStateColor(transport.state))}>
                        {transport.state.replace(/_/g, ' ')}
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
                      <Badge variant={transport.risk_band === 'critical' ? 'destructive' : 'default'} className="font-mono">
                        {(transport.risk_score * 100).toFixed(0)}%
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                        {transport.risk_factors[0]?.description || '-'}
                      </div>
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
