'use client'

import * as React from 'react'
import Link from 'next/link'
import { 
  Grid3X3,
  Search,
  Filter,
  Download,
  ChevronRight,
  CheckCircle2,
  Circle,
  AlertCircle,
  ArrowUpDown,
  Eye,
} from 'lucide-react'

import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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

import { MOCK_BP_SCOPE_ITEMS } from '@/lib/kb-mock-data'

// Test Scenarios for coverage matrix
const TEST_SCENARIOS = [
  { id: 'ts_1', code: 'OTC_HAPPY_PATH', name: 'OTC Happy Path Domestic', passRate: 98 },
  { id: 'ts_2', code: 'OTC_CREDIT_HOLD', name: 'OTC with Credit Hold', passRate: 94 },
  { id: 'ts_3', code: 'OTC_EXPORT_LC', name: 'OTC Export with LC', passRate: 87 },
  { id: 'ts_4', code: 'OTC_RETURNS', name: 'OTC Returns and Credit Memo', passRate: 92 },
  { id: 'ts_5', code: 'PTP_STANDARD', name: 'PTP Standard PO Flow', passRate: 96 },
  { id: 'ts_6', code: 'PTP_SERVICES', name: 'PTP Services Procurement', passRate: 89 },
  { id: 'ts_7', code: 'RTR_MONTH_END', name: 'RTR Month-End Close', passRate: 91 },
]

// Coverage matrix: scope item -> scenarios
const COVERAGE_MATRIX: Record<string, { scenarioId: string; coverage: 'full' | 'partial' | 'none' }[]> = {
  'bp_1': [
    { scenarioId: 'ts_1', coverage: 'full' },
    { scenarioId: 'ts_2', coverage: 'full' },
    { scenarioId: 'ts_3', coverage: 'partial' },
    { scenarioId: 'ts_4', coverage: 'partial' },
  ],
  'bp_2': [
    { scenarioId: 'ts_1', coverage: 'full' },
    { scenarioId: 'ts_2', coverage: 'full' },
    { scenarioId: 'ts_4', coverage: 'full' },
  ],
  'bp_3': [
    { scenarioId: 'ts_1', coverage: 'full' },
    { scenarioId: 'ts_2', coverage: 'partial' },
    { scenarioId: 'ts_3', coverage: 'full' },
  ],
  'bp_4': [
    { scenarioId: 'ts_1', coverage: 'full' },
    { scenarioId: 'ts_4', coverage: 'full' },
  ],
  'bp_5': [
    { scenarioId: 'ts_5', coverage: 'full' },
    { scenarioId: 'ts_6', coverage: 'full' },
  ],
  'bp_6': [
    { scenarioId: 'ts_5', coverage: 'full' },
    { scenarioId: 'ts_6', coverage: 'partial' },
  ],
}

