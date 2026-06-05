'use client'

import * as React from 'react'
import Link from 'next/link'
import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Sparkles, 
  Search, 
  MoreHorizontal,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  RefreshCw,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { staggerContainer, staggerItem, AnimatedNumber, fadeInUp } from '@/lib/animations'

// Mock healing queue data
const MOCK_HEALING_QUEUE = [
  {
    id: 'HQ001',
    defect_code: 'DEF-0047',
    defect_title: 'Button locator changed on VA01 screen',
    healing_type: 'locator_update',
    confidence: 0.94,
    status: 'pending_review',
    proposed_fix: 'Update CSS selector from .btn-save to #saveOrder',
    created_at: '2025-01-15T10:30:00Z',
    affected_scenarios: 3,
    agent: 'Healing Agent',
  },
  {
    id: 'HQ002',
    defect_code: 'DEF-0051',
    defect_title: 'Field validation message changed',
    healing_type: 'assertion_update',
    confidence: 0.87,
    status: 'pending_review',
    proposed_fix: 'Update expected text from "Required field" to "This field is required"',
    created_at: '2025-01-15T09:15:00Z',
    affected_scenarios: 1,
    agent: 'Healing Agent',
  },
  {
    id: 'HQ003',
    defect_code: 'DEF-0039',
    defect_title: 'Timeout on ME21N transaction',
    healing_type: 'timing_adjustment',
    confidence: 0.78,
    status: 'approved',
    proposed_fix: 'Increase wait time from 5s to 10s for element load',
    created_at: '2025-01-14T16:45:00Z',
    affected_scenarios: 5,
    agent: 'Healing Agent',
  },
  {
    id: 'HQ004',
    defect_code: 'DEF-0042',
    defect_title: 'Navigation path changed for FB01',
    healing_type: 'navigation_update',
    confidence: 0.91,
    status: 'rejected',
    proposed_fix: 'Update menu path from SAP Menu > Accounting to Favorites > FB01',
    created_at: '2025-01-14T14:20:00Z',
    affected_scenarios: 2,
    agent: 'Healing Agent',
  },
]

const healingTypes = [
  { value: 'all', label: 'All Types' },
  { value: 'locator_update', label: 'Locator Update' },
  { value: 'assertion_update', label: 'Assertion Update' },
  { value: 'timing_adjustment', label: 'Timing Adjustment' },
  { value: 'navigation_update', label: 'Navigation Update' },
]

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'pending_review', label: 'Pending Review' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
]

