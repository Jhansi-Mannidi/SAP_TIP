'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { 
  Database, 
  Search, 
  Plus, 
  Download,
  Upload,
  MoreHorizontal,
  Eye,
  Edit2,
  Copy,
  Trash2,
  FileSpreadsheet,
  FileJson,
  Table as TableIcon,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react'

import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { cn, formatRelativeTime } from '@/lib/utils'
import { staggerContainer, staggerItem, AnimatedNumber, fadeInUp } from '@/lib/animations'

// Mock data
const MOCK_DATA_SETS = [
  { id: 'DS-001', name: 'Sales Order Master Data', type: 'fixture', format: 'json', records: 250, usedIn: 15, lastUpdated: '2026-05-06T10:30:00Z', status: 'valid' },
  { id: 'DS-002', name: 'Customer Master Records', type: 'fixture', format: 'csv', records: 1500, usedIn: 28, lastUpdated: '2026-05-05T14:20:00Z', status: 'valid' },
  { id: 'DS-003', name: 'Material Test Data', type: 'fixture', format: 'xlsx', records: 800, usedIn: 22, lastUpdated: '2026-05-04T09:15:00Z', status: 'stale' },
  { id: 'DS-004', name: 'Vendor Data Pool', type: 'pool', format: 'json', records: 500, usedIn: 12, lastUpdated: '2026-05-06T16:45:00Z', status: 'valid' },
  { id: 'DS-005', name: 'GL Account Data', type: 'fixture', format: 'csv', records: 350, usedIn: 8, lastUpdated: '2026-05-03T11:00:00Z', status: 'valid' },
  { id: 'DS-006', name: 'Price Conditions', type: 'generated', format: 'json', records: 2000, usedIn: 18, lastUpdated: '2026-05-06T08:00:00Z', status: 'valid' },
]

const MOCK_GENERATORS = [
  { id: 'GEN-001', name: 'Random Customer Generator', type: 'customer', lastRun: '2026-05-06T12:00:00Z', recordsGenerated: 500, status: 'active' },
  { id: 'GEN-002', name: 'Sales Order Generator', type: 'order', lastRun: '2026-05-05T18:30:00Z', recordsGenerated: 1200, status: 'active' },
  { id: 'GEN-003', name: 'Material Master Generator', type: 'material', lastRun: '2026-05-04T14:00:00Z', recordsGenerated: 800, status: 'paused' },
]

const formatIcons: Record<string, React.ElementType> = {
  json: FileJson,
  csv: FileSpreadsheet,
  xlsx: FileSpreadsheet,
}

const statusColors: Record<string, string> = {
  valid: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  stale: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  invalid: 'bg-red-500/10 text-red-600 dark:text-red-400',
}

export default function TestDataPage() {
  const [search, setSearch] = React.useState('')
  const [typeFilter, setTypeFilter] = React.useState('all')
  const [activeTab, setActiveTab] = React.useState('datasets')

  const filteredDataSets = MOCK_DATA_SETS.filter(ds => {
    if (search && !ds.name.toLowerCase().includes(search.toLowerCase())) return false
    if (typeFilter !== 'all' && ds.type !== typeFilter) return false
    return true
  })

  const stats = {
    totalDataSets: MOCK_DATA_SETS.length,
    totalRecords: MOCK_DATA_SETS.reduce((sum, ds) => sum + ds.records, 0),
    generators: MOCK_GENERATORS.length,
    activeGenerators: MOCK_GENERATORS.filter(g => g.status === 'active').length,
  }

  return (
    <AppShell currentApp="test-manager">
      <div className="flex flex-col gap-6 p-4 md:p-6">
        {/* Animated Header */}
        <motion.div 
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <div>
            <h1 className="page-title">Test Data</h1>
            <p className="page-description mt-1">
              Manage test data fixtures, pools, and data generators.
            </p>
          </div>
          <motion.div 
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Data Set
            </Button>
          </motion.div>
        </motion.div>

        {/* KPI Strip */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={staggerItem}>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent>
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Data Sets</span>
                </div>
                <p className="stat-value mt-1"><AnimatedNumber value={stats.totalDataSets} /></p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={staggerItem}>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent>
                <div className="flex items-center gap-2">
                  <TableIcon className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-muted-foreground">Total Records</span>
                </div>
                <p className="stat-value mt-1"><AnimatedNumber value={stats.totalRecords} /></p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={staggerItem}>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent>
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 text-violet-500" />
                  <span className="text-sm text-muted-foreground">Generators</span>
                </div>
                <p className="stat-value mt-1"><AnimatedNumber value={stats.generators} /></p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={staggerItem}>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm text-muted-foreground">Active Generators</span>
                </div>
                <p className="stat-value mt-1"><AnimatedNumber value={stats.activeGenerators} /></p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <TabsList>
              <TabsTrigger value="datasets" className="gap-2">
                <Database className="h-4 w-4" />
                Data Sets
              </TabsTrigger>
              <TabsTrigger value="generators" className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Generators
              </TabsTrigger>
            </TabsList>
          </motion.div>

          <TabsContent value="datasets" className="space-y-4 mt-4">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  placeholder="Search data sets..." 
                  className="pl-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="fixture">Fixture</SelectItem>
                  <SelectItem value="pool">Pool</SelectItem>
                  <SelectItem value="generated">Generated</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Data Sets Table */}
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Format</TableHead>
                    <TableHead className="text-right">Records</TableHead>
                    <TableHead className="text-right">Used In</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDataSets.map((ds) => {
                    const FormatIcon = formatIcons[ds.format] || FileJson
                    return (
                      <TableRow key={ds.id} className="hover:bg-muted/50">
                        <TableCell className="font-mono text-sm">{ds.id}</TableCell>
                        <TableCell className="font-medium">{ds.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">{ds.type}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <FormatIcon className="h-4 w-4 text-muted-foreground" />
                            <span className="uppercase text-xs">{ds.format}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">{ds.records.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{ds.usedIn} cases</TableCell>
                        <TableCell>
                          <Badge className={statusColors[ds.status]}>{ds.status}</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {formatRelativeTime(ds.lastUpdated)}
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
                                <Eye className="h-4 w-4 mr-2" />
                                View Data
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit2 className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Download className="h-4 w-4 mr-2" />
                                Export
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Copy className="h-4 w-4 mr-2" />
                                Duplicate
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
                    )
                  })}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="generators" className="space-y-4 mt-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {MOCK_GENERATORS.map((gen) => (
                <Card key={gen.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{gen.name}</CardTitle>
                      <Badge variant={gen.status === 'active' ? 'default' : 'secondary'}>
                        {gen.status}
                      </Badge>
                    </div>
                    <CardDescription className="font-mono text-xs">{gen.id}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <StaggerGrid columns="grid-cols-2" className="gap-4 text-sm" fast>
                      <div>
                        <p className="page-description">Type</p>
                        <p className="font-medium capitalize">{gen.type}</p>
                      </div>
                      <div>
                        <p className="page-description">Records Generated</p>
                        <p className="font-medium">{gen.recordsGenerated.toLocaleString()}</p>
                      </div>
                    </StaggerGrid>
                    <div>
                      <p className="caption-text mb-1">Last Run: {formatRelativeTime(gen.lastRun)}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Run Now
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Results count */}
        <div className="text-sm text-muted-foreground">
          {activeTab === 'datasets' 
            ? `Showing ${filteredDataSets.length} of ${MOCK_DATA_SETS.length} data sets`
            : `${MOCK_GENERATORS.length} generators configured`
          }
        </div>
      </div>
    </AppShell>
  )
}