export default function BPCoverageMatrixPage() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [processFilter, setProcessFilter] = React.useState<string>('all')
  
  const filteredScopeItems = MOCK_BP_SCOPE_ITEMS.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.code.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesProcess = processFilter === 'all' || item.businessProcess === processFilter
    return matchesSearch && matchesProcess
  })
  
  // Calculate coverage stats
  const totalCells = filteredScopeItems.length * TEST_SCENARIOS.length
  const coveredCells = filteredScopeItems.reduce((acc, item) => {
    const coverage = COVERAGE_MATRIX[item.id] || []
    return acc + coverage.filter(c => c.coverage === 'full').length
  }, 0)
  const partialCells = filteredScopeItems.reduce((acc, item) => {
    const coverage = COVERAGE_MATRIX[item.id] || []
    return acc + coverage.filter(c => c.coverage === 'partial').length
  }, 0)
  
  return (
    <AppShell currentApp="knowledge-center">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <div className="page-breadcrumb mb-2">
                  <Link href="/knowledge-center/bp" className="hover:text-foreground">BP KB</Link>
                  <ChevronRight className="h-4 w-4" />
                  <span className="text-foreground">Coverage Matrix</span>
                </div>
                <h1 className="page-title">Test Coverage Matrix</h1>
                <p className="page-description mt-1">
                  Cross-reference BP Scope Items against Test Scenarios
                </p>
              </div>
              <Button variant="outline" size="sm" className="gap-2 shrink-0">
                <Download className="h-4 w-4" />
                Export CSV
              </Button>
            </div>
            
            {/* Stats */}
            <StaggerGrid columns="grid-cols-2 md:grid-cols-4" className="gap-3 mt-4" fast>
              <Card className="bg-muted/50">
                <CardContent>
                  <div className="stat-value">{filteredScopeItems.length}</div>
                  <div className="text-xs text-muted-foreground">Scope Items</div>
                </CardContent>
              </Card>
              <Card className="bg-muted/50">
                <CardContent>
                  <div className="stat-value">{TEST_SCENARIOS.length}</div>
                  <div className="text-xs text-muted-foreground">Test Scenarios</div>
                </CardContent>
              </Card>
              <Card className="bg-muted/50">
                <CardContent>
                  <div className="stat-value text-emerald-600">
                    {Math.round((coveredCells / totalCells) * 100)}%
                  </div>
                  <div className="text-xs text-muted-foreground">Full Coverage</div>
                </CardContent>
              </Card>
              <Card className="bg-muted/50">
                <CardContent>
                  <div className="stat-value text-amber-600">
                    {Math.round((partialCells / totalCells) * 100)}%
                  </div>
                  <div className="text-xs text-muted-foreground">Partial Coverage</div>
                </CardContent>
              </Card>
            </StaggerGrid>
            
            {/* Filters */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-4">
              <div className="relative flex-1 sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search scope items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={processFilter} onValueChange={setProcessFilter}>
                <SelectTrigger className="w-full sm:w-[160px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Process" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Processes</SelectItem>
                  <SelectItem value="OTC">OTC</SelectItem>
                  <SelectItem value="PTP">PTP</SelectItem>
                  <SelectItem value="RTR">RTR</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        {/* Matrix Table */}
        <div className="flex-1 overflow-auto">
          <div className="min-w-[800px]">
            <table className="w-full border-collapse">
              <thead className="sticky top-0 z-10 bg-background">
                <tr>
                  <th className="border-b border-r p-3 text-left text-sm font-medium bg-muted/50 min-w-[200px]">
                    <div className="flex items-center gap-2">
                      Scope Item
                      <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
                    </div>
                  </th>
                  {TEST_SCENARIOS.map(scenario => (
                    <th key={scenario.id} className="border-b border-r p-2 text-center bg-muted/50 min-w-[120px]">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="cursor-help">
                              <div className="text-xs font-medium truncate">{scenario.code}</div>
                              <div className="text-[10px] text-muted-foreground">{scenario.passRate}% pass</div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="font-medium">{scenario.name}</p>
                            <p className="caption-text">Pass rate: {scenario.passRate}%</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredScopeItems.map(item => {
                  const itemCoverage = COVERAGE_MATRIX[item.id] || []
                  
                  return (
                    <tr key={item.id} className="hover:bg-muted/30">
                      <td className="border-b border-r p-3">
                        <Link 
                          href={`/knowledge-center/bp/${item.id}`}
                          className="hover:underline"
                        >
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="font-mono text-xs shrink-0">
                              {item.code}
                            </Badge>
                            <span className="text-sm truncate">{item.name}</span>
                          </div>
                        </Link>
                      </td>
                      {TEST_SCENARIOS.map(scenario => {
                        const coverage = itemCoverage.find(c => c.scenarioId === scenario.id)
                        
                        return (
                          <td key={scenario.id} className="border-b border-r p-2 text-center">
                            {coverage ? (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="flex justify-center">
                                      {coverage.coverage === 'full' ? (
                                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                      ) : (
                                        <AlertCircle className="h-5 w-5 text-amber-500" />
                                      )}
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    {coverage.coverage === 'full' ? 'Full coverage' : 'Partial coverage'}
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            ) : (
                              <Circle className="h-5 w-5 text-muted-foreground/30 mx-auto" />
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Legend */}
        <div className="border-t p-3 bg-muted/30">
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <span className="text-muted-foreground">Legend:</span>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>Full Coverage</span>
            </div>
            <div className="flex items-center gap-1.5">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              <span>Partial Coverage</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Circle className="h-4 w-4 text-muted-foreground/30" />
              <span>No Coverage</span>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
