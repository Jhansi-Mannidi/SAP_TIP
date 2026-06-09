'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  Database,
  Shield,
  Lock,
  Search,
  MoreHorizontal,
  RefreshCw,
  Eye,
  Settings,
  Server,
  Unlock,
  ChevronRight,
} from 'lucide-react'

import { AppShell } from '@/components/app-shell'
import { KpiStatCard } from '@/components/design-system'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import {
  ClientDetailSheet,
  type ClientWithSystem,
} from '@/components/system-admin/client-detail-sheet'
import { MOCK_SAP_SYSTEMS } from '@/lib/config-mock-data'

const allClients: ClientWithSystem[] = MOCK_SAP_SYSTEMS.flatMap((system) =>
  system.clients.map((client) => ({
    ...client,
    system_sid: system.sid,
    system_name: system.display_name,
  })),
)

export default function ClientsPage() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [systemFilter, setSystemFilter] = React.useState<string>('all')
  const [productiveFilter, setProductiveFilter] = React.useState<string>('all')
  const [selectedClient, setSelectedClient] = React.useState<ClientWithSystem | null>(null)

  const productiveCount = allClients.filter((c) => c.is_productive).length
  const lockedCount = allClients.filter((c) => c.is_locked).length
  const systemCount = new Set(allClients.map((c) => c.system_id)).size

  const filteredClients = allClients.filter((client) => {
    const matchesSearch =
      client.client_number.includes(searchQuery) ||
      client.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.system_sid.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSystem = systemFilter === 'all' || client.system_id === systemFilter
    const matchesProductive =
      productiveFilter === 'all' ||
      (productiveFilter === 'productive' && client.is_productive) ||
      (productiveFilter === 'non-productive' && !client.is_productive)
    return matchesSearch && matchesSystem && matchesProductive
  })

  const hasActiveFilters =
    searchQuery.length > 0 || systemFilter !== 'all' || productiveFilter !== 'all'

  return (
    <AppShell currentApp="system-admin">
      <div className="flex flex-col h-full">
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <h1 className="page-title">Clients</h1>
                <p className="page-description mt-1 max-w-2xl">
                  SAP clients across all registered systems. Select a row to inspect metadata,
                  RFC bindings, and SCC4 lock status.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-5">
              <KpiStatCard label="Total Clients" value={allClients.length} icon={Database} tone="brand" />
              <KpiStatCard label="Systems" value={systemCount} icon={Server} tone="neutral" />
              <KpiStatCard label="Productive" value={productiveCount} icon={Shield} tone="danger" />
              <KpiStatCard label="Locked (SCC4)" value={lockedCount} icon={Lock} tone="warning" />
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-4">
              <div className="relative flex-1 sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search clients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9"
                />
              </div>

              <Select value={systemFilter} onValueChange={setSystemFilter}>
                <SelectTrigger className="w-full sm:w-[180px] h-9">
                  <SelectValue placeholder="System" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Systems</SelectItem>
                  {MOCK_SAP_SYSTEMS.map((system) => (
                    <SelectItem key={system.id} value={system.id}>
                      {system.sid} — {system.display_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={productiveFilter} onValueChange={setProductiveFilter}>
                <SelectTrigger className="w-full sm:w-[160px] h-9">
                  <SelectValue placeholder="Productive" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Clients</SelectItem>
                  <SelectItem value="productive">Productive Only</SelectItem>
                  <SelectItem value="non-productive">Non-Productive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          {productiveCount > 0 && (
            <div className="bg-red-50 dark:bg-red-950/30 border-b border-red-200 dark:border-red-900 px-4 md:px-6 py-3">
              <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
                <Shield className="h-4 w-4 shrink-0" />
                <span className="text-sm font-medium">
                  PRODUCTIVE CLIENTS — flag changes require approval. {productiveCount} productive
                  client(s) registered.
                </span>
              </div>
            </div>
          )}

          <div className="p-4 md:p-6 space-y-3">
            <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
              <span>
                Showing{' '}
                <span className="font-medium text-foreground tabular-nums">
                  {filteredClients.length}
                </span>{' '}
                of{' '}
                <span className="font-medium text-foreground tabular-nums">{allClients.length}</span>{' '}
                clients
              </span>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('')
                    setSystemFilter('all')
                    setProductiveFilter('all')
                  }}
                  className="text-xs text-brand hover:underline"
                >
                  Clear filters
                </button>
              )}
            </div>

            <div className="border rounded-xl overflow-hidden bg-card shadow-[var(--shadow-xs)]">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40 hover:bg-muted/40">
                    <TableHead>System / Client</TableHead>
                    <TableHead className="hidden sm:table-cell">Description</TableHead>
                    <TableHead className="hidden md:table-cell">Productive</TableHead>
                    <TableHead className="hidden md:table-cell">Locked</TableHead>
                    <TableHead className="hidden lg:table-cell">Recent Activity</TableHead>
                    <TableHead className="w-[52px]" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.map((client) => {
                    const isSelected = selectedClient?.id === client.id
                    return (
                      <TableRow
                        key={client.id}
                        className={cn(
                          'cursor-pointer relative transition-colors group',
                          client.is_productive && 'bg-red-50/40 dark:bg-red-950/15',
                          isSelected && 'bg-brand/[0.06] hover:bg-brand/[0.08]',
                        )}
                        onClick={() => setSelectedClient(client)}
                      >
                        {client.is_productive && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500" />
                        )}

                        <TableCell>
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              className={cn(
                                'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg font-mono text-xs font-bold text-white',
                                client.is_productive ? 'bg-red-500' : 'bg-indigo-500/90',
                              )}
                            >
                              {client.client_number}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <Link
                                  href={`/system-admin/systems/${client.system_id}`}
                                  onClick={(e) => e.stopPropagation()}
                                  className="font-mono text-sm font-bold hover:text-brand transition-colors"
                                >
                                  {client.system_sid}
                                </Link>
                                <span className="text-muted-foreground">/</span>
                                <span className="font-mono text-sm font-bold">
                                  {client.client_number}
                                </span>
                                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all hidden sm:block" />
                              </div>
                              <p className="text-xs text-muted-foreground truncate sm:hidden mt-0.5">
                                {client.description}
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="hidden sm:table-cell max-w-[220px]">
                          <span className="text-sm truncate block">{client.description}</span>
                        </TableCell>

                        <TableCell className="hidden md:table-cell">
                          {client.is_productive ? (
                            <Badge
                              variant="outline"
                              className="h-6 gap-1 text-[10px] border-red-500/35 text-red-700 dark:text-red-400 bg-red-500/[0.06]"
                            >
                              <Shield className="h-3 w-3" />
                              Productive
                            </Badge>
                          ) : (
                            <span className="text-xs text-muted-foreground">Non-productive</span>
                          )}
                        </TableCell>

                        <TableCell className="hidden md:table-cell">
                          {client.is_locked ? (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Badge
                                    variant="outline"
                                    className="h-6 gap-1 text-[10px] border-amber-500/35 text-amber-800 dark:text-amber-300 bg-amber-500/[0.06]"
                                  >
                                    <Lock className="h-3 w-3" />
                                    Locked
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent>Client locked via SCC4</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                              <Unlock className="h-3 w-3 opacity-50" />
                              Open
                            </span>
                          )}
                        </TableCell>

                        <TableCell className="hidden lg:table-cell text-sm text-muted-foreground tabular-nums">
                          {client.recent_activity || '—'}
                        </TableCell>

                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 opacity-60 group-hover:opacity-100"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setSelectedClient(client)}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Settings className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Sync from System
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>

            {filteredClients.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center rounded-xl border border-dashed border-border bg-muted/10">
                <Database className="h-12 w-12 text-muted-foreground/40 mb-4" />
                <h3 className="font-semibold text-lg">No clients found</h3>
                <p className="page-description mt-1 max-w-sm">
                  {hasActiveFilters
                    ? 'Try adjusting your search or filters.'
                    : 'Clients appear here when SAP systems are registered.'}
                </p>
                {hasActiveFilters && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => {
                      setSearchQuery('')
                      setSystemFilter('all')
                      setProductiveFilter('all')
                    }}
                  >
                    Clear filters
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        <ClientDetailSheet
          client={selectedClient}
          open={!!selectedClient}
          onOpenChange={(open) => !open && setSelectedClient(null)}
        />
      </div>
    </AppShell>
  )
}
