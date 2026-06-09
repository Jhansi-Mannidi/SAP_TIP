'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  Key,
  Plus,
  Search,
  MoreHorizontal,
  Copy,
  RefreshCw,
  ShieldAlert,
  History,
  Trash2,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Info,
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
  DropdownMenuSeparator,
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
import { Alert, AlertDescription } from '@/components/ui/alert'
import { cn } from '@/lib/utils'
import {
  NtuDetailSheet,
  AUTHORITY_COLORS,
  STATUS_CONFIG,
  enrichNtu,
  type NTUWithSystem,
} from '@/components/system-admin/ntu-detail-sheet'
import { MOCK_NTUS, type NTUStatus } from '@/lib/config-mock-data'

const STATUS_ICONS: Record<NTUStatus, React.ElementType> = {
  active: CheckCircle2,
  rotating: RefreshCw,
  expired: AlertCircle,
  disabled: XCircle,
}

export default function NTUsPage() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState<string>('all')
  const [selectedNtu, setSelectedNtu] = React.useState<NTUWithSystem | null>(null)

  const enrichedNtus = React.useMemo(() => MOCK_NTUS.map(enrichNtu), [])

  const activeCount = enrichedNtus.filter((n) => n.status === 'active').length
  const productiveCount = enrichedNtus.filter((n) => n.is_productive).length
  const rotatingCount = enrichedNtus.filter((n) => n.status === 'rotating').length

  const filteredNTUs = enrichedNtus.filter((ntu) => {
    const matchesSearch =
      ntu.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ntu.system_sid.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || ntu.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })

  return (
    <AppShell currentApp="system-admin">
      <div className="flex flex-col h-full">
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <h1 className="page-title">Named Technical Users</h1>
                <p className="page-description mt-1 max-w-2xl">
                  Vault-backed SAP user accounts used by the platform for execution. Credentials never
                  displayed; only references.
                </p>
              </div>
              <Button size="sm" className="gap-2" asChild>
                <Link href="/system-admin/ntus/new">
                  <Plus className="h-4 w-4" />
                  <span>Add NTU</span>
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-5">
              <KpiStatCard label="Total NTUs" value={MOCK_NTUS.length} icon={Key} tone="brand" />
              <KpiStatCard label="Active" value={activeCount} icon={CheckCircle2} tone="success" />
              <KpiStatCard label="On Productive" value={productiveCount} icon={ShieldAlert} tone="danger" />
              <KpiStatCard label="Rotating" value={rotatingCount} icon={RefreshCw} tone="info" />
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-4">
              <div className="relative flex-1 sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search NTUs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[150px] h-9">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="rotating">Rotating</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="disabled">Disabled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="px-4 md:px-6 pt-4">
          <Alert className="rounded-xl border-blue-200/80 dark:border-blue-900/60 bg-blue-50/80 dark:bg-blue-950/25">
            <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <AlertDescription className="text-blue-700 dark:text-blue-300 text-sm">
              Credentials are never visible in the UI. All access is vault-mediated and audit-logged.
            </AlertDescription>
          </Alert>
        </div>

        <div className="flex-1 overflow-auto p-4 md:p-6 space-y-3">
          <p className="text-sm text-muted-foreground">
            Showing{' '}
            <span className="font-medium text-foreground tabular-nums">{filteredNTUs.length}</span> of{' '}
            <span className="font-medium text-foreground tabular-nums">{MOCK_NTUS.length}</span> NTUs
          </p>

          {filteredNTUs.length > 0 ? (
            <div className="border rounded-xl overflow-hidden bg-card shadow-[var(--shadow-xs)]">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40 hover:bg-muted/40">
                    <TableHead>Name</TableHead>
                    <TableHead>SAP System</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead className="hidden md:table-cell">Vault Reference</TableHead>
                    <TableHead className="hidden lg:table-cell">Last Rotation</TableHead>
                    <TableHead>Authority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[52px]" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredNTUs.map((ntu) => {
                    const StatusIcon = STATUS_ICONS[ntu.status]
                    const statusStyle = STATUS_CONFIG[ntu.status]

                    return (
                      <TableRow
                        key={ntu.id}
                        className={cn(
                          'group cursor-pointer transition-colors',
                          ntu.is_productive && 'bg-red-50/40 dark:bg-red-950/10',
                        )}
                        onClick={() => setSelectedNtu(ntu)}
                      >
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                              <Key className="h-3.5 w-3.5" />
                            </div>
                            <span className="font-mono font-medium text-sm">{ntu.name}</span>
                            {ntu.is_productive && (
                              <ShieldAlert className="h-3.5 w-3.5 text-red-500 shrink-0" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Link
                            href={`/system-admin/systems/${ntu.system_id}`}
                            className="font-mono text-sm text-primary hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {ntu.system_sid}
                          </Link>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{ntu.client}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex items-center gap-1.5 max-w-[200px]">
                            <code className="text-xs bg-muted/60 px-2 py-1 rounded-md truncate font-mono">
                              {ntu.vault_ref}
                            </code>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      navigator.clipboard.writeText(ntu.vault_ref)
                                    }}
                                  >
                                    <Copy className="h-3 w-3" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Copy vault path</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                          {formatDate(ntu.last_rotation)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={cn('font-mono text-[10px] border', AUTHORITY_COLORS[ntu.authority_profile])}
                          >
                            {ntu.authority_profile}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span
                            className={cn(
                              'inline-flex items-center gap-1 text-xs font-medium',
                              statusStyle.pill.split(' ').find((c) => c.startsWith('text-')),
                            )}
                          >
                            <StatusIcon
                              className={cn('h-3.5 w-3.5', ntu.status === 'rotating' && 'animate-spin')}
                            />
                            {statusStyle.label}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-1">
                            <ChevronRight className="h-4 w-4 text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <RefreshCw className="h-4 w-4 mr-2" />
                                  Rotate Now
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <History className="h-4 w-4 mr-2" />
                                  View Rotation History
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600 dark:text-red-400">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Decommission
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center rounded-xl border border-dashed bg-muted/20">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted mb-4">
                <Key className="h-7 w-7 text-muted-foreground/60" />
              </div>
              <h3 className="font-semibold text-lg">No NTUs found</h3>
              <p className="page-description mt-1 max-w-sm">
                Add a Named Technical User to enable platform access to SAP systems
              </p>
              <Button size="sm" className="mt-5 gap-2" asChild>
                <Link href="/system-admin/ntus/new">
                  <Plus className="h-4 w-4" />
                  Add NTU
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>

      <NtuDetailSheet
        ntu={selectedNtu}
        open={!!selectedNtu}
        onOpenChange={(open) => !open && setSelectedNtu(null)}
      />
    </AppShell>
  )
}
