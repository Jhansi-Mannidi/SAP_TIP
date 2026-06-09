'use client'

import * as React from 'react'
import Link from 'next/link'
import { 
  Server, 
  Plus, 
  RefreshCw,
  Shield,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  MoreHorizontal,
  Eye,
  Settings,
  Trash2,
  Activity,
  Search,
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
import { cn } from '@/lib/utils'

import { 
  MOCK_SAP_SYSTEMS, 
  SYSTEM_KIND_LABELS, 
  LANDSCAPE_ROLE_COLORS,
  type SystemKind,
  type LandscapeRole,
  type HealthStatus,
} from '@/lib/config-mock-data'

function SystemHealthBadge({ health }: { health: HealthStatus }) {
  const config = {
    healthy: { icon: CheckCircle2, label: 'Healthy', className: 'text-emerald-600 dark:text-emerald-400' },
    degraded: { icon: AlertTriangle, label: 'Degraded', className: 'text-amber-600 dark:text-amber-400' },
    unhealthy: { icon: XCircle, label: 'Unhealthy', className: 'text-red-600 dark:text-red-400' },
    unknown: { icon: HelpCircle, label: 'Unknown', className: 'text-muted-foreground' },
  }
  
  const { icon: Icon, label, className } = config[health]
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn('flex items-center gap-1.5', className)}>
            <Icon className="h-4 w-4" />
            <span className="text-sm">{label}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>System health: {label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

function LandscapeRoleBadge({ role }: { role: LandscapeRole }) {
  return (
    <Badge 
      variant="secondary" 
      className={cn(
        'text-white font-mono text-xs',
        LANDSCAPE_ROLE_COLORS[role]
      )}
    >
      {role}
    </Badge>
  )
}

function SystemKindBadge({ kind }: { kind: SystemKind }) {
  return (
    <Badge variant="outline" className="font-normal">
      {SYSTEM_KIND_LABELS[kind]}
    </Badge>
  )
}

export default function SAPSystemsPage() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [kindFilter, setKindFilter] = React.useState<string>('all')
  const [roleFilter, setRoleFilter] = React.useState<string>('all')
  const [productiveFilter, setProductiveFilter] = React.useState<string>('all')
  
  const productiveSystems = MOCK_SAP_SYSTEMS.filter(s => s.is_productive)
  
  const filteredSystems = MOCK_SAP_SYSTEMS.filter(system => {
    const matchesSearch = system.sid.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          system.display_name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesKind = kindFilter === 'all' || system.kind === kindFilter
    const matchesRole = roleFilter === 'all' || system.landscape_role === roleFilter
    const matchesProductive = productiveFilter === 'all' || 
                              (productiveFilter === 'productive' && system.is_productive) ||
                              (productiveFilter === 'non-productive' && !system.is_productive)
    return matchesSearch && matchesKind && matchesRole && matchesProductive
  })

  return (
    <AppShell currentApp="system-admin">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <h1 className="page-title">SAP Systems</h1>
                <p className="page-description mt-1 max-w-2xl">
                  Registered SAP systems integrated with this tenant — source, dev, QAS, pre-prod, prod, sandbox, training. iHub connectors and runner capacity bind here.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  <span className="hidden sm:inline">Health Check All</span>
                </Button>
                <Button size="sm" className="gap-2" asChild>
                  <Link href="/system-admin/systems/new">
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">New System</span>
                  </Link>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-5">
              <KpiStatCard label="Total Systems" value={MOCK_SAP_SYSTEMS.length} icon={Server} tone="brand" />
              <KpiStatCard
                label="Healthy"
                value={MOCK_SAP_SYSTEMS.filter((s) => s.health === 'healthy').length}
                icon={CheckCircle2}
                tone="success"
              />
              <KpiStatCard
                label="Productive"
                value={productiveSystems.length}
                icon={Shield}
                tone="danger"
              />
              <KpiStatCard
                label="Landscapes"
                value={new Set(MOCK_SAP_SYSTEMS.map((s) => s.landscape_role)).size}
                icon={Activity}
                tone="info"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-4">
              <div className="relative flex-1 sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by SID or name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              <Select value={kindFilter} onValueChange={setKindFilter}>
                <SelectTrigger className="w-full sm:w-[160px]">
                  <SelectValue placeholder="System Kind" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Kinds</SelectItem>
                  <SelectItem value="ECC">ECC</SelectItem>
                  <SelectItem value="S4HANA_ONPREM">S/4HANA On-Prem</SelectItem>
                  <SelectItem value="S4HANA_CLOUD">S/4HANA Cloud</SelectItem>
                  <SelectItem value="S4HANA_PRIVATE">S/4HANA Private</SelectItem>
                  <SelectItem value="BTP">BTP</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full sm:w-[140px]">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="DEV">DEV</SelectItem>
                  <SelectItem value="QAS">QAS</SelectItem>
                  <SelectItem value="PRE">PRE</SelectItem>
                  <SelectItem value="PROD">PROD</SelectItem>
                  <SelectItem value="SBX">SBX</SelectItem>
                  <SelectItem value="TRN">TRN</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={productiveFilter} onValueChange={setProductiveFilter}>
                <SelectTrigger className="w-full sm:w-[160px]">
                  <SelectValue placeholder="Productive" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Systems</SelectItem>
                  <SelectItem value="productive">Productive Only</SelectItem>
                  <SelectItem value="non-productive">Non-Productive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        {/* Table */}
        <div className="flex-1 overflow-auto">
          {/* Productive Systems Banner */}
          {productiveSystems.length > 0 && (
            <div className="bg-red-50 dark:bg-red-950/30 border-b border-red-200 dark:border-red-900 px-4 md:px-6 py-3">
              <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
                <Shield className="h-4 w-4" />
                <span className="text-sm font-medium">
                  PRODUCTIVE SYSTEMS — destructive operations restricted. {productiveSystems.length} productive system(s) registered.
                </span>
              </div>
            </div>
          )}
          
          <div className="p-4 md:p-6 space-y-3">
            <p className="text-sm text-muted-foreground">
              Showing{' '}
              <span className="font-medium text-foreground tabular-nums">{filteredSystems.length}</span>{' '}
              of{' '}
              <span className="font-medium text-foreground tabular-nums">{MOCK_SAP_SYSTEMS.length}</span>{' '}
              systems
            </p>
            <div className="border rounded-xl overflow-hidden bg-card shadow-[var(--shadow-xs)]">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40 hover:bg-muted/40">
                    <TableHead className="w-[100px]">SID</TableHead>
                    <TableHead>Display Name</TableHead>
                    <TableHead>Kind</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="hidden lg:table-cell">Host</TableHead>
                    <TableHead className="hidden md:table-cell">Client</TableHead>
                    <TableHead className="hidden md:table-cell">Productive</TableHead>
                    <TableHead className="hidden lg:table-cell">Region</TableHead>
                    <TableHead>Health</TableHead>
                    <TableHead className="w-[60px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSystems.map((system) => (
                    <TableRow 
                      key={system.id} 
                      className={cn(
                        'relative',
                        system.is_productive && 'bg-red-50/50 dark:bg-red-950/20'
                      )}
                    >
                      {/* Red left edge strip for productive systems */}
                      {system.is_productive && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500" />
                      )}
                      
                      <TableCell className="font-mono text-lg font-bold">
                        <Link href={`/system-admin/systems/${system.id}`} className="hover:text-primary">
                          {system.sid}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Link href={`/system-admin/systems/${system.id}`} className="hover:text-primary">
                          {system.display_name}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <SystemKindBadge kind={system.kind} />
                      </TableCell>
                      <TableCell>
                        <LandscapeRoleBadge role={system.landscape_role} />
                      </TableCell>
                      <TableCell className="hidden lg:table-cell font-mono text-xs text-muted-foreground max-w-[200px] truncate">
                        {system.host}
                      </TableCell>
                      <TableCell className="hidden md:table-cell font-mono">
                        {system.default_client}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {system.is_productive ? (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Shield className="h-4 w-4 text-red-500" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Productive System - Restricted Operations</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                        {system.region}
                      </TableCell>
                      <TableCell>
                        <SystemHealthBadge health={system.health} />
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
                              <Link href={`/system-admin/systems/${system.id}`}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Settings className="h-4 w-4 mr-2" />
                              Edit Metadata
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Activity className="h-4 w-4 mr-2" />
                              Run Connectivity Test
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600 dark:text-red-400">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Decommission
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {filteredSystems.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Server className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <h3 className="font-semibold text-lg">No systems found</h3>
                <p className="page-description mt-1">
                  Try adjusting your search or filters
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  )
}
