'use client'

import * as React from 'react'
import Link from 'next/link'
import { 
  Camera,
  Plus,
  Download,
  RefreshCw,
  MoreHorizontal,
  ExternalLink,
  Search,
  Database,
  Server,
  Clock,
  HardDrive,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Trash2,
  Copy,
} from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { KpiStatCard, StaggerGrid } from '@/components/design-system'
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { MOCK_SNAPSHOTS, type MasterDataSnapshot, type StalenessLevel } from '@/lib/mock-data'

// Staleness indicator component
function StalenessIndicator({ level }: { level: StalenessLevel }) {
  const config = {
    fresh: { icon: CheckCircle2, label: 'Fresh', className: 'text-emerald-600 bg-emerald-50' },
    aging: { icon: AlertTriangle, label: 'Aging', className: 'text-amber-600 bg-amber-50' },
    stale: { icon: XCircle, label: 'Stale', className: 'text-red-600 bg-red-50' },
  }
  
  const { icon: Icon, label, className } = config[level]
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn('flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium', className)}>
            <Icon className="h-3.5 w-3.5" />
            <span>{label}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          {level === 'fresh' && 'Snapshot taken within last 48 hours'}
          {level === 'aging' && 'Snapshot is 2-7 days old'}
          {level === 'stale' && 'Snapshot is over 7 days old - consider refreshing'}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// Format relative time
function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays === 1) return '1 day ago'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  return `${Math.floor(diffDays / 30)} months ago`
}

// Format size
function formatSize(kb: number): string {
  if (kb < 1024) return `${kb} KB`
  return `${(kb / 1024).toFixed(1)} MB`
}

