'use client'

import * as React from 'react'
import Link from 'next/link'
import { 
  Search, 
  Terminal,
  FileText,
  Clock,
  TestTube2,
  BookOpen,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

import { MOCK_TRANSACTION_CODES, MOCK_SAP_MODULES } from '@/lib/kb-mock-data'

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
  
  if (diffInHours < 1) return 'Just now'
  if (diffInHours < 24) return `${diffInHours}h ago`
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays}d ago`
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}w ago`
  return `${Math.floor(diffInDays / 30)}mo ago`
}

type SortField = 'tcode' | 'testCoverage' | 'lastTested' | 'kbArticleCount'
type SortDirection = 'asc' | 'desc'

export default function TransactionsBrowsePage() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [moduleFilter, setModuleFilter] = React.useState<string>('all')
  const [typeFilter, setTypeFilter] = React.useState<string>('all')
  const [sortField, setSortField] = React.useState<SortField>('testCoverage')
  const [sortDirection, setSortDirection] = React.useState<SortDirection>('desc')

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const filteredTcodes = MOCK_TRANSACTION_CODES
    .filter(tcode => {
      const matchesSearch = searchQuery === '' ||
        tcode.tcode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tcode.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesModule = moduleFilter === 'all' || tcode.module === moduleFilter
      const matchesType = typeFilter === 'all' || tcode.objectType === typeFilter
      return matchesSearch && matchesModule && matchesType
    })
    .sort((a, b) => {
      let comparison = 0
      switch (sortField) {
        case 'tcode':
          comparison = a.tcode.localeCompare(b.tcode)
          break
        case 'testCoverage':
          comparison = a.testCoverage - b.testCoverage
          break
        case 'lastTested':
          comparison = new Date(a.lastTested).getTime() - new Date(b.lastTested).getTime()
          break
        case 'kbArticleCount':
          comparison = a.kbArticleCount - b.kbArticleCount
          break
      }
      return sortDirection === 'asc' ? comparison : -comparison
    })

  const moduleColors: Record<string, string> = {
    'SD': 'bg-blue-500',
    'MM': 'bg-emerald-500',
    'FI': 'bg-violet-500',
    'CO': 'bg-amber-500',
    'PP': 'bg-rose-500',
  }

  const objectTypeColors: Record<string, string> = {
    'Dialog Transaction': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'Report Transaction': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    'Variant Transaction': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    'Parameter Transaction': 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
  }

  // Stats
  const totalTcodes = MOCK_TRANSACTION_CODES.length
  const testedTcodes = MOCK_TRANSACTION_CODES.filter(t => t.testCoverage > 0).length
  const totalTestCases = MOCK_TRANSACTION_CODES.reduce((sum, t) => sum + t.testCoverage, 0)
  const totalArticles = MOCK_TRANSACTION_CODES.reduce((sum, t) => sum + t.kbArticleCount, 0)

  return (
    <AppShell currentApp="knowledge-center">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="p-4 md:p-6">
            <div className="flex flex-col gap-4">
              <div>
                <h1 className="page-title">Transaction Codes</h1>
                <p className="page-description mt-1">
                  Reference for SAP transaction codes — frequency-of-test usage and linked KB articles.
                </p>
              </div>
              
              {/* Search (prominent) */}
              <div className="relative max-w-lg">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search T-codes or descriptions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-11 text-base"
                />
              </div>

              {/* Stats */}
              <StaggerGrid columns="grid-cols-2 md:grid-cols-4" className="gap-3" fast>
                <div className="bg-muted/50 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Terminal className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Total T-Codes</span>
                  </div>
                  <p className="text-xl font-bold mt-1">{totalTcodes}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <TestTube2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">With Tests</span>
                  </div>
                  <p className="text-xl font-bold mt-1">{testedTcodes}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Test Cases</span>
                  </div>
                  <p className="text-xl font-bold mt-1">{totalTestCases}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">KB Articles</span>
                  </div>
                  <p className="text-xl font-bold mt-1">{totalArticles}</p>
                </div>
              </StaggerGrid>
            </div>
          </div>

          {/* Filters */}
          <div className="px-4 md:px-6 pb-4 flex flex-wrap items-center gap-3">
            <Select value={moduleFilter} onValueChange={setModuleFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Module" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modules</SelectItem>
                <SelectItem value="SD">SD</SelectItem>
                <SelectItem value="MM">MM</SelectItem>
                <SelectItem value="FI">FI</SelectItem>
                <SelectItem value="CO">CO</SelectItem>
                <SelectItem value="PP">PP</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Object Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Dialog Transaction">Dialog Transaction</SelectItem>
                <SelectItem value="Report Transaction">Report Transaction</SelectItem>
                <SelectItem value="Variant Transaction">Variant Transaction</SelectItem>
                <SelectItem value="Parameter Transaction">Parameter Transaction</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground ml-auto">
              {filteredTcodes.length} results
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                <TableHead className="w-[100px]">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1 -ml-3 font-semibold"
                    onClick={() => handleSort('tcode')}
                  >
                    T-Code
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-[80px]">Module</TableHead>
                <TableHead className="w-[160px]">Object Type</TableHead>
                <TableHead className="w-[120px] text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1 font-semibold"
                    onClick={() => handleSort('testCoverage')}
                  >
                    Test Coverage
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead className="w-[120px]">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1 -ml-3 font-semibold"
                    onClick={() => handleSort('lastTested')}
                  >
                    Last Tested
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead className="w-[100px] text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1 font-semibold"
                    onClick={() => handleSort('kbArticleCount')}
                  >
                    KB Articles
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTcodes.map((tcode) => (
                <TableRow key={tcode.tcode} className="hover:bg-accent/50">
                  <TableCell>
                    <Link 
                      href={`/knowledge-center/domain/transactions/${tcode.tcode.toLowerCase()}`}
                      className="font-mono font-bold text-primary hover:underline"
                    >
                      {tcode.tcode}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {tcode.description}
                  </TableCell>
                  <TableCell>
                    <div className={cn(
                      "w-8 h-6 rounded flex items-center justify-center text-white text-xs font-bold",
                      moduleColors[tcode.module] || 'bg-slate-500'
                    )}>
                      {tcode.module}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn("text-xs", objectTypeColors[tcode.objectType])}>
                      {tcode.objectType.replace(' Transaction', '')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <span className={cn(
                        "font-semibold",
                        tcode.testCoverage > 30 ? "text-emerald-600 dark:text-emerald-400" :
                        tcode.testCoverage > 10 ? "text-amber-600 dark:text-amber-400" :
                        "text-muted-foreground"
                      )}>
                        {tcode.testCoverage}
                      </span>
                      <span className="text-xs text-muted-foreground">cases</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {formatRelativeTime(tcode.lastTested)}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Link 
                      href={`/knowledge-center/domain?tcode=${tcode.tcode}`}
                      className="text-primary hover:underline"
                    >
                      {tcode.kbArticleCount}
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredTcodes.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Terminal className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="font-semibold text-lg">No transaction codes found</h3>
              <p className="page-description mt-1">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
