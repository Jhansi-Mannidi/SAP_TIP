'use client'

import * as React from 'react'
import Link from 'next/link'
import { 
  History,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  FileCode2,
  Calendar,
  TrendingUp,
  ChevronLeft,
  Eye,
  ArrowUpRight,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

import { 
  MOCK_HEALING_HISTORY, 
  FAILURE_CLASS_LABELS, 
  REPAIR_STRATEGY_LABELS,
  type PromotionDecision,
  type HealingPromotionHistory,
} from '@/lib/mock-data'

// Decision badge styling
function getDecisionStyle(decision: PromotionDecision) {
  switch (decision) {
    case 'Approved':
      return { icon: CheckCircle2, className: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' }
    case 'Rejected':
      return { icon: XCircle, className: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20' }
    case 'Approved with Modifications':
      return { icon: AlertCircle, className: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' }
  }
}

// Success rate color
function getSuccessRateColor(rate: number | undefined) {
  if (rate === undefined) return 'text-muted-foreground'
  if (rate >= 95) return 'text-emerald-600 dark:text-emerald-400'
  if (rate >= 85) return 'text-amber-600 dark:text-amber-400'
  return 'text-red-600 dark:text-red-400'
}

export default function HealingPromotionsHistoryPage() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [decisionFilter, setDecisionFilter] = React.useState<string>('all')
  const [periodFilter, setPeriodFilter] = React.useState<string>('all')
  
  // Filter history
  const filteredHistory = MOCK_HEALING_HISTORY.filter(item => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      if (!item.target_ir.name.toLowerCase().includes(query) &&
          !item.reviewer.name.toLowerCase().includes(query) &&
          !FAILURE_CLASS_LABELS[item.failure_class].toLowerCase().includes(query)) {
        return false
      }
    }
    
    // Decision filter
    if (decisionFilter !== 'all' && item.decision !== decisionFilter) {
      return false
    }
    
    // Time period filter
    if (periodFilter !== 'all') {
      const decidedDate = new Date(item.decided_at)
      const now = new Date()
      const daysDiff = Math.floor((now.getTime() - decidedDate.getTime()) / (1000 * 60 * 60 * 24))
      
      switch (periodFilter) {
        case '7d':
          if (daysDiff > 7) return false
          break
        case '30d':
          if (daysDiff > 30) return false
          break
        case '90d':
          if (daysDiff > 90) return false
          break
      }
    }
    
    return true
  })
  
  // Stats
  const stats = {
    total: MOCK_HEALING_HISTORY.length,
    approved: MOCK_HEALING_HISTORY.filter(h => h.decision === 'Approved').length,
    rejected: MOCK_HEALING_HISTORY.filter(h => h.decision === 'Rejected').length,
    avgSuccessRate: Math.round(
      MOCK_HEALING_HISTORY
        .filter(h => h.success_rate_post_merge !== undefined)
        .reduce((sum, h) => sum + (h.success_rate_post_merge || 0), 0) /
      MOCK_HEALING_HISTORY.filter(h => h.success_rate_post_merge !== undefined).length
    ),
  }

  return (
    <AppShell currentApp="defect-manager">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="p-4 md:p-6">
            {/* Breadcrumb */}
            <div className="page-breadcrumb mb-4">
              <Link href="/defect-manager/healing-promotions" className="hover:text-foreground flex items-center gap-1">
                <ChevronLeft className="h-4 w-4" />
                Healing Promotions
              </Link>
              <span>/</span>
              <span className="text-foreground">History</span>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-muted">
                    <History className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <h1 className="page-title">Promotion History</h1>
                    <p className="section-description mt-0.5">
                      Historical record of healing promotion decisions
                    </p>
                  </div>
                </div>
              </div>
              <Button variant="outline" asChild>
                <Link href="/defect-manager/healing-promotions">
                  View Pending
                </Link>
              </Button>
            </div>
            
            {/* Stats */}
            <StaggerGrid columns="grid-cols-2 md:grid-cols-4" className="gap-3 mt-4" fast>
              <Card className="bg-muted/30">
                <CardContent>
                  <div className="stat-value">{stats.total}</div>
                  <div className="text-xs text-muted-foreground">Total Decisions</div>
                </CardContent>
              </Card>
              <Card className="bg-emerald-500/5 border-emerald-500/20">
                <CardContent>
                  <div className="stat-value text-emerald-600 dark:text-emerald-400">{stats.approved}</div>
                  <div className="text-xs text-muted-foreground">Approved</div>
                </CardContent>
              </Card>
              <Card className="bg-red-500/5 border-red-500/20">
                <CardContent>
                  <div className="stat-value text-red-600 dark:text-red-400">{stats.rejected}</div>
                  <div className="text-xs text-muted-foreground">Rejected</div>
                </CardContent>
              </Card>
              <Card className="bg-indigo-500/5 border-indigo-500/20">
                <CardContent>
                  <div className="stat-value text-indigo-600 dark:text-indigo-400">{stats.avgSuccessRate}%</div>
                  <div className="text-xs text-muted-foreground">Avg Success Rate</div>
                </CardContent>
              </Card>
            </StaggerGrid>
            
            {/* Filters */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-4">
              <div className="relative flex-1 sm:max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search history..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              <Select value={decisionFilter} onValueChange={setDecisionFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Decision" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Decisions</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Approved with Modifications">With Modifications</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={periodFilter} onValueChange={setPeriodFilter}>
                <SelectTrigger className="w-full sm:w-[160px]">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Time Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                  <SelectItem value="90d">Last 90 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        {/* Table */}
        <div className="flex-1 overflow-auto p-4 md:p-6">
          <Card>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Target IR</TableHead>
                    <TableHead>Decision</TableHead>
                    <TableHead className="hidden md:table-cell">Failure Class</TableHead>
                    <TableHead>Reviewer</TableHead>
                    <TableHead className="hidden lg:table-cell">Decided</TableHead>
                    <TableHead className="text-right">Success Rate</TableHead>
                    <TableHead className="w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHistory.map((item) => {
                    const decisionStyle = getDecisionStyle(item.decision)
                    const DecisionIcon = decisionStyle.icon
                    
                    return (
                      <TableRow key={item.id} className="group">
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <FileCode2 className="h-4 w-4 text-muted-foreground shrink-0" />
                            <div className="min-w-0">
                              <div className="font-medium truncate max-w-[200px]">
                                {item.target_ir.name}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {item.target_ir.version}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Badge variant="outline" className={cn('gap-1', decisionStyle.className)}>
                                  <DecisionIcon className="h-3 w-3" />
                                  <span className="hidden sm:inline">
                                    {item.decision === 'Approved with Modifications' ? 'Modified' : item.decision}
                                  </span>
                                  <span className="sm:hidden">
                                    {item.decision === 'Approved' ? 'OK' : item.decision === 'Rejected' ? 'No' : 'Mod'}
                                  </span>
                                </Badge>
                              </TooltipTrigger>
                              {item.rationale && (
                                <TooltipContent side="bottom" className="max-w-xs">
                                  <p className="text-sm">{item.rationale}</p>
                                </TooltipContent>
                              )}
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge variant="secondary" className="text-xs">
                            {FAILURE_CLASS_LABELS[item.failure_class]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="min-w-0">
                            <div className="font-medium text-sm">{item.reviewer.name}</div>
                            <div className="text-xs text-muted-foreground hidden sm:block">
                              {item.reviewer.role}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger className="text-sm text-muted-foreground">
                                {formatDistanceToNow(new Date(item.decided_at), { addSuffix: true })}
                              </TooltipTrigger>
                              <TooltipContent>
                                {new Date(item.decided_at).toLocaleString()}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                        <TableCell className="text-right">
                          {item.success_rate_post_merge !== undefined ? (
                            <div className="flex items-center justify-end gap-1">
                              <TrendingUp className={cn('h-3 w-3', getSuccessRateColor(item.success_rate_post_merge))} />
                              <span className={cn('font-medium', getSuccessRateColor(item.success_rate_post_merge))}>
                                {item.success_rate_post_merge}%
                              </span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            asChild
                          >
                            <Link href={`/defect-manager/healing-promotions/${item.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
            
            {filteredHistory.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <History className="h-10 w-10 text-muted-foreground/50 mb-3" />
                <h3 className="font-semibold">No history found</h3>
                <p className="page-description mt-1">
                  Try adjusting your filters
                </p>
              </div>
            )}
          </Card>
          
          {/* Summary */}
          <div className="mt-4 text-sm text-muted-foreground text-center">
            Showing {filteredHistory.length} of {MOCK_HEALING_HISTORY.length} historical decisions
          </div>
        </div>
      </div>
    </AppShell>
  )
}
