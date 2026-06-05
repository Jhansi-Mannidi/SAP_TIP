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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

import { MOCK_SAP_SYSTEMS } from '@/lib/config-mock-data'

// Flatten all clients with system info
const allClients = MOCK_SAP_SYSTEMS.flatMap(system => 
  system.clients.map(client => ({
    ...client,
    system_sid: system.sid,
    system_name: system.display_name,
  }))
)

export default function ClientsPage() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [systemFilter, setSystemFilter] = React.useState<string>('all')
  const [productiveFilter, setProductiveFilter] = React.useState<string>('all')
  const [selectedClient, setSelectedClient] = React.useState<typeof allClients[0] | null>(null)
  
  const filteredClients = allClients.filter(client => {
    const matchesSearch = client.client_number.includes(searchQuery) ||
                          client.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          client.system_sid.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSystem = systemFilter === 'all' || client.system_id === systemFilter
    const matchesProductive = productiveFilter === 'all' || 
                              (productiveFilter === 'productive' && client.is_productive) ||
                              (productiveFilter === 'non-productive' && !client.is_productive)
    return matchesSearch && matchesSystem && matchesProductive
  })

  return (
    <AppShell currentApp="system-admin">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <h1 className="page-title">Clients</h1>
                <p className="page-description mt-1 max-w-2xl">
                  SAP clients across all registered systems. Click a row to view details.
                </p>
              </div>
            </div>
            
            {/* Filters */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-4">
              <div className="relative flex-1 sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search clients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              <Select value={systemFilter} onValueChange={setSystemFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="System" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Systems</SelectItem>
                  {MOCK_SAP_SYSTEMS.map(system => (
                    <SelectItem key={system.id} value={system.id}>{system.sid}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={productiveFilter} onValueChange={setProductiveFilter}>
                <SelectTrigger className="w-full sm:w-[160px]">
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
        
        {/* Table */}
        <div className="flex-1 overflow-auto p-4 md:p-6">
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>System / Client</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Productive</TableHead>
                  <TableHead>Locked</TableHead>
                  <TableHead>Recent Activity</TableHead>
                  <TableHead className="w-[60px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow 
                    key={client.id} 
                    className={cn(
                      'cursor-pointer relative',
                      client.is_productive && 'bg-red-50/50 dark:bg-red-950/20'
                    )}
                    onClick={() => setSelectedClient(client)}
                  >
                    {client.is_productive && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500" />
                    )}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold">{client.system_sid}</span>
                        <span className="text-muted-foreground">/</span>
                        <span className="font-mono text-lg font-bold">{client.client_number}</span>
                      </div>
                    </TableCell>
                    <TableCell>{client.description}</TableCell>
                    <TableCell>
                      {client.is_productive ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Shield className="h-4 w-4 text-red-500" />
                            </TooltipTrigger>
                            <TooltipContent>Productive Client</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {client.is_locked ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Lock className="h-4 w-4 text-amber-500" />
                            </TooltipTrigger>
                            <TooltipContent>Client locked (SCC4)</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{client.recent_activity}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
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
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredClients.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Database className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="font-semibold text-lg">No clients found</h3>
              <p className="page-description mt-1">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>
        
        {/* Client Detail Drawer */}
        <Sheet open={!!selectedClient} onOpenChange={() => setSelectedClient(null)}>
          <SheetContent className="w-[400px] sm:w-[540px]">
            {selectedClient && (
              <>
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <span className="font-mono">{selectedClient.system_sid} / {selectedClient.client_number}</span>
                    {selectedClient.is_productive && <Shield className="h-4 w-4 text-red-500" />}
                  </SheetTitle>
                  <SheetDescription>{selectedClient.description}</SheetDescription>
                </SheetHeader>
                
                <div className="mt-6 space-y-6">
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Client Details</h4>
                    <StaggerGrid columns="grid-cols-2" className="gap-4 text-sm" fast>
                      <div>
                        <span className="text-muted-foreground">System</span>
                        <p className="font-medium">{selectedClient.system_name}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Client Number</span>
                        <p className="font-mono font-medium">{selectedClient.client_number}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Productive</span>
                        <p className="font-medium">{selectedClient.is_productive ? 'Yes' : 'No'}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Locked (SCC4)</span>
                        <p className="font-medium">{selectedClient.is_locked ? 'Yes' : 'No'}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Recent Activity</span>
                        <p className="font-medium">{selectedClient.recent_activity}</p>
                      </div>
                    </StaggerGrid>
                  </div>
                  
                  {selectedClient.is_productive && (
                    <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg p-4">
                      <p className="text-sm text-red-700 dark:text-red-400">
                        This is a productive client. Changing the productive flag requires approval.
                      </p>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Sync from System
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Settings className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </div>
              </>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </AppShell>
  )
}
