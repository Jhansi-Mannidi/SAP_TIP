'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { 
  ClipboardCheck, 
  Search, 
  Plus, 
  Download,
  MoreHorizontal,
  Eye,
  Edit2,
  Copy,
  Trash2,
  Code2,
  MousePointer,
  Keyboard,
  CheckSquare,
  Database,
  FileText,
  Timer,
} from 'lucide-react'

import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
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
const STEP_TYPES = {
  click: { icon: MousePointer, color: 'text-blue-500', label: 'Click' },
  input: { icon: Keyboard, color: 'text-emerald-500', label: 'Input' },
  verify: { icon: CheckSquare, color: 'text-violet-500', label: 'Verify' },
  query: { icon: Database, color: 'text-amber-500', label: 'Query' },
  script: { icon: Code2, color: 'text-red-500', label: 'Script' },
  wait: { icon: Timer, color: 'text-muted-foreground', label: 'Wait' },
}

const MOCK_STEPS = [
  { id: 'STEP-001', name: 'Click Sales Order Button', type: 'click', usedIn: 12, module: 'SD', isReusable: true, avgDuration: '0.5s' },
  { id: 'STEP-002', name: 'Enter Customer ID', type: 'input', usedIn: 25, module: 'SD', isReusable: true, avgDuration: '0.3s' },
  { id: 'STEP-003', name: 'Verify Order Created', type: 'verify', usedIn: 18, module: 'SD', isReusable: true, avgDuration: '1.2s' },
  { id: 'STEP-004', name: 'Query Material Availability', type: 'query', usedIn: 8, module: 'MM', isReusable: true, avgDuration: '2.5s' },
  { id: 'STEP-005', name: 'Execute Custom BAPI', type: 'script', usedIn: 3, module: 'FI', isReusable: false, avgDuration: '3.0s' },
  { id: 'STEP-006', name: 'Wait for Async Process', type: 'wait', usedIn: 15, module: 'PP', isReusable: true, avgDuration: '5.0s' },
  { id: 'STEP-007', name: 'Click Save Button', type: 'click', usedIn: 45, module: 'All', isReusable: true, avgDuration: '0.4s' },
  { id: 'STEP-008', name: 'Enter Amount Field', type: 'input', usedIn: 20, module: 'FI', isReusable: true, avgDuration: '0.3s' },
  { id: 'STEP-009', name: 'Verify Balance Updated', type: 'verify', usedIn: 10, module: 'FI', isReusable: true, avgDuration: '1.5s' },
  { id: 'STEP-010', name: 'Select Dropdown Option', type: 'click', usedIn: 30, module: 'All', isReusable: true, avgDuration: '0.6s' },
]

export default function StepLibraryPage() {
  const [search, setSearch] = React.useState('')
  const [typeFilter, setTypeFilter] = React.useState('all')
  const [moduleFilter, setModuleFilter] = React.useState('all')

  const filteredSteps = MOCK_STEPS.filter(step => {
    if (search && !step.name.toLowerCase().includes(search.toLowerCase()) && !step.id.toLowerCase().includes(search.toLowerCase())) return false
    if (typeFilter !== 'all' && step.type !== typeFilter) return false
    if (moduleFilter !== 'all' && step.module !== moduleFilter && step.module !== 'All') return false
    return true
  })

  const stats = {
    total: MOCK_STEPS.length,
    reusable: MOCK_STEPS.filter(s => s.isReusable).length,
    totalUsage: MOCK_STEPS.reduce((sum, s) => sum + s.usedIn, 0),
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
            <h1 className="page-title">Step Library</h1>
            <p className="page-description mt-1">
              Reusable test steps and actions for building test cases.
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
              New Step
            </Button>
          </motion.div>
        </motion.div>

        {/* KPI Strip */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-3 gap-4"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={staggerItem}>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent>
                <div className="flex items-center gap-2">
                  <ClipboardCheck className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Total Steps</span>
                </div>
                <p className="stat-value mt-1"><AnimatedNumber value={stats.total} /></p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={staggerItem}>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent>
                <div className="flex items-center gap-2">
                  <Copy className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm text-muted-foreground">Reusable</span>
                </div>
                <p className="stat-value mt-1"><AnimatedNumber value={stats.reusable} /></p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={staggerItem}>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-muted-foreground">Total Usage</span>
                </div>
                <p className="stat-value mt-1"><AnimatedNumber value={stats.totalUsage} /></p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Step Type Legend */}
        <motion.div 
          className="flex flex-wrap gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          {Object.entries(STEP_TYPES).map(([key, { icon: Icon, color, label }]) => (
            <Badge 
              key={key} 
              variant="outline" 
              className={cn('gap-1 cursor-pointer', typeFilter === key && 'bg-primary/10')}
              onClick={() => setTypeFilter(typeFilter === key ? 'all' : key)}
            >
              <Icon className={cn('h-3 w-3', color)} />
              {label}
            </Badge>
          ))}
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
              placeholder="Search steps..." 
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Step Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="click">Click</SelectItem>
              <SelectItem value="input">Input</SelectItem>
              <SelectItem value="verify">Verify</SelectItem>
              <SelectItem value="query">Query</SelectItem>
              <SelectItem value="script">Script</SelectItem>
              <SelectItem value="wait">Wait</SelectItem>
            </SelectContent>
          </Select>
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
                  <TableHead>ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Module</TableHead>
                  <TableHead className="text-right">Used In</TableHead>
                  <TableHead className="text-right">Avg Duration</TableHead>
                  <TableHead>Reusable</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSteps.map((step) => {
                  const StepIcon = STEP_TYPES[step.type as keyof typeof STEP_TYPES].icon
                  const stepColor = STEP_TYPES[step.type as keyof typeof STEP_TYPES].color
                  return (
                    <TableRow key={step.id} className="hover:bg-muted/50">
                      <TableCell className="font-mono text-sm">{step.id}</TableCell>
                      <TableCell>
                        <div className={cn('flex items-center gap-2', stepColor)}>
                          <StepIcon className="h-4 w-4" />
                          <span className="capitalize">{step.type}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{step.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{step.module}</Badge>
                      </TableCell>
                      <TableCell className="text-right">{step.usedIn} cases</TableCell>
                      <TableCell className="text-right text-muted-foreground">{step.avgDuration}</TableCell>
                      <TableCell>
                        {step.isReusable ? (
                          <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">Yes</Badge>
                        ) : (
                          <Badge variant="outline">No</Badge>
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
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit2 className="h-4 w-4 mr-2" />
                              Edit
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
          Showing {filteredSteps.length} of {MOCK_STEPS.length} steps
        </div>
      </div>
    </AppShell>
  )
}
