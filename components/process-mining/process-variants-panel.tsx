'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  Search,
  ChevronRight,
  GitBranch,
  BarChart3,
  Clock,
  Layers,
  Filter,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { staggerItem } from '@/lib/animations'
import {
  PROCESS_GROUPS,
  PROCESS_VARIANTS,
  type ProcessVariant,
  type ProcessVariantStatus,
} from '@/lib/process-mining-mock-data'

const STATUS_CONFIG: Record<
  ProcessVariantStatus,
  { label: string; pill: string }
> = {
  covered: { label: 'Covered', pill: 'pill pill-success' },
  partial: { label: 'Partial', pill: 'pill pill-warning' },
  gap: { label: 'Gap', pill: 'pill pill-danger' },
  untested: { label: 'Untested', pill: 'pill pill-neutral' },
}

function VariantRow({ variant }: { variant: ProcessVariant }) {
  const status = STATUS_CONFIG[variant.status]

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-3 rounded-lg border border-border/60 bg-muted/10 hover:bg-muted/25 transition-colors">
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[10px] text-muted-foreground">{variant.id}</span>
          <span className="text-sm font-medium truncate">{variant.name}</span>
          <Badge className={cn('h-5 text-[10px] border-0', status.pill)}>{status.label}</Badge>
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <BarChart3 className="h-3 w-3" />
            {variant.frequency.toLocaleString()} runs
          </span>
          <span className="inline-flex items-center gap-1">
            <Layers className="h-3 w-3" />
            {variant.steps} steps
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {variant.avgDuration}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:w-44 shrink-0">
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
            <span>Coverage</span>
            <span className="font-medium tabular-nums">{variant.testCoverage}%</span>
          </div>
          <Progress value={variant.testCoverage} className="h-1.5" />
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0 hidden sm:flex">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export function ProcessVariantsPanel() {
  const [search, setSearch] = React.useState('')
  const [processFilter, setProcessFilter] = React.useState('all')
  const [statusFilter, setStatusFilter] = React.useState('all')

  const filteredVariants = PROCESS_VARIANTS.filter((v) => {
    if (
      search &&
      !v.name.toLowerCase().includes(search.toLowerCase()) &&
      !v.process.toLowerCase().includes(search.toLowerCase())
    ) {
      return false
    }
    if (processFilter !== 'all' && v.processId !== processFilter) return false
    if (statusFilter !== 'all' && v.status !== statusFilter) return false
    return true
  })

  const grouped = PROCESS_GROUPS.map((group) => ({
    ...group,
    variants: filteredVariants.filter((v) => v.processId === group.id),
  })).filter((g) => g.variants.length > 0)

  const totalShown = filteredVariants.length

  return (
    <motion.div
      className="rounded-xl border border-border bg-card shadow-[var(--shadow-xs)] overflow-hidden"
      variants={staggerItem}
      initial="hidden"
      animate="visible"
    >
      <div className="p-4 sm:p-5 border-b border-border/60">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <h2 className="section-title">Process Variants</h2>
            <p className="section-description mt-0.5">
              All discovered process variants grouped by main process
            </p>
          </div>
          <Badge variant="outline" className="w-fit shrink-0 gap-1.5">
            <GitBranch className="h-3 w-3" />
            {totalShown} variants
          </Badge>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search variants..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 bg-background"
            />
          </div>
          <Select value={processFilter} onValueChange={setProcessFilter}>
            <SelectTrigger className="w-full sm:w-[170px] h-9 bg-background">
              <Filter className="h-3.5 w-3.5 mr-2 text-muted-foreground shrink-0" />
              <SelectValue placeholder="Process" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Processes</SelectItem>
              {PROCESS_GROUPS.map((g) => (
                <SelectItem key={g.id} value={g.id}>
                  {g.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[140px] h-9 bg-background">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="covered">Covered</SelectItem>
              <SelectItem value="partial">Partial</SelectItem>
              <SelectItem value="gap">Gap</SelectItem>
              <SelectItem value="untested">Untested</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="p-4 sm:p-5 space-y-5">
        {grouped.length > 0 ? (
          grouped.map((group) => {
            const avgCoverage = Math.round(
              group.variants.reduce((sum, v) => sum + v.testCoverage, 0) / group.variants.length,
            )
            return (
              <section key={group.id} className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Badge variant="outline" className="font-mono shrink-0">
                      {group.module}
                    </Badge>
                    <h3 className="text-sm font-semibold truncate">{group.name}</h3>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {group.variants.length} variant{group.variants.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Avg coverage</span>
                    <span className="font-semibold text-foreground tabular-nums">{avgCoverage}%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  {group.variants.map((variant) => (
                    <VariantRow key={variant.id} variant={variant} />
                  ))}
                </div>
              </section>
            )
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <GitBranch className="h-8 w-8 text-muted-foreground/40 mb-3" />
            <p className="section-title">No variants match your filters</p>
            <p className="page-description mt-1 max-w-sm">
              Try adjusting search or filter criteria to see discovered variants.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  )
}
