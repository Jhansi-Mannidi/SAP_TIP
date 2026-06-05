'use client'

import * as React from 'react'
import Link from 'next/link'
import { 
  Search, 
  Filter,
  BookOpen,
  CheckCircle2,
  Circle,
  Download,
  Sparkles,
  ExternalLink,
  Flag,
  Globe,
} from 'lucide-react'

import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

import { MOCK_BP_SCOPE_ITEMS, MOCK_SAP_MODULES } from '@/lib/kb-mock-data'

const COUNTRY_FLAGS: Record<string, string> = {
  'US': '🇺🇸',
  'DE': '🇩🇪',
  'IN': '🇮🇳',
  'GB': '🇬🇧',
  'CN': '🇨🇳',
}

const BP_COLORS: Record<string, string> = {
  'OTC': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'PTP': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  'RTR': 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
  'HTR': 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
  'ATR': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
}

const MODULE_COLORS: Record<string, string> = {
  'SD': 'bg-blue-500',
  'MM': 'bg-emerald-500',
  'FI': 'bg-violet-500',
  'CO': 'bg-amber-500',
  'PP': 'bg-rose-500',
}

export default function BPKBScopeItemsPage() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [bpFilter, setBpFilter] = React.useState<string>('all')
  const [moduleFilter, setModuleFilter] = React.useState<string>('all')
  const [inScopeOnly, setInScopeOnly] = React.useState(false)
  const [selectedItems, setSelectedItems] = React.useState<string[]>([])

  const filteredItems = MOCK_BP_SCOPE_ITEMS.filter(item => {
    const matchesSearch = searchQuery === '' ||
      item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesBP = bpFilter === 'all' || item.businessProcess === bpFilter
    const matchesModule = moduleFilter === 'all' || item.module === moduleFilter
    const matchesInScope = !inScopeOnly || item.coverageStatus === 'covered'
    return matchesSearch && matchesBP && matchesModule && matchesInScope
  })

  const toggleSelectAll = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(filteredItems.map(item => item.id))
    }
  }

  const toggleItem = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  // Stats
  const totalItems = MOCK_BP_SCOPE_ITEMS.length
  const coveredItems = MOCK_BP_SCOPE_ITEMS.filter(i => i.coverageStatus === 'covered').length
  const partialItems = MOCK_BP_SCOPE_ITEMS.filter(i => i.coverageStatus === 'partial').length

  return (
    <AppShell currentApp="knowledge-center">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="p-4 md:p-6">
            <div className="flex flex-col gap-4">
              <div>
                <h1 className="page-title">SAP Best Practice Scope Items</h1>
                <p className="page-description mt-1">
                  The SAP-recommended scope items for cloud and S/4 deployments — drives BP coverage tracking.
                </p>
              </div>

              {/* Stats */}
              <StaggerGrid columns="grid-cols-3" className="gap-3 max-w-md" fast>
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="caption-text">Total Items</p>
                  <p className="text-xl font-bold">{totalItems}</p>
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3">
                  <p className="text-xs text-emerald-600 dark:text-emerald-400">Covered</p>
                  <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{coveredItems}</p>
                </div>
                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3">
                  <p className="text-xs text-amber-600 dark:text-amber-400">Partial</p>
                  <p className="text-xl font-bold text-amber-600 dark:text-amber-400">{partialItems}</p>
                </div>
              </StaggerGrid>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search scope items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={bpFilter} onValueChange={setBpFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Business Process" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All BPs</SelectItem>
                    <SelectItem value="OTC">OTC</SelectItem>
                    <SelectItem value="PTP">PTP</SelectItem>
                    <SelectItem value="RTR">RTR</SelectItem>
                    <SelectItem value="HTR">HTR</SelectItem>
                    <SelectItem value="ATR">ATR</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={moduleFilter} onValueChange={setModuleFilter}>
                  <SelectTrigger className="w-[120px]">
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
                <div className="flex items-center gap-2">
                  <Switch
                    id="in-scope"
                    checked={inScopeOnly}
                    onCheckedChange={setInScopeOnly}
                  />
                  <Label htmlFor="in-scope" className="text-sm">In-scope for Migration</Label>
                </div>
              </div>

              {/* Bulk Actions */}
              {selectedItems.length > 0 && (
                <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg">
                  <span className="text-sm font-medium">{selectedItems.length} selected</span>
                  <Button size="sm" variant="outline" className="gap-2">
                    <Flag className="h-4 w-4" />
                    Mark in scope for Migration
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setSelectedItems([])}>
                    Clear selection
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                <TableHead className="w-[40px]">
                  <Checkbox
                    checked={selectedItems.length === filteredItems.length && filteredItems.length > 0}
                    onCheckedChange={toggleSelectAll}
                  />
                </TableHead>
                <TableHead className="w-[80px]">BP Code</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="w-[80px]">BP</TableHead>
                <TableHead className="w-[80px]">Module</TableHead>
                <TableHead className="w-[200px]">T-codes</TableHead>
                <TableHead className="w-[100px]">Countries</TableHead>
                <TableHead className="w-[100px]">Industries</TableHead>
                <TableHead className="w-[100px]">Coverage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow key={item.id} className="hover:bg-accent/50">
                  <TableCell>
                    <Checkbox
                      checked={selectedItems.includes(item.id)}
                      onCheckedChange={() => toggleItem(item.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Link 
                      href={`/knowledge-center/bp/${item.id}`}
                      className="font-mono font-bold text-primary hover:underline"
                    >
                      {item.code}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link 
                      href={`/knowledge-center/bp/${item.id}`}
                      className="hover:text-primary hover:underline"
                    >
                      {item.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn("text-xs", BP_COLORS[item.businessProcess])}>
                      {item.businessProcess}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className={cn(
                      "w-8 h-6 rounded flex items-center justify-center text-white text-xs font-bold",
                      MODULE_COLORS[item.module] || 'bg-slate-500'
                    )}>
                      {item.module}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {item.tcodesCovered.slice(0, 3).map((tcode) => (
                        <Badge key={tcode} variant="outline" className="text-xs font-mono">
                          {tcode}
                        </Badge>
                      ))}
                      {item.tcodesCovered.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{item.tcodesCovered.length - 3}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-0.5">
                      {item.countryVariants.slice(0, 4).map((country) => (
                        <span key={country} title={country} className="text-sm">
                          {COUNTRY_FLAGS[country] || country}
                        </span>
                      ))}
                      {item.countryVariants.length > 4 && (
                        <span className="text-xs text-muted-foreground">+{item.countryVariants.length - 4}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {item.industryVariants.slice(0, 2).map((industry) => (
                        <Badge key={industry} variant="secondary" className="text-xs">
                          {industry}
                        </Badge>
                      ))}
                      {item.industryVariants.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{item.industryVariants.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {item.coverageStatus === 'covered' ? (
                      <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Covered
                      </Badge>
                    ) : item.coverageStatus === 'partial' ? (
                      <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                        Partial
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="gap-1">
                        <Circle className="h-3 w-3" />
                        Not Covered
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredItems.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="font-semibold text-lg">No scope items found</h3>
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
