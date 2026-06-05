'use client'

import * as React from 'react'
import Link from 'next/link'
import { 
  Plug, 
  Plus,
  Search,
  MoreHorizontal,
  Activity,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Copy,
  Loader2,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

import { 
  MOCK_RFC_DESTINATIONS, 
  MOCK_SAP_SYSTEMS,
  type HealthStatus,
} from '@/lib/config-mock-data'

function SystemHealthBadge({ health }: { health: HealthStatus }) {
  const config = {
    healthy: { icon: CheckCircle2, label: 'Healthy', className: 'text-emerald-600 dark:text-emerald-400' },
    degraded: { icon: AlertTriangle, label: 'Degraded', className: 'text-amber-600 dark:text-amber-400' },
    unhealthy: { icon: XCircle, label: 'Unhealthy', className: 'text-red-600 dark:text-red-400' },
    unknown: { icon: AlertTriangle, label: 'Unknown', className: 'text-muted-foreground' },
  }
  
  const { icon: Icon, label, className } = config[health]
  
  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <Icon className="h-4 w-4" />
      <span className="text-sm">{label}</span>
    </div>
  )
}

export default function RFCDestinationsPage() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [testingId, setTestingId] = React.useState<string | null>(null)
  const [testResult, setTestResult] = React.useState<{ id: string; success: boolean; latency: number } | null>(null)
  
  const filteredDestinations = MOCK_RFC_DESTINATIONS.filter(rfc => 
    rfc.name.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  const getSystemSid = (systemId: string) => {
    const system = MOCK_SAP_SYSTEMS.find(s => s.id === systemId)
    return system?.sid || systemId
  }
  
  const handleTestConnection = async (rfcId: string) => {
    setTestingId(rfcId)
    setTestResult(null)
    
    // Simulate test
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setTestingId(null)
    setTestResult({
      id: rfcId,
      success: Math.random() > 0.1,
      latency: Math.floor(Math.random() * 50) + 30,
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
                <h1 className="page-title">RFC Destinations</h1>
                <p className="page-description mt-1 max-w-2xl">
                  Registered iHub connections to SAP systems. Used for read-only data access and execution where applicable.
                </p>
              </div>
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                <span>New Destination</span>
              </Button>
            </div>
            
            {/* Search */}
            <div className="flex items-center gap-3 mt-4">
              <div className="relative flex-1 sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search destinations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </div>
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
                  <TableHead>NTU Credential Ref</TableHead>
                  <TableHead>Pool Size</TableHead>
                  <TableHead>Last Health Check</TableHead>
                  <TableHead>Health</TableHead>
                  <TableHead className="w-[120px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDestinations.map((rfc) => (
                  <TableRow key={rfc.id}>
                    <TableCell className="font-mono font-medium">{rfc.name}</TableCell>
                    <TableCell>
                      <Link 
                        href={`/system-admin/systems/${rfc.system_id}`}
                        className="text-primary hover:underline font-mono"
                      >
                        {getSystemSid(rfc.system_id)}
                      </Link>
                    </TableCell>
                    <TableCell className="font-mono">{rfc.client}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-muted px-2 py-1 rounded max-w-[180px] truncate">
                          {rfc.ntu_ref}
                        </code>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-6 w-6"
                                onClick={() => navigator.clipboard.writeText(rfc.ntu_ref)}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Copy vault path</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableCell>
                    <TableCell>{rfc.pool_size}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(rfc.last_health_check).toLocaleTimeString()}
                    </TableCell>
                    <TableCell>
                      <SystemHealthBadge health={rfc.health} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleTestConnection(rfc.id)}
                          disabled={testingId === rfc.id}
                        >
                          {testingId === rfc.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Activity className="h-4 w-4" />
                          )}
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>View Logs</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredDestinations.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Plug className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="font-semibold text-lg">No RFC destinations found</h3>
              <p className="page-description mt-1">
                Create a new RFC destination to connect to SAP systems
              </p>
            </div>
          )}
        </div>
        
        {/* Test Result Dialog */}
        <Dialog open={!!testResult} onOpenChange={() => setTestResult(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Connection Test Result</DialogTitle>
              <DialogDescription>
                RFC destination connectivity test completed
              </DialogDescription>
            </DialogHeader>
            
            {testResult && (
              <div className="py-6">
                <div className={cn(
                  'flex flex-col items-center gap-4 p-6 rounded-lg',
                  testResult.success 
                    ? 'bg-emerald-50 dark:bg-emerald-950/30' 
                    : 'bg-red-50 dark:bg-red-950/30'
                )}>
                  {testResult.success ? (
                    <CheckCircle2 className="h-12 w-12 text-emerald-600" />
                  ) : (
                    <XCircle className="h-12 w-12 text-red-600" />
                  )}
                  <div className="text-center">
                    <p className={cn(
                      'font-semibold text-lg',
                      testResult.success ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'
                    )}>
                      {testResult.success ? 'Connection Successful' : 'Connection Failed'}
                    </p>
                    {testResult.success && (
                      <p className="page-description mt-1">
                        Latency: <span className="font-mono">{testResult.latency}ms</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button onClick={() => setTestResult(null)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  )
}
