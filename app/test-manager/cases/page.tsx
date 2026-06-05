'use client'

import * as React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  FileCode2, 
  Search, 
  Filter, 
  Plus, 
  Download,
  MoreHorizontal,
  Eye,
  Edit2,
  Copy,
  Trash2,
  Play,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
} from 'lucide-react'

import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
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
import { cn } from '@/lib/utils'
import { staggerContainer, staggerItem, AnimatedNumber, fadeInUp } from '@/lib/animations'

// Mock data
const MOCK_TEST_CASES = [
  { id: 'TC-001', name: 'Create Sales Order Standard', suite: 'Order Management', module: 'SD', priority: 'high', status: 'active', lastRun: 'passed', steps: 12, dataVariants: 3 },
  { id: 'TC-002', name: 'Create Purchase Order', suite: 'Procurement', module: 'MM', priority: 'high', status: 'active', lastRun: 'passed', steps: 15, dataVariants: 5 },
  { id: 'TC-003', name: 'Post Goods Receipt', suite: 'Inventory', module: 'MM', priority: 'medium', status: 'active', lastRun: 'failed', steps: 8, dataVariants: 2 },
  { id: 'TC-004', name: 'Create Invoice', suite: 'Billing', module: 'SD', priority: 'high', status: 'active', lastRun: 'passed', steps: 10, dataVariants: 4 },
  { id: 'TC-005', name: 'Create Customer Master', suite: 'Master Data', module: 'SD', priority: 'medium', status: 'draft', lastRun: 'none', steps: 20, dataVariants: 6 },
  { id: 'TC-006', name: 'Create Material Master', suite: 'Master Data', module: 'MM', priority: 'medium', status: 'active', lastRun: 'passed', steps: 25, dataVariants: 8 },
  { id: 'TC-007', name: 'Post Journal Entry', suite: 'General Ledger', module: 'FI', priority: 'high', status: 'active', lastRun: 'passed', steps: 6, dataVariants: 2 },
  { id: 'TC-008', name: 'Run MRP', suite: 'Planning', module: 'PP', priority: 'low', status: 'inactive', lastRun: 'skipped', steps: 4, dataVariants: 1 },
]

const statusColors: Record<string, string> = {
  active: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  draft: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  inactive: 'bg-muted text-muted-foreground',
}

const runColors: Record<string, { icon: React.ElementType; color: string }> = {
  passed: { icon: CheckCircle2, color: 'text-emerald-600 dark:text-emerald-400' },
  failed: { icon: XCircle, color: 'text-red-600 dark:text-red-400' },
  skipped: { icon: AlertTriangle, color: 'text-amber-600 dark:text-amber-400' },
  none: { icon: Clock, color: 'text-muted-foreground' },
}

export default function TestCasesPage() {
  const [search, setSearch] = React.useState('')
  const [moduleFilter, setModuleFilter] = React.useState('all')
  const [statusFilter, setStatusFilter] = React.useState('all')
  const [selected, setSelected] = React.useState<string[]>([])

  const filteredCases = MOCK_TEST_CASES.filter(tc => {
    if (search && !tc.name.toLowerCase().includes(search.toLowerCase()) && !tc.id.toLowerCase().includes(search.toLowerCase())) return false
    if (moduleFilter !== 'all' && tc.module !== moduleFilter) return false
    if (statusFilter !== 'all' && tc.status !== statusFilter) return false
    return true
  })

  const toggleSelect = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const toggleAll = () => {
    setSelected(prev => prev.length === filteredCases.length ? [] : filteredCases.map(tc => tc.id))
  }

  const stats = {
    total: MOCK_TEST_CASES.length,
    active: MOCK_TEST_CASES.filter(tc => tc.status === 'active').length,
    passed: MOCK_TEST_CASES.filter(tc => tc.lastRun === 'passed').length,
    failed: MOCK_TEST_CASES.filter(tc => tc.lastRun === 'failed').length,
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
            <h1 className="page-title">Test Cases</h1>
            <p className="page-description mt-1">
              Manage individual test cases and their configurations.
            </p>
          </div>
          <motion.div 
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Test Case
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
            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setStatusFilter('all')}>
              <CardContent>
                <div className="flex items-center gap-2">
                  <FileCode2 className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Total Cases</span>
                </div>
                <p className="stat-value mt-1"><AnimatedNumber value={stats.total} /></p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={staggerItem}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setStatusFilter('active')}>
              <CardContent>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm text-muted-foreground">Active</span>
                </div>
                <p className="stat-value mt-1"><AnimatedNumber value={stats.active} /></p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={staggerItem}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm text-muted-foreground">Last Run Passed</span>
                </div>
                <p className="stat-value mt-1"><AnimatedNumber value={stats.passed} /></p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={staggerItem}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent>
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-muted-foreground">Last Run Failed</span>
                </div>
                <p className="stat-value mt-1"><AnimatedNumber value={stats.failed} /></p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Filters */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search test cases..." 
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={moduleFilter} onValueChange={setModuleFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Module" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Modules</SelectItem>
              <SelectItem value="SD">SD</SelectItem>
              <SelectItem value="MM">MM</SelectItem>
              <SelectItem value="FI">FI</SelectItem>
              <SelectItem value="PP">PP</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          {selected.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{selected.length} selected</span>
              <Button variant="outline" size="sm">
                <Play className="h-4 w-4 mr-2" />
                Run Selected
              </Button>
            </div>
          )}
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">
                    <Checkbox 
                      checked={selected.length === filteredCases.length && filteredCases.length > 0}
                      onCheckedChange={toggleAll}
                    />
                  </TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Suite</TableHead>
                  <TableHead>Module</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Run</TableHead>
                  <TableHead className="text-right">Steps</TableHead>
                  <TableHead className="text-right">Variants</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCases.map((tc) => {
                  const RunIcon = runColors[tc.lastRun].icon
                  return (
                    <TableRow key={tc.id} className="hover:bg-muted/50">
                      <TableCell>
                        <Checkbox 
                          checked={selected.includes(tc.id)}
                          onCheckedChange={() => toggleSelect(tc.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <Link href={`/test-manager/cases/${tc.id}`} className="font-mono text-sm text-primary hover:underline">
                          {tc.id}
                        </Link>
                      </TableCell>
                      <TableCell className="font-medium">{tc.name}</TableCell>
                      <TableCell className="text-muted-foreground">{tc.suite}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{tc.module}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[tc.status]}>{tc.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className={cn('flex items-center gap-1', runColors[tc.lastRun].color)}>
                          <RunIcon className="h-4 w-4" />
                          <span className="text-sm capitalize">{tc.lastRun}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{tc.steps}</TableCell>
                      <TableCell className="text-right">{tc.dataVariants}</TableCell>
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
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit2 className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Play className="h-4 w-4 mr-2" />
                              Run Now
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
        </motion.div>

        {/* Results count */}
        <div className="text-sm text-muted-foreground">
          Showing {filteredCases.length} of {MOCK_TEST_CASES.length} test cases
        </div>
      </div>
    </AppShell>
  )
}
