'use client'

import * as React from 'react'
import { AppShell } from '@/components/app-shell'
import { PageHeader, PageSection, StaggerGrid } from '@/components/design-system'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import {
  Plus,
  Search,
  Play,
  Database,
  CheckCircle2,
  Send,
  FileSignature,
  Camera,
  Settings2,
  Clock,
  Code2,
  Layers,
  Filter,
  X,
  ExternalLink,
  Copy,
  User,
  Calendar,
  ArrowRight,
  Globe,
  Hash,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { MOCK_STEP_FRAGMENTS, type StepFragment, type IRStepType } from '@/lib/mock-data'
import { formatDistanceToNow } from 'date-fns'
import { NewFragmentSheet } from '@/components/new-fragment-sheet'

// Step type icons
const stepTypeIcons: Record<IRStepType, React.ElementType> = {
  open_transaction: Play,
  set_field: Settings2,
  press_button: Send,
  press_enter: ArrowRight,
  select_row: Hash,
  click_menu: Layers,
  assert_statusbar: CheckCircle2,
  assert_field: CheckCircle2,
  capture_field: Camera,
  wait: Clock,
}

const stepTypeLabels: Record<IRStepType, string> = {
  open_transaction: 'Open Transaction',
  set_field: 'Set Field',
  press_button: 'Press Button',
  press_enter: 'Press Enter',
  select_row: 'Select Row',
  click_menu: 'Click Menu',
  assert_statusbar: 'Assert Statusbar',
  assert_field: 'Assert Field',
  capture_field: 'Capture Field',
  wait: 'Wait',
}

// Theme-safe per-type tones — use rgba overlays on a saturated hue so they
// render correctly in both light and dark modes.
const stepTypeColors: Record<IRStepType, string> = {
  open_transaction: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 ring-1 ring-inset ring-blue-500/20',
  set_field: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 ring-1 ring-inset ring-indigo-500/20',
  press_button: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-1 ring-inset ring-amber-500/20',
  press_enter: 'bg-slate-500/10 text-slate-600 dark:text-slate-300 ring-1 ring-inset ring-slate-500/20',
  select_row: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 ring-1 ring-inset ring-purple-500/20',
  click_menu: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 ring-1 ring-inset ring-teal-500/20',
  assert_statusbar: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-inset ring-emerald-500/20',
  assert_field: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-inset ring-emerald-500/20',
  capture_field: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 ring-1 ring-inset ring-pink-500/20',
  wait: 'bg-slate-500/10 text-slate-600 dark:text-slate-300 ring-1 ring-inset ring-slate-500/20',
}

// All unique tags from fragments
const allTags = Array.from(
  new Set(MOCK_STEP_FRAGMENTS.flatMap(f => f.tags))
).sort()

// Step Fragment Card Component
function StepFragmentCard({ 
  fragment, 
  onSelect 
}: { 
  fragment: StepFragment
  onSelect: () => void 
}) {
  const Icon = stepTypeIcons[fragment.step_type] || Layers
  
  return (
    <Card 
      className="hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group"
      onClick={onSelect}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className={cn('p-2 rounded-lg', stepTypeColors[fragment.step_type])}>
            <Icon className="h-5 w-5" />
          </div>
          <Badge variant="secondary" className="text-xs">
            {fragment.used_in_irs.length} IRs
          </Badge>
        </div>
        <CardTitle className="text-base mt-3 line-clamp-1 group-hover:text-primary transition-colors">
          {fragment.name}
        </CardTitle>
        <CardDescription className="text-xs line-clamp-2 min-h-[2.5rem]">
          {fragment.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Parameter template summary */}
        <div className="bg-muted/50 rounded-md p-2 mb-3">
          <p className="text-xs font-mono text-muted-foreground line-clamp-2">
            {Object.entries(fragment.parameter_template).slice(0, 2).map(([key, value]) => (
              <span key={key} className="block truncate">
                {key}: {typeof value === 'object' ? JSON.stringify(value).slice(0, 30) + '...' : String(value)}
              </span>
            ))}
            {Object.keys(fragment.parameter_template).length > 2 && (
              <span className="text-muted-foreground">+{Object.keys(fragment.parameter_template).length - 2} more params</span>
            )}
          </p>
        </div>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {fragment.tags.slice(0, 3).map(tag => (
            <Badge key={tag} variant="outline" className="text-xs px-1.5 py-0">
              {tag}
            </Badge>
          ))}
          {fragment.tags.length > 3 && (
            <Badge variant="outline" className="text-xs px-1.5 py-0">
              +{fragment.tags.length - 3}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Fragment Detail Sheet Content
function FragmentDetailContent({ fragment }: { fragment: StepFragment }) {
  const Icon = stepTypeIcons[fragment.step_type] || Layers

  const handleCopyJson = async () => {
    try {
      await navigator.clipboard.writeText(
        JSON.stringify(fragment.parameter_template, null, 2),
      )
      // Sonner is mounted globally so we can call toast here
      const { toast } = await import('sonner')
      toast.success('Parameter template copied to clipboard')
    } catch {
      const { toast } = await import('sonner')
      toast.error('Could not copy to clipboard')
    }
  }

  return (
    <div className="flex h-full flex-col">
      {/* Sticky header */}
      <div className="border-b border-border px-5 sm:px-6 py-4 space-y-3">
        <div className="flex items-start gap-3">
          <span
            className={cn(
              'inline-flex h-10 w-10 items-center justify-center rounded-lg shrink-0',
              stepTypeColors[fragment.step_type],
            )}
          >
            <Icon className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-base leading-tight text-balance">
              {fragment.name}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
              {fragment.description}
            </p>
          </div>
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 space-y-5">
        {/* Metadata 2x2 grid */}
        <StaggerGrid columns="grid-cols-2" className="gap-3 rounded-lg border border-border bg-muted/30 p-3" fast>
          <MetaCell
            label="Step Type"
            value={stepTypeLabels[fragment.step_type]}
          />
          <MetaCell
            label="Used In"
            value={`${fragment.used_in_irs.length} IRs`}
          />
          <MetaCell
            label="Created By"
            icon={<User className="h-3 w-3" />}
            value={fragment.created_by}
          />
          <MetaCell
            label="Created"
            icon={<Calendar className="h-3 w-3" />}
            value={formatDistanceToNow(new Date(fragment.created_at), {
              addSuffix: true,
            })}
          />
        </StaggerGrid>

        {/* Parameter Template */}
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-foreground flex items-center gap-1.5">
              <Code2 className="h-3.5 w-3.5 text-muted-foreground" />
              Parameter Template
            </h4>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1 text-[11px]"
              onClick={handleCopyJson}
            >
              <Copy className="h-3 w-3" />
              Copy
            </Button>
          </div>
          <div className="rounded-lg overflow-hidden ring-1 ring-inset ring-border bg-zinc-950 dark:bg-zinc-900">
            <div className="flex items-center justify-between border-b border-zinc-800 px-3 py-1.5">
              <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-wide">
                JSON
              </span>
              <span className="text-[10px] text-zinc-500 tabular-nums">
                {Object.keys(fragment.parameter_template).length} params
              </span>
            </div>
            <pre className="text-[12px] leading-relaxed text-zinc-100 font-mono p-3 overflow-x-auto">
              {JSON.stringify(fragment.parameter_template, null, 2)}
            </pre>
          </div>
          <p className="page-description text-[11px]">
            Parameters with{' '}
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-[10px]">
              {'{{variable}}'}
            </code>{' '}
            syntax are placeholders to be filled when using this fragment.
          </p>
        </section>

        {/* Tags */}
        <section className="space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-foreground">
            Tags
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {fragment.tags.length === 0 ? (
              <span className="text-[11px] text-muted-foreground">No tags</span>
            ) : (
              fragment.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full bg-muted text-foreground border border-border px-2 py-0.5 text-[11px] font-medium"
                >
                  {tag}
                </span>
              ))
            )}
          </div>
        </section>

        {/* IR Usage List */}
        <section className="space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-foreground flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-muted-foreground" />
            Used in IRs ({fragment.used_in_irs.length})
          </h4>
          <div className="space-y-1.5">
            {fragment.used_in_irs.map(ir => (
              <div
                key={ir}
                className="flex items-center justify-between gap-2 p-2.5 border border-border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="inline-flex items-center rounded-md bg-muted border border-border px-1.5 py-0.5 font-mono text-[10px] text-foreground shrink-0">
                    {ir}
                  </span>
                  <span className="text-xs text-muted-foreground truncate">
                    {ir
                      .replace('ir_', '')
                      .replace(/_/g, ' ')
                      .replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 gap-1 text-[11px] shrink-0"
                >
                  <ExternalLink className="h-3 w-3" />
                  Open
                </Button>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Sticky footer */}
      <div className="border-t border-border px-5 sm:px-6 py-3 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2 bg-background">
        <Button
          variant="outline"
          size="sm"
          className="h-9 gap-1.5"
          onClick={handleCopyJson}
        >
          <Copy className="h-3.5 w-3.5" />
          Copy Template
        </Button>
        <Button size="sm" className="h-9 gap-1.5">
          <ExternalLink className="h-3.5 w-3.5" />
          Edit Fragment
        </Button>
      </div>
    </div>
  )
}

function MetaCell({
  label,
  value,
  icon,
}: {
  label: string
  value: string
  icon?: React.ReactNode
}) {
  return (
    <div className="min-w-0">
      <p className="page-description text-[10px]">
        {label}
      </p>
      <p className="text-xs font-semibold text-foreground mt-0.5 flex items-center gap-1 truncate">
        {icon ? <span className="text-muted-foreground shrink-0">{icon}</span> : null}
        <span className="truncate">{value}</span>
      </p>
    </div>
  )
}

export default function StepLibraryPage() {
  // State
  const [isLoading, setIsLoading] = React.useState(true)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [stepTypeFilter, setStepTypeFilter] = React.useState<string>('all')
  const [tagFilter, setTagFilter] = React.useState<string>('all')
  const [selectedFragment, setSelectedFragment] = React.useState<StepFragment | null>(null)
  const [isDetailOpen, setIsDetailOpen] = React.useState(false)
  const [isNewOpen, setIsNewOpen] = React.useState(false)
  
  // Simulate loading
  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])
  
  // Filter fragments
  const filteredFragments = React.useMemo(() => {
    return MOCK_STEP_FRAGMENTS.filter(fragment => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesSearch = 
          fragment.name.toLowerCase().includes(query) ||
          fragment.description.toLowerCase().includes(query) ||
          fragment.tags.some(t => t.toLowerCase().includes(query))
        if (!matchesSearch) return false
      }
      
      // Step type filter
      if (stepTypeFilter !== 'all' && fragment.step_type !== stepTypeFilter) {
        return false
      }
      
      // Tag filter
      if (tagFilter !== 'all' && !fragment.tags.includes(tagFilter)) {
        return false
      }
      
      return true
    })
  }, [searchQuery, stepTypeFilter, tagFilter])
  
  const handleSelectFragment = (fragment: StepFragment) => {
    setSelectedFragment(fragment)
    setIsDetailOpen(true)
  }
  
  const clearFilters = () => {
    setSearchQuery('')
    setStepTypeFilter('all')
    setTagFilter('all')
  }
  
  const hasActiveFilters = searchQuery || stepTypeFilter !== 'all' || tagFilter !== 'all'
  
  return (
    <AppShell currentApp="test-repository">
      <div className="flex flex-col h-full">
        {/* Page Header */}
        <div className="border-b bg-background px-6 py-4">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="page-title">Step Library</h1>
              <p className="page-description mt-1">
                Reusable step fragments — drag into any IR.
              </p>
            </div>
            <Button className="gap-2" onClick={() => setIsNewOpen(true)}>
              <Plus className="h-4 w-4" />
              New Fragment
            </Button>
          </div>
          
          {/* Filters */}
          <div className="flex items-center gap-3 mt-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search fragments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
            
            <Select value={stepTypeFilter} onValueChange={setStepTypeFilter}>
              <SelectTrigger className="w-[180px] h-9">
                <SelectValue placeholder="Step Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Step Types</SelectItem>
                {Object.entries(stepTypeLabels).map(([type, label]) => (
                  <SelectItem key={type} value={type}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={tagFilter} onValueChange={setTagFilter}>
              <SelectTrigger className="w-[160px] h-9">
                <SelectValue placeholder="Tag" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tags</SelectItem>
                {allTags.map(tag => (
                  <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {hasActiveFilters && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-9 gap-1"
                onClick={clearFilters}
              >
                <X className="h-3 w-3" />
                Clear
              </Button>
            )}
          </div>
        </div>
        
        {/* Content */}
        <ScrollArea className="flex-1 p-6">
          {isLoading ? (
            // Loading State
            <StaggerGrid columns="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" className="gap-4" fast>
              {Array.from({ length: 8 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <Skeleton className="h-9 w-9 rounded-lg" />
                      <Skeleton className="h-5 w-12" />
                    </div>
                    <Skeleton className="h-5 w-3/4 mt-3" />
                    <Skeleton className="h-4 w-full mt-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-12 w-full mb-3" />
                    <div className="flex gap-1">
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-5 w-12" />
                      <Skeleton className="h-5 w-14" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </StaggerGrid>
          ) : filteredFragments.length === 0 ? (
            // Empty State
            <div className="flex flex-col items-center justify-center py-16">
              <div className="rounded-full bg-muted p-4 mb-4">
                <Layers className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">No fragments found</h3>
              <p className="page-description mt-1 max-w-sm text-center">
                {hasActiveFilters 
                  ? 'Try adjusting your filters or search query.'
                  : 'Create your first step fragment to build a reusable library.'}
              </p>
              {hasActiveFilters ? (
                <Button variant="outline" className="mt-4" onClick={clearFilters}>
                  Clear Filters
                </Button>
              ) : (
                <Button
                  className="mt-4 gap-2"
                  onClick={() => setIsNewOpen(true)}
                >
                  <Plus className="h-4 w-4" />
                  New Fragment
                </Button>
              )}
            </div>
          ) : (
            // Card Grid
            <>
              <div className="text-sm text-muted-foreground mb-4">
                Showing {filteredFragments.length} of {MOCK_STEP_FRAGMENTS.length} fragments
              </div>
              <StaggerGrid columns="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" className="gap-4" fast>
                {filteredFragments.map(fragment => (
                  <StepFragmentCard
                    key={fragment.id}
                    fragment={fragment}
                    onSelect={() => handleSelectFragment(fragment)}
                  />
                ))}
              </StaggerGrid>
            </>
          )}
        </ScrollArea>
        
        {/* Detail Sheet */}
        <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <SheetContent
            side="right"
            className="w-full sm:max-w-lg p-0 flex flex-col gap-0"
          >
            <SheetHeader className="sr-only">
              <SheetTitle>Fragment Details</SheetTitle>
              <SheetDescription>View and manage step fragment</SheetDescription>
            </SheetHeader>
            {selectedFragment && (
              <FragmentDetailContent fragment={selectedFragment} />
            )}
          </SheetContent>
        </Sheet>

        {/* Create a new fragment */}
        <NewFragmentSheet open={isNewOpen} onOpenChange={setIsNewOpen} />
      </div>
    </AppShell>
  )
}