export default function MasterDataSnapshotsPage() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [stalenessFilter, setStalenessFilter] = React.useState<string>('all')
  const [tableFilter, setTableFilter] = React.useState<string>('all')
  const [isTakeSnapshotOpen, setIsTakeSnapshotOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(true)
  
  // Simulated loading
  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])
  
  // Filter snapshots
  const filteredSnapshots = MOCK_SNAPSHOTS.filter(snapshot => {
    const matchesSearch = snapshot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snapshot.ddic_table.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStaleness = stalenessFilter === 'all' || snapshot.staleness === stalenessFilter
    const matchesTable = tableFilter === 'all' || snapshot.ddic_table === tableFilter
    return matchesSearch && matchesStaleness && matchesTable
  })
  
  // Get unique tables for filter
  const uniqueTables = [...new Set(MOCK_SNAPSHOTS.map(s => s.ddic_table))]
  
  // Stats
  const stats = {
    total: MOCK_SNAPSHOTS.length,
    fresh: MOCK_SNAPSHOTS.filter(s => s.staleness === 'fresh').length,
    aging: MOCK_SNAPSHOTS.filter(s => s.staleness === 'aging').length,
    stale: MOCK_SNAPSHOTS.filter(s => s.staleness === 'stale').length,
    totalRows: MOCK_SNAPSHOTS.reduce((sum, s) => sum + s.row_count, 0),
  }

  return (
    <AppShell currentApp="test-repository">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex-shrink-0 border-b bg-background px-6 py-4">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="page-title">Master Data Snapshots</h1>
              <p className="page-description mt-1">
                Point-in-time captures of master data sets restoreable as fixtures
              </p>
            </div>
            <Button onClick={() => setIsTakeSnapshotOpen(true)} className="gap-2">
              <Camera className="h-4 w-4" />
              Take Snapshot
            </Button>
          </div>
          
          {/* Stats Cards */}
          <StaggerGrid
            columns="grid-cols-2 sm:grid-cols-3 xl:grid-cols-5"
            className="gap-3 sm:gap-4 mt-6 items-stretch"
            fast
          >
            <KpiStatCard
              label="Total Snapshots"
              value={stats.total}
              icon={Database}
              tone="brand"
              hint="Across all DDIC tables"
            />
            <KpiStatCard
              label="Fresh"
              value={stats.fresh}
              icon={CheckCircle2}
              tone="success"
              hint="Captured within 48h"
            />
            <KpiStatCard
              label="Aging"
              value={stats.aging}
              icon={AlertTriangle}
              tone="warning"
              hint="2–7 days old"
            />
            <KpiStatCard
              label="Stale"
              value={stats.stale}
              icon={XCircle}
              tone="danger"
              hint="Over 7 days — refresh"
            />
            <KpiStatCard
              label="Total Rows"
              value={stats.totalRows}
              icon={HardDrive}
              tone="info"
              format="locale"
              hint="Combined row count"
              className="col-span-2 sm:col-span-1"
            />
          </StaggerGrid>
        </div>
        
        {/* Filters */}
        <div className="flex-shrink-0 px-6 py-4 border-b bg-muted/30">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search snapshots..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Select value={stalenessFilter} onValueChange={setStalenessFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Staleness" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="fresh">Fresh</SelectItem>
                <SelectItem value="aging">Aging</SelectItem>
                <SelectItem value="stale">Stale</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={tableFilter} onValueChange={setTableFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="DDIC Table" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tables</SelectItem>
                {uniqueTables.map(table => (
                  <SelectItem key={table} value={table}>{table}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {(searchQuery || stalenessFilter !== 'all' || tableFilter !== 'all') && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  setSearchQuery('')
                  setStalenessFilter('all')
                  setTableFilter('all')
                }}
              >
                Clear filters
              </Button>
            )}
          </div>
        </div>
        
        {/* Table */}
        <div className="flex-1 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[300px]">Snapshot Name</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>DDIC Table</TableHead>
                <TableHead>Taken</TableHead>
                <TableHead className="text-right">Rows</TableHead>
                <TableHead className="text-right">Size</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Restore as Fixture</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-12">
                    <RefreshCw className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                    <p className="page-description mt-2">Loading snapshots...</p>
                  </TableCell>
                </TableRow>
              ) : filteredSnapshots.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-12">
                    <Camera className="h-8 w-8 mx-auto text-muted-foreground/50" />
                    <p className="page-description mt-2">No snapshots found</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-4"
                      onClick={() => setIsTakeSnapshotOpen(true)}
                    >
                      Take First Snapshot
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                filteredSnapshots.map((snapshot) => (
                  <TableRow key={snapshot.id} className="hover:bg-muted/30">
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{snapshot.name}</p>
                        <p className="caption-text truncate max-w-[280px]">
                          {snapshot.description}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <Server className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="font-mono text-sm">
                          {snapshot.source_system}-{snapshot.source_client}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono">
                        {snapshot.ddic_table}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                              <Clock className="h-3.5 w-3.5" />
                              {formatRelativeTime(snapshot.taken_at)}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            {new Date(snapshot.taken_at).toLocaleString()}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      {snapshot.row_count.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-sm text-muted-foreground">
                      {formatSize(snapshot.size_kb)}
                    </TableCell>
                    <TableCell>
                      <StalenessIndicator level={snapshot.staleness} />
                    </TableCell>
                    <TableCell>
                      {snapshot.restorable_as_fixture && (
                        <Button
                          variant="link"
                          size="sm"
                          className="h-auto p-0 gap-1 text-brand font-medium"
                          asChild
                        >
                          <Link href={`/test-repository/snapshots/${snapshot.id}/create-fixture`}>
                            Create Fixture
                            <ArrowRight className="h-3 w-3" />
                          </Link>
                        </Button>
                      )}
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
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Refresh Snapshot
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Export Data
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="h-4 w-4 mr-2" />
                            Clone
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Take Snapshot Dialog */}
        <Dialog open={isTakeSnapshotOpen} onOpenChange={setIsTakeSnapshotOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Take Master Data Snapshot
              </DialogTitle>
              <DialogDescription>
                Capture a point-in-time copy of master data from a source SAP system
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <StaggerGrid columns="grid-cols-2" className="gap-4" fast>
                <div className="space-y-2">
                  <Label>Source System</Label>
                  <Select defaultValue="STA">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="STA">STA (Staging)</SelectItem>
                      <SelectItem value="DEV">DEV (Development)</SelectItem>
                      <SelectItem value="QAS">QAS (Quality)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Client</Label>
                  <Select defaultValue="100">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="100">100</SelectItem>
                      <SelectItem value="200">200</SelectItem>
                      <SelectItem value="300">300</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </StaggerGrid>
              
              <div className="space-y-2">
                <Label>DDIC Table</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select table..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="KNA1">KNA1 - Customer Master</SelectItem>
                    <SelectItem value="LFA1">LFA1 - Vendor Master</SelectItem>
                    <SelectItem value="MARA">MARA - Material Master</SelectItem>
                    <SelectItem value="T001">T001 - Company Codes</SelectItem>
                    <SelectItem value="T024">T024 - Purchasing Groups</SelectItem>
                    <SelectItem value="CSKS">CSKS - Cost Centers</SelectItem>
                    <SelectItem value="SKA1">SKA1 - GL Accounts</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Scope Filter Expression (Optional)</Label>
                <Textarea 
                  placeholder="e.g., BUKRS = '1000' AND LAND1 = 'IN'"
                  className="font-mono text-sm"
                />
                <p className="caption-text">
                  ABAP-style WHERE clause to filter records
                </p>
              </div>
              
              <div className="space-y-2">
                <Label>Snapshot Name</Label>
                <Input placeholder="e.g., KNA1 Customer Master from STA-100" />
              </div>
              
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-amber-800">iHub Connection Required</p>
                    <p className="text-amber-700 text-xs mt-0.5">
                      This operation requires an active iHub connection to the source system
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsTakeSnapshotOpen(false)}>
                Cancel
              </Button>
              <Button className="gap-2">
                <Camera className="h-4 w-4" />
                Take Snapshot
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  )
}
