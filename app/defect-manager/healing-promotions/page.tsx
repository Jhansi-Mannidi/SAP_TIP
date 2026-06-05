'use client'

import * as React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Sparkles,
  Zap,
  FileCode2,
  AlertTriangle,
  AlertCircle,
  TrendingUp,
  Clock,
  Layers,
  ThumbsUp,
  ThumbsDown,
  Eye,
  Search,
  Filter,
  History,
  Bot,
  User,
} from 'lucide-react'

import { AppShell } from '@/components/app-shell'
import { PageHeader, KpiStatCard, StaggerGrid } from '@/components/design-system'
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { cn, formatRelativeTime } from '@/lib/utils'
import { staggerItem } from '@/lib/animations'

import {
  MOCK_HEALING_PROMOTIONS,
  type HealingPromotion,
  type PromotionConfidence,
  FAILURE_CLASS_LABELS,
  REPAIR_STRATEGY_LABELS,
} from '@/lib/mock-data'

function confidenceGradient(confidence: PromotionConfidence) {
  if (confidence === 'high') return 'from-emerald-500 to-emerald-400'
  if (confidence === 'medium') return 'from-amber-500 to-[#d4a04a]'
  return 'from-rose-500 to-rose-400'
}

function confidenceTextTone(confidence: PromotionConfidence) {
  if (confidence === 'high') return 'text-emerald-600 dark:text-emerald-400'
  if (confidence === 'medium') return 'text-amber-600 dark:text-amber-400'
  return 'text-rose-600 dark:text-rose-400'
}

function ConfidenceProgress({
  value,
  confidence,
}: {
  value: number
  confidence: PromotionConfidence
}) {
  return (
    <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-muted">
      <motion.div
        className={cn('h-full rounded-full bg-gradient-to-r', confidenceGradient(confidence))}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.65, ease: 'easeOut' }}
      />
    </div>
  )
}

function ConfidenceBadge({ confidence, score }: { confidence: PromotionConfidence; score: number }) {
  const config = {
    high: {
      bg: 'bg-emerald-500/10 ring-emerald-500/20',
      text: 'text-emerald-600 dark:text-emerald-400',
      label: 'High Confidence',
      icon: TrendingUp,
    },
    medium: {
      bg: 'bg-amber-500/10 ring-amber-500/20',
      text: 'text-amber-600 dark:text-amber-400',
      label: 'Medium Confidence',
      icon: AlertTriangle,
    },
    low: {
      bg: 'bg-rose-500/10 ring-rose-500/20',
      text: 'text-rose-600 dark:text-rose-400',
      label: 'Low Confidence',
      icon: AlertCircle,
    },
  }

  const { bg, text, label, icon: Icon } = config[confidence]

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 rounded-full px-3 py-1.5 ring-1 ring-inset shrink-0',
        bg,
      )}
    >
      <Icon className={cn('h-3.5 w-3.5', text)} />
      <span className={cn('text-xs font-medium', text)}>{label}</span>
      <span className={cn('text-xs font-bold tabular-nums', text)}>{score}%</span>
    </div>
  )
}

function MetaChip({
  icon: Icon,
  label,
  value,
  iconClassName,
}: {
  icon: React.ElementType
  label: string
  value: string
  iconClassName?: string
}) {
  return (
    <div className="flex flex-col justify-center rounded-lg border border-border/50 bg-muted/20 px-3 py-2 min-h-[3.25rem]">
      <div className="flex items-center gap-1.5 min-w-0">
        <Icon className={cn('h-3.5 w-3.5 shrink-0 text-muted-foreground', iconClassName)} />
        <span className="caption-text truncate">{label}</span>
      </div>
      <span className="text-sm font-medium truncate mt-0.5">{value}</span>
    </div>
  )
}