function getStatusBadge(status: string) {
  switch (status) {
    case 'pending_review':
      return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200"><Clock className="h-3 w-3 mr-1" />Pending</Badge>
    case 'approved':
      return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>
    case 'rejected':
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

function getTypeBadge(type: string) {
  const labels: Record<string, string> = {
    'locator_update': 'Locator',
    'assertion_update': 'Assertion',
    'timing_adjustment': 'Timing',
    'navigation_update': 'Navigation',
  }
  return <Badge variant="secondary">{labels[type] || type}</Badge>
}

function ConfidenceBar({ confidence }: { confidence: number }) {
  const pct = confidence * 100
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className={cn(
            'h-full rounded-full',
            pct >= 90 ? 'bg-emerald-500' : pct >= 75 ? 'bg-amber-500' : 'bg-red-500'
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-sm font-medium tabular-nums">{pct.toFixed(0)}%</span>
    </div>
  )
}

export default function HealingQueuePage() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [typeFilter, setTypeFilter] = React.useState('all')
  const [statusFilter, setStatusFilter] = React.useState('all')
  const [selectedItems, setSelectedItems] = React.useState<string[]>([])

  // Apply filters
  const filteredQueue = MOCK_HEALING_QUEUE.filter(item => {
    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      if (!item.defect_code.toLowerCase().includes(q) && !item.defect_title.toLowerCase().includes(q)) {
        return false
      }
    }
    // Type filter
    if (typeFilter !== 'all' && item.healing_type !== typeFilter) return false
    // Status filter
    if (statusFilter !== 'all' && item.status !== statusFilter) return false
    return true
  })

  const pendingCount = MOCK_HEALING_QUEUE.filter(h => h.status === 'pending_review').length
  const avgConfidence = MOCK_HEALING_QUEUE.reduce((sum, h) => sum + h.confidence, 0) / MOCK_HEALING_QUEUE.length

  const toggleSelection = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const toggleAll = () => {
    if (selectedItems.length === filteredQueue.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(filteredQueue.map(h => h.id))
    }
  }

  const handleApproveSelected = () => {
    alert(`Approving ${selectedItems.length} healing proposals`)
    setSelectedItems([])
  }

  const handleRejectSelected = () => {
    alert(`Rejecting ${selectedItems.length} healing proposals`)
    setSelectedItems([])
  }

  return (
    <AppShell currentApp="defect-manager">
      <div className="flex flex-col gap-6 p-4 md:p-6">
        {/* Animated Header */}
        <motion.div 
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <div>
            <h1 className="page-title">Healing Queue</h1>
            <p className="page-description mt-1">
              AI-proposed fixes awaiting human review and approval.
            </p>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </motion.div>
        </motion.div>

        {/* Animated KPI Strip */}
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
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.3, type: 'spring' }}
                  >
                    <Clock className="h-4 w-4 text-amber-500" />
                  </motion.div>
                  <span className="text-sm text-muted-foreground">Pending Review</span>
                </div>
              <p className="stat-value mt-1"><AnimatedNumber value={pendingCount} /></p>
            </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={staggerItem}>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-indigo-500" />
                  <span className="text-sm text-muted-foreground">Avg Confidence</span>
                </div>
                <p className="stat-value mt-1"><AnimatedNumber value={Math.round(avgConfidence * 100)} suffix="%" /></p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={staggerItem}>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm text-muted-foreground">Approved Today</span>
                </div>
                <p className="stat-value mt-1"><AnimatedNumber value={12} /></p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={staggerItem}>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-muted-foreground">Success Rate</span>
                </div>
                <p className="stat-value mt-1"><AnimatedNumber value={87} suffix="%" /></p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search defect code or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {healingTypes.map(t => (
                <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map(s => (
                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Bulk Actions */}
        {selectedItems.length > 0 && (
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <span className="text-sm font-medium">{selectedItems.length} selected</span>
            <Button size="sm" variant="outline" onClick={handleApproveSelected}>
              <CheckCircle className="h-4 w-4 mr-1" />
              Approve
            </Button>
            <Button size="sm" variant="outline" onClick={handleRejectSelected}>
              <XCircle className="h-4 w-4 mr-1" />
              Reject
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setSelectedItems([])}>
              Clear
            </Button>
          </div>
        )}

        {/* Table */}
        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">
                    <Checkbox 
                      checked={selectedItems.length === filteredQueue.length && filteredQueue.length > 0}
                      onCheckedChange={toggleAll}
                    />
                  </TableHead>
                  <TableHead>Defect</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Proposed Fix</TableHead>
                  <TableHead>Confidence</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Affected</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQueue.map(item => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Checkbox 
                        checked={selectedItems.includes(item.id)}
                        onCheckedChange={() => toggleSelection(item.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <Link 
                          href={`/defect-manager/defects/${item.defect_code}`}
                          className="font-medium text-primary hover:underline"
                        >
                          {item.defect_code}
                        </Link>
                        <p className="page-description line-clamp-1">{item.defect_title}</p>
                      </div>
                    </TableCell>
                    <TableCell>{getTypeBadge(item.healing_type)}</TableCell>
                    <TableCell>
                      <p className="text-sm line-clamp-2 max-w-xs">{item.proposed_fix}</p>
                    </TableCell>
                    <TableCell>
                      <ConfidenceBar confidence={item.confidence} />
                    </TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell>
                      <span className="text-sm">{item.affected_scenarios} scenarios</span>
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
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredQueue.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <p className="page-description">No healing proposals match the selected filters.</p>
                      <Button 
                        variant="link" 
                        onClick={() => { setSearchQuery(''); setTypeFilter('all'); setStatusFilter('all'); }}
                      >
                        Clear filters
                      </Button>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Results count */}
        <div className="text-sm text-muted-foreground">
          Showing {filteredQueue.length} of {MOCK_HEALING_QUEUE.length} healing proposals
        </div>
      </div>
    </AppShell>
  )
}
