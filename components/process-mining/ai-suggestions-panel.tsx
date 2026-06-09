'use client'

import * as React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Sparkles,
  Search,
  Download,
  ThumbsUp,
  ThumbsDown,
  ChevronRight,
  Filter,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { staggerItem } from '@/lib/animations'
import { AI_SUGGESTIONS, type AISuggestion } from '@/lib/process-mining-mock-data'
import {
  SUGGESTION_PRIORITY_CONFIG,
  SUGGESTION_STATUS_CONFIG,
  SUGGESTION_TYPE_CONFIG,
} from '@/components/process-mining/suggestion-config'

function SuggestionRow({ suggestion }: { suggestion: AISuggestion }) {
  const typeConfig = SUGGESTION_TYPE_CONFIG[suggestion.type]
  const TypeIcon = typeConfig.icon
  const statusConfig = SUGGESTION_STATUS_CONFIG[suggestion.status]

  return (
    <div className="group flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-4 px-4 sm:px-5 py-4 hover:bg-muted/25 transition-colors">
      <Link
        href={`/process-mining/suggestions/${suggestion.id}`}
        className="flex flex-1 items-start gap-3 min-w-0"
      >
        <div
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset',
            typeConfig.bg,
            typeConfig.color,
          )}
        >
          <TypeIcon className="h-[18px] w-[18px]" strokeWidth={2.25} />
        </div>

        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <h3 className="text-sm font-semibold leading-snug group-hover:text-brand transition-colors">
              {suggestion.title}
            </h3>
            <Badge className={cn('h-5 text-[10px] border-0 capitalize', SUGGESTION_PRIORITY_CONFIG[suggestion.priority])}>
              {suggestion.priority}
            </Badge>
            <Badge className={cn('h-5 text-[10px] border-0', statusConfig.pill)}>
              {statusConfig.label}
            </Badge>
          </div>

          <p className="text-xs text-muted-foreground">
            {suggestion.process}
            <span className="mx-1.5 text-border">·</span>
            {typeConfig.label}
            <span className="mx-1.5 text-border hidden sm:inline">·</span>
            <span className="font-mono text-[10px] hidden sm:inline">{suggestion.id}</span>
          </p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
            <span className="inline-flex items-center gap-1.5 text-foreground/80">
              <Sparkles className="h-3.5 w-3.5 text-brand" />
              <span className="font-semibold tabular-nums">{suggestion.confidence}%</span>
              <span className="text-muted-foreground">confidence</span>
            </span>
            <span className="text-muted-foreground hidden sm:inline">{suggestion.impact}</span>
          </div>
        </div>
      </Link>

      <div className="flex items-center justify-between lg:justify-end gap-2 pl-[3.25rem] lg:pl-0 shrink-0">
        {suggestion.status === 'pending' ? (
          <div className="hidden md:flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs border-emerald-500/25 text-emerald-700 hover:bg-emerald-500/5 hover:text-emerald-800 dark:text-emerald-400"
              onClick={(e) => e.preventDefault()}
            >
              <ThumbsUp className="h-3.5 w-3.5 mr-1.5" />
              Accept
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={(e) => e.preventDefault()}
            >
              <ThumbsDown className="h-3.5 w-3.5 mr-1.5" />
              Reject
            </Button>
          </div>
        ) : (
          <span className="hidden md:block w-[9.5rem]" aria-hidden />
        )}

        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 shrink-0 border-border/80 bg-brand/[0.06] text-muted-foreground hover:bg-brand/15 hover:text-brand hover:border-brand/35 transition-colors"
          asChild
        >
          <Link href={`/process-mining/suggestions/${suggestion.id}`} aria-label={`View ${suggestion.title}`}>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}

export function AiSuggestionsPanel() {
  const [search, setSearch] = React.useState('')
  const [typeFilter, setTypeFilter] = React.useState('all')
  const [statusFilter, setStatusFilter] = React.useState('all')

  const filteredSuggestions = AI_SUGGESTIONS.filter((s) => {
    if (search && !s.title.toLowerCase().includes(search.toLowerCase())) return false
    if (typeFilter !== 'all' && s.type !== typeFilter) return false
    if (statusFilter !== 'all' && s.status !== statusFilter) return false
    return true
  })

  const pendingCount = AI_SUGGESTIONS.filter((s) => s.status === 'pending').length
  const hasActiveFilters = search !== '' || typeFilter !== 'all' || statusFilter !== 'all'

  return (
    <div>
      <motion.div
        className="rounded-xl border border-border bg-card shadow-[var(--shadow-xs)] overflow-hidden"
        variants={staggerItem}
        initial="hidden"
        animate="visible"
      >
        <div className="p-4 sm:p-5 border-b border-border/60 bg-card">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div>
              <h2 className="section-title">AI Suggestions</h2>
              <p className="section-description mt-0.5 max-w-xl">
                AI-powered recommendations to improve test coverage and efficiency.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Badge variant="outline" className="gap-1.5 h-7">
                <Sparkles className="h-3 w-3 text-brand" />
                {filteredSuggestions.length} shown
              </Badge>
              <Button variant="outline" size="sm" className="h-8">
                <Download className="h-3.5 w-3.5 mr-1.5" />
                Export
              </Button>
            </div>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1 sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search suggestions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 bg-background"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[170px] h-9 bg-background">
                <Filter className="h-3.5 w-3.5 mr-2 text-muted-foreground shrink-0" />
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
              <SelectTrigger className="w-full sm:w-[150px] h-9 bg-background">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                className="h-9 text-xs text-muted-foreground"
                onClick={() => {
                  setSearch('')
                  setTypeFilter('all')
                  setStatusFilter('all')
                }}
              >
                Clear filters
              </Button>
            )}
          </div>
        </div>

        {filteredSuggestions.length > 0 ? (
          <div className="divide-y divide-border/60">
            {filteredSuggestions.map((suggestion) => (
              <SuggestionRow key={suggestion.id} suggestion={suggestion} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <Sparkles className="h-9 w-9 text-muted-foreground/35 mb-3" />
            <p className="section-title">No suggestions match your filters</p>
            <p className="section-description mt-1 max-w-sm">
              Try adjusting search or filter criteria to see AI recommendations.
            </p>
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => {
                  setSearch('')
                  setTypeFilter('all')
                  setStatusFilter('all')
                }}
              >
                Reset filters
              </Button>
            )}
          </div>
        )}

        <div className="px-4 sm:px-5 py-3 border-t border-border/60 bg-muted/15">
          <p className="text-xs text-muted-foreground">
            Showing {filteredSuggestions.length} of {AI_SUGGESTIONS.length} suggestions
            {pendingCount > 0 && (
              <span className="text-amber-700 dark:text-amber-400 font-medium">
                {' '}
                · {pendingCount} pending review
              </span>
            )}
          </p>
        </div>
      </motion.div>
    </div>
  )
}
