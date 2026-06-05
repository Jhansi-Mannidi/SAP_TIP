'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { 
  Sparkles, 
  Search, 
  Download,
  ThumbsUp,
  ThumbsDown,
  CheckCircle2,
  Clock,
  XCircle,
  Lightbulb,
  TrendingUp,
  AlertTriangle,
  ChevronRight,
  Bot,
} from 'lucide-react'

import { AppShell } from '@/components/app-shell'
import { ProcessMiningLayout } from '@/components/process-mining/process-mining-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { staggerContainer, staggerItem, AnimatedNumber } from '@/lib/animations'

// Mock data
const MOCK_SUGGESTIONS = [
  { 
    id: 'SUG-001', 
    title: 'Add test for credit check bypass scenario', 
    process: 'Order to Cash', 
    type: 'coverage_gap',
    priority: 'high',
    confidence: 92,
    status: 'pending',
    impact: 'Would cover 3 additional variants',
    createdAt: '2026-05-06T10:30:00Z'
  },
  { 
    id: 'SUG-002', 
    title: 'Consolidate duplicate PO approval tests', 
    process: 'Procure to Pay', 
    type: 'optimization',
    priority: 'medium',
    confidence: 87,
    status: 'accepted',
    impact: 'Reduce test suite by 15%',
    createdAt: '2026-05-05T14:20:00Z'
  },
  { 
    id: 'SUG-003', 
    title: 'Missing error handling for vendor block', 
    process: 'Procure to Pay', 
    type: 'risk',
    priority: 'high',
    confidence: 95,
    status: 'pending',
    impact: 'Critical path not tested',
    createdAt: '2026-05-06T09:15:00Z'
  },
  { 
    id: 'SUG-004', 
    title: 'Add negative test for invalid GL account', 
    process: 'Record to Report', 
    type: 'coverage_gap',
    priority: 'low',
    confidence: 78,
    status: 'rejected',
    impact: 'Edge case coverage',
    createdAt: '2026-05-04T11:00:00Z'
  },
  { 
    id: 'SUG-005', 
    title: 'Optimize material master data loading', 
    process: 'Plan to Produce', 
    type: 'performance',
    priority: 'medium',
    confidence: 84,
    status: 'pending',
    impact: 'Reduce test execution time by 20%',
    createdAt: '2026-05-06T16:45:00Z'
  },
]

const typeConfig: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  coverage_gap: { icon: AlertTriangle, color: 'text-amber-500', label: 'Coverage Gap' },
  optimization: { icon: TrendingUp, color: 'text-blue-500', label: 'Optimization' },
  risk: { icon: AlertTriangle, color: 'text-red-500', label: 'Risk' },
  performance: { icon: Clock, color: 'text-violet-500', label: 'Performance' },
}

const statusConfig: Record<string, { color: string; label: string }> = {
  pending: { color: 'bg-amber-500/10 text-amber-600', label: 'Pending' },
  accepted: { color: 'bg-emerald-500/10 text-emerald-600', label: 'Accepted' },
  rejected: { color: 'bg-muted text-muted-foreground', label: 'Rejected' },
}

const priorityConfig: Record<string, string> = {
  high: 'bg-red-500/10 text-red-600',
  medium: 'bg-amber-500/10 text-amber-600',
  low: 'bg-muted text-muted-foreground',
}

export default function AISuggestionsPage() {
  const [search, setSearch] = React.useState('')
  const [typeFilter, setTypeFilter] = React.useState('all')
  const [statusFilter, setStatusFilter] = React.useState('all')

  const filteredSuggestions = MOCK_SUGGESTIONS.filter(s => {
    if (search && !s.title.toLowerCase().includes(search.toLowerCase())) return false
    if (typeFilter !== 'all' && s.type !== typeFilter) return false
    if (statusFilter !== 'all' && s.status !== statusFilter) return false
    return true
  })

  const stats = {
    total: MOCK_SUGGESTIONS.length,
    pending: MOCK_SUGGESTIONS.filter(s => s.status === 'pending').length,
    accepted: MOCK_SUGGESTIONS.filter(s => s.status === 'accepted').length,
    avgConfidence: Math.round(MOCK_SUGGESTIONS.reduce((sum, s) => sum + s.confidence, 0) / MOCK_SUGGESTIONS.length),
  }

  return (
    <AppShell currentApp="process-mining">
      <ProcessMiningLayout>
      <div className="flex flex-col gap-4 sm:gap-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="section-title">AI Suggestions</h2>
            <p className="section-description mt-0.5">
              AI-powered recommendations to improve test coverage and efficiency.
            </p>
          </div>
          <Button variant="outline" size="sm" className="h-8 shrink-0">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>

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
                  <Lightbulb className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Total Suggestions</span>
                </div>
                <p className="stat-value mt-1"><AnimatedNumber value={stats.total} /></p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={staggerItem}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setStatusFilter('pending')}>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-500" />
                  <span className="text-sm text-muted-foreground">Pending Review</span>
                </div>
                <p className="stat-value mt-1"><AnimatedNumber value={stats.pending} /></p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={staggerItem}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setStatusFilter('accepted')}>
              <CardContent>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm text-muted-foreground">Accepted</span>
                </div>
                <p className="stat-value mt-1"><AnimatedNumber value={stats.accepted} /></p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={staggerItem}>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent>
                <div className="flex items-center gap-2">
                  <Bot className="h-4 w-4 text-violet-500" />
                  <span className="text-sm text-muted-foreground">Avg Confidence</span>
                </div>
                <p className="stat-value mt-1"><AnimatedNumber value={stats.avgConfidence} suffix="%" /></p>
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
              placeholder="Search suggestions..." 
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="coverage_gap">Coverage Gap</SelectItem>
              <SelectItem value="optimization">Optimization</SelectItem>
              <SelectItem value="risk">Risk</SelectItem>
              <SelectItem value="performance">Performance</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Suggestions List */}
        <motion.div 
          className="space-y-4"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {filteredSuggestions.map((suggestion) => {
            const TypeIcon = typeConfig[suggestion.type].icon
            return (
              <motion.div key={suggestion.id} variants={staggerItem}>
                <Card className="hover:shadow-md transition-all hover:border-primary/50">
                  <CardContent>
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      {/* Icon and Content */}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start gap-3">
                          <div className={cn('p-2 rounded-lg bg-muted', typeConfig[suggestion.type].color)}>
                            <TypeIcon className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-medium">{suggestion.title}</h3>
                              <Badge className={priorityConfig[suggestion.priority]}>
                                {suggestion.priority}
                              </Badge>
                              <Badge className={statusConfig[suggestion.status].color}>
                                {statusConfig[suggestion.status].label}
                              </Badge>
                            </div>
                            <p className="page-description mt-1">
                              {suggestion.process} • {typeConfig[suggestion.type].label}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Sparkles className="h-4 w-4 text-violet-500" />
                            <span>{suggestion.confidence}% confidence</span>
                          </div>
                          <span className="text-muted-foreground">•</span>
                          <span className="text-muted-foreground">{suggestion.impact}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      {suggestion.status === 'pending' && (
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" className="text-emerald-600">
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            Accept
                          </Button>
                          <Button variant="outline" size="sm" className="text-muted-foreground">
                            <ThumbsDown className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}
                      
                      <Button variant="ghost" size="icon">
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Results count */}
        <div className="text-sm text-muted-foreground">
          Showing {filteredSuggestions.length} of {MOCK_SUGGESTIONS.length} suggestions
        </div>
      </div>
      </ProcessMiningLayout>
    </AppShell>
  )
}