function PromotionCard({
  promotion,
  onApprove,
  onReject,
}: {
  promotion: HealingPromotion
  onApprove: (id: string) => void
  onReject: (id: string) => void
}) {
  return (
    <motion.article
      variants={staggerItem}
      whileHover={{ y: -2, boxShadow: 'var(--card-shadow-hover)' }}
      className={cn(
        'group relative flex flex-col rounded-xl border border-border bg-card overflow-hidden',
        'shadow-[var(--shadow-xs)] transition-colors duration-200 hover:border-border/80',
      )}
    >
      <div className="p-4 sm:p-5 flex flex-col gap-4">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-3">
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={`/test-repository/ir/${promotion.target_ir.id}`}
                className="card-title-text hover:text-brand transition-colors line-clamp-2"
              >
                {promotion.target_ir.name}
              </Link>
              <Badge variant="outline" className="font-mono text-[11px] h-5 shrink-0">
                {promotion.target_ir.version}
              </Badge>
              {promotion.auto_promotable && (
                <Badge className="h-5 text-[10px] gap-1 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-0">
                  <Zap className="h-3 w-3" />
                  Auto-Promotable
                </Badge>
              )}
              {promotion.confidence === 'low' && (
                <Badge className="h-5 text-[10px] gap-1 bg-rose-500/10 text-rose-700 dark:text-rose-400 border-0">
                  <AlertCircle className="h-3 w-3" />
                  Needs Review
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {promotion.repair_description}
            </p>
          </div>
          <ConfidenceBadge confidence={promotion.confidence} score={promotion.confidence_score} />
        </div>

        {/* Failure summary */}
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <Badge variant="secondary" className="font-mono text-[11px] h-6">
            {FAILURE_CLASS_LABELS[promotion.failure_class]}
          </Badge>
          <span className="text-muted-foreground">×</span>
          <span className="font-semibold tabular-nums">{promotion.occurrence_count}</span>
          <span className="text-muted-foreground">
            occurrences in last {promotion.occurrence_window_days} days
          </span>
        </div>

        {/* Meta grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <MetaChip
            icon={FileCode2}
            label="Strategy"
            value={REPAIR_STRATEGY_LABELS[promotion.repair_strategy]}
          />
          <MetaChip
            icon={Layers}
            label="Impacted"
            value={`${promotion.impacted_test_cases} cases`}
          />
          <MetaChip
            icon={promotion.proposed_by === 'agent' ? Bot : User}
            label="Proposed by"
            value={promotion.proposed_by === 'agent' ? 'AI Agent' : 'Human'}
            iconClassName={promotion.proposed_by === 'agent' ? 'text-indigo-500' : undefined}
          />
          <MetaChip
            icon={Clock}
            label="Proposed"
            value={formatRelativeTime(promotion.proposed_at)}
          />
        </div>

        <p className="caption-text">
          From{' '}
          <span className="text-foreground font-medium">{promotion.originating_suite}</span>
        </p>

        {/* Confidence */}
        <div className="space-y-2 rounded-lg border border-border/50 bg-muted/15 px-3 py-2.5">
          <div className="flex items-center justify-between">
            <span className="micro-label">Confidence Score</span>
            <span className={cn('text-sm font-bold tabular-nums', confidenceTextTone(promotion.confidence))}>
              {promotion.confidence_score}%
            </span>
          </div>
          <ConfidenceProgress value={promotion.confidence_score} confidence={promotion.confidence} />
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1 border-t border-border/60">
          <Button variant="outline" size="sm" className="flex-1 sm:flex-none gap-2" asChild>
            <Link href={`/defect-manager/healing-promotions/${promotion.id}`}>
              <Eye className="h-4 w-4" />
              Open Review
            </Link>
          </Button>
          <div className="flex items-center gap-2 sm:ml-auto">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 sm:flex-none gap-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 border-rose-200/60 dark:border-rose-900/40"
              onClick={() => onReject(promotion.id)}
            >
              <ThumbsDown className="h-4 w-4" />
              Reject
            </Button>
            <Button
              size="sm"
              className={cn(
                'flex-1 sm:flex-none gap-2',
                promotion.auto_promotable
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-brand text-brand-foreground hover:bg-brand/90',
              )}
              onClick={() => onApprove(promotion.id)}
            >
              <ThumbsUp className="h-4 w-4" />
              {promotion.auto_promotable ? 'Auto Approve' : 'Approve'}
            </Button>
          </div>
        </div>
      </div>
    </motion.article>
  )
}

export default function HealingPromotionsPage() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [irFilter, setIrFilter] = React.useState<string>('all')
  const [confidenceFilter, setConfidenceFilter] = React.useState<string>('all')
  const [suiteFilter, setSuiteFilter] = React.useState<string>('all')
  const [rejectDialogOpen, setRejectDialogOpen] = React.useState(false)
  const [rejectRationale, setRejectRationale] = React.useState('')
  const [promotionToReject, setPromotionToReject] = React.useState<string | null>(null)

  const uniqueIRs = [...new Set(MOCK_HEALING_PROMOTIONS.map((p) => p.target_ir.name))]
  const uniqueSuites = [...new Set(MOCK_HEALING_PROMOTIONS.map((p) => p.originating_suite))]

  const filteredPromotions = MOCK_HEALING_PROMOTIONS.filter((p) => {
    if (
      searchQuery &&
      !p.target_ir.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !p.repair_description.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false
    if (irFilter !== 'all' && p.target_ir.name !== irFilter) return false
    if (confidenceFilter !== 'all' && p.confidence !== confidenceFilter) return false
    if (suiteFilter !== 'all' && p.originating_suite !== suiteFilter) return false
    return true
  })

  const handleApprove = (id: string) => {
    console.log('Approving promotion:', id)
  }

  const handleReject = (id: string) => {
    setPromotionToReject(id)
    setRejectDialogOpen(true)
  }

  const handleConfirmReject = () => {
    console.log('Rejecting promotion:', promotionToReject, 'Rationale:', rejectRationale)
    setRejectDialogOpen(false)
    setRejectRationale('')
    setPromotionToReject(null)
  }

  const stats = {
    total: MOCK_HEALING_PROMOTIONS.length,
    highConfidence: MOCK_HEALING_PROMOTIONS.filter((p) => p.confidence === 'high').length,
    autoPromotable: MOCK_HEALING_PROMOTIONS.filter((p) => p.auto_promotable).length,
    needsReview: MOCK_HEALING_PROMOTIONS.filter((p) => p.confidence === 'low').length,
  }

  const hasActiveFilters =
    searchQuery || irFilter !== 'all' || confidenceFilter !== 'all' || suiteFilter !== 'all'

  return (
    <AppShell currentApp="defect-manager">
      <div className="-m-4 sm:-m-6 lg:-m-8 flex flex-col min-h-0 flex-1">
        {/* Sticky header */}
        <div className="border-b border-border bg-card/90 backdrop-blur-md sticky top-0 z-10 shadow-[var(--shadow-xs)]">
          <div className="px-4 sm:px-6 lg:px-8 py-4 space-y-4">
            <PageHeader
              title="Healing Promotions"
              description="Review proposed permanent IR updates derived from runtime healings. Approve to merge into the Test IR; reject with rationale."
              badge={
                <Badge className="pill h-6 gap-1.5 bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-0">
                  <Sparkles className="h-3 w-3" />
                  {stats.total} pending
                </Badge>
              }
              actions={
                <div className="flex flex-wrap items-center gap-2">
                  <Button variant="outline" size="sm" className="gap-2" asChild>
                    <Link href="/defect-manager/healing-promotions/history">
                      <History className="h-4 w-4" />
                      History
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <ThumbsDown className="h-4 w-4" />
                    Bulk Reject
                  </Button>
                  <Button size="sm" className="gap-2 bg-brand text-brand-foreground hover:bg-brand/90">
                    <ThumbsUp className="h-4 w-4" />
                    Bulk Approve
                  </Button>
                </div>
              }
            />

            {/* Filters */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 rounded-xl border border-border/60 bg-muted/20 p-3">
              <div className="relative flex-1 sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search promotions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9 bg-background"
                />
              </div>

              <Select value={irFilter} onValueChange={setIrFilter}>
                <SelectTrigger className="w-full sm:w-[180px] h-9 bg-background">
                  <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Target IR" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All IRs</SelectItem>
                  {uniqueIRs.map((ir) => (
                    <SelectItem key={ir} value={ir}>
                      {ir}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={confidenceFilter} onValueChange={setConfidenceFilter}>
                <SelectTrigger className="w-full sm:w-[160px] h-9 bg-background">
                  <SelectValue placeholder="Confidence" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Confidence</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>

              <Select value={suiteFilter} onValueChange={setSuiteFilter}>
                <SelectTrigger className="w-full sm:w-[200px] h-9 bg-background">
                  <SelectValue placeholder="Suite" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Suites</SelectItem>
                  {uniqueSuites.map((suite) => (
                    <SelectItem key={suite} value={suite}>
                      {suite}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-auto px-4 sm:px-6 lg:px-8 py-4 bg-muted/20">
          <div className="w-full space-y-4">
            <StaggerGrid
              columns="grid-cols-2 md:grid-cols-4"
              className="gap-3 w-full items-stretch"
              fast
            >
              <KpiStatCard
                label="Total Pending"
                value={stats.total}
                icon={Sparkles}
                tone="brand"
                className="min-h-[6.5rem]"
              />
              <KpiStatCard
                label="Auto-Promotable"
                value={stats.autoPromotable}
                icon={Zap}
                tone="success"
                className="min-h-[6.5rem]"
              />
              <KpiStatCard
                label="High Confidence"
                value={stats.highConfidence}
                icon={TrendingUp}
                tone="warning"
                className="min-h-[6.5rem]"
              />
              <KpiStatCard
                label="Needs Review"
                value={stats.needsReview}
                icon={AlertCircle}
                tone="danger"
                className="min-h-[6.5rem]"
              />
            </StaggerGrid>

            <StaggerGrid columns="grid-cols-1" className="gap-4 w-full" fast>
              {filteredPromotions.map((promotion) => (
                <PromotionCard
                  key={promotion.id}
                  promotion={promotion}
                  onApprove={handleApprove}
                  onReject={handleReject}
                />
              ))}
            </StaggerGrid>

            {filteredPromotions.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center rounded-xl border border-dashed border-border bg-card/50">
                <div className="h-14 w-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
                  <Sparkles className="h-7 w-7 text-muted-foreground/50" />
                </div>
                <h3 className="section-title">No promotions found</h3>
                <p className="page-description mt-1.5 max-w-sm">
                  {hasActiveFilters
                    ? 'Try adjusting your search or filters to see more results.'
                    : 'Check back later for new healing promotion proposals.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Healing Promotion</DialogTitle>
            <DialogDescription>
              Please provide a rationale for rejecting this promotion. This helps improve future
              healing suggestions.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="rationale">Rejection Rationale</Label>
              <Textarea
                id="rationale"
                placeholder="Explain why this promotion should not be applied..."
                value={rejectRationale}
                onChange={(e) => setRejectRationale(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmReject} disabled={!rejectRationale.trim()}>
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  )
}
