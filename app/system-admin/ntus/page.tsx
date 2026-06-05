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
  Clock,
  XCircle,
  Info,
} from 'lucide-react'

import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { cn } from '@/lib/utils'

import { 
  MOCK_NTUS, 
  MOCK_SAP_SYSTEMS,
  type NTUStatus,
  type AuthorityProfile,
} from '@/lib/config-mock-data'

const STATUS_CONFIG: Record<NTUStatus, { icon: React.ElementType; label: string; className: string }> = {
  active: { icon: CheckCircle2, label: 'Active', className: 'text-emerald-600 dark:text-emerald-400' },
  rotating: { icon: RefreshCw, label: 'Rotating', className: 'text-blue-600 dark:text-blue-400 animate-spin' },
  expired: { icon: AlertCircle, label: 'Expired', className: 'text-amber-600 dark:text-amber-400' },
  disabled: { icon: XCircle, label: 'Disabled', className: 'text-muted-foreground' },
}

const AUTHORITY_COLORS: Record<AuthorityProfile, string> = {
  READ_ONLY: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
  TEST_EXECUTION: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  FULL_AUTH: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  DATA_MIGRATION: 'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-400',
}

export default function NTUsPage() {
  const [searchQuery, setSearchQuery] = React.useState('')
  
  const filteredNTUs = MOCK_NTUS.filter(ntu => 
    ntu.name.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  const getSystemSid = (systemId: string) => {
    const system = MOCK_SAP_SYSTEMS.find(s => s.id === systemId)
    return system?.sid || systemId
  }
  
  const getSystemProductive = (systemId: string) => {
    const system = MOCK_SAP_SYSTEMS.find(s => s.id === systemId)
    return system?.is_productive || false
  }
  
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  return (
    <AppShell currentApp="system-admin">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <h1 className="page-title">Named Technical Users</h1>
                <p className="page-description mt-1 max-w-2xl">
                  Vault-backed SAP user accounts used by the platform for execution. Credentials never displayed; only references.
                </p>
              </div>
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                <span>Add NTU</span>
              </Button>
            </div>
            
            {/* Search */}
            <div className="flex items-center gap-3 mt-4">
              <div className="relative flex-1 sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search NTUs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Banner */}
        <div className="px-4 md:px-6 pt-4">
          <Alert className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900">
            <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <AlertDescription className="text-blue-700 dark:text-blue-400">
              Credentials are never visible in the UI. All access is vault-mediated and audit-logged.
            </AlertDescription>
          </Alert>
        </div>
        
        {/* Table */}
        <div className="flex-1 overflow-auto p-4 md:p-6">
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>SAP System</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Vault Reference</TableHead>
                  <TableHead>Last Rotation</TableHead>
                  <TableHead>Authority Profile</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[60px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNTUs.map((ntu) => {
                  const StatusIcon = STATUS_CONFIG[ntu.status].icon
                  const isProductive = getSystemProductive(ntu.system_id)
                  
                  return (
                    <TableRow 
                      key={ntu.id}
                      className={cn(
                        'relative',
                        isProductive && 'bg-red-50/50 dark:bg-red-950/20'
                      )}
                    >
                      {isProductive && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500" />
                      )}
                      <TableCell className="font-mono font-medium">{ntu.name}</TableCell>
                      <TableCell>
                        <Link 
                          href={`/system-admin/systems/${ntu.system_id}`}
                          className="text-primary hover:underline font-mono"
                        >
                          {getSystemSid(ntu.system_id)}
                        </Link>
                      </TableCell>
                      <TableCell className="font-mono">{ntu.client}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <code className="text-xs bg-muted px-2 py-1 rounded max-w-[180px] truncate">
                            {ntu.vault_ref}
                          </code>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-6 w-6"
                                  onClick={() => navigator.clipboard.writeText(ntu.vault_ref)}
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Copy vault path</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(ntu.last_rotation)}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="secondary"
                          className={cn('font-mono text-xs', AUTHORITY_COLORS[ntu.authority_profile])}
                        >
                          {ntu.authority_profile}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className={cn('flex items-center gap-1.5', STATUS_CONFIG[ntu.status].className)}>
                          <StatusIcon className="h-4 w-4" />
                          <span className="text-sm">{STATUS_CONFIG[ntu.status].label}</span>
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
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
          
          {filteredNTUs.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Key className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="font-semibold text-lg">No NTUs found</h3>
              <p className="page-description mt-1">
                Add a Named Technical User to enable platform access to SAP systems
              </p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
